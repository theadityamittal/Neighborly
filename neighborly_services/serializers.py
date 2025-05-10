from rest_framework import serializers
from .models import ServiceItem, ServiceSignUp


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

    class Meta:
        model = ServiceItem
        fields = "__all__"


# TODO: revisit and confirm if can delete?
class ServiceItemDetailSerializer(serializers.ModelSerializer):
    servicesignup = ServiceSignupSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceItem
        fields = "__all__"
