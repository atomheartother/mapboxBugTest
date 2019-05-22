import React from "react";
import Mapbox from "@react-native-mapbox/maps";

export const mapboxStyleUrl =
  "mapbox://styles/atomheartother/cjvqj3zub02df1cp2dgnrm8um";

export const mapboxAccessToken =
  "pk.eyJ1IjoiYXRvbWhlYXJ0b3RoZXIiLCJhIjoiY2p2cWozZjIwMDJlajN6cG5lbG5hc2g0YSJ9.T1hfgE9GSZMqt6kGPgX_qQ";

Mapbox.setAccessToken(mapboxAccessToken);

const startCenter = [2.6, 43.1];

const styles = {
  marker: {
    iconImage: "{image}",
    textField: "{text}" // Removing this line will fix the bug
  }
};

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
    <Mapbox.SymbolLayer id="pointMarker" style={styles.marker} />
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
        style={{ flex: 1 }}
        onDidFailLoadingMap={arg =>
          Alert.alert("Failed loading map", JSON.stringify(arg))
        }
        styleURL={mapboxStyleUrl}
      >
        <Mapbox.Camera
          centerCoordinate={startCenter}
          zoomLevel={8.5}
          rotateEnabled={false}
          pitchEnabled={false}
          pitch={0}
        />
        {renderPoint()}
      </Mapbox.MapView>
    );
  }
}
