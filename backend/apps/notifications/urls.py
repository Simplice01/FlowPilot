from django.urls import path
from .views import (
    liste_notifications,
    create_notification,
    mark_as_read,
    delete_notification
)

urlpatterns = [
    path('', liste_notifications),
    path('create/', create_notification),
    path('<int:pk>/read/', mark_as_read),
    path('<int:pk>/delete/', delete_notification),
]
