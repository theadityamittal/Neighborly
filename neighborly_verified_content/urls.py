from django.urls import path
from .views import SubmitVerificationRequestView, UserDocumentsView

urlpatterns = [
    path(
        "verificationDocument/",
        SubmitVerificationRequestView.as_view(),
        name="VerificationDocument",
    ),
    path("UserDocuments/", UserDocumentsView.as_view(), name="UserDocuments"),
]
