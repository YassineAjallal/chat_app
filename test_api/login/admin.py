from django.contrib import admin
from .models import User
from rest_framework.authtoken.models import Token

# Register your models here.
admin.site.register(User)
admin.site.register(Token)