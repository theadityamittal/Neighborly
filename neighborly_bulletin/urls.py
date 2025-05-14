from django.urls import path
from .views import BulletinItemListView, BulletinItemDetailView, UserBulletinPostsView


urlpatterns = [
<<<<<<< HEAD
    path('', BulletinItemListView.as_view(), name='bulletin-list'),
    path('<int:post_id>/', BulletinItemDetailView.as_view(), name="bulletin-detail"),
    path('user/<str:user_uuid>/', UserBulletinPostsView.as_view(), name='user-bulletin-posts'),
]
=======
    path("", BulletinItemListView.as_view(), name="bulletin-list"),
    path("<int:post_id>/", BulletinItemDetailView.as_view(), name="bulletin-detail"),
    path(
        "user/<str:user_uuid>/",
        UserBulletinPostsView.as_view(),
        name="user-bulletin-posts",
    ),
]
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
