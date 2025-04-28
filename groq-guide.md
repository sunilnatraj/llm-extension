# GROQ
The [Groq Console](console.groq.com) is an online interface that allows users to interact with open source AI models
running on Groq hardware. It provides:
1. Access to LLMs: Users can run prompts against models optimized for Groq's hardware.
2. API integration: Developers can integrate Groq’s AI processing capabilities into their own applications.

## LLM Models Supported
[List of LLM modesl supported](https://console.groq.com/docs/models)

## Rate Limits
[Refer documentation](https://console.groq.com/docs/rate-limits)
Know your limits in the free tier - https://console.groq.com/dashboard/limits
Check usage - https://console.groq.com/dashboard/usage

## API Key
Obtain an API key after logging into console.groq.com
Create API Key >> https://console.groq.com/keys >> Save the API Key
Dashboard - https://console.groq.com/dashboard/

## OpenAI compatibility
The Groq API has been designed to be mostly compatible with OpenAI's client libraries, allowing existing applications to be configured with minimal effort to run on Groq and experience its inference speed.
To integrate Groq with OpenAI's client libraries, the base_url should be set to https://api.groq.com/openai/v1.

# Groq configuration for the AI plugin (Plugin version V0.1.2 and OpenRefine version 3.9+)

| Attribute  | Value |
|-------------|------------|
 | apiURL |  https://api.groq.com/openai/v1/chat/completions | 
 | modelName | Set the model name |
 | apiKey | <apiKey> |
 | waittime | 5000 | 

For details on all attributes refer the setup guide.

### NB: Multiple Groq instances can be created using different models while utilizing the same API key. This can be
achieved by modifying the instance label (e.g., Groq-DeepSeek) and specifying the desired model name (e.g.,
deepseek-r1-distill-llama-70b). Other configuration parameters may be adjusted as required or retained with their existing values.

