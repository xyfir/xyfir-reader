import 'styles/app.scss';

import localForage from 'localforage';
import { render } from 'react-dom';
import React from 'react';

// Components
import Navigation from 'components/app/Navigation';
import Settings from 'components/settings/Settings';
import Loading from 'components/app/Loading';
import Books from 'components/books/Books';
import Alert from 'components/app/Alert';

// Modules
import updateView from 'lib/url/update-view';
import store from 'lib/store';

// Constants
import { INITIALIZE_STATE } from 'constants/actions/app';
import { LOG_STATE } from 'constants/config';
import { READ_BOOK } from 'constants/views';
import initialState from 'constants/initial-state';

// Actions
import { save } from 'actions/app';

// Globals
window.localforage = localForage;

localforage.config({
  driver: [localforage.INDEXEDDB, localforage.WEBSQL],
  name: 'xyReader'
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this._alert = this._alert.bind(this);

    store.subscribe(state => {
      this.setState(state);

      if (LOG_STATE) console.log(state);

      if (state.save.length) {
        state.save.forEach(s => localforage.setItem(s, state[s]));
        store.dispatch(save([]));
      }
    });

    // Update state.view when url hash changes
    // Update state according to url hash
    window.onhashchange = () => updateView(store);

    setTimeout(() => this._loadAd(), 120000);
  }

  async componentWillMount() {
    const state = Object.assign({}, initialState);

    // Pull data from local storage
    state.loading = false;
    state.config = (await localforage.getItem('config')) || state.config;
    state.books = (await localforage.getItem('books')) || state.books;

    // Set theme
    document.body.className = 'theme-' + state.config.general.theme;

    // Push initial state to store
    store.dispatch({ type: INITIALIZE_STATE, state });

    // Set state.view based on current url hash
    updateView(store);
  }

  /**
   * Creates a 'toast' for react-md Snackbar component.
   * @param {string} text
   * @param {string|object} [action=close]
   * @param {boolean} [autohide=true]
   */
  _alert(text, action = 'close', autohide = true) {
    this._Alert._alert(text, action, autohide);
  }

  dispatch(action) {
    return store.dispatch(action);
  }

  render() {
    if (!this.state || this.state.loading) return <Loading />;

    const view = (() => {
      const props = {
        App: this, // eventually replace other props with this
        data: this.state,
        dispatch: store.dispatch,
        alert: this._alert
      };

      switch (this.state.view.split('/')[0]) {
        case 'SETTINGS':
          return <Settings {...props} />;
        case 'BOOKS':
          return <Books {...props} />;
      }
    })();

    return (
      <div className="xyfir-books">
        <Navigation App={this} />

        <div
          className={`main ${
            this.state.view != READ_BOOK ? 'md-toolbar-relative' : ''
          }`}
        >
          {view}
        </div>

        <Alert ref={i => (this._Alert = i)} />
      </div>
    );
  }
}

render(<App />, document.getElementById('content'));
