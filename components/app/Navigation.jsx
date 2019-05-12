import { ListItem, Toolbar, Divider, Drawer, Button, FontIcon } from 'react-md';
import React from 'react';

// Constants
import { READ_BOOK } from 'constants/views';

// Components
import OpenWindow from 'components/misc/OpenWindow';

export default class AppNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      drawer: false,
      bookList: false
    };
  }

  /**
   * Handle the 'Book List' item being clicked in Drawer's normal set of
   * `navItems`.
   * @param {Event} e
   */
  onOpenBookList(e) {
    e.stopPropagation(); // prevent drawer from closing
    this.setState({ bookList: true });
  }

  /**
   * Handle the back button within the Drawer's Toolbar being clicked.
   */
  onDrawerBack() {
    if (this.state.bookList) this.setState({ bookList: false });
    else this.setState({ drawer: false });
  }

  /**
   * Return elements for each book list group.
   * @return {JSX.Element[]}
   */
  _renderBookListDrawerNavItems() {
    const { App } = this.props;

    return (
      Array('All', 'Creator')
        // Convert to array of objects
        // Count unique instances within each list group
        .map((_group, i) => {
          const group = {
            name: _group,
            property: _group.toLowerCase(),
            arr: [],
            length: 0
          };

          // Count books for all
          if (i == 0) {
            group.length = App.state.books.length;
            return group;
          }

          App.state.books.forEach(book => {
            const value = book[group.property];
            if (group.arr.indexOf(value) == -1) group.arr.push(value);
          });

          group.length = group.arr.length;
          delete group.arr;

          return group;
        })
        // Only list groups (other than All) that have more than one subgroup
        .filter(group => group.name == 'All' || group.length > 1)
        // Return JSX elements
        .map(group => (
          <a href={'#/books/list/' + group.property} key={group.property}>
            <ListItem primaryText={`${group.name} (${group.length})`} />
          </a>
        ))
    );
  }

  /** @return {JSX.Element[]} */
  _renderNormalDrawerNavItems() {
    return [
      <ListItem
        onClick={e => this.onOpenBookList(e)}
        leftIcon={<FontIcon>book</FontIcon>}
        primaryText="Book List"
      />,
      <a href="#/books/upload">
        <ListItem
          leftIcon={<FontIcon>file_upload</FontIcon>}
          primaryText="Upload Books"
        />
      </a>,
      <a href="#/books/recently-opened">
        <ListItem
          leftIcon={<FontIcon>access_time</FontIcon>}
          primaryText="Recently Opened"
        />
      </a>,

      <Divider />,

      <ListItem
        leftIcon={<FontIcon>settings</FontIcon>}
        primaryText="Settings"
        nestedItems={[
          <a href="#/settings/general">
            <ListItem
              leftIcon={<FontIcon>settings_applications</FontIcon>}
              primaryText="General"
            />
          </a>,
          <a href="#/settings/reader">
            <ListItem
              leftIcon={<FontIcon>book</FontIcon>}
              primaryText="Reader"
            />
          </a>,
          <a href="#/settings/book-list">
            <ListItem
              leftIcon={<FontIcon>list</FontIcon>}
              primaryText="Book List"
            />
          </a>
        ]}
      />
    ];
  }

  render() {
    const { App } = this.props;

    return (
      <React.Fragment>
        <Toolbar
          colored
          fixed
          className={App.state.view == READ_BOOK ? 'hidden' : ''}
          actions={[
            <Button
              icon
              key="search"
              onClick={() => (location.hash = '#/books/list/all')}
              iconChildren="search"
            />,
            <Button
              icon
              key="home"
              onClick={() => (location.hash = '#/books/recently-opened')}
              iconChildren="home"
            />
          ]}
          title="xyReader"
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
          autoclose={true}
          navItems={
            this.state.bookList
              ? this._renderBookListDrawerNavItems()
              : this._renderNormalDrawerNavItems()
          }
          visible={this.state.drawer}
          header={
            <Toolbar
              colored
              nav={
                <Button
                  icon
                  onClick={() => this.onDrawerBack()}
                  iconChildren="arrow_back"
                />
              }
            />
          }
          type={Drawer.DrawerTypes.TEMPORARY}
        />
      </React.Fragment>
    );
  }
}
