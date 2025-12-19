from rest_framework import serializers
from .models import Utilisateur
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'phone'
        ]


# 🔐 SERIALIZER JWT PERSONNALISÉ (CLÉ DU PROBLÈME)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # 🔥 DONNÉES MÉTIER INDISPENSABLES AU FRONTEND
        token['role'] = user.role
        token['username'] = user.username

        return token
