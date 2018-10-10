import { Button } from 'react-md';
import Dropzone from 'react-dropzone';
import React from 'react';

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
      if (this.state.uploading) return;
      else this.setState({ uploading: true });

      this.setState({ uploading: false });
      App._alert('Book(s) uploaded successfully');
      // ** save book
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
