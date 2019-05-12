import React from 'react';

// Components
import RecentlyOpened from 'components/books/RecentlyOpened';
import Upload from 'components/books/Upload';
import Reader from 'components/reader/Reader';
import List from 'components/books/list/List';

export default class Books extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    switch (this.props.data.view.split('/')[1]) {
      case 'RECENTLY_OPENED':
        return <RecentlyOpened {...this.props} />;
      case 'UPLOAD':
        return <Upload {...this.props} />;
      case 'LIST':
        return <List {...this.props} />;
      case 'READ':
        return <Reader {...this.props} />;
    }
  }
}
