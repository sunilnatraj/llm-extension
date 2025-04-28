# OpenRouter
[OpenRouter](openrouter.ai) is a platform that provides unified API access to multiple AI models from various
providers, including OpenAI, Google, Anthropic, Mistral, and others. It allows developers to interact with
different models using a single API key and a standardized OpenAI-compatible API.

## LLM Models Supported
[List of LLM modesl supported](https://openrouter.ai/models)

## Rate Limits
[Refer documentation](https://openrouter.ai/docs/api-reference/limits)

## API Key
1. Obtain an API key after logging into openrouter.ai.
2. Create API Key - https://openrouter.ai/settings/keys >> Create API Key >> Save <your key>

3. Manage your account - https://openrouter.ai/settings/preferences
4. Check your credit - https://openrouter.ai/settings/credits 
5. Quck start guide - https://openrouter.ai/docs/quickstart

## OpenAI compatibility
It is completely compatible with OpenAI and supports an array of parameters. See here for details
related to chap completion – https://openrouter.ai/docs/api-reference/chat-completion.

# OpenRouter configuration for the AI plugin (Plugin version V0.1.2 and OpenRefine version 3.9+)

| Attribute  | Value |
|-------------|------------|
 | apiURL |  https://openrouter.ai/api/v1/chat/completions | 
 | modelName | Set the model name |
 | apiKey | <apiKey> |
 | waittime | 5000 | 

For details on all attributes refer the setup guide.

### NB: Multiple OpenRouter instances can be created using 
different models while utilizing the same API key. This can be achieved by modifying the instance label (e.g. OpenRouter-DeepSeek) and specifying the desired model name (e.g., deepseek/deepseek-v3-base:free). Other configuration parameters may be adjusted as required or retained with their existing values.

![image](https://github.com/user-attachments/assets/6e2d9023-a450-43b1-9233-b63eaeb84dab)

