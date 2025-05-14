from django.urls import path
from .views import (
    TestPetitionView,
    grab_petition_data,
    grab_petition_data_by_organizer,
    create_petition,
    sign_petition,
    edit_petitions,
)

urlpatterns = [
    path("grabPetitionData/", TestPetitionView.as_view(), name="grabPetitionData"),
    path(
        "grabPetitionData/<int:petition_id>/",
        grab_petition_data,
        name="grabPetitionDataById",
    ),
    # grab petition data by user id
    path(
        "grabPetitionData/organizer/<str:user_id>/",
        grab_petition_data_by_organizer,
        name="grabPetitionDataByOrganizerId",
    ),
    path("createPetition/", create_petition, name="createPetition"),
    path("signPetition/<int:petition_id>/", sign_petition, name="signPetition"),
    path("edit_petitions/<int:petition_id>/", edit_petitions, name="edit_petitions"),
]
