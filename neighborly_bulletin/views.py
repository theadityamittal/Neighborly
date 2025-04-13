from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import BulletinPost
from .serializers import BulletinPostSerializer

class BulletinPostViewSet(viewsets.ModelViewSet):
    queryset = BulletinPost.objects.all().order_by('-created_at')
    serializer_class = BulletinPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]