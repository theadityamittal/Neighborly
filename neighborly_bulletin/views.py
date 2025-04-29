from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

#for api filtering
from django_filters.rest_framework import DjangoFilterBackend
from .filters import BulletinItemFilter

from django.shortcuts import get_object_or_404

# Models and serializers
from .models import BulletinItem
from .serializers import BulletinItemSerializer#, BulletinItemSerializer

# Geolocation
from utils.geolocation import geocode_location

# class BulletinPostViewSet(viewsets.ModelViewSet):
#     queryset = BulletinPost.objects.all().order_by('-created_at')
#     serializer_class = BulletinPostSerializer
#     permission_classes = [IsAuthenticatedOrReadOnly]


'''For all bulletin items & creation of new bulletin items'''    
class BulletinItemListView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        filtered = BulletinItemFilter(request.GET, queryset=BulletinItem.objects.all())
        serializer = BulletinItemSerializer(filtered.qs, many=True)
        #serializer = BulletinItemSerializer(BulletinItem.objects.all(), many=True)
        return Response(serializer.data)
    
    def post(self, request):
        data = request.data.copy()
        data["post_provider"] = request.user.id  # auto-assign creator

        serializer = BulletinItemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

'''For a service item'''
class BulletinItemDetailView(APIView):
    permission_classes = [IsAuthenticated] 
    def get(self, request, post_id):
        try:
            service = get_object_or_404(BulletinItem, post_id=post_id) #BulletinItem.objects.get(post_id=post_id)
        except BulletinItem.DoesNotExist:
            return Response({"error": "Bulletin not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = BulletinItemSerializer(service) 
        return Response(serializer.data)
    
    
    def patch(self, request, post_id):
        service = get_object_or_404(BulletinItem, post_id=post_id)
        serializer = BulletinItemSerializer(service, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, post_id):
        service = get_object_or_404(BulletinItem, post_id=post_id)
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)