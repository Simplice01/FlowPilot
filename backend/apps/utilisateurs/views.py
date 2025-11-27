from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .models import Utilisateur
from .serializers import UtilisateurSerializer
from apps.utilisateurs.permissions import IsAdmin

# 🧩 Liste de tous les utilisateurs
@api_view(['GET'])
@permission_classes([IsAdmin])  # Seul l'admin peut voir tous les utilisateurs
def liste_utilisateurs(request):
    """
    Retourne la liste complète des utilisateurs.
    Accessible uniquement par un administrateur.
    """
    users = Utilisateur.objects.all()
    serializer = UtilisateurSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# 🧩 Récupérer un utilisateur spécifique
@api_view(['GET'])
@permission_classes([IsAdmin])
def detail_utilisateur(request, pk):
    """
    Retourne les détails d'un utilisateur précis.
    """
    try:
        user = Utilisateur.objects.get(pk=pk)
    except Utilisateur.DoesNotExist:
        return Response({"error": "Utilisateur introuvable"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UtilisateurSerializer(user)
    return Response(serializer.data)


# 🧩 Créer un nouvel utilisateur (réservé à l’admin)
@api_view(['POST'])
@permission_classes([IsAdmin])
def create_utilisateur(request):
    """
    Crée un nouvel utilisateur avec un rôle défini (admin, manager, commercial).
    """
    serializer = UtilisateurSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🧩 Modifier un utilisateur existant
@api_view(['PUT'])
@permission_classes([IsAdmin])
def update_utilisateur(request, pk):
    """
    Met à jour les informations d’un utilisateur.
    """
    try:
        user = Utilisateur.objects.get(pk=pk)
    except Utilisateur.DoesNotExist:
        return Response({"error": "Utilisateur introuvable"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UtilisateurSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🧩 Supprimer un utilisateur
@api_view(['DELETE'])
@permission_classes([IsAdmin])
def delete_utilisateur(request, pk):
    """
    Supprime un utilisateur du système.
    """
    try:
        user = Utilisateur.objects.get(pk=pk)
        user.delete()
        return Response({"message": "Utilisateur supprimé ✅"}, status=status.HTTP_204_NO_CONTENT)
    except Utilisateur.DoesNotExist:
        return Response({"error": "Utilisateur introuvable"}, status=status.HTTP_404_NOT_FOUND)
