from rest_framework import serializers
from .models import ServiceItem, ServiceSignUp

class ServiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceItem
        fields = '__all__'

# can delete?
class ServiceItemDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceItem
        fields = '__all__'

class ServiceSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceSignUp
        fields = ['signup_id', 'service', 'user_id', 'start_date', 'end_date', 'messages', 'status', 'signed_at']
        read_only_fields = ['user_id', 'signed_at', 'status']


