from django.apps import AppConfig


class NeighborlyServicesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "neighborly_services"

    def ready(self):
        import neighborly_services.signals  # noqa
