from rest_framework.views import APIView
from .serializers import UserSerializer, LoginSerializer
from rest_framework.response import Response
from .models import User
from rest_framework import status
from django.contrib.auth import authenticate,login
from rest_framework.authtoken.models import Token
from rest_framework import generics, viewsets

class Login(APIView):
    http_method_names = ['post']
    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(request, username=serializer.validated_data['username'], password=serializer.validated_data['password'])
        if user is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        login(request, user)
        content = {
            "username": user.get_username(),
            "token": Token.objects.get(user_id=user.id).key
        }
        return Response(content, status=status.HTTP_200_OK)
    
class Register(generics.CreateAPIView):
    serializer_class = UserSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        response.data['token'] = Token.objects.get(user__username=response.data['username']).key
        return response
    

class Update(generics.UpdateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()

class Users(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = UserSerializer
    queryset = User.objects.all()

class HomeApiView():
    pass