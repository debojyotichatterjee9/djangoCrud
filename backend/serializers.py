from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task # model that needs to be serialized
        fields = '__all__' # what fields that need to be displayed (in this case all the fields will be displayed)