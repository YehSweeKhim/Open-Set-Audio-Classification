import React from "react";
import "./App.css";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
    };
  }

  onChangeHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    });
  };

  onClickHandler = () => {
    const data = new FormData();
    data.append("audio_file", this.state.selectedFile);
    axios.post("http://localhost:5000/predict_mod", data).then((res) => {
      console.log(res);
      console.log(res.statusText);
    });
  };

  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h4>File Details:</h4>
          <p id="text">File Name: {this.state.selectedFile.name}</p>
          <p id="text">File Type: {this.state.selectedFile.type}</p>
          <p id="text">
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h5>Choose before Pressing the Upload button</h5>
        </div>
      );
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Open Set Audio Classification Problem</h2>
          <input type="file" name="file" onChange={this.onChangeHandler} />
          <button
            type="button"
            className="btn btn-success btn-block"
            onClick={this.onClickHandler}
          >
            Upload
          </button>
        </header>
        <div>{this.fileData()}</div>
      </div>
    );
  }
}

export default App;
