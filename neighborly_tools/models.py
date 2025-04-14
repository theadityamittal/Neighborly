from django.db import models
import uuid

class Tool(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    description = models.TextField()
    condition = models.CharField(max_length=50, choices=[('New', 'New'), ('Used', 'Used')])
    availability = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class BorrowRequest(models.Model):
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE, related_name="borrow_requests")
    user_id = models.CharField(max_length=255)
    borrow_date = models.DateField()
    return_date = models.DateField()

    def __str__(self):
        return f"{self.user_id} borrowing {self.tool.name}"