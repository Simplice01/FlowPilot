from django.db import models
from apps.utilisateurs.models import Utilisateur 
from django.db.models import SET_NULL


# Create your models here.
class Client(models.Model):
  STATUT_CHOICES = (
        ('prospect', 'Prospect'),
        ('client', 'Client'),
    )

  first_name=models.CharField("Prénom",max_length=100)
  last_name=models.CharField("Nom",max_length=100)
  email=models.EmailField("Email",unique=True)
  phone=models.CharField("Téléphone",max_length=20)
  adresse=models.TextField("Adresse",blank=True)
  commercial=models.ForeignKey(Utilisateur,on_delete=SET_NULL,null=True,related_name="clients")
  statut = models.CharField(
        max_length=10,
        choices=STATUT_CHOICES,
        default='prospect'
    )
  class Meta:
        ordering = ['last_name', 'first_name']
        verbose_name = "Client"
        verbose_name_plural = "Clients"
  def __str__(self):
        return f"{self.first_name} {self.last_name}"      

  

 