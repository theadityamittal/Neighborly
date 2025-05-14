import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const FormLocationPicker = ({ location, setLocation, onCoordinatesChange, latitude = null, longitude = null}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);

  const [displayAddress, setDisplayAddress] = useState({
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: longitude && latitude ? [longitude, latitude] : [-73.935242, 40.73061],
      zoom: 12,
      interactive: true,
    });
    mapInstance.current = map;
    if (longitude && latitude) {
      reverseGeocode(longitude, latitude);
    }    

    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;

      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker({ draggable: true })
          .setLngLat([lng, lat])
          .addTo(map);
      } else {
        markerRef.current.setLngLat([lng, lat]);
      }

      reverseGeocode(lng, lat);

      markerRef.current.on('dragend', () => {
        const pos = markerRef.current.getLngLat();
        reverseGeocode(pos.lng, pos.lat);
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
        mapInstance.current?.flyTo({ center: [lng, lat], zoom: 13 });

        if (!markerRef.current) {
          markerRef.current = new mapboxgl.Marker({ draggable: true })
            .setLngLat([lng, lat])
            .addTo(mapInstance.current);
        } else {
          markerRef.current.setLngLat([lng, lat]);
        }

        reverseGeocode(lng, lat);
      });
    }
  }, []);

  const reverseGeocode = async (lng, lat) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}&types=address&country=us`
      );
      const data = await res.json();
      if (data.features.length > 0) {
        const result = data.features[0];
        const context = result.context || [];
        const getContext = (type) => context.find((c) => c.id.startsWith(type))?.text || '';

        const cityName = getContext('place');
        const stateName = getContext('region');
        const zip = getContext('postcode');
        const neighborhood = getContext('neighborhood');
        const street = result.text || '';
        const address = result.address ? `${result.address} ${street}` : street;
        const fullAddress = result.place_name;

        setLocation(fullAddress);
        setDisplayAddress({ streetAddress: address, city: cityName, state: stateName, zipCode: zip, neighborhood: neighborhood });

        onCoordinatesChange({
          latitude: lat,
          longitude: lng,
          streetAddress: address,
          city: cityName,
          state: stateName,
          zipCode: zip,
          neighborhood: neighborhood,
          fullAddress,
        });
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  return (
    <div>
      <label className="input-label" style={{ marginTop: '20px', marginBottom: '10px' }}>Location</label>
      <div id="form-location-geocoder" style={{ marginBottom: '10px' }} />
      <div
        ref={mapRef}
        style={{ height: '250px', width: '100%', borderRadius: '8px', marginTop: '10px' }}
      />

      {/* Address Preview */}
      {location && (
        <div style={{
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            marginTop: '20px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: '#333'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', marginTop: '2px', marginBottom: '2px', color: '#111', textAlign: 'center' }}>
              📍 Selected Location
            </h4>
            {[
              ['Street', displayAddress.streetAddress],
              ['Neighborhood', displayAddress.neighborhood],
              ['City', displayAddress.city],
              ['State', displayAddress.state],
              ['ZIP Code', displayAddress.zipCode],
            ].map(([label, value]) => (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }} key={label}>
                <strong style={{ width: '120px' }}>{label}:</strong>
                <span>{value || '-'}</span>
              </div>
            ))}
          </div>
      )}

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