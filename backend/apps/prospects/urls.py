from django.urls import path
from .views import liste_prospects
from .views import convertir_prospect
from .views import create_prospect
from .views import update_prospect
from .views import delete_prospect


urlpatterns = [
    path('', liste_prospects),
    path('<int:pk>/convert/', convertir_prospect),
    path('create/', create_prospect),
    path('<int:pk>/update/', update_prospect),
    path('<int:pk>/delete/', delete_prospect),



]
