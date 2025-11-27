from django.db import models
from django.contrib.auth.models import AbstractUser

class Utilisateur(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrateur'),
        ('manager', 'Manager'),
        ('commercial', 'Commercial'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='commercial')
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.username} - {self.role}"
