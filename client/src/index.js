import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import colorpicker from 'spectrum-colorpicker'

import './index.css';
import 'spectrum-colorpicker/spectrum.css';




class ColorPicker extends React.Component {

  setDocumentBackgroundColor() {
    document.body.style.backgroundColor = this.props.color;
  }

  componentDidMount() {
    let cp = $("#colorpicker_input");
    cp.spectrum({
      'color': this.props.color,
      'change': this.props.onChange
    });

    this.setDocumentBackgroundColor()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.color != this.props.color) {
      this.setDocumentBackgroundColor();
      let cp = $("#colorpicker_input");
      cp.spectrum("set", this.props.color);
    }
  }

  render() {
    return (
      <div className="color_picker">
        <input id='colorpicker_input' />
        color picker: {this.props.color}
      </div>
    );
  }
}

class EmailComponent extends React.Component {

  render() {
    let email_value = (this.props.email) ? this.props.email : "email@domain.com";

    return (
      <div>
        <input type="text" size="20" value={email_value} onChange={this.props.onChange} />
        <button onClick={this.props.onSaveClick}>Save</button>
        <button onClick={this.props.onLoadClick}>Load</button>
      </div>
    );
  }
}


class ColorEntry extends React.Component {

  componentDidMount() {

  }

  colorSelected(e) {
    // package up the passed-in onClick
    this.props.onClick(e, this.props.color);
  }

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

class ColorList extends React.Component {

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


class ColorDemo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'color': "#ccff66",
      'email': '',
      'color_list': []
    }
  }

  updateColor(color) {
    let color_name = color.toHexString(); // #ff0000
    //console.log('color name: ' + color_name)
    this.setState({ 'color': color_name })
  }

  updateEmail(e) {
    let email_address = e.target.value;
    this.setState({ 'email': email_address });
  }

  getColorList() {
    if (!this.state.email) {
      return this.state.color_list;
    }

    let self = this;

    // uri = '/:email/'
    let uri = "/" + this.state.email;
    fetch(uri, {
      'method': 'GET'
    })
      .then((response) => {
        console.log('returned')
        return response.json();
      })
      .then((json) => {
        console.log(json)
        self.setState({ 'color_list': json })
      })
  }

  addColor() {
    if (!this.state.email) {
      return;
    }

    let self = this;

    let body = [{ 'color': this.state.color }]
    // uri = '/:email/'
    // POST [{color: '#ffffff'}, ...]
    let uri = "/" + this.state.email;
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

  deleteColor() {
    if (!this.state.email) {
      return;
    }
  }

  colorSelected(e, selected_color) {
    console.log(selected_color)
    this.setState({ 'color': selected_color })
  }

  componentWillMount() {
    this.getColorList();
  }

  render() {
    return (
      <div className="color_demo">
        <ColorPicker color={this.state.color} onChange={this.updateColor.bind(this)} />
        <EmailComponent email={this.state.email} onChange={this.updateEmail.bind(this)} onLoadClick={this.getColorList.bind(this)} onSaveClick={this.addColor.bind(this)} />
        <ColorList color_list={this.state.color_list} onColorClick={this.colorSelected.bind(this)} />
        Email: {this.state.email || 'undefined'}<br />
        Color: {this.state.color}<br />
        Color_list: {this.state.color_list}
      </div>
    );
  }
}

// ========================================

ReactDOM.render((
  <ColorDemo />
), document.getElementById('root')
);