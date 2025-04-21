import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const FormLocationPicker = ({ location, setLocation, onCoordinatesChange }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-73.935242, 40.73061],
      zoom: 12,
      interactive: true,
    });
    mapInstance.current = map;

    // Add click handler once
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      setLocation(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
      onCoordinatesChange({ latitude: lat, longitude: lng });

      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker({ draggable: true })
          .setLngLat([lng, lat])
          .addTo(map);
      } else {
        markerRef.current.setLngLat([lng, lat]);
      }

      markerRef.current.on('dragend', () => {
        const pos = markerRef.current.getLngLat();
        setLocation(`Lat: ${pos.lat.toFixed(5)}, Lng: ${pos.lng.toFixed(5)}`);
        onCoordinatesChange({ latitude: pos.lat, longitude: pos.lng });
      });
    });
  }, []);

  useEffect(() => {
    if (!mapInstance.current || geocoderRef.current) return;

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      countries: 'us',
      placeholder: 'Search for a location',
      marker: false,
    });

    const inputEl = document.getElementById('form-location-geocoder');
    if (inputEl) {
      geocoder.addTo(inputEl);
      geocoderRef.current = geocoder;

      setTimeout(() => {
        const inputBox = document.querySelector('.mapboxgl-ctrl-geocoder input');
        if (inputBox) inputBox.classList.add('input');
      }, 100);

      geocoder.on('result', (e) => {
        const [lng, lat] = e.result.center;
        const name = e.result.place_name;

        setLocation(name);
        onCoordinatesChange({ latitude: lat, longitude: lng });

        mapInstance.current?.flyTo({ center: [lng, lat], zoom: 13 });

        if (!markerRef.current) {
          markerRef.current = new mapboxgl.Marker({ draggable: true })
            .setLngLat([lng, lat])
            .addTo(mapInstance.current);
        } else {
          markerRef.current.setLngLat([lng, lat]);
        }

        markerRef.current.on('dragend', () => {
          const pos = markerRef.current.getLngLat();
          setLocation(`Lat: ${pos.lat.toFixed(5)}, Lng: ${pos.lng.toFixed(5)}`);
          onCoordinatesChange({ latitude: pos.lat, longitude: pos.lng });
        });
      });
    }
  }, [setLocation, onCoordinatesChange]);

  return (
    <div>
      <label className="input-label" style={{ marginTop: '20px', marginBottom: '10px' }}>Location</label>
      <div id="form-location-geocoder" style={{ marginBottom: '10px' }} />
      <div
        ref={mapRef}
        style={{ height: '250px', width: '100%', borderRadius: '8px', marginTop: '10px' }}
      />

      <style>{`
        .mapboxgl-ctrl-geocoder {
            background: none !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            font-family: inherit !important;
        }

        .mapboxgl-ctrl-geocoder input {
            background: #FFFFFF;
            border: 1px solid #F1F3F7;
            box-shadow: 0px 1px 4px rgba(25, 33, 61, 0.08);
            border-radius: 6px;
            padding: 12px;
            font-size: 14px;
            width: 100%;
            box-sizing: border-box;
            padding-left: 36px;
        }

        .mapboxgl-ctrl-geocoder--suggestion {
            font-size: 14px;
            font-family: 'Inter', sans-serif;
        }

        .mapboxgl-ctrl-geocoder--icon-search {
            left: 12px;
            top: 15px;
            width: 16px;
            height: 16px;
            opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export default FormLocationPicker;