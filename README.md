# Open-Set-Audio-Classification
50.038 Computational Data Science: Project

## Introduction
In our research paper, we propose a range of approaches to attempt to solve the open set recognition (OSR) problem in the context of audio classification. We first describe our chosen dataset and data split as well as the data representation that we will be using to train our models. We then choose a baseline model that solves the audio classification closed set recognition (CSR) problem for us to extend upon for the OSR problem. Next, we describe the feature extraction methods we used to augment our models and discuss the evaluation metrics that will be used to assess model performance. Lastly, we describe the various approaches taken to tackle the OSR problem and discuss the results obtained, with a final summary of our learnings.

## Base Model
We chose a model with state-of-the-art performance on the UrbanSound8K dataset for the CSR problem to be our base model. We would then expand on this model to solve the OSR problem. We chose the DenseNet-201 Convolutional Neural Network (CNN) pre-trained on ImageNet.

## Feature Extraction
1. Base model as feature extractor
2. VGGish as a feature extractor

## Machine learning algorithms/ models
* Threshold Check
  * Softmax Threshold
  * Similarity Comparison (Euclidean distance/ Cosine Similarity)
* Generation of synthetic data
* One-Class Support Vector Classification (SVC)
* One vs Rest
  * Pre-trained DenseNet
  * Single Layer Perceptron (SLP) with features extracted from base model
  * SLP with features extracted from VGGish
  * Support Vector Machine (SVM) with features extracted from the base model
  * SVM with features extracted from VGGish
  
Head over to our [research paper](https://github.com/YehSweeKhim/Open-Set-Audio-Classification/blob/master/Open_Set_Audio_Classification_Problem.pdf) to read more about the machine learning algorithms/ models used and a final summary of our learnings.
