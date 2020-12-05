from flask import Flask, request
from flask_cors import CORS
import keras
import numpy as np

from generate_numpy_spectrograms import generate_spec

from extract_features import generate_embedding

import os

app = Flask(__name__)
CORS(app)

basemodel = keras.models.load_model("basemodel-known")
models = []
for i in range(5):
    model = keras.Sequential()
    model.add(keras.layers.InputLayer(input_shape=(128,)))
    model.add(keras.layers.Dense(2, activation="softmax"))
    model.compile(
          optimizer="Adam",
          loss="sparse_categorical_crossentropy",
          metrics=["accuracy"])
    model.summary()
    model.load_weights("ovr-norm{}".format(i))
    models.append(model)
class_mapping = {0: "Air Conditioner", 1:"Car Horn", 2:"Children Player", 3:"Dog Bark", 4:"Drilling", 5:"Unknown"}

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
    prediction = basemodel.predict_classes(x=spec)
    return class_mapping[prediction[0]]

@app.route('/predict_mod', methods=['POST'])
def predict_mod():
    if "audio_file" not in request.files:
        return "Please attach a file", 400
    audio_file = request.files["audio_file"]
    if audio_file.mimetype != "audio/wav":
        return "Please ensure you upload a .wav file", 400
    audio_file.save("temp_file.wav")
    embedding = generate_embedding("temp_file.wav")
    prediction = None
    probabilities = []
    for i in range(5):
        probabilities.append(models[i].predict(x=embedding/255))
    best_class = np.argmax(probabilities)
    highest_prob = probabilities[best_class]
    if highest_prob < 0.5:
        prediction = 5
    else:
        prediction = best_class
    return class_mapping[prediction[0]]

if __name__ == '__main__':
    app.run()