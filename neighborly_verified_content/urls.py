from django.urls import path
from .views import SubmitVerificationRequestView

urlpatterns = [
    path('verificationDocument/', SubmitVerificationRequestView.as_view(), name='VerificationDocument'),
]