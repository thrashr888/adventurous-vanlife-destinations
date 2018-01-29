import React, { Component } from 'react';
import usMap from './Blank_US_Map_(states_only).svg';
import './App.css';

import getTSV from './getTSV';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Array [ "date", "city", "state", "location", "Lat", "Lng" ]
      docUrl:
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5mJfTqI8H2RG-YCyy6_OWFzaZe5nHQouniy0cvlyBW1n6-FqXEMuwScJzp-zho1Yh58ZgOHF8Q_Cj/pub?gid=632068352&single=true&output=tsv',
      destinations: [],
      hZoom: 15,
      vZoom: 15,
      horizontal: 0,
      vertical: 0,
    };

    this.handleRange = this.handleRange.bind(this);
  }

  componentDidMount() {
    getTSV(this.state.docUrl).then(destinations => {
      this.setState({ destinations });
    });
  }

  handleRange(key = 'range') {
    return e => {
      let state = {};
      state[key] = e.target.value;
      this.setState(state);
    };
  }

  fudgeNumber(num, zoom = 50, move = 1000, dir) {
    return Math.abs(num) * zoom - move - dir;
  }

  render() {
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Adventurous Vanlife Destinations</h1>
          <div className="Tools">
            <input
              type="range"
              onChange={this.handleRange('hZoom')}
              defaultValue={this.state.hZoom}
              min="5"
              max="25"
            />
            {this.state.hZoom} horizontal zoom
            <br />
            <input
              type="range"
              onChange={this.handleRange('vZoom')}
              defaultValue={this.state.vZoom}
              min="5"
              max="25"
            />
            {this.state.vZoom} vertical zoom
            <br />
            <input type="range" onChange={this.handleRange('vertical')} defaultValue="10" max={height} />
            {this.state.vertical} vertical
            <br />
            <input type="range" onChange={this.handleRange('horizontal')} defaultValue="10" max={width} />
            {this.state.horizontal} horizontal
          </div>
        </header>

        <div className="Map">
          <img src={usMap} className="App-logo" alt="logo" />
        </div>

        <div className="Destinations">
          {this.state.destinations.map(d => (
            <div
              className="Destination"
              key={d.city + d.state}
              style={{
                bottom: this.fudgeNumber(d.Lat, this.state.vZoom, height, this.state.vertical) + 'px',
                right: this.fudgeNumber(d.Lng, this.state.hZoom, width, this.state.horizontal) + 'px',
              }}
            >
              {d.city}, {d.state}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
