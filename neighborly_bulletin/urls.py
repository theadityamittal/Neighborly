from django.urls import path
from .views import BulletinItemListView, BulletinItemDetailView


urlpatterns = [
    path('', BulletinItemListView.as_view(), name='bulletin-list'),
    path('<int:post_id>/', BulletinItemDetailView.as_view(), name="bulletin-detail"),

]