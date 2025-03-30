from django.urls import path
from .views import TestServiceView

urlpatterns = [
    path('grabServiceData/', TestServiceView.as_view(), name='ServiceView'),
]