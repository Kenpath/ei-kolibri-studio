from rest_framework.serializers import ModelSerializer

from contentcuration.models import ContentNode


class ContentNodeSerializerUploadURL(ModelSerializer):
    class Meta:
        model = ContentNode
        fields = ['upload_url']
