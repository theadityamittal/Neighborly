from rest_framework import serializers
from .models import ServiceItem, ServiceSignUp#, ServiceStatus

class ServiceItemSerializer(serializers.ModelSerializer):
    # class Meta:
    #     model = ServiceItem
    #     fields = '__all__'
    closestAvailability = serializers.DateField(source="earliest_availability", read_only=True)
    #id = serializers.IntegerField(source="service_id", read_only=True)
    class Meta:
        model = ServiceItem
        fields = [
            "service_id",
            "title",
            "description",
            "service_provider",      # still the user ID for now
            "location",
            "date_posted",
            "available",
            "waitlist",
            "closestAvailability",   # renamed from earliest_availability
            "unavailable_dates",
            "price",
            "view_type",
            "tabs",
            "images"
        ]

class ServiceItemDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceItem
        fields = '__all__'

class ServiceSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceSignUp
        fields = ['signup_id', 'service', 'user_id', 'start_date', 'end_date', 'messages', 'status', 'signed_at']
        read_only_fields = ['user_id', 'signed_at', 'status']
# class ServiceStatusSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ServiceStatus
#         fields = '__all__'

