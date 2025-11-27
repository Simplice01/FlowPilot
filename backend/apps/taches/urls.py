from django.urls import path
from .views import liste_taches, create_tache, update_tache, delete_tache

urlpatterns = [
    path('', liste_taches),
    path('create/', create_tache),
    path('<int:pk>/update/', update_tache),
    path('<int:pk>/delete/', delete_tache),
]
