from rest_framework import views, viewsets, generics
from rest_framework.response import Response
from rest_framework import status
from .serializer import MessageSerializer, RoomSerializer
from .models import MessageModel, RoomModel

class ChatView(views.APIView):
    def get(self, request, format=None):
        return Response(data={"accepted" : 'Accepted'}, status=status.HTTP_200_OK)
    
class MessageViewSet(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = MessageSerializer
    queryset = MessageModel.objects.all()

class RoomApiView(generics.ListAPIView):
    serializer_class = RoomSerializer
    queryset = RoomModel.objects.all()


class RoomInfoView(views.APIView):
    metadata_class = ['get']
    def get(self, request, name, format=None):
        room_message = MessageModel.objects.filter(room__name=name)
        message_serializer = MessageSerializer(room_message, many=True)
        print(message_serializer.data)
        return Response(message_serializer.data)