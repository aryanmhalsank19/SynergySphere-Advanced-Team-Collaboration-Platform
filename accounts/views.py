from rest_framework import generics, permissions
from .models import User
from .serializers import UserPublicSerializer, UserRegisterSerializer

class MeView(generics.RetrieveAPIView):
    serializer_class = UserPublicSerializer
    def get_object(self):
        return self.request.user

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegisterSerializer
