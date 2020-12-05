Add in models folder, vggish_model.ckpt and vggish_pca_params.npz to the backend directory

Add execution permissions to install.sh and model_server.sh with ```sudo chmod +x install.sh model_server.sh```

Install apt packages with ```./install.sh```

Start tenserflow server with ```./model_server.sh```. Leave the terminal running. 

Open a new terminal

Create a python virtual environment with ```python3 -m venv venv```

Activate virtual environment with ```source venv/bin/activate```

Install python libraries with ```pip install -r requirements.txt```

run flask app with ```flask run```