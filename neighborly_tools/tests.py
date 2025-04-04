from django.test import TestCase
from .models import Tool, BorrowRequest
from django.utils import timezone

class ToolModelTest(TestCase):
    def setUp(self):
        self.tool = Tool.objects.create(
            owner_id="user123",
            name="Drill Machine",
            description="A powerful drill",
            condition="New",
            availability=True
        )

    def test_tool_creation(self):
        self.assertEqual(self.tool.name, "Drill Machine")
        self.assertTrue(self.tool.availability)

class BorrowRequestModelTest(TestCase):
    def setUp(self):
        self.tool = Tool.objects.create(
            owner_id="user123",
            name="Hammer",
            description="Heavy hammer",
            condition="Used",
            availability=True
        )
        self.borrow_request = BorrowRequest.objects.create(
            tool=self.tool,
            user_id="user456",
            borrow_date=timezone.now().date(),
            return_date=timezone.now().date()
        )

    def test_borrow_request_creation(self):
        self.assertEqual(self.borrow_request.tool.name, "Hammer")