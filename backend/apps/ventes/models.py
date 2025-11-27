from django.db import models
from apps.contrats.models import Contrat
from apps.utilisateurs.models import Utilisateur

class Vente(models.Model):
    STATUT_CHOICES = (
        ('paye', 'Payé'),
        ('impaye', 'Impayé'),
    )

    contrat = models.ForeignKey(Contrat, on_delete=models.CASCADE)
    commercial = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    statut = models.CharField(max_length=10, choices=STATUT_CHOICES, default='impaye')
    date_vente = models.DateField()

    def __str__(self):
        return f"{self.contrat} - {self.montant}"
