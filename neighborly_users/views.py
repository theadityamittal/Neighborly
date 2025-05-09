from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .permissions import IsVerifiedPermission


class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print(request.data)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User created successfully"}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedPermission]

    def patch(self, request):
        user = get_object_or_404(CustomUser, email=request.user.email)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            print(f"Serializer valid. Updated fields: {serializer.validated_data}")
            serializer.save()
            print(f"User updated successfully: {user.email}")
            return Response(
                {"message": "User updated successfully"}, status=status.HTTP_200_OK
            )
        else:
            print(f"Serializer validation failed. Errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = get_object_or_404(CustomUser, email=request.user.email)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        return {"access": data["access"], "refresh": data["refresh"]}


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class GetUserDetailView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedPermission]

    def post(self, request):
        user = get_object_or_404(CustomUser, user_id=request.data.get("user_id"))
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
