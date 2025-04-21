from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import UsersDocumentsSerializer
from .models import UsersDocuments
from rest_framework.permissions import IsAuthenticated
from neighborly_users.permissions import IsStaffPermission

class SubmitVerificationRequestView(APIView):
    def get_permissions(self):
        if self.request.method == 'PUT':
            return [IsAuthenticated(), IsStaffPermission()]
        return [IsAuthenticated()]
    def post(self, request):
        serializer = UsersDocumentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Successfully created Verification Request"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        document = get_object_or_404(UsersDocuments, email=request.user.email)
        serializer = UsersDocumentsSerializer(document, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Verification Request updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)