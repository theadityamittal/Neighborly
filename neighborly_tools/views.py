from rest_framework import viewsets
from .models import Tool, BorrowRequest
from .serializers import ToolSerializer, BorrowRequestSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

class ToolViewSet(viewsets.ModelViewSet):
    queryset = Tool.objects.all()
    serializer_class = ToolSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def toggle_availability(self, request, pk=None):
        tool = self.get_object()
        tool.availability = not tool.availability
        tool.save()
        return Response({'status': 'availability toggled', 'availability': tool.availability})

class BorrowRequestViewSet(viewsets.ModelViewSet):
    queryset = BorrowRequest.objects.all()
    serializer_class = BorrowRequestSerializer
    permission_classes = [IsAuthenticated]