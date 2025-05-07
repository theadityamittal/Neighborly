from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Event, EventSignUp
from .serializers import EventSerializer, EventSignUpSerializer
from neighborly_users.models import CustomUser
from neighborly_users.serializers import UserSerializer
from rest_framework.decorators import action, permission_classes, api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

class EventViewSet(ModelViewSet):
    queryset = Event.objects.all().order_by('-created_at')
    serializer_class = EventSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated] 


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
    
    @action(detail=False, methods=["get"], url_path="get_events")
    def get_events(self, request):
        events = Event.objects.filter(eventsignup__user_id=request.user.user_id)
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["get"], url_path="get_events_not_users")
    def get_events_not_users(self, request):
        print(request.user.user_id)
        events = Event.objects.exclude(organizer_id=request.user.user_id)
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)




class SignUpEventSet(ModelViewSet):
    queryset = EventSignUp.objects.all().order_by('-signed_at')
    serializer_class = EventSignUp
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["post"], url_path="signup_event")
    def signup_for_event(self, request):
        user_id = request.user.user_id
        event = request.data.get("event_id")

        se = EventSignUp.objects.filter(event_id=event, user_id=user_id)
        if se.exists():
            return Response({"message": "User has already signed up"}, status=status.HTTP_200_OK)
        
        EventSignUp.objects.create(event_id=event, user_id=user_id)
        return Response({"message": "Successfully signed up for event."}, status=201)

    def delete(self, request, signup_id):
        signup = get_object_or_404(EventSignUp, signup_id=signup_id)
        print(signup)
        signup.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=["get"], url_path="unsignup_event")
    def unsignup_for_event(self, request):
        user_id = request.user.user_id

        se = EventSignUp.objects.filter(event_id=event, user_id=user_id)
        if not se.exists():
            return Response({"message": "User has already unsigned up"}, status=status.HTTP_200_OK)
        
        se.delete()  # This deletes all matching rows
        return Response({"message": "Successfully unsigned from event."}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_events_for_user(request):
    user_id = request.user.user_id
    print(request.user.user_id)
    events = Event.objects.filter(organizer_id=request.user.user_id)

    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_information_for_event(request, event_id):
    event_information = EventSignUp.objects.filter(event_id=event_id)
    serializer = EventSignUpSerializer(event_information, many=True)
    return Response(serializer.data)

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def grab_events_by_organizer(request, user_id):
    events = Event.objects.filter(organizer_id=user_id)  # Make sure this is a STRING match
    data = EventSerializer(events, many=True).data
    return Response({"events": data})