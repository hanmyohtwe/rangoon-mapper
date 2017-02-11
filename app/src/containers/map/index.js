import React, { Component } from 'react';
import { connect } from 'react-redux';
import GoogleMap from 'google-map-react';
import _ from 'lodash';

import './index.css';
import { handlePlacesChanged, onMapLoad, selectStartEndStop } from '../../actions/map';
import customMapStyles from '../../constants/CustomMapStyles.json';
import BusStop from '../../components/BusStop';
import Polyline from '../../components/Polyline';

class Map extends Component {
  componentDidMount() {
    const { startStop, endStop } = this.props.query;
    const { busStopsMap } = this.props.map;
    if (startStop || endStop) {
      this.props.selectStartEndStop(busStopsMap[startStop], busStopsMap[endStop]);
    }
  }
  render() {
    const {
      center,
      zoom,
      busServices,
      routePath,
      google } = this.props.map;


    let polylines = null;

    if (routePath && routePath.path) {
      polylines = _.groupBy(routePath.path || [], 'service_name');
    }
    return (
      <GoogleMap
        bootstrapURLKeys={{ key: 'AIzaSyBePNN11JZSltU-e8ht5z176ZWDKpx5Jg0' }}
        center={center}
        zoom={zoom}
        options={{ styles: customMapStyles }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={this.props.onMapLoad}
      >


        {polylines ?
          _.map(polylines, (value, key) => <Polyline key={key} google={google} color={key === '0' ? '#000' : busServices[key].color} routePath={value} />)
        : null}


        {routePath && routePath.path ?
          routePath.path.map(marker => <BusStop key={marker.bus_stop_id} {...marker} />)
          : null}
      </GoogleMap>
    );
  }
}

Map.defaultProps = {
  query: {
    startStop: null,
    endStop: null,
  },
};

Map.propTypes = {
  map: React.PropTypes.object.isRequired,
  onMapLoad: React.PropTypes.func.isRequired,
  selectStartEndStop: React.PropTypes.func.isRequired,
  query: React.PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  const { map, busStops } = state;
  const { query } = ownProps.location;

  return {
    map,
    busStops,
    query,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handlePlacesChanged: (places) => {
      dispatch(handlePlacesChanged(places));
    },
    onMapLoad: (google) => {
      dispatch(onMapLoad(google));
    },
    selectStartEndStop: (startStop, endStop) => {
      dispatch(selectStartEndStop(startStop, endStop));
    },
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Map);
