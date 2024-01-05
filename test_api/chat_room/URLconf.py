from django.urls import path, include
from .views import MessageViewSet, RoomApiView, RoomInfoView
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'messages', MessageViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('rooms/', RoomApiView.as_view()),
    path('rooms/<str:name>', RoomInfoView.as_view())
]