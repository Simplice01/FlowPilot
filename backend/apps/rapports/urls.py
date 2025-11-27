from django.urls import path
from .views import liste_rapports, create_rapport, update_rapport, delete_rapport,generer_rapport

urlpatterns = [
    path('', liste_rapports),
    path('create/', create_rapport),
    path('<int:pk>/update/', update_rapport),
    path('<int:pk>/delete/', delete_rapport),
    path('generer/', generer_rapport),
]
