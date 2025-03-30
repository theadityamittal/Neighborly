from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('neighborly_users.urls')),
    path('services/', include('neighborly_services.urls')),
    path('petitions/', include('neighborly_petitions.urls')),
    path('events/', include('neighborly_events.urls')),
]