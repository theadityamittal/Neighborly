from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Petition, PetitionSignature
from rest_framework.permissions import IsAuthenticated

class TestPetitionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        petition = Petition.objects.all().values()
        petition_signatures = PetitionSignature.objects.all().values()
        
        return Response({
            "petition": list(petition),
            "petition_signatures": list(petition_signatures)
        })