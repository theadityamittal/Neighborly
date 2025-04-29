from rest_framework import serializers
from .models import BulletinItem
from django.core.files.storage import default_storage

class BulletinItemSerializer(serializers.ModelSerializer):
    # For uploading (write-only field)
    upload_images = serializers.ListField(
        child=serializers.ImageField(max_length=None, allow_empty_file=False, use_url=True),
        write_only=True,
        required=False,
    )

    class Meta:
        model = BulletinItem
        fields = '__all__'

    def create(self, validated_data):
        images_data = validated_data.pop('upload_images', [])  # pull out uploaded images separately

        uploaded_urls = []
        for image_file in images_data:
            path = bulletin_image_upload_path(None, image_file.name)
            saved_path = default_storage.save(path, image_file)
            uploaded_url = default_storage.url(saved_path)
            uploaded_urls.append(uploaded_url)

        # Save the rest of the fields + uploaded images
        bulletin_item = BulletinItem.objects.create(
            **validated_data,
            images=uploaded_urls
        )

        return bulletin_item