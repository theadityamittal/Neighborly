from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Event

class TestEvents(APIView):
    def get(self, request):
        events = Event.objects.all().values()
        return Response({"events": list(events)})