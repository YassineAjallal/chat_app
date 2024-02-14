from django.db import models

class MessageModel(models.Model):
    message = models.CharField(max_length=1000, null=False)
    username = models.CharField(max_length=128, default="Django User")
    created = models.DateTimeField(auto_now=True)
    room = models.ForeignKey(to='RoomModel', on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.message
    

class RoomModel(models.Model):
    name = models.CharField(max_length=128, null=False)
    topic = models.CharField(max_length=10000)

    def __str__(self) -> str:
        return self.name
