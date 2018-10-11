import { FontIcon } from 'react-md';
import React from 'react';

// Modules
import loadCovers from 'lib/books/load-covers';
import sortBooks from 'lib/books/sort';

export default class RecentlyOpened extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    loadCovers();
  }

  componentDidUpdate() {
    loadCovers();
  }

  render() {
    const { App } = this.props;

    return (
      <ul className="recently-opened books">
        {sortBooks(App.state.books, 'last_read', true)
          .slice(-4)
          .reverse()
          .map(b => {
            return (
              <li className="book" key={b.id}>
                <a href={`#/books/read/${b.id}`}>
                  <img className="cover" id={`cover-${b.id}`} />
                </a>

                <div className="info">
                  <a className="title" href={`#/books/read/${b.id}`}>
                    {b.title}
                  </a>

                  <a
                    className="creator"
                    href={`#/books/list/all?search=1&creator=${encodeURIComponent(
                      b.creator
                    )}`}
                  >
                    {b.creator}
                  </a>

                  <div className="chips">
                    <span className="chip percent-complete">{b.percent}%</span>

                    {b.words > 0 ? (
                      <span className="chip word-count">
                        {Math.round(b.words / 1000)}K
                      </span>
                    ) : null}
                  </div>

                  <span className="last-read">
                    {b.last_read > 0
                      ? 'Last read on ' +
                        new Date(b.last_read).toLocaleDateString()
                      : 'Book has not been read'}
                  </span>
                </div>
              </li>
            );
          })}
      </ul>
    );
  }
}
