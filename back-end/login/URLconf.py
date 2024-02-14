from django.urls import path, include
from .views import Login, Register, Users, Logout
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'users', Users)

urlpatterns = [
    path('login/', Login.as_view()),
    path('register/', Register.as_view()),
    path('logout/', Logout.as_view()),
    path('', include(router.urls)),
]