package org.openrefine.extensions.llmExtension.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.openrefine.extensions.llmExtension.LLMConfiguration;
import org.openrefine.extensions.llmExtension.model.ChatCompletionRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.OutputStream;
import java.net.*;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.MessageFormat;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ChatCompletionService {
    private static final Logger logger = LoggerFactory.getLogger("ChatCompletionService");
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public enum ResponseFormat {
        text,
        json_schema,
        json_object
    }

    // Use a single HttpClient instance for connection reuse
    private static final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2) // Use HTTP/2 if available
            .connectTimeout(Duration.ofSeconds(30)) // Set connection timeout
            .build();

    public static String invoke(LLMConfiguration llmConfig, String systemContent, String responseFormat, String jsonSchema, String userContent) throws Exception {
        String responseMessage;
        try {
            String apiUrl = llmConfig.getApiURL();

            // Prepare request payload
            List<ChatCompletionRequest.Message> messages = new ArrayList<>();
            messages.add(new ChatCompletionRequest.Message("system", systemContent));
            messages.add(new ChatCompletionRequest.Message("user", userContent));

            ChatCompletionRequest.ResponseFormat _responseFormat = null;
            // Response format not supported for TEXT on HuggingFace platform
            if (! ( ResponseFormat.text.name().equals(responseFormat) && apiUrl.contains("huggingface") ) ) {
                _responseFormat = new ChatCompletionRequest.ResponseFormat(responseFormat);
                if (ResponseFormat.json_schema.name().equals(responseFormat) && jsonSchema != null && !jsonSchema.isEmpty()) {
                    Map<String, Object> schema = objectMapper.readValue(jsonSchema, new TypeReference<Map<String, Object>>() {
                    });
                    _responseFormat = ChatCompletionRequest.ResponseFormat.jsonSchema(schema);
                }
            }

            ChatCompletionRequest payloadObject = new ChatCompletionRequest(
                    llmConfig.getModelName(),
                    _responseFormat,
                    messages,
                    llmConfig.getMaxTokens(),
                    llmConfig.getTemperature(),
                    llmConfig.getTopP(),
                    llmConfig.getSeed()
            );

            String payload = objectMapper.writeValueAsString(payloadObject);
            //logger.info("chatCompletion - invoke - payload: {}", payload);

            // Create HTTP request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .timeout(Duration.ofSeconds(60)) // Set timeout for the request
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + llmConfig.getApiKey())
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

            // Send request and get response
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            int responseCode = response.statusCode();
            if (responseCode == 200) {
                JsonNode responseJson = objectMapper.readTree(response.body());
                String content = responseJson
                        .at("/choices/0/message/content")
                        .asText();
                return content.replace("<|end_of_turn|>", "");
            } else {
                logger.error("ChatCompletionService request failure - {} {}", responseCode, response.body());
                responseMessage = MessageFormat.format("LLM request failed. Status Code : {0,number,integer}. Message : {1}", responseCode, response.body());
            }
        } catch (InterruptedException e) {
            logger.error("ChatCompletionService error InterruptedException - {}", e.getMessage());
            responseMessage = MessageFormat.format("LLM request failed. Message : InterruptedException {0}", e.getMessage());
        } catch (SecurityException e) {
            logger.error("ChatCompletionService error SecurityException - {}", e.getMessage());
            responseMessage = MessageFormat.format("LLM request failed. Message : SecurityException {0}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("ChatCompletionService error IllegalArgumentException - {}", e.getMessage());
            responseMessage = MessageFormat.format("LLM request failed. Message : IllegalArgumentException {0}", e.getMessage());
        } catch (Exception e ) {
            logger.error("ChatCompletionService error Exception - {}", e.getMessage());
            responseMessage = MessageFormat.format("LLM request failed. Message : Exception {0}", e.getMessage());
        }

        throw new Exception(responseMessage);
    }

    public static String test(LLMConfiguration llmConfig)  {
        String systemContent = "You are a helpful and concise assistant.";
        String userContent = "What’s the capital of France?";
        String llmResponse;
        try {
            llmResponse = invoke(llmConfig, systemContent, "text", null, userContent);
        } catch (Exception e) {
            llmResponse = e.getMessage();
        }
        return llmResponse;
    }

}
