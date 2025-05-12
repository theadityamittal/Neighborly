from rest_framework import serializers
from .models import ServiceItem, ServiceSignUp
from django.contrib.auth import get_user_model
from neighborly_users.serializers import UserSerializer

CustomUser = get_user_model()


class ServiceSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceSignUp
        fields = [
            "signup_id",
            "service",
            "user_id",
            "start_date",
            "end_date",
            "messages",
            "status",
            "signed_at",
        ]
        read_only_fields = ["user_id", "signed_at", "status"]


class ServiceItemSerializer(serializers.ModelSerializer):
    servicesignup = ServiceSignupSerializer(many=True, read_only=True)
    provider_details = serializers.SerializerMethodField()

    class Meta:
        model = ServiceItem
        fields = "__all__"

    def get_provider_details(self, obj):
        user = CustomUser.objects.filter(user_id=obj.service_provider).first()
        return UserSerializer(user).data if user else None


# TODO: revisit and confirm if can delete?
class ServiceItemDetailSerializer(serializers.ModelSerializer):
    servicesignup = ServiceSignupSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceItem
        fields = "__all__"
