from rest_framework import serializers
from .models import Petition, PetitionSignature

class PetitionSerializer(serializers.ModelSerializer):
    signature_count = serializers.IntegerField(read_only=True)

    class Meta:
        model  = Petition
        fields = [
            'petition_id',
            'title',
            'description',
            'organizer_id',
            'visibility',
            'tags',
            'created_at',
            'target',
            'location',
            'provider',
            'voting_ends_at',
            'hero_image',
            'signature_count',
        ]

class PetitionSignatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetitionSignature
        fields = '__all__'