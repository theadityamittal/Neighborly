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

'''For all bulletin items & creation of new bulletin items'''    
class BulletinItemListView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        filtered = BulletinItemFilter(request.GET, queryset=BulletinItem.objects.all())
        serializer = BulletinItemSerializer(filtered.qs, many=True)
        
        return Response(serializer.data)
    
    def post(self, request):
        # data = request.data.copy()
        print(request)
        #data = request.POST.copy()
        #files = request.FILES
        #data["user"] = request.user.id  # auto-assign creator
        request.data["user"] = request.user.id
        #serializer = BulletinItemSerializer(data=data)
        serializer = BulletinItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

'''For a bulletin item'''
class BulletinItemDetailView(APIView):
    permission_classes = [IsAuthenticated] 
    def get(self, request, post_id):
        bulletin = get_object_or_404(BulletinItem, post_id=post_id) #BulletinItem.objects.get(post_id=post_id)
        serializer = BulletinItemSerializer(bulletin) 
        return Response(serializer.data)
    
    
    def patch(self, request, post_id):
        bulletin = get_object_or_404(BulletinItem, post_id=post_id)
        serializer = BulletinItemSerializer(bulletin, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, post_id):
        bulletin = get_object_or_404(BulletinItem, post_id=post_id)
        bulletin.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
class UserBulletinPostsView(APIView):
    def get(self, request, user_uuid):
        posts = BulletinItem.objects.filter(user_id=user_uuid)
        serializer = BulletinItemSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)