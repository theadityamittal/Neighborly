from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Petition, PetitionSignature
from .serializers import PetitionSerializer, PetitionSignatureSerializer


# GET all petitions + all signatures
class TestPetitionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        petitions = Petition.objects.all()
        signatures = PetitionSignature.objects.all()

        petition_data = PetitionSerializer(petitions, many=True).data
        signature_data = PetitionSignatureSerializer(signatures, many=True).data

        return Response({
            "petition": petition_data,
            "petition_signatures": signature_data
        })


# GET petition by ID + its signatures
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def grab_petition_data(request, petition_id):
    petition = get_object_or_404(Petition, pk=petition_id)
    petition_data = PetitionSerializer(petition).data

    signatures = PetitionSignature.objects.filter(petition=petition)
    signature_data = PetitionSignatureSerializer(signatures, many=True).data

    return Response({
        "petition": petition_data,
        "petition_signatures": signature_data
    })
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_petition(request):
    serializer = PetitionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sign_petition(request, petition_id):
    petition = get_object_or_404(Petition, petition_id=petition_id)
    user_id = request.user.id

    already_signed = PetitionSignature.objects.filter(petition=petition, user_id=user_id).exists()
    if already_signed:
        return Response({"detail": "Already signed."}, status=status.HTTP_200_OK)

    PetitionSignature.objects.create(petition=petition, user_id=user_id)
    return Response({"detail": "Petition signed successfully."})