const zoom = 0.05;
const testing = true;

// Example fake location object for NYC (Central Park)
const fakeNYCLocation = {
    latitude: 40.785091,
    longitude: -73.968285,
    latitudeDelta: zoom,
    longitudeDelta: zoom,
}

// GENERATED USING AI
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#29991F" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#383838" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#2E8B85" }] },
  // ...add more as needed
];

export { darkMapStyle, fakeNYCLocation, testing, zoom };

