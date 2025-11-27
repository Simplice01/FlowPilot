from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """Autorise uniquement les admins."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsManagerOrAdmin(permissions.BasePermission):
    """Autorise les managers et admins."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['manager', 'admin']


class IsCommercialOrHigher(permissions.BasePermission):
    """Autorise commerciaux, managers et admins."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['commercial', 'manager', 'admin']
