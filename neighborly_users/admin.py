from django.contrib import admin

from .models import CustomUser


class MyAdminSite(admin.AdminSite):
    site_header = "User administration"


admin_site = MyAdminSite(name="myuser")
admin_site.register(CustomUser)