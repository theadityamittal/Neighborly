from django.db import models

class Petition(models.Model):

    petition_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    organizer_id = models.CharField(max_length=255)
    visibility = models.BooleanField(default=True)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    target = models.IntegerField()
    location = models.CharField(max_length=100, default="Unknown")
    provider = models.CharField(max_length=100, default="Anonymous")
    voting_ends_at = models.DateField(null=True, blank=True)
    hero_image = models.URLField(
        max_length=500,
        default="https://source.unsplash.com/featured/?nature,protest"
    )
    def __str__(self):
        return self.title

class PetitionSignature(models.Model):
    signature_id = models.AutoField(primary_key=True)
    petition = models.ForeignKey(Petition, on_delete=models.CASCADE)
    user_id = models.CharField(max_length=255)
    signed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Signature {self.signature_id} on {self.petition.title}"