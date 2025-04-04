from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ToolViewSet, BorrowRequestViewSet

router = DefaultRouter()
router.register(r'tools', ToolViewSet)
router.register(r'borrow_requests', BorrowRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]