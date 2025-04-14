from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ServiceItem, ServiceSignUp
from rest_framework.permissions import IsAuthenticated
from .serializers import ServiceItemSerializer, ServiceSignupSerializer

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

class ServiceItemSignUpView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, service_id):
        try:
            service = ServiceItem.objects.get(pk=service_id)
        except ServiceItem.DoesNotExist:
            return Response({"error": "Service not found."}, status=404)

        # Prevent duplicate signup
        # if ServiceSignUp.objects.filter(user=request.user, service=service).exists():
        #     return Response({"detail": "You have already signed up for this service."}, status=400)


        # signup = ServiceSignUp.objects.create(service=service)
        signup = ServiceSignUp.objects.create(
            user_id=str(request.user.id),
            service=service,
            start_date=request.data.get('start_date'),
            end_date=request.data.get('end_date'),
            messages=request.data.get('messages', ''),
        )

        serializer = ServiceSignupSerializer(signup)
        return Response(serializer.data, status=201)
