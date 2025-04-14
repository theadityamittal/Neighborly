from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from .models import Tool, BorrowRequest
from .serializers import ToolSerializer, BorrowRequestSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

class ToolViewSet(viewsets.ModelViewSet):
    queryset = Tool.objects.all()
    serializer_class = ToolSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = (SearchFilter,)
    search_fields = ['name', 'condition']  # Allow searching by name and condition

    @action(detail=True, methods=['patch'])
    def toggle_availability(self, request, pk=None):
        tool = self.get_object()
        tool.availability = not tool.availability
        tool.save()
        return Response({'status': 'availability toggled', 'availability': tool.availability})