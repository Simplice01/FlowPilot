from django.db import models
from apps.clients.models import Client
from apps.utilisateurs.models import Utilisateur

class Contrat(models.Model):
    STATUT_CHOICES = (
        ('attente', 'En attente'),
        ('signe', 'Signé'),
        ('annule', 'Annulé'),
    )

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="contrats")
    commercial = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True)
    titre = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    montant = models.DecimalField(max_digits=10, decimal_places=2)

    statut = models.CharField(max_length=10, choices=STATUT_CHOICES, default='attente')

    date_signature = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titre} - {self.client}"
