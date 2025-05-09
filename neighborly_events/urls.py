from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EventViewSet,
    SignUpEventSet,
    get_information_for_event,
    get_events_for_user,
    grab_events_by_organizer,
)

router = DefaultRouter()
router.register(r"events", EventViewSet)
router.register(r"signups", SignUpEventSet, basename="signup-event")

urlpatterns = [
    path("", include(router.urls)),
    path("userlist/<int:event_id>/", get_information_for_event, name="get-event-info"),
    path("list/", get_events_for_user, name="get-events-for-user"),
    path("grabEventsData/organizer/<str:user_id>", grab_events_by_organizer),
]
