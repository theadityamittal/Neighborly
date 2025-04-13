from rest_framework import serializers
from .models import BulletinPost

class BulletinPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BulletinPost
        fields = '__all__'