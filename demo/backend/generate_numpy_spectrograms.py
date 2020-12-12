import librosa
import torch
import torchaudio
import torchvision
from PIL import Image
import numpy as np


def generate_spec(audio_path):
    clip, sr = librosa.load(audio_path)
    num_channels = 3
    window_sizes = [25, 50, 100]
    hop_sizes = [10, 25, 50]

    specs = []
    for i in range(num_channels):
        window_length = int(round(window_sizes[i]*sr/1000))
        hop_length = int(round(hop_sizes[i]*sr/1000))

        clip = torch.Tensor(clip)
        spec = torchaudio.transforms.MelSpectrogram(
            sample_rate=sr, n_fft=2205, win_length=window_length, hop_length=hop_length, n_mels=128)(clip)
        eps = 1e-6
        spec = spec.numpy()
        spec = np.log(spec + eps)
        spec = np.asarray(torchvision.transforms.Resize(
            (128, 250))(Image.fromarray(spec)))
        specs.append(spec)
    return np.array(specs)
