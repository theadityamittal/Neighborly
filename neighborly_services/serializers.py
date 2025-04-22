from rest_framework import serializers
from .models import ServiceItem, ServiceSignUp

class ServiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceItem
        fields = '__all__'

    # # keep this override for renaming earliest_availability
    # closestAvailability = serializers.DateField(
    #     source="earliest_availability",
    #     read_only=True
    # )

    # class Meta:
    #     model = ServiceItem
    #     fields = [
    #         "service_id",
    #         "title",
    #         "description",
    #         "service_provider",
    #         "location",
    #         "date_posted",
    #         "available",
    #         "waitlist",
    #         "closestAvailability",
    #         "unavailable_dates",
    #         "price",
    #         "view_type",
    #         "tags",     
    #         "images",
    #     ]

class ServiceItemDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceItem
        fields = '__all__'

class ServiceSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceSignUp
        fields = ['signup_id', 'service', 'user_id', 'start_date', 'end_date', 'messages', 'status', 'signed_at']
        read_only_fields = ['user_id', 'signed_at', 'status']


