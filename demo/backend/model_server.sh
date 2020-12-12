#!/bin/bash

CONFIG_FILE="tensorflow_serving_config"
PORT=8501
LOG_FILE="logs/tensorflow_server.log"

nohup tensorflow_model_server \
  --rest_api_port=$PORT \
  --model_config_file=$CONFIG_FILE > $LOG_FILE 2>&1