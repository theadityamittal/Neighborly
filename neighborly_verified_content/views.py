from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import UsersDocumentsSerializer
from .models import UsersDocuments
from neighborly_users.serializers import UserSerializer
from neighborly_users.models import CustomUser
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
        user = get_object_or_404(CustomUser, user_id=request.data.get('user_id'))
        serializer = UserSerializer(user, data={"verified": True}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Successfully verified user"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UserDocumentsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # If the user is not staff, return their own document
        if not request.user.is_staff:
            document = UsersDocuments.objects.filter(user_id=request.user.email)
            serializer = UsersDocumentsSerializer(document)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # If the user is staff, allow filtering by user_id
        user_id = request.query_params.get('user_id')
        if user_id:
            documents = UsersDocuments.objects.filter(user_id=user_id)
        else:
            documents = UsersDocuments.objects.all()

        serializer = UsersDocumentsSerializer(documents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
