from django.contrib import admin
from .models import Comment

class CommentAdmin(admin.ModelAdmin):
  list_display = ("text", "image", "timestamp", "edited")

admin.site.register(Comment, CommentAdmin)
