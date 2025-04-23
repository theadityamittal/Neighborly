from django.urls import path
from .views import ToolListView, ToolDetailView, ToolSignUpView,ToolSignUpDetailView

urlpatterns = [
    path('', ToolListView.as_view(), name='tool-list'),
    path('<int:tool_id>/', ToolDetailView.as_view(), name="tool-detail"),
    path('<int:tool_id>/borrow/', ToolSignUpView.as_view(), name='borrow-for-tool'),
    path("borrow/<int:signup_id>/", ToolSignUpDetailView.as_view(), name='tool-borrow-detail'),

]