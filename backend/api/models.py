from django.db import models

class Comment(models.Model):
    text = models.TextField()
    image = models.ImageField(upload_to='images/', null=True, blank=True)
        #^saved to backend/media/images/
    timestamp = models.DateTimeField(auto_now_add=True)
