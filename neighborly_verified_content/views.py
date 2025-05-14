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
<<<<<<< HEAD
        if self.request.method in ('PUT', 'PATCH'):
=======
        if self.request.method in ("PUT", "PATCH"):
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
            return [IsAuthenticated(), IsStaffPermission()]
        return [IsAuthenticated()]

    def post(self, request):
        serializer = UsersDocumentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Successfully created Verification Request"},
<<<<<<< HEAD
                status=status.HTTP_201_CREATED
=======
                status=status.HTTP_201_CREATED,
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        # existing bulk update path
<<<<<<< HEAD
        user = get_object_or_404(CustomUser, user_id=request.data.get('user_id'))
=======
        user = get_object_or_404(CustomUser, user_id=request.data.get("user_id"))
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Successfully Updated Verification Form"},
<<<<<<< HEAD
                status=status.HTTP_200_OK
=======
                status=status.HTTP_200_OK,
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        # 1) update the user
<<<<<<< HEAD
        user = get_object_or_404(CustomUser, user_id=request.data.get('user_id'))
=======
        user = get_object_or_404(CustomUser, user_id=request.data.get("user_id"))
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
        user_serializer = UserSerializer(user, data={"verified": True}, partial=True)
        if not user_serializer.is_valid():
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user_serializer.save()

        # 2) update the document
<<<<<<< HEAD
        document = get_object_or_404(UsersDocuments, user_id=request.data.get('user_id'))
        doc_serializer = UsersDocumentsSerializer(document, data={"verified": True}, partial=True)
=======
        document = get_object_or_404(
            UsersDocuments, user_id=request.data.get("user_id")
        )
        doc_serializer = UsersDocumentsSerializer(
            document, data={"verified": True}, partial=True
        )
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
        if not doc_serializer.is_valid():
            return Response(doc_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        doc_serializer.save()

        return Response(
<<<<<<< HEAD
            {"message": "Successfully verified user"},
            status=status.HTTP_200_OK
        )
    
=======
            {"message": "Successfully verified user"}, status=status.HTTP_200_OK
        )

>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf

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
