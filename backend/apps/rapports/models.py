from django.db import models

# Create your models here.
from apps.utilisateurs.models import Utilisateur

class Rapport(models.Model):
    TYPE_CHOICES = (
        ('vente', 'Rapport de ventes'),
        ('client', 'Rapport clients'),
        ('prospect', 'Rapport prospects'),
        ('activite', 'Rapport d’activité'),
    )

    titre = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    contenu = models.TextField(blank=True)  # résumé ou statistiques calculées
    auteur = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True)
    date_debut = models.DateField()
    date_fin = models.DateField()
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_creation']

    def __str__(self):
        return f"{self.titre} ({self.type})"
