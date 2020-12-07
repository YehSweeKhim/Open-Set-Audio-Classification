import React from "react";
import "./App.css";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      closedClass: null,
      openClass: null,
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
    this.setState({
      closedClass: "Loading...",
      openClass: "Loading..."
    })
    data.append("audio_file", this.state.selectedFile);
    axios.post("http://localhost:5000/predict", data).then((res) => {
      this.setState({
        closedClass: res.data
      })
    }).catch((err) => {
      this.setState({
        closedClass: "error"
      })
    });
    axios.post("http://localhost:5000/predict_mod", data).then((res) => {
      this.setState({
        openClass: res.data
      })
    }).catch((err) => {
      this.setState({
        openClass: "error"
      })
    });
  };

  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h4 className="Zero">File Details:</h4>
          <p id="text">File Name: {this.state.selectedFile.name}</p>
          <p id="text">File Type: {this.state.selectedFile.type}</p>
          <p id="text">
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    } else return
  };

  results = () => {
    if (this.state.openClass === "error" || this.state.closedClass === "error") {
      return (
        <div>
          <h4>Please select a .wav file</h4>
        </div>
      )
    } else if (this.state.openClass || this.state.closedClass) {
      return (
        <div>
          <h4>Closed Classifier Class: {this.state.closedClass}</h4>
          <h4>Open Classifier Class: {this.state.openClass}</h4>
        </div>
      )
    } else return
  }

  render() {
    return (
      <div className="App">
        <h1 className="Zero">Closed vs Open Set Audio Classification</h1>
        <p className="Description">Traditional classifiers are trained to solve the closed set problem, where they are able to distinguish between data from the different classes that they are trained on. However, one limitation is that when given data that does not belong to any of the classes it knows, it will still produce a classification, which would be wrong! This is known as the open set problem, and classifiers trained to solve this should be able to tell the difference between data that belongs to a class it has seen before, and those that don't. Check out the demo below to see the difference!</p>
        <h4 className="Zero">Available classes</h4>
        <ul>
          <li>Air Conditioner</li>
          <li>Car Horn</li>
          <li>Children Playing</li>
          <li>Dog Bark</li>
          <li>Drilling</li>
        </ul>
        <div className="Row">
          <input type="file" name="file" onChange={this.onChangeHandler} />
          {this.fileData()}
          <button
            onClick={this.onClickHandler}
          >
            Classify!
          </button>
        </div>
        {this.results()}
      </div>
    );
  }
}

export default App;
