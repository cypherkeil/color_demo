import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import colorpicker from 'spectrum-colorpicker'

import './index.css';
import 'spectrum-colorpicker/spectrum.css';

/**
 * Implements a color picker which also sets background color.
 * 
 * @param String color: The color to show.
 * @param function onChange: an onChange callback for the colorpicker.
 */
class ColorPicker extends React.Component {

  /**
   * Sets the background color of the document by css to match our color.
   */
  setDocumentBackgroundColor() {
    document.body.style.backgroundColor = this.props.color;
  }

  /**
   * Lifecycle method.
   * 
   * Uses jQuery to initialize the colorpicker. Sets the document background to match.
   */
  componentDidMount() {
    let cp = $("#colorpicker_input");
    cp.spectrum({
      'color': this.props.color,
      'change': this.props.onChange
    });

    this.setDocumentBackgroundColor()
  }

  /**
   * Lifecycle.
   * 
   * If our color property changed, update the color in the colorpicker and document background.
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.color !== this.props.color) {
      this.setDocumentBackgroundColor();
      let cp = $("#colorpicker_input");
      cp.spectrum("set", this.props.color);
    }
  }

  /**
   * Lifecycle.
   * 
   * Creates element for the colorpicker.
   */
  render() {
    return (
      <div className="color_picker">
        <input id='colorpicker_input' />
        <span className="color_picker_label">
          color: {this.props.color}
        </span>
      </div>
    );
  }
}

/**
 * Small component that displays an input for a collection, with 'Save' and 'Load' options to
 * allow saving colors to or loading colors from that collection.
 * 
 * @param String collection_name The collection name, undefined for not set.
 * @param onChange function onChange function for when the name is updated.
 * @param onSaveClick function onClick function for when the 'Save' button is clicked.
 * @param onLoadClick function onClick function for when the 'Load' button is clicked.
 */
class CollectionNameComponent extends React.Component {

  /**
   * Lifecycle.
   * 
   * Sets up collection_name input, 'Save', 'Load' buttons.
   */
  render() {
    let collection_name_value = (this.props.collection_name) ? this.props.collection_name : "collection name";

    return (
      <div>
        <input type="text" size="20" value={collection_name_value} onChange={this.props.onChange} />
        <button onClick={this.props.onSaveClick}>Save</button>
        <button onClick={this.props.onLoadClick}>Load</button>
      </div>
    );
  }
}

/**
 * Represents a saved color in a ColorList.
 * 
 * @param color String the color being represented.
 * @param onClick function an onClick function for when the ColorEntry is clicked.
 */
class ColorEntry extends React.Component {

  /**
   * Package up the passed-in onClick handler to pass in our color, also.
   * 
   * @param event e the event object given to the handler.
   */
  colorSelected(e) {
    // package up the passed-in onClick
    this.props.onClick(e, this.props.color);
  }

  /**
   * Lifecycle.
   * 
   * Sets up an outer div, with a label and a thumbnail inner divs.
   */
  render() {
    let thumb_style = { 'backgroundColor': this.props.color };

    return (
      <div className="color_entry" onClick={this.colorSelected.bind(this)}>
        <div className="color_entry_thumb" style={thumb_style}></div>
        <div className="color_entry_label">
          {this.props.color}
        </div>
      </div>
    );
  }

}

/**
 * Displays a list of saved colors.
 * 
 * @param Array color_list A list of colors, as strings. ("#ccddee")
 * @param function onColorClick A callback function for when a specific ColorEntry is clicked.
 */
class ColorList extends React.Component {

  /**
   * Lifecycle.
   * 
   * Generates a list of ColorEntries for our color_list.
   */
  render() {

    let color_entries = this.props.color_list.map((ele, i) => {
      return (
        <ColorEntry key={ele} color={ele} onClick={this.props.onColorClick} />
      )
    });

    return (
      <div className="color_list">
        {color_entries}
      </div>
    );
  }
}


