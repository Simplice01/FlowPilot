from django.db import models
from apps.utilisateurs.models import Utilisateur


# Create your models here.
class Notification(models.Model):
    user = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
