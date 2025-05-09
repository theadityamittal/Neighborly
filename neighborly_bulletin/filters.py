import django_filters
from .models import BulletinItem


class BulletinItemFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr="icontains")
    content = django_filters.CharFilter(lookup_expr="icontains")

    # dates
    date_posted = django_filters.DateFilter(field_name="date_posted")  # exact
    date_posted__gte = django_filters.DateFilter(
        field_name="date_posted", lookup_expr="gte"
    )  # on or after
    date_posted__lte = django_filters.DateFilter(
        field_name="date_posted", lookup_expr="lte"
    )  # on or before

    tags = django_filters.CharFilter(lookup_expr="icontains")

    visibility = django_filters.CharFilter(lookup_expr="iexact")
    neighborhood = django_filters.CharFilter(lookup_expr="icontains")
    street_address = django_filters.CharFilter(lookup_expr="icontains")
    city = django_filters.CharFilter(lookup_expr="icontains")
    zip_code = django_filters.CharFilter(lookup_expr="exact")

    class Meta:
        model = BulletinItem
        fields = [
            "title",
            "content",
            "user",
            "date_posted",
            "neighborhood",
            "street_address",
            "city",
            "zip_code",
            "visibility",
            "tags",
        ]
