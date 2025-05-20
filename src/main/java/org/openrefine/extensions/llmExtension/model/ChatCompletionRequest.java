package org.openrefine.extensions.llmExtension.model;

import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatCompletionRequest {
    private String model;
    private List<Message> messages;
    private ResponseFormat response_format;
    private int max_tokens;
    private double temperature;
    private Double top_p;
    private Integer seed;

    public ChatCompletionRequest(String model, ResponseFormat responseFormat, List<Message> messages, int maxTokens, double temperature, Double top_p, Integer seed) {
        this.model = model;
        this.response_format = responseFormat;
        this.messages = messages;
        this.max_tokens = maxTokens;
        this.temperature = temperature;
        this.top_p = top_p;
        this.seed = seed;
    }

    public ChatCompletionRequest(String model, ResponseFormat responseFormat, List<Message> messages, int maxTokens, double temperature, Double top_p) {
        this.model = model;
        this.response_format = responseFormat;
        this.messages = messages;
        this.max_tokens = maxTokens;
        this.temperature = temperature;
        this.top_p = top_p;
    }


    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ResponseFormat {

        @JsonProperty("type")
        private String type;

        @JsonProperty("json_schema")
        private Map<String, Object> json_schema; // Only for `json_schema`

        @JsonProperty("pattern")
        private String pattern; // Only for `regex`

        public ResponseFormat(String type) {
            this.type = type;
        }
        public ResponseFormat(String type, Map<String, Object> schema, String pattern) {
            this.type = type;
            this.json_schema = schema;
            this.pattern = pattern;
        }

        public void setType(String type) {
            this.type = type;
        }

        public static ResponseFormat jsonSchema(Map<String, Object> schema) {
            return new ResponseFormat("json_schema", schema, null);
        }

        public static ResponseFormat jsonObject() {
            return new ResponseFormat("json_object", null, null);
        }

        public static ResponseFormat regex(String pattern) {
            return new ResponseFormat("regex", null, pattern);
        }

        public static ResponseFormat text() {
            return new ResponseFormat("text", null, null);
        }

        public String getType() {
            return type;
        }

        public Map<String, Object> getJson_schema() {
            return json_schema;
        }

        public String getPattern() {
            return pattern;
        }
    }
    // Inner class for the message structure
    public static class Message {
        private String role;
        private String content;

        public Message(String role, String content) {
            this.role = role;
            this.content = content;
        }

        public String getRole() {
            return role;
        }

        public String getContent() {
            return content;
        }
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public int getMax_tokens() {
        return max_tokens;
    }

    public void setMax_tokens(int max_tokens) {
        this.max_tokens = max_tokens;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public ResponseFormat getResponse_format() {
        return response_format;
    }

    public void setResponse_format(ResponseFormat response_format) {
        this.response_format = response_format;
    }

    public Double getTop_p() {
        return top_p;
    }

    public Integer getSeed() {
        return seed;
    }
}
