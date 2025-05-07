from neighborly_users.admin import admin_site
from django.urls import path, include

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from neighborly_users.views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

schema_view = get_schema_view(
   openapi.Info(
      title="Neighborly Backend APIs",
      default_version='v1',
      description="This is the API documentation for Desphixs LMS project APIs",
      terms_of_service="https://www.google.com/policies/terms/"
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin_site.urls),
    path('', include('neighborly_tools.urls')),
    path('auth/', include('neighborly_users.urls')),
    path('services/', include('neighborly_services.urls')),
    path('tools/', include('neighborly_tools.urls')),
    path('bulletin/', include('neighborly_bulletin.urls')),
    path('petitions/', include('neighborly_petitions.urls')),
    path('events/', include('neighborly_events.urls')),
    path('documents/', include('neighborly_verified_content.urls')),
    path('tools/', include('neighborly_tools.urls')),
    path('', include('apps.core.urls')),
    path('bulletin/', include('neighborly_bulletin.urls')),

    #api documentation
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('api_doc', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    

]