from django.urls import path, include
from .views import (
    ServiceItemListView,
    ServiceItemDetailView,
    ServiceItemSignUpView,
    ServiceSignUpDetailView,
    get_services_by_user,
    update_visibility,
    get_services_exculde_user,
)
urlpatterns = [
    path("", ServiceItemListView.as_view(), name="service-list"),
    path("get_services_exculde_user/", get_services_exculde_user, name="get_services_exculde_user"),
    path("<int:service_id>/", ServiceItemDetailView.as_view(), name="service-detail"),
    path(
        "<int:service_id>/signup/",
        ServiceItemSignUpView.as_view(),
        name="signup-for-service",
    ),
    path(
        "signup/<int:signup_id>/",
        ServiceSignUpDetailView.as_view(),
        name="service-signup-detail",
    ),
    path("user/<str:user_id>/", get_services_by_user),
    path("updateVisibility/", update_visibility)
]
