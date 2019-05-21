/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";

import Map from "./Map";
import Downloader from "./Downloader";

const pages = {
  downloader: Downloader,
  map: Map
};

type Props = {};
export default class App extends Component<Props> {
  state = {
    page: "downloader"
  };

  changePage = page => {
    this.setState({ page });
  };

  render() {
    const { page } = this.state;
    const PageComponent = pages[page];
    return <PageComponent changePage={this.changePage} />;
  }
}
