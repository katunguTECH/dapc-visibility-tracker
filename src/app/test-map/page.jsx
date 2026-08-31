// src/app/test-map/page.jsx
'use client';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: -1.286389,
  lng: 36.817223
};

export default function TestMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  console.log('🔑 API Key exists:', !!apiKey);

  if (!apiKey) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">API Key Missing</h1>
        <p>Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Map</h1>
      <p className="text-sm text-gray-500 mb-4">API Key: {apiKey.substring(0, 15)}...</p>
      <div className="border rounded-lg overflow-hidden">
        <LoadScript
          googleMapsApiKey={apiKey}
          loadingElement={
            <div className="h-[500px] flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading Google Maps...</p>
              </div>
            </div>
          }
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
          >
            <Marker position={center} />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