/**
 * Puts together the entire colorpicker demo.
 */
class ColorDemo extends React.Component {

  /**
   * Lifecycle.
   * 
   * @param Object props the properties passed to this component
   */
  constructor(props) {
    super(props);
    this.state = {
      // The currently selected color
      'color': "#ccff66",
      // The collection name that is set (empty for not set)
      'collection_name': '',
      // The list of saved colors associated with the collection name if loaded.
      'color_list': []
    }
  }

  /**
   * Callback for when the colorpicker has changed.
   * 
   * @param color color See spectrum.colorpicker docs.
   * @return None calls self.setState().
   */
  updateColor(color) {
    let color_name = color.toHexString(); // #ff0000
    //console.log('color name: ' + color_name)
    this.setState({ 'color': color_name })
  }

  /**
   * Callback for when the collectionname has changed.
   * 
   * @param event e The event object passed to the handler.
   * @return None calls self.setState().
   */
  updateCollectionName(e) {
    let collection_name = e.target.value;
    this.setState({ 'collection_name': collection_name });
  }

  /**
   * If there is a valid collection name set, query the API to receive the colors saved for that collection.
   * 
   * @return None calls self.setState().
   */
  getColorList() {
    if (!this.state.collection_name) {
      return this.state.color_list;
    }

    let self = this;

    // uri = '/:collection_name/'
    let uri = "/" + this.state.collection_name;
    fetch(uri, {
      'method': 'GET'
    })
      .then((response) => {
        console.log('returned')
        return response.json();
      })
      .then((json) => {
        console.log(json)
        // get back a list of color objects, just make a flat list
        let color_list = json.map((ele, i) => {
          return ele["color"];
        })
        self.setState({ 'color_list': color_list })
      })
  }

  /**
   * If there is a valid collection name set, save the active color to the collection via the API.
   * 
   * @return None Calls this.getColorList() when finished.
   */
  addColor() {
    if (!this.state.collection_name) {
      return;
    }

    let self = this;

    let body = [this.state.color]
    // uri = '/:collection_name/'
    // POST [{color: '#ffffff'}, ...]
    let uri = "/" + this.state.collection_name;
    fetch(uri, {
      'method': 'POST',
      'headers': {
        "Content-Type": "application/json; charset=utf-8",
      },
      'body': JSON.stringify(body)
    })
      .then((response) => {
        console.log('returned')
        self.getColorList();
      })
  }

  /**
   * If there is a valid collection name set, delete the currently selected color.
   * 
   * Not implemented yet.
   */
  deleteColor() {
    if (!this.state.collection_name) {
      return;
    }
  }

  /**
   * Callback for when a saved color (ColorEntry) in the color list is clicked.
   * 
   * @param event e the event object passed to the handler.
   * @param String selected_color the new color selected in the colorpicker.
   * 
   * @return None calls self.setState().
   */
  colorSelected(e, selected_color) {
    console.log(selected_color)
    this.setState({ 'color': selected_color })
  }

  /**
   * Lifecycle.
   * 
   * Updates the color list on loading.
   */
  componentWillMount() {
    this.getColorList();
  }

  /**
   * Lifecycle.
   * 
   * Puts together the ColorPicker, CollectionNameComponent, and ColorList components.
   */
  render() {
    return (
      <div className="color_demo">
        <ColorPicker color={this.state.color} onChange={this.updateColor.bind(this)} />
        <CollectionNameComponent collection_name={this.state.collection_name} onChange={this.updateCollectionName.bind(this)} onLoadClick={this.getColorList.bind(this)} onSaveClick={this.addColor.bind(this)} />
        <ColorList color_list={this.state.color_list} onColorClick={this.colorSelected.bind(this)} />
      </div>
    );
  }
}

// ========================================

ReactDOM.render((
  <ColorDemo />
), document.getElementById('root')
);