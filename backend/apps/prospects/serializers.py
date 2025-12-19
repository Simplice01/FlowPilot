from rest_framework import serializers
from .models import Prospect

class ProspectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prospect
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'source',
            'statut',
            'commercial',
            'created_at',
        ]
        read_only_fields = ['commercial', 'created_at']
