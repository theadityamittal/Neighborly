from rest_framework import serializers
from .models import BulletinItem
from django.conf import settings


class BulletinItemSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.name", read_only=True)

    class Meta:
        model = BulletinItem
        fields = "__all__"

    def get_image_url(self, obj):
        if obj.image:
            return f"{settings.AWS_S3_BASE_URL}{obj.image.url}"
        return None

    # def create(self, validated_data):
    # images_data = validated_data.pop('upload_images', [])  # pull out
    # uploaded images separately

    #     uploaded_urls = []
    #     for image_file in images_data:
    #         path = bulletin_image_upload_path(None, image_file.name)
    #         saved_path = default_storage.save(path, image_file)
    #         uploaded_url = default_storage.url(saved_path)
    #         uploaded_urls.append(uploaded_url)

    #     # Save the rest of the fields + uploaded images
    #     bulletin_item = BulletinItem.objects.create(
    #         **validated_data,
    #         images=uploaded_urls
    #     )

    #     return bulletin_item
