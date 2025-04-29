from django.urls import path
from .views import TestPetitionView, grab_petition_data, grab_petition_data_by_organizer, create_petition, sign_petition

urlpatterns = [
    path('grabPetitionData/', TestPetitionView.as_view(), name='grabPetitionData'),
    path('grabPetitionData/<int:petition_id>/', grab_petition_data, name='grabPetitionDataById'),
    # grab petition data by user id
    path('grabPetitionData/organizer/<str:user_id>/', grab_petition_data_by_organizer, name='grabPetitionDataByOrganizerId'),
    path('createPetition/', create_petition, name='createPetition'),
    path("testPetitions/", TestPetitionView.as_view(), name="test_petitions"),
    path('signPetition/<int:petition_id>/', sign_petition, name='signPetition'),
]