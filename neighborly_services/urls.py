from django.urls import path
from .views import TestServiceView
from .views import ServiceItemListView

urlpatterns = [
    path('grabServiceData/', TestServiceView.as_view(), name='grabServiceData'),
    path('services/', ServiceItemListView.as_view(), name='service-list'),
]