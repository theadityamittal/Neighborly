from rest_framework import serializers
from .models import UsersDocuments

class UsersDocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersDocuments
        fields = '__all__'