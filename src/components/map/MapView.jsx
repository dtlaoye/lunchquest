import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { createRoot } from "react-dom/client";
import markerDefault from "../../assets/pin-resting.svg";
import markerSelected from "../../assets/pin-selected.svg";
import MarkerOverlay from "./MarkerOverlay";

const MapView = forwardRef(
  ({ onMapReady, onMarkerSelect, selectedPlaceId }, ref) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    // Pan with vertical offset
    const panToWithOffset = (latLng, yOffset = 150) => {
      const map = mapInstance.current;
      if (!map) return;

      const scale = Math.pow(2, map.getZoom());
      const projection = map.getProjection();
      const worldPoint = projection.fromLatLngToPoint(latLng);
      const pixelOffset = new window.google.maps.Point(0, yOffset / scale);
      const adjustedPoint = new window.google.maps.Point(
        worldPoint.x,
        worldPoint.y + pixelOffset.y
      );
      const newCenter = projection.fromPointToLatLng(adjustedPoint);
      map.panTo(newCenter);
    };

    const markersRef = useRef([]);
    const overlayRef = useRef(null);

    const [clickedPlace, setClickedPlace] = useState(null);
    const [clickedLatLng, setClickedLatLng] = useState(null);
    const mapInitialized = useRef(false);

    useEffect(() => {
      if (mapInitialized.current) return;

      const initMap = async () => {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          version: "weekly",
          libraries: ["places"],
        });

        const [{ Map, OverlayView }, { Marker }] = await Promise.all([
          loader.importLibrary("maps"),
          loader.importLibrary("marker"),
        ]);

        const map = new Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.006 },
          zoom: 14,
        });

        mapInstance.current = map;
        mapInitialized.current = true;

        // Custom OverlayView for marker info
        class ReactOverlay extends OverlayView {
          constructor() {
            super();
            this.container = null;
            this.isReady = false;
            this.place = null;
            this.latLng = null;
          }

          onAdd() {
            this.container = document.createElement("div");
            const panes = this.getPanes();
            if (panes?.floatPane) {
              panes.floatPane.appendChild(this.container);
              this.isReady = true;
              this.draw();
            }
          }

          draw() {
            const projection = this.getProjection();
            if (!this.container || !projection) return;

            const { place, latLng } = this;
            if (!place || !latLng) return;

            const position = projection.fromLatLngToDivPixel(latLng);
            this.container.style.position = "absolute";
            this.container.style.left = `${position.x}px`;
            this.container.style.top = `${position.y}px`;
            this.container.style.transform =
              "translate(-50%, -100%) translateY(-12px)";
            this.container.style.zIndex = "999";

            const root = createRoot(this.container);
            root.render(
              <div style={{ minWidth: 200, minHeight: 50 }}>
                <MarkerOverlay place={place} />
              </div>
            );
          }

          onRemove() {
            if (this.container?.parentNode) {
              this.container.parentNode.removeChild(this.container);
            }
            this.container = null;
            this.isReady = false;
          }
        }

        overlayRef.current = new ReactOverlay();
        overlayRef.current.setMap(map);

        map.addListener("click", () => {
          setClickedLatLng(null);
          setClickedPlace(null);
        });

        onMapReady?.(map);
      };

      initMap();
    }, [onMapReady]);

    // Trigger overlay redraw on selection
    useEffect(() => {
      const overlay = overlayRef.current;
      const isLatLng = clickedLatLng?.lat && clickedLatLng?.lng;

      if (overlay && overlay.isReady && clickedPlace && isLatLng) {
        overlay.place = clickedPlace;
        overlay.latLng = clickedLatLng;

        requestAnimationFrame(() => {
          overlay.draw();
        });
      }
    }, [clickedPlace, clickedLatLng]);

    useImperativeHandle(ref, () => ({
      setMarkers(places) {
        if (!mapInstance.current || !places) return;

        markersRef.current.forEach(({ marker }) => marker.setMap(null));
        markersRef.current = [];

        const bounds = new window.google.maps.LatLngBounds();

        places.forEach((place) => {
          const location =
            place.geometry.location instanceof window.google.maps.LatLng
              ? place.geometry.location
              : new window.google.maps.LatLng(place.geometry.location);

          const marker = new window.google.maps.Marker({
            position: location,
            map: mapInstance.current,
            title: place.name,
            icon: getMarkerIcon(place.place_id === selectedPlaceId),
          });

          marker.addListener("click", () => {
            onMarkerSelect?.(place.place_id);
            setClickedLatLng(location);
            setClickedPlace(place);

            if (window.innerWidth < 768) {
              panToWithOffset(location, 150);
            }
          });

          markersRef.current.push({ placeId: place.place_id, marker, place });
          bounds.extend(location);
        });

        mapInstance.current.fitBounds(bounds);
      },

      selectMarkerById(placeId) {
        const found = markersRef.current.find((m) => m.placeId === placeId);
        if (!found) return;

        const { place } = found;
        const location =
          place.geometry.location instanceof window.google.maps.LatLng
            ? place.geometry.location
            : new window.google.maps.LatLng(place.geometry.location);

        setClickedLatLng(location);
        setClickedPlace(place);
        onMarkerSelect?.(placeId);

        if (window.innerWidth < 768) {
          panToWithOffset(location, 150);
        }
      },
    }));

    useEffect(() => {
      markersRef.current.forEach(({ placeId, marker }) => {
        marker.setIcon(getMarkerIcon(placeId === selectedPlaceId));
      });
    }, [selectedPlaceId]);

    const getMarkerIcon = (isSelected) =>
      isSelected ? markerSelected : markerDefault;

    return <div ref={mapRef} className="w-full h-full" />;
  }
);

export default React.memo(
  MapView,
  (prev, next) => prev.selectedPlaceId === next.selectedPlaceId
);
