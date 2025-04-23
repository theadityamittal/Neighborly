from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterUserView, UpdateUserView, UserDetailView, GetUserDetailView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('update/', UpdateUserView.as_view(), name='update_user'),
    path('user/info/', UserDetailView.as_view(), name='user_detail'),
    path('user/get/', GetUserDetailView.as_view(), name='get_user_detail'),
]