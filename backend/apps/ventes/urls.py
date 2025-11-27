from django.urls import path
from .views import liste_ventes, create_vente, update_vente, delete_vente

urlpatterns = [
    path('', liste_ventes),
    path('create/', create_vente),
    path('<int:pk>/update/', update_vente),
    path('<int:pk>/delete/', delete_vente),
    
]
