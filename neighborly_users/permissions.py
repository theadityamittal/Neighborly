from rest_framework.permissions import BasePermission


class IsStaffPermission(BasePermission):
    """
    Custom permission to only allow staff members to access the specific view.
    """

    message = "You must be a staff member to access this resource."

    def has_permission(self, request, view):
        return request.user and request.user.is_staff


class IsVerifiedPermission(BasePermission):
    """
    Custom permission to only allow verified members to access the specific view.
    """

    message = "You must be a verified member to access this resource."

    def has_permission(self, request, view):
        return request.user and request.user.verified
