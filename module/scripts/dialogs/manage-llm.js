function ManageLLMSettingsUI() {
  this.launch();
}

ManageLLMSettingsUI = function() {
  const frame = $(DOM.loadHTML("llm-extension", "scripts/dialogs/manage-llm.html"));
  const elmts = this.elmts = DOM.bind(frame);
  var _llmProviders = [];

  elmts.llmSettingsContainer.text($.i18n("llm-extension/manage-llm"));

  elmts.llmLabel.text($.i18n("llm-detail/label"));
  elmts.llmModel.text($.i18n("llm-detail/model"));
  elmts.llmApiUrl.text($.i18n("llm-detail/serverUrl"));
  elmts.llmActions.text($.i18n("llm-detail/actions"));

  elmts.infoLLMManagement.text($.i18n("llm-management/info"));
  elmts.llmProviderGuide.text($.i18n("llm-nanagement/provider-guide"));
  elmts.llmFeatureGuide.text($.i18n("llm-management/feature-guide"));
  elmts.explainLLMSetup.text($.i18n("llm-management/llm-help"));
  elmts.closeButton.text($.i18n("llm-management/close"));
  elmts.addButton.text($.i18n("llm-management/add-llm"));

  this.populateDialog();
  let level = DialogSystem.showDialog(frame);

  elmts.closeButton.on('click',function () {
      DialogSystem.dismissUntil(level - 1);
    });

  elmts.addButton.on('click',() => {
      this.addLLMProvider("add", {});
    });
};

ManageLLMSettingsUI.prototype.populateDialog = function () {
  LLMManager.loadAllLLMProviders().then(llmProviders => {
    this.elmts.listLLMProviders.empty();
    _llmProviders = [];
    for (let llmProvider of llmProviders) {
        let llmProviderLabel = llmProvider.label;
        let llmProviderModel = llmProvider.modelName;
        let llmProviderApiUrl = llmProvider.apiURL;
        _llmProviders.push(llmProvider);

        const llm = $(DOM.loadHTML("llm-extension", "scripts/dialogs/llm-provider-item.html"));
        let _elmts = DOM.bind(llm);
        _elmts.llmProviderLabel.text(llmProviderLabel);
        _elmts.llmProviderModel.text(llmProviderModel);
        _elmts.llmProviderApiUrl.text(llmProviderApiUrl);

        _elmts.editLlmProvider.text($.i18n('core-index/edit'));
        _elmts.editLlmProvider.on('click', (event) => {
            this.editLLMProvider(event, llmProviderLabel);
        });

        _elmts.deleteLlmProvider.text($.i18n('core-index/delete'));
        _elmts.deleteLlmProvider.on('click', (event) => {
            this.deleteLLMProvider(event, llmProviderLabel);
        });

        this.elmts.listLLMProviders.append(llm);
      }
    }).catch(error => console.error("Error loading LLM providers:", error));
};

ManageLLMSettingsUI.prototype.deleteLLMProvider = function(event, llmProviderLabel) {
    if (window.confirm(llmProviderLabel + ' - ' + $.i18n('llm-details/confirm-delete'))) {
        var llmProviderInfo =  _llmProviders.find(provider => provider.label === llmProviderLabel);
        var dismissBusy = DialogSystem.showBusy($.i18n('llm-detail/deleting'));
        LLMManager.saveLLMProvider("delete", llmProviderInfo).then( temp => {
            this.populateDialog();
          }
        ).catch(error => console.error("Error deleting LLM provider:", error));
        dismissBusy();
    }
};

ManageLLMSettingsUI.prototype.editLLMProvider = function(event, llmProviderLabel) {
  var llmProviderInfo =  _llmProviders.find(provider => provider.label === llmProviderLabel);
  this.addLLMProvider("update", llmProviderInfo);
};


