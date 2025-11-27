from django.db import models
from apps.utilisateurs.models import Utilisateur

class Prospect(models.Model):
    STATUT_CHOICES = (
        ('nouveau', 'Nouveau'),
        ('contacte', 'Contacté'),
        ('converti', 'Converti'),
    )

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    source = models.CharField(max_length=100, blank=True)
    
    commercial = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, related_name="prospects")

    statut = models.CharField(max_length=10, choices=STATUT_CHOICES, default='nouveau')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
