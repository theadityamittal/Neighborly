from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, SignUpEventSet

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'signups', SignUpEventSet, basename='signup-event')

urlpatterns = [
    path('', include(router.urls)),
]
