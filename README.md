# Kasanoma ASR  
### Personalized, Code-Switched & Edge-Deployable Speech Recognition for Atypical African Speech

Kasanoma is a research project focused on building:
1. Personalized ASR for atypical/disordered speech  
2. Code-switched English–Twi/Yoruba/Ga models  
3. Edge-deployable inference on Raspberry Pi  
4. Assistive features for disabled users  

### Features
- Whisper + wav2vec2 baselines
- Personalized fine-tuning
- Hypernetwork-based adaptation (coming soon)
- Residual adapters and accent pre-training
- Code-switch ASR experiments
- ONNX + quantization for edge deployment
- Full preprocessing & evaluation pipeline

### Repository Structure
```
kasanoma-asr/
│
├── data/
│   ├── raw/               # Original recordings
│   ├── processed/         # Cleaned & resampled audio
│   ├── transcripts/       # *.txt or JSON files
│   └── metadata.csv       # Speaker info, labels
│
├── models/
│   ├── whisper_baseline/
│   ├── wav2vec2_baseline/
│   ├── personalized/
│   └── adapters/
│
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   ├── 02_whisper_baseline.ipynb
│   ├── 03_wav2vec2_baseline.ipynb
│   ├── 04_whisper_finetune.ipynb
│   ├── 05_wav2vec2_finetune.ipynb
│   └── 06_code_switch_experiments.ipynb
│
├── scripts/
│   ├── preprocess_audio.py
│   ├── train_whisper.py
│   ├── train_wav2vec2.py
│   ├── evaluate_asr.py
│   ├── export_onnx.py
│   ├── quantize_model.py
│   └── demo_inference.py
│
├── results/
│   ├── baseline/
│   ├── personalization/
│   └── code_switching/
│
├── configs/
│   ├── whisper_config.json
│   ├── wav2vec2_config.json
│   ├── dataset_config.json
│   └── training_params.yaml
│
├── tests/
│   ├── test_preprocessing.py
│   └── test_inference.py
│
├── README.md
├── requirements.txt
├── environment.yml
├── LICENSE
└── .gitignore

```


### Setup
```bash
conda env create -f environment.yml
conda activate afrispeech
