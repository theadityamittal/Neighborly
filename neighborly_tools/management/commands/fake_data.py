from django.core.management.base import BaseCommand
from neighborly_tools.models import Tool, BorrowRequest
from datetime import date, timedelta
import uuid
import random

class Command(BaseCommand):
    help = 'Populate the database with fake tools and borrow requests'

    def handle(self, *args, **options):
        # Create fake tools
        for i in range(5):
            tool = Tool.objects.create(
                id=uuid.uuid4(),
                owner_id=f"user_{i}",
                name=f"Tool {i + 1}",
                description=f"Description for tool {i + 1}",
                condition=random.choice(['New', 'Used']),
                availability=random.choice([True, False])
            )

            # Create fake borrow requests for each tool
            for j in range(2):  # two borrow requests per tool
                borrow_date = date.today() - timedelta(days=random.randint(1, 10))
                return_date = borrow_date + timedelta(days=random.randint(3, 7))
                BorrowRequest.objects.create(
                    tool=tool,
                    user_id=f"borrower_{i}_{j}",
                    borrow_date=borrow_date,
                    return_date=return_date
                )

        self.stdout.write(self.style.SUCCESS("Fake Tools and Borrow Requests Inserted"))