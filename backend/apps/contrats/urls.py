from django.urls import path
from .views import liste_contrats, create_contrat, update_contrat, delete_contrat

urlpatterns = [
    path('', liste_contrats),
    path('create/', create_contrat),
    path('<int:pk>/update/', update_contrat),
    path('<int:pk>/delete/', delete_contrat),
]
