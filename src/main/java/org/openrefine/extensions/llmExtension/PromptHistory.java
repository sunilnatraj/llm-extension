package org.openrefine.extensions.llmExtension;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.sql.Timestamp;
import java.time.Instant;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PromptHistory {
    private String promptId;
    private long projectId;
    private String providerLabel;
    private String responseFormat;
    private String systemPrompt;
    private String jsonSchema;
    private Timestamp added_on;
    private Timestamp last_accessed_on;
    private Boolean starred;

    public PromptHistory() {
    }

    public PromptHistory(long projectId, String providerLabel, String responseFormat, String systemPrompt, String jsonSchema, Timestamp added_on, Timestamp last_accessed_on, Boolean starred) {
        this.promptId = String.format("{1}_{2}", projectId, added_on);
        this.projectId = projectId;
        this.providerLabel = providerLabel;
        this.responseFormat = responseFormat;
        this.systemPrompt = systemPrompt;
        this.jsonSchema = jsonSchema;
        this.added_on = added_on;
        this.last_accessed_on = last_accessed_on;
        this.starred = starred;
    }

    public PromptHistory(long projectId, String providerLabel, String responseFormat, String systemPrompt, String jsonSchema, Boolean starred) {
        this.promptId = String.format("{1}_{2}", projectId, added_on);
        this.projectId = projectId;
        this.providerLabel = providerLabel;
        this.responseFormat = responseFormat;
        this.systemPrompt = systemPrompt;
        this.jsonSchema = jsonSchema;
        this.starred = starred;
        this.added_on = Timestamp.from(Instant.now());
        this.last_accessed_on = Timestamp.from(Instant.now());
    }

    public String getPromptId() {
        return promptId;
    }

    public void setPromptId(String promptId) {
        this.promptId = promptId;
    }

    public long getProjectId() {
        return projectId;
    }

    public void setProjectId(long projectId) {
        this.projectId = projectId;
    }

    public String getProviderLabel() {
        return providerLabel;
    }

    public void setProviderLabel(String providerLabel) {
        this.providerLabel = providerLabel;
    }

    public String getResponseFormat() {
        return responseFormat;
    }

    public void setResponseFormat(String responseFormat) {
        this.responseFormat = responseFormat;
    }

    public String getSystemPrompt() {
        return systemPrompt;
    }

    public void setSystemPrompt(String systemPrompt) {
        this.systemPrompt = systemPrompt;
    }

    public String getJsonSchema() {
        return jsonSchema;
    }

    public void setJsonSchema(String jsonSchema) {
        this.jsonSchema = jsonSchema;
    }

    public Timestamp getAdded_on() {
        return added_on;
    }

    public void setAdded_on(Timestamp added_on) {
        this.added_on = added_on;
    }

    public Timestamp getLast_accessed_on() {
        return last_accessed_on;
    }

    public void setLast_accessed_on(Timestamp last_accessed_on) {
        this.last_accessed_on = last_accessed_on;
    }

    public Boolean getStarred() {
        return starred;
    }

    public void setStarred(Boolean starred) {
        this.starred = starred;
    }

    public boolean isStarred() {
        return starred;
    }
}