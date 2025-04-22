import django_filters
from .models import ServiceItem

class ServiceItemFilter(django_filters.FilterSet):
    price_min = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    tags = django_filters.CharFilter(lookup_expr="icontains")
    service_provider = django_filters.NumberFilter()
    visibility = django_filters.CharFilter(lookup_expr="iexact")
    neighborhood = django_filters.CharFilter(lookup_expr="icontains")
    street_address = django_filters.CharFilter(lookup_expr="icontains")
    city = django_filters.CharFilter(lookup_expr="icontains")
    zip_code = django_filters.CharFilter(lookup_expr="exact")

    class Meta:
        model = ServiceItem
        fields = [
            "service_provider",
            "neighborhood",
            "street_address",
            "city",
            "zip_code",
            "visibility",
            "tags",
        ]