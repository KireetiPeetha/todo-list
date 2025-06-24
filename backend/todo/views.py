from django.shortcuts import render

# todo-list/backend/todo/views.py

from rest_framework import viewsets        # Required for DRF ViewSets
from .serializers import TodoSerializer   # Your serializer for Todo model
from .models import Todo                  # Your Todo model

class TodoViewSet(viewsets.ModelViewSet):
    # What this does: Defines the queryset (data) that this viewset will operate on.
    # It fetches all Todo objects from the database and orders them by creation date (newest first).
    queryset = Todo.objects.all().order_by('-created_at')

    # What this does: Specifies the serializer to use for converting Todo model
    # instances to/from JSON (or other formats).
    serializer_class = TodoSerializer
