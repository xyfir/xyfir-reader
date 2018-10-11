import { SelectField, TextField, Button, Paper } from 'react-md';
import React from 'react';

// Constants
import { FONTS, ALIGNMENTS } from 'constants/reader/styles';
import initialState from 'constants/initial-state';
import * as themes from 'constants/reader/themes';

// Action creators
import { setReader, setGeneral } from 'actions/settings';
import { save } from 'actions/app';

// Components
import ColorPicker from 'components/misc/ColorPicker';
import OpenWindow from 'components/misc/OpenWindow';

// Modules
import query from 'lib/url/parse-query-string';

const BackgroundColorExample = ({ styles, backgroundColor }) => (
  <span
    style={{
      color: styles.color,
      fontSize: styles.fontSize + 'em',
      fontFamily: styles.fontFamily,
      backgroundColor: styles.backgroundColor
    }}
    className="example background-color"
  >
    Example. <span style={{ backgroundColor }}>Highlight.</span> Example.
  </span>
);

export default class ReaderSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.props.App.state.config.reader;
  }

  componentDidMount() {
    const q = query();

    if (q.subscriptionKey && +q.subscriptionKey != 0) {
      this._annotationsKey.getField().value = q.subscriptionKey;
      this.onSaveKey();
    }
  }

  /** @param {string} theme */
  onSetTheme(theme) {
    this._theme = theme.toLowerCase();
    this.setState(themes[theme.toUpperCase()]);
  }

  onSave() {
    const { App } = this.props;

    App.store.dispatch(setReader(this.state));

    if (App.state.config.general.matchThemes && this._theme) {
      document.body.className = `theme-${this._theme}`;
      App.store.dispatch(setGeneral({ theme: this._theme, matchThemes: true }));
    }

    App.store.dispatch(save(['config']));
    App._alert('Settings saved successfully');
  }

  onResetStyles() {
    this.setState(initialState.config.reader);
  }

  render() {
    return (
      <Paper
        zDepth={1}
        component="section"
        className="reader-settings theme section flex"
      >
        <h3>Styling</h3>

        <SelectField
          id="select--theme"
          label="Reader Theme"
          onChange={v => this.onSetTheme(v)}
          menuItems={['Light', 'Dark']}
          className="md-cell"
        />

        <br />
        <br />

        <SelectField
          id="select--font"
          label="Font"
          value={this.state.fontFamily}
          onChange={v => this.setState({ fontFamily: v })}
          menuItems={FONTS}
          className="md-cell"
        />

        <SelectField
          id="select--text-align"
          label="Alignment"
          value={this.state.textAlign}
          onChange={v => this.setState({ textAlign: v })}
          menuItems={ALIGNMENTS}
          className="md-cell"
        />

        <TextField
          id="number--font-size"
          min={0.1}
          step={0.1}
          type="number"
          label="Font Size"
          value={this.state.fontSize}
          onChange={v => this.setState({ fontSize: +v })}
          className="md-cell"
        />

        <TextField
          id="number--text-indent"
          min={0}
          step={0.1}
          type="number"
          label="Indentation"
          value={this.state.textIndent}
          onChange={v => this.setState({ textIndent: +v })}
          className="md-cell"
        />

        <TextField
          id="number--line-spacing"
          min={1}
          step={0.1}
          type="number"
          label="Line Spacing"
          value={this.state.lineHeight}
          onChange={v => this.setState({ lineHeight: +v })}
          className="md-cell"
        />

        <span
          className="example text"
          style={{
            color: this.state.color,
            fontSize: this.state.fontSize + 'em',
            textAlign: this.state.textAlign,
            fontFamily: this.state.fontFamily,
            lineHeight: this.state.lineHeight + 'em',
            textIndent: this.state.textIndent + 'em',
            backgroundColor: this.state.backgroundColor
          }}
        >
          Example text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Etiam viverra est at lacus convallis, at ullamcorper nisi pretium.
          Praesent ullamcorper felis eu mi egestas, at gravida nibh cursus. Nunc
          rutrum, ante eget malesuada efficitur, nisl massa bibendum arcu, ac
          condimentum urna ex in est. Sed ipsum dolor, pretium eu egestas at,
          tempor eget dolor. Fusce vehicula, ante quis vestibulum viverra,
          tellus nisi vestibulum leo, vel lobortis libero purus at ipsum. In id
          enim vitae felis mollis tempor. Duis egestas vitae arcu vitae egestas.
          Nunc ultricies felis lacus, ut suscipit mauris iaculis vitae.
        </span>

        <br />

        <ColorPicker
          id="font-color"
          label="Font Color"
          value={this.state.color}
          onChange={v => this.setState({ color: v })}
        />

        <ColorPicker
          id="background-color"
          label="Background Color"
          value={this.state.backgroundColor}
          onChange={v => this.setState({ backgroundColor: v })}
        />

        <br />
        <br />

        <ColorPicker
          id="highlight-color"
          label="Highlight Color"
          value={this.state.highlightColor}
          onChange={v => this.setState({ highlightColor: v })}
        />

        <BackgroundColorExample
          styles={this.state}
          backgroundColor={this.state.highlightColor}
        />

        <br />

        <ColorPicker
          id="-color"
          label="Search Match Color"
          value={this.state.searchMatchColor}
          onChange={v => this.setState({ searchMatchColor: v })}
        />

        <BackgroundColorExample
          styles={this.state}
          backgroundColor={this.state.searchMatchColor}
        />

        <br />

        <ColorPicker
          id="annotation-color"
          label="Annotation Color"
          value={this.state.annotationColor}
          onChange={v => this.setState({ annotationColor: v })}
        />

        <BackgroundColorExample
          styles={this.state}
          backgroundColor={this.state.annotationColor}
        />

        <br />

        <SelectField
          id="select--default-highlight-mode"
          label="Default Highlight Mode"
          onChange={v => this.setState({ defaultHighlightMode: v })}
          menuItems={[
            { label: 'None', value: 'none' },
            { label: 'Annotations', value: 'annotations' }
          ]}
          className="md-cell"
          defaultValue="none"
        />

        <h3>xyAnnotations</h3>
        <p>
          A xyAnnotations subscription allows you to find and download
          annotations for books that you're reading.
          <br />
          xyAnnotations subscriptions can be purchased directly through{' '}
          <OpenWindow href="https://annotations.xyfir.com/">
            xyAnnotations
          </OpenWindow>
          , or through certain other reader applications that support
          xyAnnotations.
        </p>

        <TextField
          id="text--xyannotations-key"
          type="text"
          label="Subscription Key"
          value={this.state.xyAnnotationsKey}
          onChange={v => this.setState({ xyAnnotationsKey: v })}
          className="md-cell"
        />

        <div>
          <Button
            primary
            raised
            iconChildren="save"
            onClick={() => this.onSave()}
          >
            Save
          </Button>

          <Button
            secondary
            raised
            iconChildren="clear"
            onClick={() => this.onResetStyles()}
          >
            Reset
          </Button>
        </div>
      </Paper>
    );
  }
}
