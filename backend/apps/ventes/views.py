from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Vente
from .serializers import VenteSerializer
from apps.utilisateurs.permissions import IsCommercialOrHigher, IsManagerOrAdmin

# 🧩 Liste des ventes
@api_view(['GET'])
@permission_classes([IsCommercialOrHigher])
def liste_ventes(request):
    """
    Liste toutes les ventes.
    - Admin/Manager : voient toutes les ventes
    - Commercial : voit uniquement ses ventes
    """
    ventes = Vente.objects.all()

    # 🔒 Filtrage dynamique : un commercial ne voit que ses ventes
    if request.user.role == 'commercial':
        ventes = ventes.filter(commercial=request.user)

    serializer = VenteSerializer(ventes, many=True)
    return Response(serializer.data)


# 🧩 Création d’une vente
@api_view(['POST'])
@permission_classes([IsCommercialOrHigher])
def create_vente(request):
    """
    Crée une nouvelle vente.
    Accessible aux commerciaux, managers et admins.
    Le commercial est automatiquement associé à la vente créée.
    """
    data = request.data.copy()

    # 🔒 Si l’utilisateur est commercial, on force son propre ID
    if request.user.role == 'commercial':
        data['commercial'] = request.user.id

    serializer = VenteSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🧩 Mise à jour d’une vente
@api_view(['PUT'])
@permission_classes([IsCommercialOrHigher])
def update_vente(request, pk):
    """
    Met à jour une vente existante.
    - Admin/Manager : peuvent modifier n’importe quelle vente.
    - Commercial : peut modifier uniquement ses propres ventes.
    """
    try:
        vente = Vente.objects.get(pk=pk)
    except Vente.DoesNotExist:
        return Response({"error": "Vente non trouvée"}, status=status.HTTP_404_NOT_FOUND)

    # 🔒 Restriction : un commercial ne peut modifier que ses ventes
    if request.user.role == 'commercial' and vente.commercial != request.user:
        return Response({"error": "Accès refusé 🚫"}, status=status.HTTP_403_FORBIDDEN)

    serializer = VenteSerializer(vente, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🧩 Suppression d’une vente
@api_view(['DELETE'])
@permission_classes([IsManagerOrAdmin])
def delete_vente(request, pk):
    """
    Supprime une vente.
    Seuls les managers et administrateurs peuvent supprimer.
    """
    try:
        vente = Vente.objects.get(pk=pk)
        vente.delete()
        return Response({"message": "Vente supprimée ✅"}, status=status.HTTP_204_NO_CONTENT)
    except Vente.DoesNotExist:
        return Response({"error": "Vente non trouvée"}, status=status.HTTP_404_NOT_FOUND)
