from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Prospect
from .serializers import ProspectSerializer
from apps.clients.models import Client
from apps.utilisateurs.permissions import IsCommercialOrHigher, IsManagerOrAdmin


# 🧩 Liste des prospects
@api_view(['GET'])
@permission_classes([IsCommercialOrHigher])
def liste_prospects(request):
    """
    Liste tous les prospects :
    - Admin / Manager : voient tous les prospects
    - Commercial : voit uniquement ses propres prospects
    """
    prospects = Prospect.objects.all()

    # 🔒 Si l'utilisateur est commercial, ne voir que ses prospects
    if request.user.role == 'commercial':
        prospects = prospects.filter(commercial=request.user)

    # Filtres optionnels
    statut = request.GET.get('statut')
    commercial = request.GET.get('commercial')
    nom = request.GET.get('nom')

    if statut:
        prospects = prospects.filter(statut=statut)
    if commercial and request.user.role != 'commercial':
        prospects = prospects.filter(commercial__id=commercial)
    if nom:
        prospects = prospects.filter(last_name__icontains=nom)

    serializer = ProspectSerializer(prospects, many=True)
    return Response(serializer.data)


# 🧩 Création d’un prospect
@api_view(['POST'])
@permission_classes([IsCommercialOrHigher])
def create_prospect(request):
    """
    Crée un nouveau prospect :
    - Le commercial est AUTOMATIQUEMENT l'utilisateur connecté
    """
    serializer = ProspectSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(commercial=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 🧩 Conversion d’un prospect en client
@api_view(['POST'])
@permission_classes([IsCommercialOrHigher])
def convertir_prospect(request, pk):
    """
    Convertit un prospect en client.
    Accessible aux commerciaux, managers et administrateurs.
    """
    try:
        prospect = Prospect.objects.get(id=pk)
    except Prospect.DoesNotExist:
        return Response({"error": "Prospect non trouvé"}, status=404)

    # 🔒 Vérifier qu'un commercial ne convertit que ses prospects
    if request.user.role == 'commercial' and prospect.commercial != request.user:
        return Response({"error": "Accès refusé 🚫"}, status=status.HTTP_403_FORBIDDEN)

    # Création du client à partir du prospect
    client = Client.objects.create(
        first_name=prospect.first_name,
        last_name=prospect.last_name,
        email=prospect.email,
        phone=prospect.phone,
        commercial=prospect.commercial,
        statut='client'
    )

    # Mise à jour du statut du prospect
    prospect.statut = 'converti'
    prospect.save()

    return Response({
        "message": "Prospect converti en client ✅",
        "client_id": client.id
    }, status=status.HTTP_201_CREATED)


# 🧩 Mise à jour d’un prospect
@api_view(['PUT'])
@permission_classes([IsCommercialOrHigher])
def update_prospect(request, pk):
    """
    Met à jour un prospect :
    - Admin / Manager : peuvent modifier tous les prospects
    - Commercial : uniquement ses propres prospects
    """
    try:
        prospect = Prospect.objects.get(pk=pk)
    except Prospect.DoesNotExist:
        return Response({"error": "Prospect non trouvé"}, status=status.HTTP_404_NOT_FOUND)

    # 🔒 Vérification du propriétaire
    if request.user.role == 'commercial' and prospect.commercial != request.user:
        return Response({"error": "Accès refusé 🚫"}, status=status.HTTP_403_FORBIDDEN)

    serializer = ProspectSerializer(prospect, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🧩 Suppression d’un prospect
@api_view(['DELETE'])
@permission_classes([IsManagerOrAdmin])
def delete_prospect(request, pk):
    """
    Supprime un prospect :
    - Seuls les managers et administrateurs peuvent supprimer.
    """
    try:
        prospect = Prospect.objects.get(pk=pk)
        prospect.delete()
        return Response({"message": "Prospect supprimé avec succès ✅"}, status=status.HTTP_204_NO_CONTENT)
    except Prospect.DoesNotExist:
        return Response({"error": "Prospect non trouvé"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'PUT'])
@permission_classes([IsCommercialOrHigher])
def prospect_detail(request, pk):
    try:
        prospect = Prospect.objects.get(pk=pk)
    except Prospect.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.user.role == 'commercial' and prospect.commercial != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = ProspectSerializer(prospect)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = ProspectSerializer(prospect, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
