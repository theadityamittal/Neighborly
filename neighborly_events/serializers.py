from rest_framework import serializers
from django.conf import settings
from .models import Event

class EventSerializer(serializers.ModelSerializer):
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
            'image'
        ]
    def get_image_url(self, obj):
        if obj.image:
            return f"{settings.AWS_S3_BASE_URL}{obj.image}"
        return None