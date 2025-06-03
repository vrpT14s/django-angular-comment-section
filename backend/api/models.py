from django.db import models

class Comment(models.Model):
    text = models.TextField()
    image = models.TextField(null=True,blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    edited = models.BooleanField(default=False)
