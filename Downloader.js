import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Mapbox from "@mapbox/react-native-mapbox-gl";

export const mapboxStyleUrl =
  "mapbox://styles/atomheartother/cjvqj3zub02df1cp2dgnrm8um";

export const mapboxAccessToken =
  "pk.eyJ1IjoiYXRvbWhlYXJ0b3RoZXIiLCJhIjoiY2p2cWozZjIwMDJlajN6cG5lbG5hc2g0YSJ9.T1hfgE9GSZMqt6kGPgX_qQ";

Mapbox.setAccessToken(mapboxAccessToken);

export const maxBounds = [
  [3.47745080284, 43.6316469052],
  [0.457313662746, 42.3566053561]
];

packs = {
  testPack: {
    bounds: maxBounds,
    minZoom: 7,
    maxZoom: 10
  }
};

export default class Downloader extends React.PureComponent {
  state = {
    totalSize: null,
    downloaded: 0
  };

  componentDidMount() {
    this.checkOfflinePackages();
  }

  deletePack = async key => {
    return Mapbox.offlineManager.deletePack(key);
  };

  downloadPack = async (pack, key) => {
    Mapbox.offlineManager.setProgressEventThrottle(5000);
    Mapbox.offlineManager.createPack(
      {
        name: key,
        styleURL: mapboxStyleUrl,
        ...pack
      },
      // Progress callback
      async (offlineRegion, status) => {
        this.setState({
          totalSize: status.requiredResourceCount,
          downloaded: status.completedResourceCount
        });
      },
      // Error callback
      async () => {
        // Delete it
        await this.deletePack(key);
      }
    );
  };

  checkOfflinePackages = async () => {
    Object.keys(packs).forEach(async k => {
      const offlinePack = await Mapbox.offlineManager.getPack(k);
      // if packs are present, check their dl status
      if (offlinePack) {
        const status = await offlinePack.status();
        if (status.requiredResourceCount === status.completedResourceCount) {
          // The pack is valid
          this.setState({
            totalSize: status.requiredResourceCount,
            downloaded: status.completedResourceCount
          });
          return;
        }
        // Delete the pack because it's here but it didn't pass all tests
        await this.deletePack(k);
      }
      // Download the pack
      this.downloadPack(packs[k], k);
    });
  };

  render() {
    const { changePage } = this.props;
    const { totalSize, downloaded } = this.state;
    const done = totalSize && downloaded && totalSize === downloaded;
    return (
      <View style={styles.container}>
        <Text
          style={styles.welcome}
        >{`Pack progress: ${downloaded}/${totalSize || "??"}`}</Text>
        <Button
          disabled={!done}
          onPress={() => {
            changePage("map");
          }}
          title="Map"
        />
        <Button
          disabled={!done}
          onPress={async () => {
            await this.deletePack("testPack");
            this.checkOfflinePackages();
          }}
          title="Delete pack"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  }
});
