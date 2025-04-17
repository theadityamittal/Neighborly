from django.core.management.base import BaseCommand
from neighborly_services.models import ServiceItem
from datetime import datetime

dummy_services = [
    {
        "title": "Premium Yoga Class",
        "provider": "Zen Studio",
        "location": "Los Angeles, CA",
        "closestAvailability": "March 20, 2025",
        "unavailableDates": ["2025-03-20", "2025-03-21"],
        "price": "$7 / Day",
        "viewType": "card",
        "tabs": ["Yoga", "Fitness"],
        "images": ["https://neighborlyphotos.s3.us-east-2.amazonaws.com/services/uploads/yoga1.jpg", "https://neighborlyphotos.s3.us-east-2.amazonaws.com/services/uploads/yoga2.jpg"]
    }, 
    {
        "title": "Gourmet Cooking Workshop",
        "provider": "MasterChef Academy",
        "location": "New York, NY",
        "closestAvailability": "April 5, 2025",
        "unavailableDates": ["2025-04-05", "2025-04-06"],
        "price": "$15 / Day",
        "viewType": "card",
        "tabs": ["Cooking", "Food"],
        "images": ["https://neighborlyphotos.s3.us-east-2.amazonaws.com/services/uploads/cooking1.jpg", "https://neighborlyphotos.s3.us-east-2.amazonaws.com/services/uploads/cooking2.jpg"]
    },
    {
        "title": "Photography Bootcamp",
        "provider": "Creative Lens Studio",
        "location": "Chicago, IL",
        "closestAvailability": "April 12, 2025",
        "unavailableDates": [],
        "price": "$20 / Day",
        "viewType": "card",
        "tabs": ["Photography", "Art"],
        "images": ["https://neighborlyphotos.s3.us-east-2.amazonaws.com/services/uploads/photo1.jpg"]
    },
    {
        "title": "Digital Marketing Course",
        "provider": "Online Academy",
        "location": "San Francisco, CA",
        "closestAvailability": "March 25, 2025",
        "unavailableDates": ["2025-03-25"],
        "price": "$10 / Day",
        "viewType": "card",
        "tabs": ["Marketing", "Business"],
        "images": ["https://neighborlyphotos.s3.us-east-2.amazonaws.com/services/uploads/marketing1.jpg"]
    },
    {
        "title": "Pilates Training Session",
        "provider": "Wellness Hub",
        "location": "Seattle, WA",
        "closestAvailability": "April 8, 2025",
        "unavailableDates": [],
        "price": "$12 / Day",
        "viewType": "card",
        "tabs": ["Pilates", "Fitness"],
        "images": ["https://neighborlyphotos.s3.us-east-2.amazonaws.com/services/uploads/pilates1.jpg"]
    },
    {
        "title": "Tree Climbing Workshop",
        "provider": "Adventure Club",
        "location": "Denver, CO",
        "closestAvailability": "April 15, 2025",
        "unavailableDates": ["2025-04-15"],
        "price": "$18 / Day",
        "viewType": "card",
        "tabs": ["Adventure", "Fitness"],
        "images": ["https://neighborlyphotos.s3.us-east-2.amazonaws.com/services/uploads/tree1.jpg"]
    },
]

provider_map = {
    "Zen Studio": 1,
    "MasterChef Academy": 2,
    "Creative Lens Studio": 3,
    "Online Academy": 4,
    "Wellness Hub": 5,
    "Adventure Club": 6
}

for service in dummy_services:
    obj, created = ServiceItem.objects.get_or_create(
        title=service["title"],
        defaults={
            "description": f"{service['title']} by {service['provider']}.",
            "service_provider": provider_map.get(service["provider"], 0),
            "location": service["location"],
            "earliest_availability": datetime.strptime(service["closestAvailability"], "%B %d, %Y").date(),
            "unavailable_dates": service["unavailableDates"],
            "price": service["price"],
            "view_type": service["viewType"],
            "tabs": service["tabs"],
            "images": service["images"],
            "waitlist": [],
            "available": True,
        }
    )
    if created:
        print(f"✅ Created: {obj.title}")
    else:
        print(f"⏭ Skipped (already exists): {obj.title}")