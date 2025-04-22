from django.urls import path
# from .views import TestServiceView
from .views import ServiceItemListView, ServiceItemDetailView, ServiceItemSignUpView,ServiceSignUpDetailView


urlpatterns = [
    # path('grabServiceData/', TestServiceView.as_view(), name='grabServiceData'),
    path('', ServiceItemListView.as_view(), name='service-list'),
    path('<int:service_id>/', ServiceItemDetailView.as_view(), name="service-detail"),
    path('<int:service_id>/signup/', ServiceItemSignUpView.as_view(), name='signup-for-service'),
    path("signup/<int:signup_id>/", ServiceSignUpDetailView.as_view(), name='service-signup-detail'),

]