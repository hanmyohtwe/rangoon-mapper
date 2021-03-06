import { map as lodashMap } from 'lodash';

import types from '../../constants/ActionTypes';
import { calculateRoute as calculateRouteAction, drawPolylines as drawPolylinesAction, createActions } from '../../utils';

// Begin Action creators
const updateMapCenterActions = createActions([
  types.UPDATE_MAP_CENTER_REQUEST,
  types.UPDATE_MAP_CENTER_SUCCESS,
  types.UPDATE_MAP_CENTER_FAIL,
]);
const loadAdjacencyListActions = createActions([
  types.LOAD_ADJACENCY_LIST_REQUEST,
  types.LOAD_ADJACENCY_LIST_SUCCESS,
  types.LOAD_ADJACENCY_LIST_FAIL,
]);
const loadMapActions = createActions([
  types.LOAD_MAP_REQUEST,
  types.LOAD_MAP_SUCCESS,
  types.LOAD_MAP_FAIL,
]);
const calculateRouteActions = createActions([
  types.CALCULATE_ROUTE_REQUEST,
  types.CALCULATE_ROUTE_SUCCESS,
  types.CALCULATE_ROUTE_ERROR,
]);
const drawPolylinesActions = createActions([
  types.DRAW_POLYLINES_REQUEST,
  types.DRAW_POLYLINES_SUCCESS,
  types.DRAW_POLYLINES_FAIL,
]);
const clearPolylinesActions = createActions([
  types.CLEAR_POLYLINES_REQUEST,
  types.CLEAR_POLYLINES_SUCCESS,
  types.CLEAR_POLYLINES_FAIL,
]);

export const updateMapCenter = () => (dispatch, getState) => {
  const { map } = getState();
  const { google, startStop, endStop, routePath } = map;
  if (routePath.path.length > 1) {
    dispatch(updateMapCenterActions.request(map));
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(startStop);
    routePath.path.forEach(stop => bounds.extend(stop));
    bounds.extend(endStop);
    google.map.fitBounds(bounds);
    if (window.innerWidth >= 768) {
      // google.map.setZoom(google.map.getZoom() - 1);
      google.map.panBy(-200, 0);
    }
    dispatch(updateMapCenterActions.success(map));
  } else {
    dispatch(updateMapCenterActions.success({ ...map, center: routePath.path[0] }));
  }
};

export const clearPolylines = () => (dispatch, getState) => {
  const { map } = getState();
  const { polylines } = map;

  dispatch(clearPolylinesActions.request());
  lodashMap(polylines, (polyline) => {
    polyline.setMap(null);
  });
  dispatch(clearPolylinesActions.success({ polylines: null }));
};

export const drawPolylines = () =>
  (dispatch, getState) => {
    const { map } = getState();
    const { google, startStop, endStop, polylines, routePath } = map;

    if (polylines) {
      dispatch(clearPolylines());
    }

    dispatch(drawPolylinesActions.request());

    drawPolylinesAction(google, routePath, startStop, endStop).then(
      (response) => {
        dispatch(drawPolylinesActions.success({ polylines: response }));
      },
      (error) => {
        dispatch(drawPolylinesActions.fail(error));
      },
    );
  };

export const calculateRoute = (startStop, endStop) =>
  (dispatch, getState) => {
    const { map } = getState();
    const { graph, busStopsMap, polylines } = map;

    if (polylines) {
      dispatch(clearPolylines());
    }

    dispatch(calculateRouteActions.request());

    calculateRouteAction(graph, busStopsMap, startStop, endStop).then(
      (routePath) => {
        dispatch(calculateRouteActions.success({ routePath }));
        dispatch(updateMapCenter());
        dispatch(drawPolylines());
      },
      (error) => {
        dispatch(calculateRouteActions.fail(error));
      },
    );
  };

export const loadMap = google =>
  (dispatch, getState) => {
    const { map } = getState();
    const { startStop, endStop } = map;

    dispatch(loadMapActions.success({ google }));

    if (startStop && endStop) {
      dispatch(calculateRoute(startStop, endStop));
    }
  };

export const loadAdjacencyList = (graph, busStopsMap, busServices) =>
  (dispatch) => {
    dispatch(loadAdjacencyListActions.success({ graph, busStopsMap, busServices }));
  };
