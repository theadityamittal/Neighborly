from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'user_id',
            'name',
            'email',
            'phone_number',
            'address',
            'city',
            'neighborhood',
            'zip_code',
            'latitude',
            'longitude',
            'account_type',
            'verified',
            'created_at',
            'password',
            'is_staff',
        ]
        read_only_fields = ('user_id', 'created_at', 'is_staff')

    def create(self, validated_data):
        # Extract password and create user via manager to ensure all fields are handled properly
        password = validated_data.pop('password')
        user = CustomUser.objects.create_user(
            password=password,
            **validated_data
        )
        return user

    def update(self, instance, validated_data):
        # Handle password change
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))
        # Update other fields
        return super().update(instance, validated_data)
