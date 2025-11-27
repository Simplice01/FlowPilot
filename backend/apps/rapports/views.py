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


# 🧩 Génération automatique d’un rapport (statistiques)
@api_view(['POST'])
@permission_classes([IsManagerOrAdmin])
def generer_rapport(request):
    """
    Génère automatiquement un rapport (ventes, clients, prospects ou activités)
    entre deux dates, puis envoie une notification aux administrateurs.
    Accessible uniquement aux managers et administrateurs.
    """
    type_rapport = request.data.get('type')
    date_debut = request.data.get('date_debut')
    date_fin = request.data.get('date_fin')
    auteur_id = request.data.get('auteur')

    if not (type_rapport and date_debut and date_fin and auteur_id):
        return Response({"error": "Veuillez fournir type, date_debut, date_fin et auteur."}, status=400)

    contenu = ""

    # Rapport de ventes
    if type_rapport == "vente":
        total_ventes = Vente.objects.filter(date_vente__range=[date_debut, date_fin]).aggregate(Sum('montant'))['montant__sum'] or 0
        nb_ventes = Vente.objects.filter(date_vente__range=[date_debut, date_fin]).count()
        contenu = f"Total des ventes : {total_ventes} FCFA\nNombre de ventes : {nb_ventes}"

    # Rapport clients
    elif type_rapport == "client":
        nouveaux_clients = Client.objects.filter(created_at__range=[date_debut, date_fin]).count()
        contenu = f"Nouveaux clients créés entre {date_debut} et {date_fin} : {nouveaux_clients}"

    # Rapport prospects
    elif type_rapport == "prospect":
        nouveaux_prospects = Prospect.objects.filter(created_at__range=[date_debut, date_fin]).count()
        contenu = f"Nouveaux prospects enregistrés : {nouveaux_prospects}"

    # Rapport d’activité (tâches)
    elif type_rapport == "activite":
        total_taches = Tache.objects.filter(created_at__range=[date_debut, date_fin]).count()
        taches_terminees = Tache.objects.filter(statut="terminee", created_at__range=[date_debut, date_fin]).count()
        contenu = f"Tâches créées : {total_taches}\nTâches terminées : {taches_terminees}"

    # Création du rapport
    rapport = Rapport.objects.create(
        titre=f"Rapport automatique ({type_rapport}) - {date.today()}",
        type=type_rapport,
        contenu=contenu,
        auteur_id=auteur_id,
        date_debut=date_debut,
        date_fin=date_fin
    )

    # 🔔 Création automatique d'une notification
    try:
        auteur = Utilisateur.objects.get(id=auteur_id)
        message = f"Nouveau rapport {type_rapport} généré par {auteur.first_name} {auteur.last_name}"
    except Utilisateur.DoesNotExist:
        message = f"Nouveau rapport {type_rapport} généré."

    admins = Utilisateur.objects.filter(is_superuser=True)
    for admin in admins:
        Notification.objects.create(user=admin, message=message)

    serializer = RapportSerializer(rapport)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
