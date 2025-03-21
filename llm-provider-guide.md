# AI - LLM Provider Definition Guide
Documentation for managing LLM Provider which capatures the details of the AI service and configurations.

## Overview
This guide explains how to configure an LLM Provider by specifying key details such as the model, API key, temperature, top-p, seed, and max tokens.

If you want to use an LLM that does not support the /chat/completions endpoint, refer the [section](#llms-that-dont-support-the-chatcompletions-endpoint)

## Demo Video

https://github.com/user-attachments/assets/e0c689de-3aff-4ece-8194-c483b4f17b5f


## Configuration Fields

| Field	      | Description                                                                                                                                                      |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Label       | A unique user-friendly name for the LLM provider.                                                                                                                |
| Server URL  | The endpoint for the chat completion API                                                                                                                         |
| Model       | The model to use. Ensure the model is supported by the platform.                                                                                                 |
| API Key     | The authentication key for accessing the API. If your service is running locally or does not support authentication set a dummy value                            |
| Temperature | Controls randomness in responses (1 = balanced, 0 = deterministic, >1 = more creative).                                                                          |
| Top-P       | Controls nucleus sampling (0.8 means tokens with 80% cumulative probability are considered).                                                                     |
| Seed        | Ensures reproducible responses when set (e.g., 32). If left blank, responses may vary.                                                                           |
| Max Tokens  | The maximum number of tokens the response can generate. Higher values allow longer responses but consume more API usage.                                         |
| Wait Time   | Specify the duration to wait between requests. Set it to 0 for no wait between requests or time in milliseconds e.g. for a 2 second delay set the value as 2000. |
 

## Buttons & Actions
| Button	| Function |
|-------|-------------|
|Help	| Opens the documentation or guide for configuring LLM Providers. |
|Test | Service	Runs a test call to check if the API key, model, and server URL are correct. |
|Cancel	| Discards changes and closes the dialog. |
|Save	| Saves the configuration.|

## Temperature - Top-P settings and workings

| Temperature (T)	| Top-P (P)	| Effect on Output	| Use Case |
|-------|-------------|-------|-------------|
| Low (T ≈ 0.2)	| Low (P ≈ 0.5)	| Very deterministic and strictly follows high-probability words. Almost no variation.	| Good for structured outputs like math, facts, legal docs, code generation.| 
| Low (T ≈ 0.2)	| High (P ≈ 0.95)	| Mostly deterministic but allows some diversity within high-confidence tokens.	| Good for customer support, FAQs, chatbots with strict correctness.| 
| Medium (T ≈ 0.7)	| Low (P ≈ 0.5)	| Balanced response with limited diversity.	| Works for formal writing, product descriptions, summarization.| 
| Medium (T ≈ 0.7)	| High (P ≈ 0.95)	| Best balance between coherence & creativity. Maintains fluency while allowing variety.	| ✅ Recommended default for chat, general conversations, AI assistants.| 
| High (T ≈ 1.2)	| Low (P ≈ 0.5)	| Somewhat unpredictable, but still respects top choices.	| Good for storytelling, opinion pieces, creative writing.| 
| High (T ≈ 1.2)	| High (P ≈ 0.95)	| Most creative & diverse. Generates unique responses but may hallucinate or go off-topic.	| Best for poetry, fiction, brainstorming ideas.| 
| Very High (T ≈ 2.0)	| Low (P ≈ 0.5)	| Chaotic & unstructured but still picks from top probabilities.	| Avoid for most use cases, unless extreme creativity is required.| 
| Very High (T ≈ 2.0)	| High (P ≈ 1.0)	| Fully random, often nonsensical output.| 	Not recommended for practical tasks.| 

## Top-P & Temperature - Recommended Defaults:
| Use Case	| Temperature	| Top-P |
|-------|-------------|-------|
| General Chatbot / AI Assistant	| 0.7	| 0.95| 
| Technical Writing / FAQs	| 0.3	| 0.95| 
| Storytelling / Creative Writing	| 1.2	| 0.9| 
| Code Generation / Logical Responses	| 0.2	| 0.9| 
| Poetry / Idea Brainstorming	| 1.5	| 0.95| 

## Seed

A seed is a fixed starting point for a random number generator. Since language models use random sampling during token selection, setting a seed ensures that you get the same output every time.

### How Does It Work?
1. Without a fixed seed: The model will generate different responses each time you run it (even with the same prompt).
2. With a fixed seed (seed = 42, for example): The model will follow the same random path and give the same response every time.


## LLMs that don't support the /chat/completions endpoint

If you want to use an LLM that doesn't natively support the /chat/completions endpoint (like Cohere, AI21, or older models), you can use [LiteLLM Proxy](https://docs.litellm.ai/docs/simple_proxy) Server to standardize your API interactions:
1. All requests use the familiar /chat/completions endpoint regardless of the target model
2. Parameters are normalized across providers (temperature, max_tokens, etc.)
3. Response formats are standardized to match OpenAI's structure
4. Behind the scenes, LiteLLM handles the translation between the OpenAI format and provider-specific formats