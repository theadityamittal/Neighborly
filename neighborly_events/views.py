from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Event, EventSignUp

class TestEvents(APIView):
    def get(self, request):
        events = Event.objects.all().values()
        event_signups = EventSignUp.objects.all().values()
        return Response({
            "events": list(events),
            "event_signups": list(event_signups),
        })