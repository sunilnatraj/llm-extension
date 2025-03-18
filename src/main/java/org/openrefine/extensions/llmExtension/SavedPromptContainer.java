package org.openrefine.extensions.llmExtension;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SavedPromptContainer {
    private List<PromptHistory> promptHistory;

    public List<PromptHistory> getPromptHistory() {
        return promptHistory;
    }

    public void setPromptHistory(List<PromptHistory> promptHistory) {
        this.promptHistory = promptHistory;
    }

    public SavedPromptContainer(List<PromptHistory> promptHistory) {
        super();
        this.promptHistory = promptHistory;
    }

    public SavedPromptContainer() {
        promptHistory = new ArrayList<>();
    }

}