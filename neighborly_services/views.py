from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import ServiceItem, ServiceSignUp

from .serializers import ServiceItemSerializer, ServiceSignupSerializer
from utils.availability import get_earliest_availability

from datetime import timedelta


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
    permission_classes = [IsAuthenticated] 

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

        signup = ServiceSignUp.objects.create(
            user_id=str(request.user.id),
            service=service,
            start_date=request.data.get('start_date'),
            end_date=request.data.get('end_date'),
            messages=request.data.get('messages', ''),
        )

        serializer = ServiceSignupSerializer(signup)
        return Response(serializer.data, status=201)

class ServiceRequestStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, signup_id):
        new_status = request.data.get("status")  # "accepted" or "rejected"

        if new_status not in ["accepted", "rejected"]:
            return Response({"error": "Invalid status."}, status=400)

        try:
            signup = ServiceSignUp.objects.get(pk=signup_id)
        except ServiceSignUp.DoesNotExist:
            return Response({"error": "Signup not found."}, status=400)

        service = signup.service

        # if str(service.service_provider.id) != str(request.user.id):
        #     return Response({"error": "Unauthorized."}, status=403)

        signup.status = new_status
        signup.save()

        if new_status == "accepted":
            start = signup.start_date
            end = signup.end_date
            new_blocked_dates = []
            #current = start
            while start <= end:
                new_blocked_dates.append(str(start))  # Ensure ISO format
                start += timedelta(days=1)
            # Merge with existing unavailable dates
            current_unavailable = service.unavailable_dates or []
            updated_unavailable = list(set(current_unavailable + new_blocked_dates))
            service.unavailable_dates = updated_unavailable

            # Recalculate earliest availability
            service.earliest_availability = get_earliest_availability(updated_unavailable)
            
            service.save()

        return Response({"message": f"Signup status updated to {new_status}."}, status=200)