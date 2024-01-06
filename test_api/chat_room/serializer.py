from rest_framework import serializers
from .models import MessageModel, RoomModel
import datetime

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageModel
        fields = ["username", "message", "created"]
    def to_representation(self, instance):
        representation =  super().to_representation(instance)
        new_datetime_str = datetime.datetime.strptime(representation['created'], '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%d-%m-%Y %H:%M')
        representation['created'] = new_datetime_str
        return representation

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomModel
        fields = "__all__"