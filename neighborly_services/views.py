from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ServiceItem, ServiceSignUp
from rest_framework.permissions import IsAuthenticated

class TestServiceView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        services = ServiceItem.objects.all().values()
        signup = ServiceSignUp.objects.all().values()
        
        return Response({
            "services": list(services),
            "signup": list(signup)
        })