from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, grab_events_by_organizer

router = DefaultRouter()
router.register(r'events', EventViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path("grabEventsData/organizer/<str:user_id>", grab_events_by_organizer),
]
