from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

#for api filtering
from django_filters.rest_framework import DjangoFilterBackend
from .filters import ToolFilter

from django.shortcuts import get_object_or_404

from .models import Tool, BorrowRequest

from .serializers import ToolSerializer, BorrowRequestSerializer

'''For all tools & creation of new tools'''    
class ToolListView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        filtered = ToolFilter(request.GET, queryset=Tool.objects.all())
        serializer = ToolSerializer(filtered.qs, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        data = request.data.copy()
        data["owner_id"] = request.user.id  # auto-assign creator

        serializer = ToolSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

'''For a tool'''
class ToolDetailView(APIView):
    permission_classes = [IsAuthenticated] 
    def get(self, request, tool_id):
        try:
            tool = get_object_or_404(Tool, tool_id=tool_id)
        except Tool.DoesNotExist:
            return Response({"error": "Tool not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ToolSerializer(tool) 
        return Response(serializer.data)
    
    
    def patch(self, request, tool_id):
        tool = get_object_or_404(Tool, tool_id=tool_id)
        serializer = ToolSerializer(tool, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, tool_id):
        tool = get_object_or_404(Tool, tool_id=tool_id)
        tool.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


'''For creating a new signup item'''
class ToolSignUpView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, tool_id):
        try:
            tool = Tool.objects.get(pk=tool_id)
        except Tool.DoesNotExist:
            return Response({"error": "Tool not found."}, status=404)

        signup = BorrowRequest.objects.create(
            user_id=str(request.user.id),
            tool=tool,
            start_date=request.data.get('start_date'),
            end_date=request.data.get('end_date'),
            messages=request.data.get('messages', ''),
        )

        serializer = BorrowRequestSerializer(signup)
        return Response(serializer.data, status=201)

'''For getting all signups for a specific tool'''
class ToolSignUpDetailView(APIView):
    permission_classes = [IsAuthenticated]

    # To get specific signup details
    def get(self, request, signup_id):
        signup = get_object_or_404(BorrowRequest, signup_id=signup_id)
        serializer = BorrowRequestSerializer(signup)
        return Response(serializer.data)

    # To update specific signup details
    def patch(self, request, signup_id):
        new_status = request.data.get("status")  # expected: "accepted" or "rejected"

        if new_status not in ["accepted", "rejected"]:
            return Response({"error": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)

        signup = get_object_or_404(BorrowRequest, pk=signup_id)
        tool = signup.tool

        # Enforce only the tool provider can approve/reject
        if tool.owner_id != request.user.id:
            return Response({"error": "Unauthorized."}, status=status.HTTP_403_FORBIDDEN)

        # Just update status — do not modify unavailable dates
        signup.status = new_status
        signup.save()
        print(signup)

        return Response({"message": f"Signup status updated to '{new_status}'."}, status=status.HTTP_200_OK)
    
    # To delete specific signup details
    def delete(self, request, signup_id):
        signup = get_object_or_404(BorrowRequest, signup_id=signup_id)
        signup.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def grab_tools_by_owner(request, user_id):
    tools = Tool.objects.filter(owner_id=user_id)
    data = ToolSerializer(tools, many=True).data
    return Response({"tools": data})
