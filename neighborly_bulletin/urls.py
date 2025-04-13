from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BulletinPostViewSet

router = DefaultRouter()
router.register(r'posts', BulletinPostViewSet)

urlpatterns = [
    path('', include(router.urls)),
]