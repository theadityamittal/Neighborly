from django.db import models
import uuid
import os


def petition_image_upload_path(instance, filename):
    ext = filename.split(".")[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join("petitions/uploads/", filename)


class Petition(models.Model):
    petition_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    organizer_id = models.CharField(max_length=255)
    provider = models.CharField(max_length=100, default="Anonymous")

    # Location related
    location = models.CharField(max_length=255)
    street_address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    neighborhood = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    visibility = models.CharField(max_length=10, default="public")
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    target = models.IntegerField()
    voting_ends_at = models.DateField(null=True, blank=True)
    hero_image = models.ImageField(
        upload_to=petition_image_upload_path, null=True, blank=True
    )

    def __str__(self):
        return self.title


class PetitionSignature(models.Model):
    signature_id = models.AutoField(primary_key=True)
    petition = models.ForeignKey(Petition, on_delete=models.CASCADE)
    user_id = models.CharField(max_length=255)
    user_name = models.CharField(max_length=255, default="Anonymous User")
    signed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Signature {self.signature_id} on {self.petition.title}"
