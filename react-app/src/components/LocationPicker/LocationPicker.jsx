import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

// Load your token from .env file
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const LocationPicker = ({ onLocationChange }) => {
  const mapContainerRef = useRef(null);
  const [lng, setLng] = useState(-73.935242); // Default: NYC
  const [lat, setLat] = useState(40.730610);
  const [zoom] = useState(12);
  const [locationName, setLocationName] = useState('');

  const reverseGeocode = async (lng, lat) => {
    const token = mapboxgl.accessToken;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}`;
    console.log("🧭 Reverse geocoding:", url); // Add this line
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log("📍 Reverse result:", data); // Add this line
  
      if (data.features && data.features.length > 0) {
        const place = data.features[0].place_name;
        console.log("📌 Place found:", place); // Add this line
        setLocationName(place);
        onLocationChange({ latitude: lat, longitude: lng, locationName: place });
      } else {
        setLocationName('');
        onLocationChange({ latitude: lat, longitude: lng, locationName: '' });
      }
    } catch (err) {
      console.error("❌ Reverse geocoding failed:", err);
      setLocationName('');
    }
  };
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      // style: 'mapbox://styles/mapbox/navigation-day-v1',
      center: [lng, lat],
      zoom,
    });

    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([lng, lat])
      .addTo(map);

    // Drag marker
    marker.on('dragend', () => {
      const { lng, lat } = marker.getLngLat();
      setLng(lng);
      setLat(lat);
      reverseGeocode(lng, lat);
    });

    // Add geocoder control
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
    });

    map.addControl(geocoder);

    geocoder.on('result', (e) => {
      const coords = e.result.center;
      marker.setLngLat(coords);
      setLng(coords[0]);
      setLat(coords[1]);
      reverseGeocode(coords[0], coords[1]);
    });

    // Click to move marker
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      marker.setLngLat([lng, lat]);
      setLng(lng);
      setLat(lat);
      reverseGeocode(lng, lat);
    });

    return () => map.remove();
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} />
      <p style={{ marginTop: '10px' }}>
        <strong>Selected location:</strong><br />
        {locationName && <span>{locationName}<br /></span>}
        {lat.toFixed(5)}, {lng.toFixed(5)}
      </p>
    </div>
  );
};

export default LocationPicker;