from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TaskSerializer
from .models import Task
from rest_framework import status

# Create your views here.

@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'List': '/task-list',
        'Detail View': '/task-detail/<str:pk>/',
        'Create': '/task-create/',
        'Update': '/task-update/<str:pk>/',
        'Delete': '/task-delete/<str:pk>/',
    }
    return Response(api_urls)


# ============================================ LIST VIEW ============================================ #
@api_view(['GET'])
def taskList(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


# ============================================ DETAIL VIEW ============================================ #
@api_view(['GET'])
def taskDetail(request, pk):
    task = Task.objects.get(id=pk)
    serializer = TaskSerializer(task, many=False)
    return Response(serializer.data)


# ============================================ CREATE VIEW ============================================ #
@api_view(['POST'])
def taskCreate(request):
    serializer = TaskSerializer(data = request.data)

    if serializer.is_valid():
        serializer.save() # TODO: will have to add the error handling part later
    return Response(serializer.data)


# ============================================ UPDATE VIEW ============================================ #
@api_view(['POST'])
def taskUpdate(request, pk):
    task = Task.objects.get(id=pk)
    serializer = TaskSerializer(instance = task, data = request.data)

    if serializer.is_valid():
        serializer.save() # TODO: will have to add the error handling part later
    return Response(serializer.data)


# ============================================ DELETE VIEW ============================================ #
@api_view(['GET','DELETE'])
def taskDelete(request, pk):
    task = Task.objects.get(id=pk)
    serializer = TaskSerializer(task, many=False)
    task.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)