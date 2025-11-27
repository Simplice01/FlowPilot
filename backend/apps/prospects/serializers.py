from rest_framework import serializers
from .models import Prospect

class ProspectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prospect
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'adresse', 'commercial','statut','created_at','updated_at']

