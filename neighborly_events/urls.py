from django.urls import path
from .views import TestEvents

urlpatterns = [
    path('grabEventsData/', TestEvents.as_view(), name='grabEventsData'),
]