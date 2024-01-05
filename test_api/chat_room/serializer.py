from rest_framework import serializers
from .models import MessageModel, RoomModel


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageModel
        fields = ["username", "message", "created"]

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomModel
        fields = "__all__"