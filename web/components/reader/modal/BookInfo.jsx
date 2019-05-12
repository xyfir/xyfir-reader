import moment from 'moment';
import React from 'react';

// Components
import Navigation from 'components/reader/modal/Navigation';

export default class BookInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { book } = this.props.Reader.state;

    return (
      <section className="book-info">
        <Navigation {...this.props} title="Book Info" />

        <table>
          <tbody>
            <tr>
              <th>Title</th>
              <td>{book.title}</td>
            </tr>

            <tr>
              <th>Creator(s)</th>
              <td>{book.creator}</td>
            </tr>

            <tr>
              <th>Publisher</th>
              <td>{book.publisher}</td>
            </tr>

            <tr>
              <th>Published</th>
              <td>{(book.pubdate || '').split('T')[0]}</td>
            </tr>

            <tr>
              <th>Added</th>
              <td>{moment(book.id).format('YYYY-MM-DD')}</td>
            </tr>
          </tbody>
        </table>

        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: book.descriptions }}
        />
      </section>
    );
  }
}
