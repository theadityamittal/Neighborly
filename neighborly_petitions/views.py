from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Count
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes, parser_classes

from .models import Petition, PetitionSignature
from .serializers import PetitionSerializer, PetitionSignatureSerializer


# GET all petitions + all signatures
class TestPetitionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # annotate each petition with its signature_count
        petitions = Petition.objects.annotate(
            signature_count=Count("petitionsignature")
        ).exclude(organizer_id=request.user.user_id)
        petition_data = PetitionSerializer(petitions, many=True).data

        # if you still need full signature list:
        signatures = PetitionSignature.objects.all()
        signature_data = PetitionSignatureSerializer(signatures, many=True).data

        return Response(
            {"petitions": petition_data, "petition_signatures": signature_data}
        )


# GET petition by ID + its signatures
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def grab_petition_data(request, petition_id):
    # annotate the single petition
    petition = get_object_or_404(
        Petition.objects.annotate(signature_count=Count("petitionsignature")),
        pk=petition_id,
    )
    petition_data = PetitionSerializer(petition).data

    signatures = PetitionSignature.objects.filter(petition=petition)
    signature_data = PetitionSignatureSerializer(signatures, many=True).data

    return Response({"petition": petition_data, "petition_signatures": signature_data})


# GET petitions by organizer ID
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def grab_petition_data_by_organizer(request, user_id):
    # annotate each petition with its signature_count
    petitions = Petition.objects.filter(organizer_id=user_id).annotate(
        signature_count=Count("petitionsignature")
    )
    petition_data = PetitionSerializer(petitions, many=True).data

    return Response({"petitions": petition_data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_petition(request):
    serializer = PetitionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def sign_petition(request, petition_id):
    petition = get_object_or_404(Petition, petition_id=petition_id)
    user_id = request.user.user_id

    if PetitionSignature.objects.filter(petition=petition, user_id=user_id).exists():
        return Response({"detail": "Already signed."}, status=status.HTTP_200_OK)

    PetitionSignature.objects.create(petition=petition, user_id=user_id)
    return Response({"detail": "Petition signed successfully."})


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def edit_petitions(request, petition_id):
    service = get_object_or_404(Petition, petition_id=petition_id)
    print(service)
    print(request.data)
    serializer = PetitionSerializer(service, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
