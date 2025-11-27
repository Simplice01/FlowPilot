from django.db import models
from apps.utilisateurs.models import Utilisateur


# Create your models here.
class Tache(models.Model):
    PRIORITE_CHOICES = (
        ('basse', 'Basse'),
        ('moyenne', 'Moyenne'),
        ('haute', 'Haute'),
    )

    titre = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    commercial = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    priorite = models.CharField(max_length=10, choices=PRIORITE_CHOICES, default='moyenne')
    deadline = models.DateField()
    statut = models.CharField(max_length=20, default='a faire')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titre