ManageLLMSettingsUI.prototype.addLLMProvider = function (mode, _llmProviderDetail) {
    const frame = $(DOM.loadHTML("llm-extension", "scripts/dialogs/llm-provider-detail.html"));
    const elmts = DOM.bind(frame);
    elmts.dialogHeader.text($.i18n("llm-detail/dialog-header"));
    elmts.llmLabel.text($.i18n("llm-detail/label"));
    elmts.llmServerUrl.text($.i18n("llm-detail/serverUrl"));
    elmts.llmModel.text($.i18n("llm-detail/model"));
    elmts.llmApiKey.text($.i18n("llm-detail/apikey"));
    elmts.llmTemperature.text($.i18n("llm-detail/temperature"));
    elmts.llmMaxTokens.text($.i18n("llm-detail/maxTokens"));
    elmts.llmTopP.text($.i18n("llm-detail/topP"));
    elmts.llmSeed.text($.i18n("llm-detail/seed"));
    elmts.llmWaitTime.text($.i18n("llm-detail/waitTime"));

    elmts.llmPromptHelp.text($.i18n("llm-chatcompletion/prompt-help"));
    elmts.testButton.text($.i18n("llm-detail/test"));
    elmts.cancelButton.text($.i18n("llm-detail/cancel"));
    elmts.saveButton.text($.i18n("llm-detail/save"));

    if ( mode === 'update') {
      // init values
      elmts.llmLabelInput[0].value = _llmProviderDetail.label;
      elmts.llmServerUrlInput[0].value = _llmProviderDetail.apiURL;
      elmts.llmModelInput[0].value = _llmProviderDetail.modelName;
      elmts.llmApiKeyInput[0].value = _llmProviderDetail.apiKey;
      elmts.llmTemperatureInput[0].value = _llmProviderDetail.temperature;
      elmts.llmMaxTokensInput[0].value = _llmProviderDetail.maxTokens;
      elmts.llmTopPInput[0].value = _llmProviderDetail.topP;
      elmts.llmSeedInput[0].value = _llmProviderDetail.seed;
      elmts.llmWaitTimeInput[0].value = _llmProviderDetail.waitTime;
    }
    let level = DialogSystem.showDialog(frame);

    elmts.cancelButton.on('click',function () {
      DialogSystem.dismissUntil(level - 1);
    });

    elmts.saveButton.on('click', () => {
          var llmProviderInfo = {};
          llmProviderInfo.label = jQueryTrim(elmts.llmLabelInput.val());
          llmProviderInfo.apiURL = jQueryTrim(elmts.llmServerUrlInput.val());
          llmProviderInfo.modelName = jQueryTrim(elmts.llmModelInput.val());
          llmProviderInfo.apiKey = jQueryTrim(elmts.llmApiKeyInput.val());
          llmProviderInfo.temperature = elmts.llmTemperatureInput.val();
          llmProviderInfo.maxTokens = elmts.llmMaxTokensInput.val();
          llmProviderInfo.topP = elmts.llmTopPInput.val();
          llmProviderInfo.seed = elmts.llmSeedInput.val();
          llmProviderInfo.waitTime = elmts.llmWaitTimeInput.val();

          if ( mode === 'update') {
            llmProviderInfo.updateKey = _llmProviderDetail.label;
          }

          var errorMessage = ManageLLMSettingsUI.validateLLMProvider(llmProviderInfo);
          if ( errorMessage.length > 0 ) {
            alert(errorMessage);
            return;
          }
          var dismissBusy = DialogSystem.showBusy($.i18n('llm-detail/saving'));
          LLMManager.saveLLMProvider(mode, llmProviderInfo).then(temp => {
              this.populateDialog();
          }).catch(error => console.error("Error loading LLM providers:", error));
          dismissBusy();
          DialogSystem.dismissUntil(level - 1);
    });

    elmts.testButton.on('click', async function () {

          var requestPayload = {};
          requestPayload.label = jQueryTrim(elmts.llmLabelInput.val());
          requestPayload.providerLabel = jQueryTrim(elmts.llmLabelInput.val());
          requestPayload.apiURL = jQueryTrim(elmts.llmServerUrlInput.val());
          requestPayload.modelName = jQueryTrim(elmts.llmModelInput.val());
          requestPayload.apiKey = jQueryTrim(elmts.llmApiKeyInput.val());
          requestPayload.temperature = elmts.llmTemperatureInput.val();
          requestPayload.maxTokens = elmts.llmMaxTokensInput.val();
          requestPayload.topP = elmts.llmTopPInput.val();
          requestPayload.seed = elmts.llmSeedInput.val();
          requestPayload.waitTime = elmts.llmWaitTimeInput.val();
          requestPayload.subCommand = "test";

          var errorMessage = ManageLLMSettingsUI.validateLLMProvider(requestPayload);
          if ( errorMessage.length > 0 ) {
            alert(errorMessage);
            return;
          }

          requestPayload.subCommand = "test";
          var dismissBusy = DialogSystem.showBusy($.i18n('llm-extension/processing'));
          var response = "";
          try {
            response  = await LLMManager.ProcessLLMRequest(requestPayload);
          } catch (error) {
            response = error;
          }
          dismissBusy();
          alert(response);
    });

};

ManageLLMSettingsUI.validateLLMProvider = function (llmProviderInfo) {
  var errorMessage = "";

  if (llmProviderInfo.label === '' || llmProviderInfo.apiURL === '' ||
    llmProviderInfo.modelName === '' || llmProviderInfo.apiKey === ''
  ) {
    errorMessage = errorMessage.concat($.i18n('llm-detail/provider-missing-info')).concat("\n");
  }

  if (llmProviderInfo.temperature < "0" || llmProviderInfo.temperature > "2" ) {
    errorMessage = errorMessage.concat($.i18n('llm-detail/provider-temperature-error')).concat("\n");
  }

  if ( llmProviderInfo.maxTokens <= 0 ) {
    errorMessage = errorMessage.concat($.i18n('llm-detail/provider-maxtokens-error')).concat("\n");
  }

  if ( llmProviderInfo.waitTime < 0 ) {
      errorMessage = errorMessage.concat($.i18n('llm-detail/provider-waittime-error')).concat("\n");
  }

  return errorMessage;
};