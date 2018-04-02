import React from 'react';
import PropTypes from 'prop-types';

import { RelativeOpeningTime } from '../listing';

class MapOfLocations extends React.Component {
  constructor(props) {
    super(props);
    console.log('creating map', this.props, { google });

    this.state = {
      addresses: this.parseAddresses(this.props.locations),
    };
  }

  componentDidMount() {
    if (google === undefined) { return; }
    const map = new google.maps.Map( // TODO We should probably not just have google on the global namespace
      this.refs.map,
      { zoom: 10, position: new google.maps.LatLng(0, 0) },
    );

    // this.state.addresses.forEach((loc) => {
    //   const marker = new google.maps.Marker({
    //     position: loc.latLng,
    //     map,
    //     title: loc.name,
    //   });
    //   console.log('added marker', marker);
    // });

    const userMarker = new google.maps.Marker({
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        fillColor: 'blue',
        fillOpacity: 0.8,
        strokeColor: 'blue',
        strokeWeight: 12,
        strokeOpacity: 0.2,
      },
    });

    if (this.props.userLocation) {
      userMarker.setPosition(this.props.userLocation);
    }
  }

  parseAddresses() {
    return this.props.locations.map((loc) => {
      const { address: { latitude, longitude }, name, schedule } = loc;
      return {
        latLng: new google.maps.LatLng(latitude, longitude),
        name,
        schedule,
      };
    });
  }

  render() {
    return (
      <div>
        <div ref="map" className="map" />
        <table>
          <tbody>
            { this.state.addresses.map((address, i) => (
              <tr key={address.name}>
                <th>{ i }</th>
                <td>{ address.name }</td>
                <td><RelativeOpeningTime schedule={address.schedule} /></td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    );
  }
}

MapOfLocations.propTypes = {
  locations: PropTypes.array.isRequired,
};

export default MapOfLocations;
