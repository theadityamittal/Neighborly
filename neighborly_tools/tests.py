from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from neighborly_tools.models import Tool, BorrowRequest

User = get_user_model()

class ToolTests(APITestCase):
    
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')

        self.user_data = {
            "name": "Tool User",
            "email": "tooluser@example.com",
            "phone_number": "9876543210",
            "address": "456 Avenue, City",
            "city": 'Test City',
            "zip_code": "54321",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "neighborhood": "Queens",
            "account_type": "resident",
            "password": "password321"
        }

        self.token = self.authenticate_user()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
        self.user_id = User.objects.get(email=self.user_data["email"]).id

    def authenticate_user(self):
        self.client.post(self.register_url, self.user_data, format='json')
        response = self.client.post(self.login_url, {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, format='json')
        return response.data["access"]

    '''==============Create Tool=============='''
    def test_user_can_create_tool(self):
        payload = {
            "title": "Power Saw",
            "description": "Used once. Cuts fast.",
            "location": "Queens",
            "latitude": 40.7282,
            "longitude": -73.7949,
            "available": True,
            "price": "12.50",
            "quota": 3,
            "tags": ["Cutting", "Electric"],
            "condition": "Used"
        }
        response = self.client.post("/tools/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tool.objects.count(), 1)
        print("\n√ test_user_can_create_tool passed!")

    '''==============Borrow a Tool=============='''
    def test_user_can_borrow_tool(self):
        tool = Tool.objects.create(
            title="Hammer",
            owner_id=self.user_id,
            location="Brooklyn",
            available=True,
            condition="New"
        )
        borrow_url = f"/tools/{tool.tool_id}/borrow/"
        payload = {
            "start_date": "2025-05-01",
            "end_date": "2025-05-02",
            "messages": "Need for weekend project",
            "price": "0",
            "user_id": str(self.user_id)
        }
        response = self.client.post(borrow_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BorrowRequest.objects.count(), 1)
        print("\n√ test_user_can_borrow_tool passed!")

    '''==============Patch Borrow Status=============='''
    def test_patch_borrow_status(self):
        tool = Tool.objects.create(title="Ladder", owner_id=self.user_id, location="Queens", available=True, condition="Used")
        request = BorrowRequest.objects.create(
            tool=tool,
            user_id=self.user_id,
            start_date="2025-05-10",
            end_date="2025-05-12",
            messages="Roof work",
            status="pending"
        )
        patch_url = f"/tools/borrow/{request.signup_id}/"
        response = self.client.patch(patch_url, data={"status": "accepted"}, format="json")
        self.assertEqual(response.status_code, 200)
        print("\n√ test_patch_borrow_status passed!")

    '''==============Filter Tools=============='''
    def test_filter_tools_by_city_and_availability(self):
        Tool.objects.create(title="Drill", owner_id=self.user_id, city="NY", location="New York", available=True, condition="Used")
        Tool.objects.create(title="Wrench", owner_id=self.user_id, city="NY", location="New York", available=False, condition="New")
        Tool.objects.create(title="Chainsaw", owner_id=self.user_id, city="SF", location="San Francisco", available=True, condition="Used")

        response = self.client.get("/tools/?city=NY&condition=Used")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Drill")
        print("\n√ test_filter_tools_by_city_and_availability passed!")