from rest_framework import serializers
from django.conf import settings
from .models import Event, EventSignUp
from neighborly_users.models import CustomUser
from neighborly_users.serializers import UserSerializer
    
class EventSignUpSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = EventSignUp
        fields = '__all__'

    def get_user(self, obj):
        user = CustomUser.objects.filter(user_id=obj.user_id).first()
        if user:
            return UserSerializer(user).data
        return None

class EventSerializer(serializers.ModelSerializer):
    eventsignup = EventSignUpSerializer(many=True, read_only=True)
    class Meta:
        model = Event
        fields = [
            'event_id', 
            'event_name', 
            'organizer_name', 
            'organizer_id', 
            'description', 
            'location', 
            'date', 
            'time', 
            'visibility', 
            'tags', 
            'recurring', 
            'max_attendees', 
            'created_at', 
            'image',
            'eventsignup',
            
        ]
    def get_image_url(self, obj):
        if obj.image:
            return f"{settings.AWS_S3_BASE_URL}{obj.image}"
        return None