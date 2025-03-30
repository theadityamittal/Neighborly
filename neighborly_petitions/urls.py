from django.urls import path
from .views import TestPetitionView

urlpatterns = [
    path('grabPetitionData/', TestPetitionView.as_view(), name='grabPetitionData'),
]