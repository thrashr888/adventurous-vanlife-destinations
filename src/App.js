import React, { Component } from 'react';
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
      zoom: 20,
      horizontal: 0,
      vertical: 0,
    };

    this.handleZoom = this.handleZoom.bind(this);
    this.handleVertical = this.handleVertical.bind(this);
    this.handleHorizontal = this.handleHorizontal.bind(this);
  }

  componentDidMount() {
    getTSV(this.state.docUrl).then(destinations => {
      this.setState({ destinations });
    });
  }

  fudgeNumber(num, zoom = 50, move = 1000, dir) {
    return Math.abs(num) * zoom - move - dir;
  }

  handleZoom(e) {
    this.setState({ zoom: e.target.value });
  }
  handleHorizontal(e) {
    this.setState({ horizontal: e.target.value });
  }
  handleVertical(e) {
    this.setState({ vertical: e.target.value });
  }

  render() {
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Adventurous Vanlife Destinations</h1>
        </header>
        <div>
          <input type="range" onChange={this.handleZoom} defaultValue="10" /> {this.state.zoom} zoom
          <br />
          <input type="range" onChange={this.handleVertical} defaultValue="10" max={height} />{' '}
          {this.state.vertical} vertical
          <br />
          <input type="range" onChange={this.handleHorizontal} defaultValue="10" max={width} />{' '}
          {this.state.horizontal} horizontal
        </div>

        <div style={{ height: '80vh', position: 'absolute', width: '100vw' }}>
          {this.state.destinations.map(d => {
            let style = {
              bottom: this.fudgeNumber(d.Lat, this.state.zoom, height, this.state.vertical) + 'px',
              right: this.fudgeNumber(d.Lng, this.state.zoom, width, this.state.horizontal) + 'px',
              position: 'absolute',
            };
            return (
              <div key={d.city + d.state} style={style}>
                {d.city}, {d.state}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
