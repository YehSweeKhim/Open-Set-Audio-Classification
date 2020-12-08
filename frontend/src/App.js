import React from "react";
import "./App.css";
import axios from "axios";
import ReactAudioPlayer from "react-audio-player";

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
    this.audio = new Audio("sounds/beep.wav");
    this.audio.load();
    // this.playAudio();
  };

  start = () => {
    if (this.audio !== undefined) {
      const audioPromise = this.audio.play();
      if (audioPromise !== undefined) {
        audioPromise
          .then((_) => {
            // autoplay started
          })
          .catch((err) => {
            // catch dom exception
            console.info(err);
          });
      }
    }
  };

  onClickHandler = () => {
    const data = new FormData();
    this.setState({
      closedClass: "Loading...",
      openClass: "Loading...",
    });
    data.append("audio_file", this.state.selectedFile);
    axios
      .post("http://localhost:5000/predict", data)
      .then((res) => {
        this.setState({
          closedClass: res.data,
        });
      })
      .catch((err) => {
        this.setState({
          closedClass: "error",
        });
      });
    axios
      .post("http://localhost:5000/predict_mod", data)
      .then((res) => {
        this.setState({
          openClass: res.data,
        });
      })
      .catch((err) => {
        this.setState({
          openClass: "error",
        });
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
    } else return;
  };

  results = () => {
    if (
      this.state.openClass === "error" ||
      this.state.closedClass === "error"
    ) {
      return (
        <div>
          <h4>Please select a .wav file</h4>
        </div>
      );
    } else if (this.state.openClass || this.state.closedClass) {
      return (
        <div>
          <h4>Closed Classifier Class: {this.state.closedClass}</h4>
          <h4>Open Classifier Class: {this.state.openClass}</h4>
        </div>
      );
    } else return;
  };

  render() {
    return (
      <div className="App">
        <h1 className="Header">Closed vs Open Set Audio Classification</h1>
        <p className="Description">
          Traditional classifiers are trained to solve the closed set problem,
          where they are able to distinguish between data from the different
          classes that they are trained on. However, one limitation is that when
          given data that does not belong to any of the classes it knows, it
          will still produce a classification, which would be wrong! This is
          known as the open set problem, and classifiers trained to solve this
          should be able to tell the difference between data that belongs to a
          class it has seen before, and those that don't. Check out the demo
          below to see the difference!
        </p>

        <div id="Display" className="Row">
          <div className="Col">
            <h4 className="Classes">Known classes:</h4>
            <ul>
              <li>Air Conditioner</li>
              <li>Car Horn</li>
              <li>Children Playing</li>
              <li>Dog Bark</li>
              <li>Drilling</li>
            </ul>
          </div>
          <div id="Insert" className="Col">
            <div className="row">
              <h4 className="col">Pick an audio file!☺️</h4>
              {/* <ReactAudioPlayer src={this.state.selectedFile} autoPlay controls /> */}
              {/* <button className="col" onClick={this.start}>Play</button> */}
            </div>
            <div className="row">
              <input
                className="File"
                type="file"
                name="file"
                onChange={this.onChangeHandler}
              />
              <button className="Classify" onClick={this.onClickHandler}>
                Classify!
              </button>
            </div>
            {this.fileData()}
          </div>
        </div>
        <div className="Result">
          <h2>OUR PREDICTION:</h2>
          {this.results()}</div>
      </div>
    );
  }
}

export default App;
