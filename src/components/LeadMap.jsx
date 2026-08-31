// src/components/LeadMap.jsx
'use client';

import { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Autocomplete } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '600px'
};

const defaultCenter = {
  lat: -1.286389,
  lng: 36.817223
};

const mapOptions = {
  mapTypeId: 'roadmap',
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  zoomControl: true,
};

export default function LeadMap({ leads, onLeadClick, onSearch }) {
  const [map, setMap] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(13);
  const searchInputRef = useRef(null);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onSearchBoxLoad = useCallback((ref) => {
    setSearchBox(ref);
  }, []);

  const onPlacesChanged = useCallback(() => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const location = place.geometry?.location;
        if (location) {
          const newCenter = {
            lat: location.lat(),
            lng: location.lng()
          };
          setCenter(newCenter);
          setZoom(15);
          if (map) {
            map.panTo(newCenter);
            map.setZoom(15);
          }
          if (onSearch) {
            onSearch(place.formatted_address || place.name);
          }
        }
      }
    }
  }, [searchBox, map, onSearch]);

  const handleMarkerClick = (lead) => {
    setSelectedLead(lead);
    if (onLeadClick) {
      onLeadClick(lead);
    }
  };

  const handleInfoWindowClose = () => {
    setSelectedLead(null);
  };

  const getMarkerColor = (status) => {
    return status === 'site_generated' ? '#4CAF50' : '#F44336';
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Google Maps API Key Missing</p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={['places']}
      loadingElement={
        <div className="h-[600px] flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Google Maps...</p>
          </div>
        </div>
      }
    >
      <div className="relative h-full w-full">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-96">
          <Autocomplete
            onLoad={onSearchBoxLoad}
            onPlacesChanged={onPlacesChanged}
          >
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for a location..."
              className="w-full px-4 py-3 rounded-lg shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Autocomplete>
        </div>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {leads && leads.map((lead) => (
            lead.lat && lead.lng && (
              <Marker
                key={lead.id}
                position={{ lat: lead.lat, lng: lead.lng }}
                onClick={() => handleMarkerClick(lead)}
                icon={{
                  url: `http://maps.google.com/mapfiles/ms/icons/${getMarkerColor(lead.status)}-dot.png`,
                  scaledSize: new window.google.maps.Size(32, 32)
                }}
              />
            )
          ))}

          {selectedLead && (
            <InfoWindow
              position={{ lat: selectedLead.lat, lng: selectedLead.lng }}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="p-2 max-w-xs">
                <h3 className="font-bold text-lg text-gray-800">{selectedLead.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedLead.address}</p>
                {selectedLead.phone && (
                  <p className="text-sm text-gray-600 mt-1">📞 {selectedLead.phone}</p>
                )}
                <div className="mt-2 flex items-center">
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    selectedLead.status === 'site_generated' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedLead.status === 'site_generated' ? '✅ Has Website' : '❌ No Website'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (onLeadClick) {
                      onLeadClick(selectedLead);
                    }
                  }}
                  className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                >
                  {selectedLead.status === 'site_generated' ? 'View Site' : 'Generate Site'}
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-10">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-700">No Website</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700">Has Website</span>
          </div>
        </div>
      </div>
    </LoadScript>
  );
}
