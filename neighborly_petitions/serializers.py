from rest_framework import serializers
from .models import Petition, PetitionSignature
from neighborly_users.models import CustomUser
from neighborly_users.serializers import UserSerializer

class PetitionSerializer(serializers.ModelSerializer):
    signature_count = serializers.IntegerField(read_only=True)
    provider_details = serializers.SerializerMethodField()
    class Meta:
        model = Petition
        fields = [
            "petition_id",
            "title",
            "description",
            "organizer_id",
            "provider",
            "location",
            "street_address",
            "city",
            "zip_code",
            "neighborhood",
            "latitude",
            "longitude",
            "visibility",
            "tags",
            "created_at",
            "target",
            "voting_ends_at",
            "hero_image",
            "signature_count",
            "provider_details",
        ]
    def get_provider_details(self, obj):
        user = CustomUser.objects.filter(user_id=obj.organizer_id).first()
        return UserSerializer(user).data if user else None


class PetitionSignatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetitionSignature
        fields = "__all__"
