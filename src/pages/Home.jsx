import React, { useState, useRef, useEffect } from "react";
import MapView from "../components/map/MapView";
import RestaurantList from "../components/restaurant/RestaurantList";
import FloatingToggleButton from "../components/FloatingToggleButton";
import Header from "../components/layout/Header";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [search, setSearch] = useState("");
  const [showMap, setShowMap] = useState(true);

  const mapRef = useRef();

  const handleMapReady = (mapInstance) => {
    setMap(mapInstance);
    // Trigger initial nearby search after map is ready
    setTimeout(() => {
      handleSearch(mapInstance.getCenter());
    }, 300);
  };

  const handleSearch = (center = map?.getCenter()) => {
    if (!map || !window.google) return;

    const service = new window.google.maps.places.PlacesService(map);

    const request = {
      location: center,
      radius: 1500,
      keyword: search || "restaurant",
      type: "restaurant",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setRestaurants(results);
        mapRef.current?.setMarkers(results);
      } else {
        setRestaurants([]);
      }
    });
  };

  // ✅ Geolocation logic on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatLng = new window.google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          if (map) {
            map.setCenter(userLatLng);
            handleSearch(userLatLng);
          }
        },
        () => {
          handleSearch(); // fallback if denied
        }
      );
    } else {
      handleSearch(); // fallback if unavailable
    }
  }, [map]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Card list */}
        <RestaurantList
          restaurants={restaurants}
          selectedPlaceId={selectedPlaceId}
          onSelect={(placeId) => {
            setSelectedPlaceId(placeId);
            mapRef.current?.selectMarkerById(placeId);
          }}
          showMap={showMap}
        />

        {/* Map */}
        <div className={`flex-1 ${showMap ? "block" : "hidden md:block"}`}>
          <MapView
            ref={mapRef}
            onMapReady={handleMapReady}
            onMarkerSelect={(placeId) => setSelectedPlaceId(placeId)}
            selectedPlaceId={selectedPlaceId}
          />
        </div>

        <FloatingToggleButton
          showMap={showMap}
          toggle={() => setShowMap(!showMap)}
        />
      </div>
    </div>
  );
}

export default Home;
