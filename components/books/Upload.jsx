import { FileUpload } from 'react-md';
import { loadBooks } from 'actions/books';
import React from 'react';
import EPUB from 'epubjs';

export default class UploadBooks extends React.Component {
  constructor(props) {
    super(props);
  }

  /** @param {File} file */
  async onUpload(file) {
    const { App } = this.props;

    try {
      const id = Date.now();
      await localforage.setItem(`epub-${id}`, file);

      // Extract cover and metadata
      const books = this.props.App.state.books;
      const book = new EPUB(file, {});
      await book.ready;

      window.book = book;
      await localforage.setItem(
        `cover-${id}`,
        await book.archive.zip.files[book.package.coverPath].async('blob')
      );
      books.push(book.package.metadata);
      await localforage.setItem('books', books);
      this.props.App.dispatch(loadBooks(books));

      App._alert('Book(s) uploaded successfully');
    } catch (err) {
      App._alert(err.toString());
      this.setState({ uploading: false });
    }
  }

  render() {
    return (
      <section className="upload-books">
        <p>Only EPUB books are supported.</p>

        <FileUpload
          primary
          raised
          id="file-upload"
          name="file-upload"
          label="Select Book"
          onLoad={f => this.onUpload(f)}
        />
      </section>
    );
  }
}
