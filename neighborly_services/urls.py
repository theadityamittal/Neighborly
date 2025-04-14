from django.urls import path
from .views import TestServiceView
from .views import ServiceItemListView
from .views import ServiceItemSignUpView

urlpatterns = [
    path('grabServiceData/', TestServiceView.as_view(), name='grabServiceData'),
    path('', ServiceItemListView.as_view(), name='service-list'),
    path('<int:service_id>/signup/', ServiceItemSignUpView.as_view(), name='signup-for-service'),
]