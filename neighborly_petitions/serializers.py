from rest_framework import serializers
from .models import Petition, PetitionSignature

class PetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Petition
        fields = '__all__'

class PetitionSignatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetitionSignature
        fields = '__all__'