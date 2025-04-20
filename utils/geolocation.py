import requests
from django.conf import settings

def geocode_location(location_name):
    token = settings.MAPBOX_ACCESS_TOKEN
    if not token:
        return None, None # When no valid

    url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{location_name}.json"
    params = {"access_token": token, "limit": 1}
    response = requests.get(url, params=params)

    if response.status_code != 200:
        return None, None

    data = response.json()
    if data.get("features"):
        lon, lat = data["features"][0]["center"]
        return lat, lon
    return None, None