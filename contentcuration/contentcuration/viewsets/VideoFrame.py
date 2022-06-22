import re

from django.db import transaction
from django_bulk_update.helper import bulk_update
from le_utils.constants import exercises
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import ValidationError

from contentcuration.models import ContentNode
from contentcuration.models import File
from contentcuration.models import VideoFrame
from contentcuration.viewsets.base import BulkCreateMixin
from contentcuration.viewsets.base import BulkListSerializer
from contentcuration.viewsets.base import BulkModelSerializer
from contentcuration.viewsets.base import BulkUpdateMixin
from contentcuration.viewsets.base import RequiredFilterSet
from contentcuration.viewsets.base import ValuesViewset
from contentcuration.viewsets.common import UserFilteredPrimaryKeyRelatedField
from contentcuration.viewsets.common import UUIDInFilter
from contentcuration.viewsets.common import UUIDRegexField

exercise_image_filename_regex = re.compile(
    r"\!\[[^]]*\]\(\${placeholder}/([a-f0-9]{{32}}\.[0-9a-z]+)\)".format(
        placeholder=exercises.IMG_PLACEHOLDER
    )
)


class VideoFrameFilter(RequiredFilterSet):
    contentnode__in = UUIDInFilter(field_name="contentnode")

    class Meta:
        model = VideoFrame
        fields = (
            "contentnode",
            "contentnode__in",
        )


# Get unique checksums in the assessment item text fields markdown
def get_filenames_from_assessment(video_frame):
# Coerce to a string, for Python 2, as the stored data is in unicode, and otherwise
# the unicode char in the placeholder will not match
    return set(
        exercise_image_filename_regex.findall(
            str(
                video_frame.videoURL
            )
        )
    )


class VideoFrameListSerializer(BulkListSerializer):
    def create(self, all_validated_data):
        with transaction.atomic():
            all_objects = super(VideoFrameListSerializer, self).create(
                all_validated_data
            )
            self.child.set_files(all_objects)
            return all_objects

    def update(self, queryset, all_validated_data):
        with transaction.atomic():
            all_objects = super(VideoFrameListSerializer, self).update(
                queryset, all_validated_data
            )
            self.child.set_files(all_objects, all_validated_data)
            return all_objects


class VideoFrameSerializer(BulkModelSerializer):

    video_id = UUIDRegexField()
    contentnode = UserFilteredPrimaryKeyRelatedField(
        queryset=ContentNode.objects.all(), required=False
    )

    class Meta:
        model = VideoFrame
        fields = (
            "uploadURL",
            "contentnode",
            "video_id",
        )
        list_serializer_class = VideoFrameListSerializer
        # Use the contentnode and assessment_id as the lookup field for updates
        update_lookup_field = ("contentnode", "video_id")

    def set_files(self, all_objects, all_validated_data=None):  # noqa C901
        files_to_delete = []
        files_to_update = {}
        current_files_by_aitem = {}

        # Create a set of assessment item ids that have had markdown fields modified.
        if all_validated_data:
            md_fields_modified = {
                self.id_value_lookup(ai) for ai in all_validated_data
                    if "videoURL" in ai
            }
        else:
            # If this is a create operation, just check if these fields are not null.
            md_fields_modified = {
                self.id_value_lookup(ai) for ai in all_objects if ai.videoURL
            }

        all_objects = [ai for ai in all_objects if self.id_value_lookup(ai) in md_fields_modified]

        for file in File.objects.filter(assessment_item__in=all_objects):
            if file.videoframe_item_id not in current_files_by_aitem:
                current_files_by_aitem[file.videoframe_item_id] = []
            current_files_by_aitem[file.videoframe_item_id].append(file)

        for aitem in all_objects:
            current_files = current_files_by_aitem.get(aitem.id, [])
            filenames = get_filenames_from_assessment(aitem)
            set_checksums = {filename.split(".")[0] for filename in filenames}
            current_checksums = {f.checksum for f in current_files}

            missing_checksums = set_checksums.difference(current_checksums)

            for filename in filenames:
                checksum = filename.split(".")[0]
                if checksum in missing_checksums:
                    if checksum not in files_to_update:
                        files_to_update[checksum] = []
                    files_to_update[checksum].append(aitem)

            redundant_checksums = current_checksums.difference(set_checksums)

            files_to_delete.extend(
                [f.id for f in current_files if f.checksum in redundant_checksums]
            )

        if files_to_delete:
            File.objects.filter(id__in=files_to_delete).delete()
        if files_to_update:
            # Query file objects that this user has uploaded to set the assessment_item attribute
            source_files = list(
                File.objects.filter(
                    checksum__in=files_to_update.keys(),
                    uploaded_by=self.context["request"].user,
                    contentnode__isnull=True,
                    assessment_item__isnull=True,
                )
            )

            updated_files = []

            for file in source_files:
                if file.checksum in files_to_update and files_to_update[file.checksum]:
                    aitem = files_to_update[file.checksum].pop()
                    file.video_frame = aitem
                    updated_files.append(file)
            if any(files_to_update.values()):
                # Not all the files to update had a file, raise an error
                raise ValidationError(
                    "Attempted to set files to an assessment item that do not have a file on the server"
                )
            bulk_update(source_files)

    def create(self, validated_data):
        with transaction.atomic():
            instance = super(VideoFrameListSerializer, self).create(validated_data)
            self.set_files([instance])
            return instance

    def update(self, instance, validated_data):
        with transaction.atomic():
            instance = super(VideoFrameListSerializer, self).update(
                instance, validated_data
            )
            self.set_id_values(instance, validated_data)
            self.set_files([instance], [validated_data])
            return instance


class VideoFrameViewSet(BulkCreateMixin, BulkUpdateMixin, ValuesViewset):
    queryset = VideoFrame.objects.all()
    serializer_class = VideoFrameSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = VideoFrameFilter
    values = (
        "uploadURL",
        "contentnode_id",
        "video_id",
    )

    field_map = {
        "contentnode": "contentnode_id",
    }
