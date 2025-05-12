from rest_framework import serializers
from .models import Tool, BorrowRequest
from django.contrib.auth import get_user_model
from neighborly_users.serializers import UserSerializer

CustomUser = get_user_model()

class BorrowRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BorrowRequest
        # fields = '__all__'
        fields = [
            "signup_id",
            "tool",
            "user_id",
            "start_date",
            "end_date",
            "messages",
            "status",
            "signed_at",
        ]
        read_only_fields = ["user_id", "signed_at", "status"]


class ToolSerializer(serializers.ModelSerializer):
    borrow_requests = BorrowRequestSerializer(many=True, read_only=True)
    provider_details = serializers.SerializerMethodField()

    class Meta:
        model = Tool
        fields = "__all__"
    
    def get_provider_details(self, obj):
        user = CustomUser.objects.filter(user_id=obj.owner_id).first()
        return UserSerializer(user).data if user else None
