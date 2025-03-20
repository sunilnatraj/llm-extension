package org.openrefine.extensions.llmExtension;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class LLMConfiguration {
    private String label;
    private String apiURL;
    private String modelName;
    private double temperature;
    private int maxTokens;
    private String apiKey;
    private Double topP;
    private Integer seed;
    private int waitTime;

    public LLMConfiguration(String label, String apiURL, String modelName, double temperature, int maxTokens, String apiKey, Double topP, Integer seed, int waitTime) {
        this.label = label;
        this.apiURL = apiURL;
        this.modelName = modelName;
        this.temperature = temperature;
        this.maxTokens = maxTokens;
        this.apiKey = apiKey;
        this.topP = topP;
        this.seed = seed;
        this.waitTime = waitTime;
    }

    public LLMConfiguration() {

    }

    public String getLabel() {
        return label;
    }

    public String getApiURL() {
        return apiURL;
    }

    public String getModelName() {
        return modelName;
    }

    public double getTemperature() {
        return temperature;
    }

    public int getMaxTokens() {
        return maxTokens;
    }

    public String getApiKey() {
        return apiKey;
    }

    public Double getTopP() {
        return topP;
    }

    public Integer getSeed() {
        return seed;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public void setApiURL(String apiURL) {
        this.apiURL = apiURL;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public void setMaxTokens(int maxTokens) {
        this.maxTokens = maxTokens;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public void setTopP(Double topP) {
        this.topP = topP;
    }

    public void setSeed(Integer seed) {
        this.seed = seed;
    }

    public int getWaitTime() {
        return waitTime;
    }

    public void setWaitTime(int waitTime) {
        this.waitTime = waitTime;
    }

    @Override
    public String toString() {
        return "LLMConfiguration{" +
                ", label=" + label +  '\'' +
                ", apiURL=" + apiURL + '\'' +
                ", modelName='" + modelName + '\'' +
                ", temperature=" + temperature +
                ", maxTokens=" + maxTokens +
                ", apiKey='" + apiKey + '\'' +
                ", topP='" + topP + '\'' +
                ", seed='" + seed + '\'' +
                ", waitTime='" + waitTime + '\'' +
                '}';
    }
}
