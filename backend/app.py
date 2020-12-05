from flask import Flask, request
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import requests
import json

from generate_numpy_spectrograms import generate_spec

from extract_features import generate_embedding

import os

app = Flask(__name__)
CORS(app)

class_mapping = {0: "Air Conditioner", 1: "Car Horn",
                 2: "Children Player", 3: "Dog Bark", 4: "Drilling", 5: "Unknown"}


@app.route('/')
def index():
    return "DISLIKE enyi"


@app.route('/predict', methods=['POST'])
def predict():
    if "audio_file" not in request.files:
        return "Please attach a file", 400
    audio_file = request.files["audio_file"]
    if audio_file.mimetype != "audio/wav":
        return "Please ensure you upload a .wav file", 400
    audio_file.save("temp_file.wav")

    spec = generate_spec("temp_file.wav").transpose()
    spec = np.array([spec])

    data = json.dumps({"signature_name": "serving_default", "instances": spec.tolist()})
    headers = {"content-type": "application/json"}
    json_response = requests.post('http://localhost:8501/v1/models/basemodel/versions/1:predict', data=data, headers=headers)
    predictions = json.loads(json_response.text)['predictions']
    return class_mapping[np.argmax(predictions[0])]


@app.route('/predict_mod', methods=['POST'])
def predict_mod():
    if "audio_file" not in request.files:
        return "Please attach a file", 400
    audio_file = request.files["audio_file"]
    if audio_file.mimetype != "audio/wav":
        return "Please ensure you upload a .wav file", 400
    audio_file.save("temp_file.wav")

    embedding = generate_embedding("temp_file.wav")/255

    probabilities = []
    for i in range(5):
        data = json.dumps({"signature_name": "serving_default", "instances": embedding.tolist()})
        headers = {"content-type": "application/json"}
        json_response = requests.post('http://localhost:8501/v1/models/ovr{}/versions/1:predict'.format(i), data=data, headers=headers)
        predictions = json.loads(json_response.text)['predictions']
        probabilities.append(predictions[0][1])
    best_class = np.argmax(probabilities)
    highest_prob = probabilities[best_class]

    prediction = None
    if highest_prob < 0.5:
        prediction = 5
    else:
        prediction = best_class
    return class_mapping[prediction]


if __name__ == '__main__':
    app.run()
