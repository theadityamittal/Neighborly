from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ServiceItem, ServiceStatus

class TestServiceView(APIView):
    def get(self, request):
        services = ServiceItem.objects.all().values()
        statuses = ServiceStatus.objects.all().values()
        
        return Response({
            "services": list(services),
            "statuses": list(statuses)
        })