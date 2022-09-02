from rest_framework.serializers import ModelSerializer

from contentcuration.models import File


class FileModelSerializer(ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'
