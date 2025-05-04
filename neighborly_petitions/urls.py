from django.urls import path
from .views import TestPetitionView, grab_petition_data, create_petition, sign_petition, get_petitions

urlpatterns = [
    path('grabPetitionData/', TestPetitionView.as_view(), name='grabPetitionData'),
    path('grabPetitionData/<int:petition_id>/', grab_petition_data, name='grabPetitionDataById'),
    path('createPetition/', create_petition, name='createPetition'),
    path("testPetitions/", TestPetitionView.as_view(), name="test_petitions"),
    path('signPetition/<int:petition_id>/', sign_petition, name='signPetition'),
    path('get_my_petitions/', get_petitions, name="getPetitions")
]