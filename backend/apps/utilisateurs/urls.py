from django.urls import path
from .views import (
    liste_utilisateurs,
    detail_utilisateur,
    create_utilisateur,
    update_utilisateur,
    delete_utilisateur,
)

urlpatterns = [
    path('', liste_utilisateurs),
    path('<int:pk>/', detail_utilisateur),
    path('create/', create_utilisateur),
    path('<int:pk>/update/', update_utilisateur),
    path('<int:pk>/delete/', delete_utilisateur),
]
