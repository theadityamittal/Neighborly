from django.urls import path
from .views import TestPetitionView, grab_petition_data, create_petition, sign_petition, get_petitions, get_petitions_not_users, get_petition_data

urlpatterns = [
    path('grabPetitionData/', TestPetitionView.as_view(), name='grabPetitionData'),
    path('grabPetitionData/<int:petition_id>/', grab_petition_data, name='grabPetitionDataById'),
    path('createPetition/', create_petition, name='createPetition'),
    path("testPetitions/", TestPetitionView.as_view(), name="test_petitions"),
    path('signPetition/<int:petition_id>/', sign_petition, name='signPetition'),
    path('get_my_petitions/', get_petitions, name="getPetitions"),
    path('get_petitions_not_users/', get_petitions_not_users, name="get_petitions_not_users"),
    path('get_petition_data/<int:petition_id>/', get_petition_data, name="get_petition_data")
]