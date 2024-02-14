import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import MessageModel, RoomModel

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = "chat_%s" % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        username = text_data_json["username"]
        room = RoomModel.objects.get(name=self.room_name)
        new_message = MessageModel.objects.create(message=message, username=username, room=room)
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "chat_message", "message": json.dumps({
                "message": message, 
                "username": username, 
                "created": new_message.created.strftime("%d-%m-%Y %H:%M")})}
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event["message"]
        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message}))

# class ChatConsumer(WebsocketConsumer):
#     def websocket_connect(self, message):
#         print(message)
#         print("-------> connect called")
#         self.accept()
#     def websocket_disconnect(self, close_code):
#         print("-------> disconnect called")

#     # Receive message from WebSocket
#     def websocket_receive(self, text_data):
#         print("-------> recieve called")

