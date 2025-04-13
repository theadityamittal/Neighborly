from neighborly_users.admin import admin_site
from django.urls import path, include

urlpatterns = [
    path('admin/', admin_site.urls),
    path('', include('neighborly_tools.urls')),
    path('auth/', include('neighborly_users.urls')),
    path('services/', include('neighborly_services.urls')),
    path('petitions/', include('neighborly_petitions.urls')),
    path('events/', include('neighborly_events.urls')),
    path('', include('apps.core.urls')),
    path('api/bulletin/', include('neighborly_bulletin.urls')),
]