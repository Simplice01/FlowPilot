from django.urls import path
from .views import liste_clients
from .views import create_client
from .views import update_client
from .views import delete_client



urlpatterns = [
    path('', liste_clients),
    path('create/', create_client),
    path('<int:pk>/update/', update_client),
    path('<int:pk>/delete/', delete_client),



]
