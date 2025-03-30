from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.timezone import now
import uuid

class CustomUserManager(BaseUserManager):
    def create_user(self, email, name, phone_number, address, neighborhood, account_type, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        user = self.model(
            email = self.normalize_email(email),
            name = name,
            phone_number = phone_number,
            address = address,
            neighborhood = neighborhood,
            account_type = account_type,
            verified = False,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, phone_number, address, neighborhood, account_type, password):
        user = self.create_user(email, name, phone_number, address, neighborhood, account_type, password)
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
    neighborhood = models.CharField(max_length=255)
    account_type = models.CharField(max_length=255)
    verified = models.BooleanField(default=False)
    password_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=now)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone_number', 'address', 'neighborhood', 'account_type']

    objects = CustomUserManager()

    def __str__(self):
        return self.email