import { Button } from 'react-md';
import Dropzone from 'react-dropzone';
import React from 'react';

// Constants
import { XYLIBRARY_URL } from 'constants/config';

export default class UploadBooks extends React.Component {
  constructor(props) {
    super(props);

    this.state = { uploading: false };
  }

  /**
   * Validate and attempt to upload books.
   * @param {File[]} files
   */
  onUpload(files) {
    const { App } = this.props;

    try {
      if (!navigator.onLine) throw 'This action requires internet connectivity';

      if (this.state.uploading) return;
      else this.setState({ uploading: true });

      // Determine space needed on storage server
      const bytes = files.reduce((a, f) => a + f.size);

      if (bytes > 500000001 || files.length > 20)
        throw 'Limit 20 files and 500mb total';

      // Upload files
      const req = request.post(
        `${XYLIBRARY_URL}/libraries/${App.state.account.library}/books`
      );

      files.forEach(file => req.attach('book', file));

      req.end((err, res) => {
        this.setState({ uploading: false });

        if (err || res.body.error) {
          console.error('<UploadBooks>', err, '-', res);
          return App._alert('Could not upload file(s)');
        }

        App._alert('Book(s) uploaded successfully');

        // ** save book
      });
    } catch (err) {
      App._alert(err.toString());
      this.setState({ uploading: false });
    }
  }

  render() {
    return (
      <Dropzone
        ref={i => (this._dropzone = i)}
        onDrop={f => this.onUpload(f)}
        disabled={this.state.uploading}
        className="dropzone upload-books"
        disableClick={true}
      >
        <p className="status">
          {this.state.uploading
            ? 'Uploading file(s), please wait...'
            : 'Drag and drop ebooks or use button to select files for upload'}
        </p>

        <p>
          Upload ebooks to your library. Metadata (title, authors, etc) will
          automatically be extracted from the ebook files. Each book's metadata
          can be viewed and modified after upload.
        </p>
        <p>Only EPUB books can be read.</p>

        <Button
          primary
          raised
          iconChildren="file_upload"
          onClick={() => this._dropzone.open()}
        >
          Select Files
        </Button>
      </Dropzone>
    );
  }
}
