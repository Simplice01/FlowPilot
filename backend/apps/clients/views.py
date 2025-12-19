from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Client
from .serializers import ClientSerializer
from apps.utilisateurs.permissions import IsCommercialOrHigher, IsManagerOrAdmin


# 🧩 Liste des clients
@api_view(['GET'])
@permission_classes([IsCommercialOrHigher])
def liste_clients(request):
    """
    Liste tous les clients :
    - Admin / Manager : voient tous les clients
    - Commercial : voit uniquement ses propres clients
    """
    clients = Client.objects.all()

    # 🔒 Si commercial → voir uniquement ses clients
    if request.user.role == 'commercial':
        clients = clients.filter(commercial=request.user)

    # Filtres dynamiques depuis l’URL
    statut = request.GET.get('statut')
    commercial = request.GET.get('commercial')
    nom = request.GET.get('nom')

    if statut:
        clients = clients.filter(statut=statut)
    if commercial and request.user.role != 'commercial':
        clients = clients.filter(commercial__id=commercial)
    if nom:
        clients = clients.filter(last_name__icontains=nom)

    serializer = ClientSerializer(clients, many=True)
    return Response(serializer.data)


# 🧩 Création d’un client
@api_view(['POST'])
@permission_classes([IsCommercialOrHigher])
def create_client(request):
    """
    Crée un nouveau client :
    - Commercial : le client lui est automatiquement assigné
    - Manager / Admin : peuvent attribuer le client à n’importe quel commercial
    """
    data = request.data.copy()

    # 🔒 Forcer le commercial connecté s’il est commercial
    if request.user.role == 'commercial':
        data['commercial'] = request.user.id

    serializer = ClientSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🧩 Mise à jour d’un client
@api_view(['PUT'])
@permission_classes([IsCommercialOrHigher])
def update_client(request, pk):
    """
    Met à jour un client existant :
    - Admin / Manager : peuvent tout modifier
    - Commercial : uniquement ses propres clients
    """
    try:
        client = Client.objects.get(pk=pk)
    except Client.DoesNotExist:
        return Response({"error": "Client non trouvé"}, status=status.HTTP_404_NOT_FOUND)

    # 🔒 Vérification du propriétaire
    if request.user.role == 'commercial' and client.commercial != request.user:
        return Response({"error": "Accès refusé 🚫"}, status=status.HTTP_403_FORBIDDEN)

    serializer = ClientSerializer(client, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🧩 Suppression d’un client
@api_view(['DELETE'])
@permission_classes([IsManagerOrAdmin])
def delete_client(request, pk):
    """
    Supprime un client :
    - Réservé aux managers et administrateurs
    """
    try:
        client = Client.objects.get(pk=pk)
        client.delete()
        return Response({"message": "Client supprimé avec succès ✅"}, status=status.HTTP_204_NO_CONTENT)
    except Client.DoesNotExist:
        return Response({"error": "Client non trouvé"}, status=status.HTTP_404_NOT_FOUND)

