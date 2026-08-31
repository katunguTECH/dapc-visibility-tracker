"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, MarkerF, useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter = { lat: 20, lng: 0 };
const defaultZoom = 2;

export default function ProspectsPage() {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(defaultZoom);
  const [totalLeads, setTotalLeads] = useState(0);

  const searchRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
    language: "en",
  });

  const fetchExistingLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/leads");
      if (!response.ok) throw new Error("Failed to load leads");
      const data = await response.json();
      setBusinesses(data.leads || []);
      setTotalLeads(data.leads?.length || 0);
    } catch (err) {
      console.error("Failed to load leads:", err);
      setError("Failed to load leads. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExistingLeads();
  }, [fetchExistingLeads]);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    console.log("Map loaded successfully");
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const handlePlaceChanged = () => {
    const place = searchRef.current?.getPlace();
    if (place?.geometry) {
      const newCenter = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setMapCenter(newCenter);
      setMapZoom(13);
      if (mapRef.current) {
        mapRef.current.panTo(newCenter);
        mapRef.current.setZoom(13);
      }
      
      const cityName = extractCityName(place);
      
      if (cityName) {
        searchForBusinesses(cityName, newCenter);
      }
    }
  };

  const extractCityName = (place) => {
    if (place.address_components) {
      for (const component of place.address_components) {
        if (component.types.includes("locality") || component.types.includes("administrative_area_level_1")) {
          return component.long_name;
        }
      }
    }
    return place.name || null;
  };

  const searchForBusinesses = async (query, location) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const locationStr = location ? `${location.lat},${location.lng}` : "";
      
      // Search for various business types
      const businessTypes = [
        "restaurant",
        "car repair",
        "plumber",
        "hair salon",
        "grocery store",
        "pharmacy",
        "electrician",
        "barber shop"
      ];
      
      const allLeads = [];
      
      for (const type of businessTypes) {
        const fullQuery = `${type} in ${query}`;
        const params = new URLSearchParams({
          query: fullQuery,
          location: locationStr,
        });
        
        try {
          const response = await fetch(`/api/leads?${params.toString()}`);
          if (!response.ok) continue;
          
          const data = await response.json();
          if (data.leads) {
            allLeads.push(...data.leads);
          }
        } catch (e) {
          console.error(`Error searching for ${type}:`, e);
        }
      }
      
      const uniqueLeads = Array.from(new Map(allLeads.map(lead => [lead.placeId, lead])).values());
      
      setBusinesses(uniqueLeads);
      setTotalLeads(uniqueLeads.length);
      
      if (uniqueLeads.length > 0 && mapRef.current) {
        fitMapToBusinesses(uniqueLeads);
      }
      
      console.log(`Found ${uniqueLeads.length} businesses without websites`);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search for businesses.");
    } finally {
      setLoading(false);
    }
  };

  const fitMapToBusinesses = (leads) => {
    if (!mapRef.current || leads.length === 0) return;
    
    const bounds = new window.google.maps.LatLngBounds();
    leads.forEach((business) => {
      if (business.lat && business.lng) {
        bounds.extend({ lat: business.lat, lng: business.lng });
      }
    });
    
    mapRef.current.fitBounds(bounds);
  };

  const handleSearch = () => {
    searchForBusinesses(searchQuery, mapCenter);
  };

  const handleReset = () => {
    setSearchQuery("");
    setMapCenter(defaultCenter);
    setMapZoom(defaultZoom);
    if (mapRef.current) {
      mapRef.current.panTo(defaultCenter);
      mapRef.current.setZoom(defaultZoom);
    }
    fetchExistingLeads();
  };

  const handleMarkerClick = (business) => {
    setSelectedBusiness(business);
    if (business.lat && business.lng) {
      setMapCenter({ lat: business.lat, lng: business.lng });
      setMapZoom(16);
      if (mapRef.current) {
        mapRef.current.panTo({ lat: business.lat, lng: business.lng });
        mapRef.current.setZoom(16);
      }
    }
  };

  const createMarkerIcon = () => {
    if (typeof window === "undefined" || !window.google) return undefined;
    
    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="#ef4444" stroke="white" stroke-width="2"/>
          <text x="20" y="25" text-anchor="middle" font-size="14" fill="white" font-weight="bold">✗</text>
        </svg>`
      ),
      scaledSize: new window.google.maps.Size(40, 40),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(20, 20),
    };
  };

  if (loadError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-700 mb-4">Map Load Error</h2>
          <p className="text-red-600 mb-4">
            Failed to load Google Maps. Please check your API key configuration.
          </p>
          <div className="text-left text-sm text-gray-600 space-y-2 mb-6">
            <p><strong>Error:</strong> {loadError.message || "Unknown error"}</p>
            <p className="font-semibold">To fix this:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Make sure the API key belongs to the project with APIs enabled</li>
              <li>Enable <strong>Maps JavaScript API</strong></li>
              <li>Enable <strong>Places API</strong></li>
              <li>Enable <strong>Geocoding API</strong></li>
              <li>Check API key restrictions</li>
            </ul>
          </div>
          <a 
            href="https://console.cloud.google.com/google/maps-apis/overview" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Open Google Cloud Console
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🌍 Global Lead Finder</h1>
        <div className="flex space-x-3">
          <a className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" href="/admin/leads">
            📋 View All Leads
          </a>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. car garages in Nairobi, restaurants in Paris..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition" onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "🔍 Search"}
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition" onClick={handleReset}>
            Reset
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {loading ? "Searching..." : `${totalLeads} businesses without websites found`}
        </p>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-[600px]">
            {!isLoaded ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            ) : (
              <div className="relative h-full w-full">
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-96">
                  <Autocomplete
                    onLoad={(autocomplete) => (searchRef.current = autocomplete)}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <input
                      placeholder="Search any location worldwide..."
                      className="w-full px-4 py-3 rounded-lg shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="text"
                    />
                  </Autocomplete>
                </div>

                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={mapZoom}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: true,
                    streetViewControl: false,
                    fullscreenControl: true,
                    minZoom: 2,
                    maxZoom: 20,
                  }}
                >
                  {businesses.map((business, index) => {
                    if (business.lat && business.lng) {
                      return (
                        <MarkerF
                          key={business.id || index}
                          position={{ lat: business.lat, lng: business.lng }}
                          onClick={() => handleMarkerClick(business)}
                          icon={createMarkerIcon()}
                          title={business.name}
                        />
                      );
                    }
                    return null;
                  })}
                </GoogleMap>

                {selectedBusiness && (
                  <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-xl z-10 max-w-sm">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{selectedBusiness.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">📍 {selectedBusiness.address}</p>
                    {selectedBusiness.phone && <p className="text-sm text-gray-600 mb-2">📞 {selectedBusiness.phone}</p>}
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                        ❌ No Website - Lead!
                      </span>
                    </div>
                    <button className="mt-3 text-gray-500 hover:text-gray-700 text-sm" onClick={() => setSelectedBusiness(null)}>
                      ✕ Close
                    </button>
                  </div>
                )}

                <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-10">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-sm text-gray-700">No Website (Lead)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 h-[600px] overflow-y-auto">
            <h2 className="font-semibold text-lg mb-3">🎯 Businesses Without Websites</h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : businesses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No businesses found yet</p>
                <p className="text-sm text-gray-400">
                  Try searching for a specific business type like "car repair Nairobi"
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {businesses.map((business, index) => (
                  <div
                    key={business.id || index}
                    className={`border rounded-lg p-3 hover:shadow-md transition cursor-pointer ${
                      selectedBusiness?.id === business.id ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => handleMarkerClick(business)}
                  >
                    <h3 className="font-semibold text-blue-600">{business.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{business.address}</p>
                    {business.phone && <p className="text-sm text-gray-500">📞 {business.phone}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <span className="inline-block px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                        ❌ No Website
                      </span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name + ' ' + business.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View on Google Maps ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
