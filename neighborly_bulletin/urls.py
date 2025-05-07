from django.urls import path
from .views import BulletinItemListView, BulletinItemDetailView, UserBulletinPostsView


urlpatterns = [
    path('', BulletinItemListView.as_view(), name='bulletin-list'),
    path('<int:post_id>/', BulletinItemDetailView.as_view(), name="bulletin-detail"),
    path('user/<str:user_uuid>/', UserBulletinPostsView.as_view(), name='user-bulletin-posts'),
]