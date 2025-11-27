from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Contrat
from .serializers import ContratSerializer
from apps.utilisateurs.permissions import IsCommercialOrHigher, IsManagerOrAdmin


# 🧩 Liste des contrats
@api_view(['GET'])
@permission_classes([IsCommercialOrHigher])
def liste_contrats(request):
    """
    Liste les contrats.
    - Admin / Manager : voient tous les contrats
    - Commercial : voit uniquement ses propres contrats
    """
    contrats = Contrat.objects.all()

    # 🔒 Filtrage automatique pour les commerciaux
    if request.user.role == 'commercial':
        contrats = contrats.filter(commercial=request.user)

    # Filtres optionnels via paramètres GET
    statut = request.GET.get('statut')
    commercial = request.GET.get('commercial')

    if statut:
        contrats = contrats.filter(statut=statut)
    if commercial and request.user.role != 'commercial':
        contrats = contrats.filter(commercial__id=commercial)

    serializer = ContratSerializer(contrats, many=True)
    return Response(serializer.data)


# 🧩 Création d’un contrat
@api_view(['POST'])
@permission_classes([IsCommercialOrHigher])
def create_contrat(request):
    """
    Crée un nouveau contrat.
    - Commercial : contrat automatiquement associé à lui-même
    - Manager / Admin : peuvent spécifier le commercial
    """
    data = request.data.copy()

    # 🔒 Si commercial → forcer le commercial connecté
    if request.user.role == 'commercial':
        data['commercial'] = request.user.id

    serializer = ContratSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🧩 Mise à jour d’un contrat
@api_view(['PUT'])
@permission_classes([IsCommercialOrHigher])
def update_contrat(request, pk):
    """
    Met à jour un contrat existant.
    - Admin / Manager : peuvent modifier tous les contrats
    - Commercial : uniquement ses propres contrats
    """
    try:
        contrat = Contrat.objects.get(pk=pk)
    except Contrat.DoesNotExist:
        return Response({"error": "Contrat non trouvé"}, status=status.HTTP_404_NOT_FOUND)

    # 🔒 Vérification d’accès
    if request.user.role == 'commercial' and contrat.commercial != request.user:
        return Response({"error": "Accès refusé 🚫"}, status=status.HTTP_403_FORBIDDEN)

    serializer = ContratSerializer(contrat, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🧩 Suppression d’un contrat
@api_view(['DELETE'])
@permission_classes([IsManagerOrAdmin])
def delete_contrat(request, pk):
    """
    Supprime un contrat.
    - Seuls les managers et administrateurs peuvent supprimer.
    """
    try:
        contrat = Contrat.objects.get(pk=pk)
        contrat.delete()
        return Response({"message": "Contrat supprimé ✅"}, status=status.HTTP_204_NO_CONTENT)
    except Contrat.DoesNotExist:
        return Response({"error": "Contrat non trouvé"}, status=status.HTTP_404_NOT_FOUND)
