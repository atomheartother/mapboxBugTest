import React from "react";
import Mapbox from "@mapbox/react-native-mapbox-gl";
import SymbolLayer from "@mapbox/react-native-mapbox-gl/javascript/components/SymbolLayer";

export const mapboxStyleUrl =
  "mapbox://styles/atomheartother/cjvqj3zub02df1cp2dgnrm8um";

export const mapboxAccessToken =
  "pk.eyJ1IjoiYXRvbWhlYXJ0b3RoZXIiLCJhIjoiY2p2cWozZjIwMDJlajN6cG5lbG5hc2g0YSJ9.T1hfgE9GSZMqt6kGPgX_qQ";

Mapbox.setAccessToken(mapboxAccessToken);

const startCenter = [2.6, 43.1];

const styles = Mapbox.StyleSheet.create({
  marker: {
    iconImage: "{image}",
    textField: "{text}" // Removing this line will fix the bug
  }
});

function singleMarkerFeature() {
  const features = [
    {
      type: "Feature",
      id: 1,
      properties: {
        image: "POIactive",
        text: "x"
      },
      geometry: {
        type: "Point",
        coordinates: startCenter
      }
    }
  ];
  return {
    type: "FeatureCollection",
    features
  };
}

const renderPoint = () => (
  <Mapbox.ShapeSource id="pointSource" shape={singleMarkerFeature()}>
    <SymbolLayer id="pointMarker" style={styles.marker} />
  </Mapbox.ShapeSource>
);

export default class Map extends React.PureComponent {
  render() {
    return (
      <Mapbox.MapView
        ref={c => {
          this.map = c;
        }}
        logoEnabled={false}
        zoomLevel={8.5}
        centerCoordinate={startCenter}
        style={{ flex: 1 }}
        minZoomLevel={8.5}
        maxZoomLevel={24}
        rotateEnabled={false}
        pitchEnabled={false}
        pitch={0}
        onDidFailLoadingMap={arg =>
          Alert.alert("Failed loading map", JSON.stringify(arg))
        }
        styleURL={mapboxStyleUrl}
      >
        {renderPoint()}
      </Mapbox.MapView>
    );
  }
}
