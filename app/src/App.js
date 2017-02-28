import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import graph from '../../experiment/adjancencyList.json';
import busStopsMap from '../../experiment/stops_map.json';
import busServices from '../../experiment/bus_services.json';
import { loadAdjacencyList } from './actions/map';
import './styles/main.scss';
// import { distance } from './utils';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {
  componentWillMount() {
    this.props.loadAdjacencyList();
  }
  render() {
    return (
      <MuiThemeProvider>
        <div className="container-fluid">
          <Helmet
            meta={[
              { property: 'og:description', content: 'The ultimate transport app for Yangon' },
              { name: 'description', content: 'The ultimate transport app for Yangon' },
            ]}
          />
          <div className="row">
            <aside className="col-sm-12 col-md-3 sidebar">
              {this.props.sidebar}
            </aside>
            <main className="col-sm-12 map">
              {this.props.main}
            </main>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.defaultProps = {
  sidebar: null,
};

App.propTypes = {
  main: React.PropTypes.element.isRequired,
  sidebar: React.PropTypes.element,
  loadAdjacencyList: React.PropTypes.func.isRequired,
};


const mapDispatchToProps = dispatch => ({
  loadAdjacencyList: () => dispatch(loadAdjacencyList(graph, busStopsMap, busServices)),
});

const mapStateToProps = () => ({

});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
