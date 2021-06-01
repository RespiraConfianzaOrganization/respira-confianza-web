/* eslint-disable import/no-webpack-loader-syntax */
import React from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { getRequest } from "../../utils/axios";
import "./Map.css";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: -32.774999,
        longitude: -71.531942,
        zoom: 8,
        width: "100%",
        height: "100%",
      },
      stations: [],
      selectedStation: null,
      stationInfo: null,
    };
  }

  async componentDidMount() {
    await this.getStations();
  }

  getStations = async () => {
    const response = await getRequest(
      `${process.env.REACT_APP_API_URL}/api/public/stations`
    );
    if (response.status === 200) {
      this.setState({ stations: response.data.stations });
    }
  };

  getStationStatus = async (id) => {
    const response = await getRequest(
      `${process.env.REACT_APP_API_URL}/api/stations/${id}/status`
    );
    if (response.status === 200) {
      this.setState({
        stationInfo: {
          station: response.data.station,
          pollutants: response.data.pollutants,
        },
      });
    }
  };

  displayInfoStation() {
    let pollutants = [];
    if (this.state.stationInfo) {
      pollutants = this.state.stationInfo.pollutants;
    }
    return (
      <div className="Map__CityInfo">
        <h3>
          {this.state.selectedStation.name},{" "}
          {this.state.selectedStation.City.name}
        </h3>
        <div className="Map__ReadingsInfo">
          {pollutants.map((pollutant) => (
            <div key={pollutant.name} className="Map__ReadingsInfoItem">
              <p className="Map__Infotext data">-</p>
              <div>
                <p className="Map__Infotext name">{pollutant.name}</p>
                <p className="Map__Infotext unit">{pollutant.unit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  async handleSelectStation(station) {
    this.setState({ selectedStation: station });
    await this.getStationStatus(station.id);
  }

  render() {
    return (
      <div>
        <div className="Map_Container">
          <ReactMapGL
            {...this.state.viewport}
            onViewportChange={(viewport) => this.setState({ viewport })}
            mapboxApiAccessToken={`${process.env.REACT_APP_MAP_TOKEN}`}
          >
            {this.state.stations.map((station) => (
              <Marker
                key={station.id}
                latitude={station.latitude}
                longitude={station.longitude}
                offsetLeft={-20}
                offsetTop={-10}
              >
                <div onClick={() => this.handleSelectStation(station)}>
                  <img className="Map_pin" src="pin.png" alt="pin" />
                </div>
              </Marker>
            ))}
            {this.state.selectedStation && this.displayInfoStation()}
          </ReactMapGL>
        </div>
      </div>
    );
  }
}

export default Map;
