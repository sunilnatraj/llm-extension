/**
 * Manages LLM service entries
 */
function LLMManager() {
}

LLMManager.loadAllLLMProviders = async function () {
    var llmproviders = [];
    let response = await $.get(
        "command/llm-extension/llm-management",
        null,
        function(settings) {
            if(settings){
               llmproviders = settings;
            }
        },
        "json"
        );
        let data = await response;
        return llmproviders;
};

LLMManager.saveLLMProvider =  async function(mode, llmProviderInfo) {
    return new Promise((resolve, reject) => {
        llmProviderInfo.crudOperation = mode;
        Refine.postCSRF(
        "command/llm-extension/llm-management",
        llmProviderInfo,
        function(settings) {
            if (settings) {
                resolve(settings);
            } else {
                reject("No response received.");
            }
        },
        "json",
        function( jqXhr, textStatus, errorThrown ){
            let errorMsg = textStatus + ": " + errorThrown;
            console.log("LLM crud failed - " + errorMsg);
            reject(errorMsg);
        });
    });
};

LLMManager.ProcessLLMRequest = async function(llmProviderInfo) {
    return new Promise((resolve, reject) => {
        Refine.postCSRF(
            "command/llm-extension/llm-connect",
            llmProviderInfo,
            function(settings) {
                if (settings) {
                    resolve(settings);
                } else {
                    reject("No response received.");
                }
            },
            "json",
            function(jqXhr, textStatus, errorThrown) {
                let errorMsg = textStatus + ": " + errorThrown;
                console.log("LLM service failed - " + errorMsg);
                reject(errorMsg);
            }
        );
    });
};

LLMManager.getPromptHistory = async function (_starred) {
    var promptHistory = [];
    let response = await $.get(
        "command/llm-extension/llm-prompt?"+ $.param({ project: theProject.id, starred: _starred }),
        null,
        function(settings) {
            if(settings){
                promptHistory = settings;
            }
        },
        "json"
        );
        let data = await response;
        return promptHistory;
};