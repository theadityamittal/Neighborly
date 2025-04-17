# neighborly_bulletin/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BulletinPostViewSet

router = DefaultRouter()
router.register(r'', BulletinPostViewSet, basename='bulletin')  # root route

urlpatterns = [
    path('', include(router.urls)),
]