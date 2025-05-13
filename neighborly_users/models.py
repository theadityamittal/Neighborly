from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.utils.timezone import now
import uuid
import os

def user_icon_upload_path(instance, filename):
    ext = filename.split(".")[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join("user_icons/", filename)

class CustomUserManager(BaseUserManager):
    def create_user(
        self,
        email,
        name,
        phone_number,
        address,
        city,
        neighborhood,
        zip_code,
        account_type,
        password=None,
        latitude=None,
        longitude=None,
        icon=None,
    ):
        if not email:
            raise ValueError("Users must have an email address")
        user = self.model(
            email=self.normalize_email(email),
            name=name,
            phone_number=phone_number,
            address=address,
            city=city,
            neighborhood=neighborhood,
            zip_code=zip_code,
            latitude=latitude,
            longitude=longitude,
            icon=icon,
            account_type=account_type,  # two possible types, [resident, NGO]
            verified=False,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self,
        email,
        name,
        phone_number,
        address,
        city,
        neighborhood,
        zip_code,
        account_type,  # two possible types, [resident, NGO]
        password,
        latitude=None,
        longitude=None,
    ):
        user = self.create_user(
            email,
            name,
            phone_number,
            address,
            city,
            neighborhood,
            zip_code,
            account_type,
            password,
            latitude,
            longitude,
        )
        user.is_superuser = True
        user.is_staff = True
        user.verified = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, unique=True)
    address = models.TextField()
    city = models.CharField(max_length=255)
    neighborhood = models.CharField(max_length=255)
    zip_code = models.CharField(max_length=20)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    icon = models.FileField(
    upload_to=user_icon_upload_path,
    null=True,
    blank=True,
    )
    account_type = models.CharField(
        max_length=255
    )  # two possible types, [resident, NGO]
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=now)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "name",
        "phone_number",
        "address",
        "city",
        "neighborhood",
        "zip_code",
        "account_type",
    ]

    objects = CustomUserManager()

    def __str__(self):
        return self.email
