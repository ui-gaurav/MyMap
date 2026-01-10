async function initMap() {
  const { SearchBox } = await google.maps.importLibrary("places");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const mapElement = document.querySelector("gmp-map");
  const input = document.getElementById("pac-input");

  customElements.whenDefined("gmp-map").then(async () => {
    const innerMap = await mapElement.innerMap;

    const searchBox = new google.maps.places.SearchBox(input);

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) return;

        // Add Marker
        new AdvancedMarkerElement({
          map: innerMap,
          position: place.geometry.location,
          title: place.name,
        });

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      innerMap.fitBounds(bounds);
    });
  });
}

initMap();
