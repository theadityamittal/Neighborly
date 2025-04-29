from rest_framework import serializers
from .models import BulletinItem

class BulletinItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BulletinItem
        fields = '__all__'