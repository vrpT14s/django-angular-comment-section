from django.shortcuts import render

from rest_framework import viewsets
from .models import Comment
from .serializers import CommentSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        order = self.request.query_params.get('order')
        if order == 'oldest-first':
            return self.queryset.order_by('timestamp')
        return self.queryset.order_by('-timestamp')
