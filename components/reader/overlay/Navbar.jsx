import { ListItem, Toolbar, Button, Drawer, FontIcon } from 'react-md';
import React from 'react';

export default class ReaderNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { drawer: false };

    this._isBookmarked = this._isBookmarked.bind(this);
  }

  /**
   * Go to the previous CFI in the history.
   * @todo For some reason this needs to be called twice to work.
   */
  onGoBack() {
    const { Reader } = this.props;
    const history = Object.assign({}, Reader.state.history);

    if (history.items.length && history.index) {
      if (history.index == -1) history.index = history.items.length - 1;
      else history.index--;

      Reader.setState({ history });
      Reader.book.rendition.display(history.items[history.index]);
    }
  }

  /** Create or remove a bookmark. */
  onBookmark() {
    const { Reader } = this.props;
    const { cfi } = Reader.book.rendition.location.start;

    Reader._updateBook({
      bookmarks: this._isBookmarked()
        ? Reader.state.book.bookmarks.filter(b => cfi != b.cfi)
        : Reader.state.book.bookmarks.concat([{ cfi, created: Date.now() }])
    });
  }

  /**
   * Check if the books's current CFI is bookmarked
   * @return {boolean}
   */
  _isBookmarked() {
    const { Reader } = this.props;
    const cfi = Reader.book.rendition.location.start.cfi;

    return Reader.state.book.bookmarks.findIndex(b => cfi == b.cfi) > -1;
  }

  render() {
    const { Reader } = this.props;

    return (
      <div className="toolbar">
        <Toolbar
          colored
          fixed
          className={!this.props.show ? 'hide' : ''}
          actions={[
            <Button
              icon
              onClick={() => this.onGoBack()}
              iconChildren="chevron_left"
            />,

            <Button
              icon
              key="bookmark"
              onClick={() => this.onBookmark()}
              iconChildren={
                this._isBookmarked() ? 'bookmark' : 'bookmark_border'
              }
            />,

            <Button
              icon
              key="home"
              onClick={() => (location.hash = '#/books/recently-opened')}
              iconChildren="home"
            />
          ]}
          nav={
            <Button
              icon
              onClick={() => this.setState({ drawer: true })}
              iconChildren="menu"
            />
          }
        />

        <Drawer
          onVisibilityChange={v => this.setState({ drawer: v })}
          overlayClassName="reader-drawer-overlay"
          autoclose={true}
          navItems={[
            <ListItem
              primaryText="Settings"
              leftIcon={<FontIcon>settings</FontIcon>}
              onClick={() => (location.hash = '#/settings/reader')}
            />,
            <ListItem
              primaryText="Table of Contents"
              leftIcon={<FontIcon>book</FontIcon>}
              onClick={() => Reader.onToggleShow('toc')}
            />,
            <ListItem
              primaryText="Search"
              leftIcon={<FontIcon>search</FontIcon>}
              onClick={() => Reader.onToggleShow('search')}
            />,
            <ListItem
              primaryText="Book Styling"
              leftIcon={<FontIcon>style</FontIcon>}
              onClick={() => Reader.onToggleShow('bookStyling')}
            />,
            <ListItem
              primaryText="Filters"
              leftIcon={<FontIcon>filter</FontIcon>}
              onClick={() => Reader.onToggleShow('filters')}
            />,
            <ListItem
              primaryText="View Bookmarks"
              leftIcon={<FontIcon>bookmark</FontIcon>}
              onClick={() => Reader.onToggleShow('bookmarks')}
            />,
            <ListItem
              primaryText="Manage Annotations"
              leftIcon={<FontIcon>speaker_notes</FontIcon>}
              onClick={() => Reader.onToggleShow('manageAnnotations')}
            />,
            <ListItem
              onClick={e => !e.stopPropagation() && Reader.onSetHighlightMode()}
              leftIcon={<FontIcon>highlight</FontIcon>}
              primaryText="Set Highlight Mode"
              secondaryText={Reader.state.highlight.message}
            />
          ]}
          visible={this.state.drawer}
          header={
            <Toolbar
              colored
              nav={
                <Button
                  icon
                  onClick={() => this.setState({ drawer: false })}
                  iconChildren="arrow_back"
                />
              }
            />
          }
          type={Drawer.DrawerTypes.TEMPORARY}
        />
      </div>
    );
  }
}
