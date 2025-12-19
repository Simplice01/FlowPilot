from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Tache
from .serializers import TacheSerializer
from apps.utilisateurs.permissions import IsCommercialOrHigher, IsManagerOrAdmin

# 🧩 Liste des tâches
@api_view(['GET'])
@permission_classes([IsCommercialOrHigher])
def liste_taches(request):
    """
    Liste toutes les tâches :
    - Admin & Manager : voient toutes les tâches
    - Commercial : voit uniquement ses propres tâches
    """
    taches = Tache.objects.all()

    # 🔒 Si commercial → ne voir que ses tâches
    if request.user.role == 'commercial':
        taches = taches.filter(commercial=request.user)

    serializer = TacheSerializer(taches, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsCommercialOrHigher])
def create_tache(request):
    data = request.data.copy()

    # 🔒 Le commercial DOIT être fourni
    if not data.get('commercial'):
        return Response(
            {"commercial": ["Ce champ est obligatoire."]},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = TacheSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 🧩 Mise à jour d’une tâche
@api_view(['PUT'])
@permission_classes([IsCommercialOrHigher])
def update_tache(request, pk):
    """
    Met à jour une tâche existante :
    - Admin & Manager : peuvent modifier toutes les tâches
    - Commercial : peut modifier uniquement ses propres tâches
    """
    try:
        tache = Tache.objects.get(pk=pk)
    except Tache.DoesNotExist:
        return Response({"error": "Tâche non trouvée"}, status=status.HTTP_404_NOT_FOUND)

    # 🔒 Vérifier que le commercial modifie bien sa tâche
    if request.user.role == 'commercial' and tache.commercial != request.user:
        return Response({"error": "Accès refusé 🚫"}, status=status.HTTP_403_FORBIDDEN)

    serializer = TacheSerializer(tache, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🧩 Suppression d’une tâche
@api_view(['DELETE'])
@permission_classes([IsManagerOrAdmin])
def delete_tache(request, pk):
    """
    Supprime une tâche :
    - Seuls les managers et administrateurs peuvent supprimer.
    """
    try:
        tache = Tache.objects.get(pk=pk)
        tache.delete()
        return Response({"message": "Tâche supprimée ✅"}, status=status.HTTP_204_NO_CONTENT)
    except Tache.DoesNotExist:
        return Response({"error": "Tâche non trouvée"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsCommercialOrHigher])
def detail_tache(request, pk):
    try:
        tache = Tache.objects.get(pk=pk)
    except Tache.DoesNotExist:
        return Response({"error": "Tâche introuvable"}, status=status.HTTP_404_NOT_FOUND)

    # 🔒 Sécurité
    if request.user.role == 'commercial' and tache.commercial != request.user:
        return Response({"error": "Accès refusé"}, status=status.HTTP_403_FORBIDDEN)

    serializer = TacheSerializer(tache)
    return Response(serializer.data)
