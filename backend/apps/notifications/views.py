from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Notification
from .serializers import NotificationSerializer
from apps.utilisateurs.permissions import IsCommercialOrHigher, IsManagerOrAdmin


# 🧩 Liste des notifications (par utilisateur)
@api_view(['GET'])
@permission_classes([IsCommercialOrHigher])
def liste_notifications(request):
    """
    Liste les notifications :
    - Commercial / Manager : voit uniquement ses propres notifications
    - Admin : peut voir toutes les notifications
    """
    if request.user.is_superuser or request.user.role == 'admin':
        notifications = Notification.objects.all()
    else:
        notifications = Notification.objects.filter(user=request.user)

    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


# 🧩 Création d'une notification
@api_view(['POST'])
@permission_classes([IsManagerOrAdmin])
def create_notification(request):
    """
    Crée une notification manuellement :
    - Réservé aux managers et administrateurs.
    """
    serializer = NotificationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🧩 Marquer une notification comme lue
@api_view(['PUT'])
@permission_classes([IsCommercialOrHigher])
def mark_as_read(request, pk):
    """
    Marque une notification comme lue :
    - L’utilisateur ne peut modifier que ses propres notifications.
    """
    try:
        notification = Notification.objects.get(pk=pk)
    except Notification.DoesNotExist:
        return Response({"error": "Notification non trouvée"}, status=status.HTTP_404_NOT_FOUND)

    # 🔒 Vérification d’accès
    if notification.user != request.user and not request.user.is_superuser:
        return Response({"error": "Accès refusé 🚫"}, status=status.HTTP_403_FORBIDDEN)

    notification.is_read = True
    notification.save()
    return Response({"message": "Notification marquée comme lue ✅"})


# 🧩 Suppression d’une notification
@api_view(['DELETE'])
@permission_classes([IsManagerOrAdmin])
def delete_notification(request, pk):
    """
    Supprime une notification :
    - Réservé aux managers et administrateurs.
    """
    try:
        notification = Notification.objects.get(pk=pk)
        notification.delete()
        return Response({"message": "Notification supprimée ✅"}, status=status.HTTP_204_NO_CONTENT)
    except Notification.DoesNotExist:
        return Response({"error": "Notification non trouvée"}, status=status.HTTP_404_NOT_FOUND)
