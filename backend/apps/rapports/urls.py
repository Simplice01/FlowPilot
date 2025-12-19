from django.urls import path
from .views import liste_rapports, create_rapport, update_rapport, delete_rapport,generer_rapport

urlpatterns = [
    path('', liste_rapports),              # GET
    path('create/', create_rapport),       # POST manuel
    path('generer/', generer_rapport),     # POST automatique
    path('<int:pk>/update/', update_rapport),
    path('<int:pk>/delete/', delete_rapport),

]
