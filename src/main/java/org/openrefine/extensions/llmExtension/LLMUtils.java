package org.openrefine.extensions.llmExtension;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.google.refine.ProjectManager;
import com.google.refine.io.FileProjectManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class LLMUtils {
    private static final Logger logger = LoggerFactory.getLogger("LLMUtils");

    public final static String LLM_EXTENSION_DIR = "llm-extension";
    public final static String SETTINGS_FILE_NAME = ".saved-llm-connections.json";
    public final static String SAVED_CONNECTION_KEY = "savedConnections";
    public final static String PROMPT_HISTORY_FILE_NAME = ".llm-prompt-history.json";
    public final static Integer PROMPT_HISTORY_LIMIT = 100;

    private static SimpleTextEncryptor textEncryptor = new SimpleTextEncryptor("Aa1Gb@tY7_Y");
    private static ObjectMapper _mapper = new ObjectMapper();

    public static void addLLMProvider(LLMConfiguration llmConfig) {

        try {
            String savedConnectionFile = getExtensionFilePath(SETTINGS_FILE_NAME);
            SavedConnectionContainer savedConnectionContainer = getSavedConnections(savedConnectionFile);
            savedConnectionContainer.getSavedConnections().add(llmConfig);
            _mapper.writerWithDefaultPrettyPrinter().writeValue(new File(savedConnectionFile), savedConnectionContainer);

        } catch (JsonGenerationException e1) {
            logger.error("JsonGenerationException: {}", e1);
            // e1.printStackTrace();
        } catch (JsonMappingException e1) {
            logger.error("JsonMappingException: {}", e1);
            // e1.printStackTrace();
        } catch (IOException e1) {
            logger.error("IOException: {}", e1);
            // e1.printStackTrace();
        }
    }

    public static void updateLLMProvider(String updateKey, LLMConfiguration llmConfig) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            String savedConnectionFile = getExtensionFilePath(SETTINGS_FILE_NAME);
            SavedConnectionContainer savedConnectionContainer = getSavedConnections(savedConnectionFile);
            savedConnectionContainer.getSavedConnections()
                    .removeIf(config -> updateKey.equals(config.getLabel()));
            savedConnectionContainer.getSavedConnections().add(llmConfig);

            mapper.writerWithDefaultPrettyPrinter().writeValue(new File(savedConnectionFile), savedConnectionContainer);

        } catch (JsonGenerationException e1) {
            logger.error("JsonGenerationException: {}", e1);
            // e1.printStackTrace();
        } catch (JsonMappingException e1) {
            logger.error("JsonMappingException: {}", e1);
            // e1.printStackTrace();
        } catch (IOException e1) {
            logger.error("IOException: {}", e1);
            // e1.printStackTrace();
        }
    }

    public static void deleteLLMProvider(LLMConfiguration llmConfig) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            String savedConnectionFile = getExtensionFilePath(SETTINGS_FILE_NAME);
            SavedConnectionContainer savedConnectionContainer = mapper.readValue(new File(savedConnectionFile),
                    SavedConnectionContainer.class);
            savedConnectionContainer.getSavedConnections()
                    .removeIf(config -> llmConfig.getLabel().equals(config.getLabel()));

            mapper.writerWithDefaultPrettyPrinter().writeValue(new File(savedConnectionFile), savedConnectionContainer);

        } catch (JsonGenerationException e1) {
            logger.error("JsonGenerationException: {}", e1);
            // e1.printStackTrace();
        } catch (JsonMappingException e1) {
            logger.error("JsonMappingException: {}", e1);
            // e1.printStackTrace();
        } catch (IOException e1) {
            logger.error("IOException: {}", e1);
            // e1.printStackTrace();
        }
    }

    public static List<LLMConfiguration> getLLMProviders() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            String filename = getExtensionFilePath(SETTINGS_FILE_NAME);
            File file = new File(filename);
            if (!file.exists()) {
                String dirPath = getExtensionFolder();
                File dirFile = new File(dirPath);
                boolean dirExists = true;
                if (!dirFile.exists()) {
                    dirExists = dirFile.mkdir();
                }
                if (dirExists) {
                    SavedConnectionContainer sc = new SavedConnectionContainer(new ArrayList<LLMConfiguration>());
                    mapper.writerWithDefaultPrettyPrinter().writeValue(new File(filename), sc);
                    return sc.getSavedConnections();
                }
            }
            // SavedConnectionContainer savedConnectionContainer = mapper.readValue(new File(filename), SavedConnectionContainer.class);
            SavedConnectionContainer savedConnectionContainer = getSavedConnections(filename);
            savedConnectionContainer.getSavedConnections().sort((o1, o2) -> o1.getLabel().compareTo(o2.getLabel()));
            return savedConnectionContainer.getSavedConnections();
        } catch (JsonParseException e) {
            logger.error("JsonParseException: {}", e);
        } catch (JsonMappingException e) {
            logger.error("JsonMappingException: {}", e);
        } catch (IOException e) {
            logger.error("IOException: {}", e);
        }
        return null;
    }

    public static LLMConfiguration getLLMProvider(String label) {
        LLMConfiguration matchingConfig = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            String savedConnectionFile = getExtensionFilePath(SETTINGS_FILE_NAME);
            SavedConnectionContainer savedConnectionContainer = getSavedConnections(savedConnectionFile);
            matchingConfig = savedConnectionContainer.getSavedConnections()
                    .stream()
                    .filter(config -> label.equals(config.getLabel()))
                    .findFirst()
                    .orElse(null);
        } catch (JsonGenerationException e1) {
            logger.error("JsonGenerationException: {}", e1);
        } catch (JsonMappingException e1) {
            logger.error("JsonMappingException: {}", e1);
        } catch (IOException e1) {
            logger.error("IOException: {}", e1);
        }
        return matchingConfig;
    }

    public static String getExtensionFilePath(String _fileName) {
        File dir = ((FileProjectManager) ProjectManager.singleton).getWorkspaceDir();
        String fileSep = System.getProperty("file.separator");
        String filename = dir.getPath() + fileSep + LLM_EXTENSION_DIR + fileSep + _fileName;

        logger.debug("** extension file name: {} **", filename);
        return filename;
    }

    public static String getExtensionFolder() {
        File dir = ((FileProjectManager) ProjectManager.singleton).getWorkspaceDir();
        String fileSep = System.getProperty("file.separator");
        String filename = dir.getPath() + fileSep + LLM_EXTENSION_DIR;
        return filename;
    }

    private static SavedConnectionContainer getSavedConnections(String filename) throws IOException {
        File file = new File(filename);
        SavedConnectionContainer savedConnectionContainer = new SavedConnectionContainer();

        if (!file.exists()) {
            // Create an empty file with default contents
            _mapper.writeValue(file, savedConnectionContainer);
        }

        // Read JSON as tree (avoiding direct deserialization)
        JsonNode jsonNode = _mapper.readTree(new File(filename));
        // Merge JSON into the default instance (only existing fields will be updated)
        ObjectReader reader = _mapper.readerForUpdating(savedConnectionContainer);
        reader.readValue(jsonNode);
        return savedConnectionContainer;
    }

    private static SavedPromptContainer getSavedPromptHistory(String filename) throws IOException {
        File file = new File(filename);
        SavedPromptContainer savedPromptContainer = new SavedPromptContainer();

        if (!file.exists()) {
            // Create an empty file with default contents
            _mapper.writeValue(file, savedPromptContainer);
        }

        // Read JSON as tree (avoiding direct deserialization)
        JsonNode jsonNode = _mapper.readTree(file);
        // Merge JSON into the default instance (only existing fields will be updated)
        ObjectReader reader = _mapper.readerForUpdating(savedPromptContainer);
        reader.readValue(jsonNode);

        return savedPromptContainer;
    }


    public static void addPromptToPromptHistory(long projectId, String providerLabel, String responseFormat, String systemPrompt, String jsonSchema) {
        try {
            PromptHistory promptHistory = new PromptHistory(projectId, providerLabel, responseFormat, systemPrompt, jsonSchema, Boolean.FALSE);
            String savedPromptHistoryFile = getExtensionFilePath(PROMPT_HISTORY_FILE_NAME);
            SavedPromptContainer savedPromptContainer = getSavedPromptHistory(savedPromptHistoryFile);
            if ( !isPromptHistoryExists(savedPromptContainer, promptHistory) ) {
                if (savedPromptContainer.getPromptHistory().size() >= PROMPT_HISTORY_LIMIT) {
                    int _trimSize = (savedPromptContainer.getPromptHistory().size() - PROMPT_HISTORY_LIMIT) + 1;
                    List<PromptHistory> sortedPrompts = savedPromptContainer.getPromptHistory()
                            .stream()
                            .sorted(
                                    Comparator.comparing(PromptHistory::isStarred, Comparator.reverseOrder())
                                            .thenComparing(PromptHistory::getLast_accessed_on, Comparator.reverseOrder()) 
                            )
                            .collect(Collectors.toList());
                    sortedPrompts = sortedPrompts.subList(0, sortedPrompts.size() - _trimSize);
                    savedPromptContainer.setPromptHistory(sortedPrompts);
                }
                savedPromptContainer.getPromptHistory().add(promptHistory);
                _mapper.writerWithDefaultPrettyPrinter().writeValue(new File(savedPromptHistoryFile), savedPromptContainer);
            }
        } catch (JsonGenerationException e1) {
            logger.error("JsonGenerationException: {}", e1);
            // e1.printStackTrace();
        } catch (JsonMappingException e1) {
            logger.error("JsonMappingException: {}", e1);
            // e1.printStackTrace();
        } catch (IOException e1) {
            logger.error("IOException: {}", e1);
            // e1.printStackTrace();
        }
    }

    public static List<PromptHistory> getPromptHistory(long projectId, Boolean starred) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            String filename = getExtensionFilePath(PROMPT_HISTORY_FILE_NAME);
            File file = new File(filename);
            if (!file.exists()) {
                String dirPath = getExtensionFolder();
                File dirFile = new File(dirPath);
                boolean dirExists = true;
                if (!dirFile.exists()) {
                    dirExists = dirFile.mkdir();
                }
                if (dirExists) {
                    SavedPromptContainer sc = new SavedPromptContainer(new ArrayList<PromptHistory>());
                    mapper.writerWithDefaultPrettyPrinter().writeValue(new File(filename), sc);
                    return sc.getPromptHistory();
                }
            }
            SavedPromptContainer savedPromptContainer = getSavedPromptHistory(filename);
            if ( starred ) {
                // Keep only prompts where field starred is True
                List<PromptHistory> filteredPrompts = savedPromptContainer.getPromptHistory()
                        .stream()
                        .filter(PromptHistory::isStarred)
                        .collect(Collectors.toList());
                savedPromptContainer.setPromptHistory(filteredPrompts);
            }
            savedPromptContainer.getPromptHistory().sort(Comparator
                    .<PromptHistory, Boolean>comparing(p -> !(p.getProjectId() == projectId))
                    .thenComparing(PromptHistory::getLast_accessed_on, Comparator.reverseOrder())
            );
            return savedPromptContainer.getPromptHistory();
        } catch (JsonParseException e) {
            logger.error("JsonParseException: {}", e);
        } catch (JsonMappingException e) {
            logger.error("JsonMappingException: {}", e);
        } catch (IOException e) {
            logger.error("IOException: {}", e);
        }
        return null;
    }

    public static void togglePromptStarred(String promptId) {
        try {
            String savedPromptHistoryFile = getExtensionFilePath(PROMPT_HISTORY_FILE_NAME);
            SavedPromptContainer savedPromptContainer = getSavedPromptHistory(savedPromptHistoryFile);
            List<PromptHistory> promptHistoryList = savedPromptContainer.getPromptHistory();
            for (PromptHistory prompt : promptHistoryList) {
                if (prompt.getPromptId().equals(promptId)) {
                    prompt.setStarred(!prompt.isStarred());
                    break;
                }
            }
            savedPromptContainer.setPromptHistory(promptHistoryList);
            _mapper.writerWithDefaultPrettyPrinter().writeValue(new File(savedPromptHistoryFile), savedPromptContainer);
        } catch (JsonGenerationException e1) {
            logger.error("JsonGenerationException: {}", e1);
            // e1.printStackTrace();
        } catch (JsonMappingException e1) {
            logger.error("JsonMappingException: {}", e1);
            // e1.printStackTrace();
        } catch (IOException e1) {
            logger.error("IOException: {}", e1);
            // e1.printStackTrace();
        }
    }

    public static void touchPrompt(String promptId) {
        try {
            String savedPromptHistoryFile = getExtensionFilePath(PROMPT_HISTORY_FILE_NAME);
            SavedPromptContainer savedPromptContainer = getSavedPromptHistory(savedPromptHistoryFile);
            List<PromptHistory> promptHistoryList = savedPromptContainer.getPromptHistory();
            for (PromptHistory prompt : promptHistoryList) {
                if (prompt.getPromptId().equals(promptId)) {
                    prompt.setLast_accessed_on(Timestamp.from(Instant.now()));
                    break;
                }
            }
            savedPromptContainer.setPromptHistory(promptHistoryList);
            _mapper.writerWithDefaultPrettyPrinter().writeValue(new File(savedPromptHistoryFile), savedPromptContainer);
        } catch (JsonGenerationException e1) {
            logger.error("JsonGenerationException: {}", e1);
            // e1.printStackTrace();
        } catch (JsonMappingException e1) {
            logger.error("JsonMappingException: {}", e1);
            // e1.printStackTrace();
        } catch (IOException e1) {
            logger.error("IOException: {}", e1);
            // e1.printStackTrace();
        }
    }

    private static boolean isPromptHistoryExists(SavedPromptContainer savedPromptContainer, PromptHistory promptHistory) {
        return savedPromptContainer.getPromptHistory().stream()
                .anyMatch(p -> p.getProviderLabel().equals(promptHistory.getProviderLabel()) &&
                        p.getResponseFormat().equals(promptHistory.getResponseFormat()) &&
                        p.getSystemPrompt().equals(promptHistory.getSystemPrompt()) &&
                        p.getJsonSchema().equals(promptHistory.getJsonSchema()));
    }

}
