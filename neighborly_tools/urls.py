from django.urls import path
from .views import ToolListView, ToolDetailView, ToolSignUpView,ToolSignUpDetailView, get_tools, get_tools_exclude_user, grab_tools_by_owner

urlpatterns = [
    path('', ToolListView.as_view(), name='tool-list'),
    path('get_tools/', get_tools, name='get_tools'),
    path('<int:tool_id>/', ToolDetailView.as_view(), name="tool-detail"),
    path('<int:tool_id>/borrow/', ToolSignUpView.as_view(), name='borrow-for-tool'),
    path("borrow/<int:signup_id>/", ToolSignUpDetailView.as_view(), name='tool-borrow-detail'),
    path("get_tools_exclude_user/", get_tools_exclude_user, name="get_tools_exclude_user"),
    path('tools/grabToolsData/owner/<str:user_id>/', grab_tools_by_owner),
]