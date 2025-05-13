from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "user_id",
            "name",
            "email",
            "phone_number",
            "address",
            "city",
            "neighborhood",
            "zip_code",
            "latitude",
            "longitude",
            "icon",
            "account_type",
            "verified",
            "created_at",
            "password",
            "is_staff",
        ]
        read_only_fields = ("user_id", "created_at", "is_staff")

    def create(self, validated_data):
        print(f"validated_data before  = {validated_data}")
        password = validated_data.pop("password")

        # Only pass fields that create_user accepts
        create_user_fields = {
            "email": validated_data.get("email"),
            "name": validated_data.get("name"),
            "phone_number": validated_data.get("phone_number"),
            "address": validated_data.get("address"),
            "city": validated_data.get("city"),
            "neighborhood": validated_data.get("neighborhood"),
            "zip_code": validated_data.get("zip_code"),
            "account_type": validated_data.get("account_type"),
            "latitude": validated_data.get("latitude"),
            "longitude": validated_data.get("longitude"),
            "password": password,
        }

        # Handle icon separately
        icon = validated_data.pop("icon", None)
        print(f"validated_data after  = {validated_data}")
        user = CustomUser.objects.create_user(**create_user_fields)

        # Set icon if provided
        if icon:
            user.icon = icon
            user.save()

        return user

    def update(self, instance, validated_data):
        # Handle password change
        if "password" in validated_data:
            instance.set_password(validated_data.pop("password"))
        # Update other fields
        return super().update(instance, validated_data)
