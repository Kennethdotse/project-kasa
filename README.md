# Kasanoma ASR

## Overview
Kasanoma ASR is a research-focused speech recognition project for African languages and atypical speech. The goal is to enable personalized, code-switched, and edge-deployable ASR systems with a focus on English, Twi, Yoruba, and Ga.

### Key objectives
- Personalized ASR for atypical or disordered speech
- Code-switched models for English and West African languages
- Edge deployment on low-power devices such as Raspberry Pi
- Assistive features for accessibility and disabled users

## Project Components
- `project-app/`: Next.js application, UI components, Firebase integration, and edge-ready frontend
- Dataset access and loading examples for the Kasa speech dataset
- Research and model development resources for code-switched ASR

## Project Kasa Dataset
The Project Kasa Dataset contains paired audio and text transcripts for ASR and NLP research. It is built to support code-switched speech recognition for West African language blends.

### Dataset access
This dataset is hosted on Hugging Face as a gated repository. To access it:

1. Create a Hugging Face account
2. Request access on the repository page:
   - https://huggingface.co/datasets/Kennethdot/ghana-english-twi-codeswitch-asr
3. Use a Hugging Face access token during download

### Loading the dataset
Use the Hugging Face `datasets` library to load the data once access is granted:

```python
from datasets import load_dataset

# Authenticate with huggingface-cli or set HF_TOKEN
dataset = load_dataset(
    "Kennethdot/ghana-english-twi-codeswitch-asr",
    use_auth_token=True,
)

print(dataset["train"][0])
```

### Expected format
The dataset follows the standard Hugging Face speech format and includes fields such as:
- `speaker_id`
- `audio` (16 kHz waveform)
- `transcription`
- `language` (e.g. `eng-twi`)
- `gender`

## Repository structure
- `project-app/`: main app folder
  - `src/app/`: Next.js pages and layout
  - `src/components/`: reusable UI components and audio recording interface
  - `src/firebase/`: Firebase config and authentication utilities
  - `src/lib/`: helper utilities, prompts, and placeholder assets

- `notebooks/`: exploratory notebooks for setup and Whisper experimentation
- `requirements.txt` / `environment.yml`: Python environment dependencies

## Getting started
1. Clone the repository
2. Install dependencies for the app and/or Python notebooks
3. Configure Hugging Face access and Firebase credentials as needed
4. Run the Next.js app from `project-app/` or explore dataset notebooks

## License and citation
The dataset is available under the CC BY-NC 4.0 license for research and educational use. Please cite the Project Kasa Project contributors if you leverage this work in academic or professional settings.
