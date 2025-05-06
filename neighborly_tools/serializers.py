from rest_framework import serializers
from .models import Tool, BorrowRequest

class BorrowRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BorrowRequest
        # fields = '__all__'
        fields = ['signup_id', 'tool', 'user_id', 'start_date', 'end_date', 'messages', 'status', 'signed_at']
        read_only_fields = ['user_id', 'signed_at', 'status']

class ToolSerializer(serializers.ModelSerializer):
    borrow_requests = BorrowRequestSerializer(many=True, read_only=True)
    class Meta:
        model = Tool
        fields = '__all__'