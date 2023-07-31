from rest_framework.serializers import ModelSerializer

from contentcuration.models import ContentNode


class ContentNodeSerializerBlimeyExercise(ModelSerializer):
    class Meta:
        model = ContentNode
        fields = ['blimey_exercise']
