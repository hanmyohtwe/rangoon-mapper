import types from '../constants/ActionTypes';

const initialState = {
  center: { lat: 16.7943528, lng: 96.1518985 },
  zoom: 15,
  startStop: null,
  endStop: null,
  routePath: null,
  graph: null,
  google: null,
  busStopsMap: null,
  busServices: null,
  polylines: null,
};

const map = (state = initialState, action) => {
  switch (action.type) {
    case types.PLACES_CHANGED: {
      const location = action.places[0].geometry.location;
      const center = { lat: location.lat(), lng: location.lng() };
      return Object.assign({}, state, {
        center,
      });
    }

    case types.UPDATE_MAP_CENTER: {
      return Object.assign({}, state, {
        center: action.center,
      });
    }

    case types.AJACENCY_LIST_LOADED: {
      return Object.assign({}, state, {
        graph: action.graph,
        busStopsMap: action.busStopsMap,
        busServices: action.busServices,
      });
    }

    case types.ON_MAP_LOAD: {
      const { google } = action;
      return Object.assign({}, state, {
        google,
      });
    }

    case types.SELECT_START_STOP_SUCCESS: {
      return Object.assign({}, state, {
        startStop: action.payload.startStop,
      });
    }

    case types.SELECT_END_STOP_SUCCESS: {
      return Object.assign({}, state, {
        endStop: action.payload.endStop,
      });
    }

    case types.CALCULATE_ROUTE_SUCCESS: {
      return Object.assign({}, state, {
        routePath: action.payload.routePath,
      });
    }

    case types.DRAW_POLYLINES_SUCCESS: {
      return Object.assign({}, state, {
        polylines: action.payload.polylines,
      });
    }

    default: {
      return state;
    }
  }
};

export default map;
