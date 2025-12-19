from django.urls import path
from .views import (
    liste_utilisateurs,
    detail_utilisateur,
    create_utilisateur,
    update_utilisateur,
    delete_utilisateur,
    liste_commerciaux,
    me,
    CustomTokenObtainPairView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # AUTH
    path('login/', CustomTokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),

    # USERS CRUD
    path('', liste_utilisateurs),                # GET /api/users/
    path('create/', create_utilisateur),         # POST /api/users/create/
    path('<int:pk>/', detail_utilisateur),        # GET
    path('<int:pk>/update/', update_utilisateur), # PUT
    path('<int:pk>/delete/', delete_utilisateur), # DELETE
    path('commerciaux/', liste_commerciaux),
    path('me/', me),


]
