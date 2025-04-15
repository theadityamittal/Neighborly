from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Event
from .serializers import EventSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class EventViewSet(ModelViewSet):
    queryset = Event.objects.all().order_by('-created_at')
    serializer_class = EventSerializer
    parser_classes = [MultiPartParser, FormParser]


    def get_queryset(self):
        return Event.objects.all().order_by('-created_at')

    @action(detail=False, methods=["post"], url_path="filter_organizer_id")
    def filter_organizer_id(self, request):
        organizer_id = request.data.get("organizer_id")
        if not organizer_id:
            return Response({"error": "organizer_id is required"}, status=400)

        events = Event.objects.filter(organizer_id=organizer_id).order_by("-created_at")
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)