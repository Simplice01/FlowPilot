from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from datetime import date
from .models import Rapport
from .serializers import RapportSerializer
from apps.clients.models import Client
from apps.prospects.models import Prospect
from apps.taches.models import Tache
from apps.ventes.models import Vente
from apps.utilisateurs.models import Utilisateur
from apps.notifications.models import Notification
from apps.utilisateurs.permissions import IsManagerOrAdmin

# 🧩 Liste de tous les rapports
@api_view(['GET'])
@permission_classes([IsManagerOrAdmin])
def liste_rapports(request):
    """
    Liste tous les rapports disponibles.
    Accessible uniquement aux managers et administrateurs.
    """
    rapports = Rapport.objects.all()
    serializer = RapportSerializer(rapports, many=True)
    return Response(serializer.data)


# 🧩 Création manuelle d’un rapport
@api_view(['POST'])
@permission_classes([IsManagerOrAdmin])
def create_rapport(request):
    """
    Permet de créer manuellement un rapport.
    Accessible uniquement aux managers et admins.
    """
    serializer = RapportSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🧩 Mise à jour d’un rapport
@api_view(['PUT'])
@permission_classes([IsManagerOrAdmin])
def update_rapport(request, pk):
    """
    Met à jour un rapport existant.
    Accessible uniquement aux managers et admins.
    """
    try:
        rapport = Rapport.objects.get(pk=pk)
    except Rapport.DoesNotExist:
        return Response({"error": "Rapport non trouvé"}, status=status.HTTP_404_NOT_FOUND)

    serializer = RapportSerializer(rapport, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🧩 Suppression d’un rapport
@api_view(['DELETE'])
@permission_classes([IsManagerOrAdmin])
def delete_rapport(request, pk):
    """
    Supprime un rapport.
    Accessible uniquement aux managers et admins.
    """
    try:
        rapport = Rapport.objects.get(pk=pk)
        rapport.delete()
        return Response({"message": "Rapport supprimé ✅"}, status=status.HTTP_204_NO_CONTENT)
    except Rapport.DoesNotExist:
        return Response({"error": "Rapport non trouvé"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsManagerOrAdmin])
def generer_rapport(request):
    type_rapport = request.data.get('type')
    date_debut = request.data.get('date_debut')
    date_fin = request.data.get('date_fin')

    if not (type_rapport and date_debut and date_fin):
        return Response(
            {"error": "Veuillez fournir type, date_debut et date_fin."},
            status=400
        )

    if type_rapport not in dict(Rapport.TYPE_CHOICES):
        return Response({"error": "Type de rapport invalide."}, status=400)

    if date_debut > date_fin:
        return Response({"error": "date_debut doit être antérieure à date_fin."}, status=400)

    contenu = ""

    if type_rapport == "vente":
        total_ventes = Vente.objects.filter(
            date_vente__range=[date_debut, date_fin]
        ).aggregate(Sum('montant'))['montant__sum'] or 0
        nb_ventes = Vente.objects.filter(
            date_vente__range=[date_debut, date_fin]
        ).count()
        contenu = f"Total des ventes : {total_ventes} FCFA\nNombre de ventes : {nb_ventes}"

    elif type_rapport == "client":
        nouveaux_clients = Client.objects.filter(
            created_at__range=[date_debut, date_fin]
        ).count()
        contenu = f"Nouveaux clients : {nouveaux_clients}"

    elif type_rapport == "prospect":
        nouveaux_prospects = Prospect.objects.filter(
            created_at__range=[date_debut, date_fin]
        ).count()
        contenu = f"Nouveaux prospects : {nouveaux_prospects}"

    elif type_rapport == "activite":
        total_taches = Tache.objects.filter(
            created_at__range=[date_debut, date_fin]
        ).count()
        taches_terminees = Tache.objects.filter(
            statut="terminee",
            created_at__range=[date_debut, date_fin]
        ).count()
        contenu = f"Tâches créées : {total_taches}\nTâches terminées : {taches_terminees}"

    rapport = Rapport.objects.create(
        titre=f"Rapport {type_rapport} - {date.today()}",
        type=type_rapport,
        contenu=contenu,
        auteur=request.user,
        date_debut=date_debut,
        date_fin=date_fin
    )

    admins = Utilisateur.objects.filter(is_superuser=True)
    for admin in admins:
        Notification.objects.create(
            user=admin,
            message=f"Nouveau rapport {type_rapport} généré par {request.user.username}"
        )

    serializer = RapportSerializer(rapport)
    return Response(serializer.data, status=201)
