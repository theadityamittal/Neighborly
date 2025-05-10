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
        # require staff for both PUT (bulk user update) and PATCH (verify)
        if self.request.method in ("PUT", "PATCH"):
            return [IsAuthenticated(), IsStaffPermission()]
        return [IsAuthenticated()]

    def post(self, request):
        serializer = UsersDocumentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Successfully created Verification Request"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        # existing bulk update path
        user = get_object_or_404(CustomUser, user_id=request.data.get("user_id"))
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Successfully Updated Verification Form"},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        # 1) update the user
        user = get_object_or_404(CustomUser, user_id=request.data.get("user_id"))
        user_serializer = UserSerializer(user, data={"verified": True}, partial=True)
        if not user_serializer.is_valid():
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user_serializer.save()

        # 2) update the document
        document = get_object_or_404(
            UsersDocuments, user_id=request.data.get("user_id")
        )
        doc_serializer = UsersDocumentsSerializer(
            document, data={"verified": True}, partial=True
        )
        if not doc_serializer.is_valid():
            return Response(doc_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        doc_serializer.save()

        return Response(
            {"message": "Successfully verified user"}, status=status.HTTP_200_OK
        )


class UserDocumentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            document = UsersDocuments.objects.filter(
                user_id=request.user.user_id
            ).first()
            if not document:
                return Response(
                    {"message": "No documents found for the user."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            serializer = UsersDocumentsSerializer(document)
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)

        user_id = request.query_params.get("user_id")
        if user_id:
            documents = UsersDocuments.objects.filter(user_id=user_id, verified=False)
        else:
            documents = UsersDocuments.objects.filter(verified=False)

        serializer = UsersDocumentsSerializer(documents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
