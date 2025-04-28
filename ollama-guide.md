![ollama](https://github.com/user-attachments/assets/ea18144e-878f-4b8d-9b71-011e738516c9)
# Ollama

Ollama is a tool for running and interacting with open-source large language models (LLMs) locally.

## Installation
[Install instructions](https://github.com/ollama/ollama/blob/main/README.md#quickstart)

## LLM Models Supported
[List of LLM modesl supported](https://ollama.com/library)

## Installing an LLM Model
[Steps to install an LLM Model](https://github.com/ollama/ollama/blob/main/README.md#model-library)

## Commands reference

| Command  | Description |
|-------------|------------|
 | ollama list |  List LLM models on your computer | 
 | ollama show <model name> |  Show model information  | 
 | ollama ps |  List which models are currently loaded  | 
 | ollama run <model> |  Runs a specific model and makes it ready for interaction. |
 | ollama stop <model name> | Stop a model which is currently running |

## OpenAI compatibility
Ollama offers limited support for certain OpenAI API functionalities, enabling integration with
existing applications. [More details are available here](https://github.com/ollama/ollama/blob/main/docs/openai.md)
1. REST/API endpoints – See : https://github.com/ollama/ollama/blob/main/docs/openai.md#endpoints
2. Chat completion endpoint: http://localhost:11434/v1/chat/completions

# Ollama configuration for the AI plugin (Plugin version V0.1.2 and OpenRefine version 3.9+)

| Attribute  | Value |
|-------------|------------|
 | apiURL |  http://localhost:11434/v1/chat/completions | 
 | modelName | Set the model name you wish to use e.g. llama3.1:8b |
 | apiKey | 1234 |
 | waittime | 1000 | 

For details on all attributes refer the setup guide.

![image](https://github.com/user-attachments/assets/6e0fae2d-7410-42c4-a6df-48475a98a176)

