from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ServiceItem, ServiceSignUp
from rest_framework.permissions import IsAuthenticated
from .serializers import ServiceItemSerializer

class TestServiceView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        services = ServiceItem.objects.all().values()
        signup = ServiceSignUp.objects.all().values()
        
        return Response({
            "services": list(services),
            "signup": list(signup)
        })

class ServiceItemListView(APIView):
    permission_classes = [IsAuthenticated] #for testing purposes, change to IsAuthenticated later

    def get(self, request):
        services = ServiceItem.objects.all()
        serializer = ServiceItemSerializer(services, many=True)
        return Response(serializer.data)

