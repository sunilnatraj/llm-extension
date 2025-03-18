function LLMChatCompletionDialog(column) {
  this.launch(column);
}


LLMChatCompletionDialog.prototype.launch = function (column) {
  var columnIndex = Refine.columnNameToColumnIndex(column.name);
  var frame = $(
    DOM.loadHTML("llm-extension", "scripts/dialogs/llm-chatcompletion-dialog.html")
  );

  var elmts = DOM.bind(frame);
  this._elmts = elmts;
  var _llmProviders = [];
  const selectOneLabel = $.i18n('llm-chatcompletion/select-one');

  elmts.dialogHeader.text($.i18n('llm-chatcompletion/add-by-llm') + column.name);
  elmts.or_views_newCol.text($.i18n('llm-chatcompletion/new-col-name'));
  elmts.or_views_llmSelector.text($.i18n('llm-chatcompletion/llm-selector'))
  elmts.or_views_responeFormatSelector.text($.i18n("llm-chatcompletion/responseformat-selector"))
  elmts.systemPromptLabel.text($.i18n('llm-chatcompletion/system-prompt'));
  elmts.jsonSchemaLabel.text($.i18n('llm-chatcompletion/json-schema'));
  elmts.jsonSchemaHint.text($.i18n("llm-chatcompletion/json-schema-hint"));

  elmts.okButton.html($.i18n('core-buttons/ok'));
  elmts.cancelButton.text($.i18n('core-buttons/cancel'));
  elmts.or_dialog_preview.html($.i18n('llm-chatcompletion/preview-label'));
  elmts.or_dialog_history.html($.i18n('llm-chatcompletion/history-label'));
  elmts.or_dialog_starred.html($.i18n('llm-chatcompletion/starred-label'));


  const colActionSelector = elmts.columnaction;
  colActionSelector.append('<option value="' + "add" + '">' + $.i18n("llm-chatcompletion/col-mode-add") + '</option>');
  colActionSelector.append('<option value="' + "update" + '">' + $.i18n("llm-chatcompletion/col-mode-upd") + '</option>');

  const llmSelector = elmts.llmselector;
  LLMManager.loadAllLLMProviders().then(llmProviders => {
    llmSelector.empty();
    llmSelector.append('<option value="" disabled selected>' + selectOneLabel + '</option>');
    for (let llmProvider of llmProviders) {
      llmSelector.append('<option value="' + llmProvider.label + '">' + llmProvider.label + '</option>');
      _llmProviders.push(llmProvider);
    }
  });

  const responseformatSelector = elmts.responseformatselector;
  responseformatSelector.append('<option value="" disabled selected>' + selectOneLabel + '</option>');
  responseformatSelector.append('<option value="' + "text" + '">' + $.i18n("llm-chatcompletion/response-format-text") + '</option>');
  responseformatSelector.append('<option value="' + "json_schema" + '">' + $.i18n("llm-chatcompletion/response-format-json-schema") + '</option>');
  responseformatSelector.append('<option value="' + "json_object" + '">' + $.i18n("llm-chatcompletion/response-format-json-object") + '</option>');

  this.previewInputData = DataTableView.sampleVisibleRows(column).values[0];
  //elmts.previewRequestTextareaId.text(o.values[0]);

  var level = DialogSystem.showDialog(frame);
  var dismiss = function () { DialogSystem.dismissUntil(level - 1); };

  //this._renderPreview(this.previewInputData);


  elmts.llmselector.on('change', function () {
    // this._elmts.previewResponseTextareaId.text($.i18n("llm-chatcompletion/response-help-text"));
    $(".preview-textarea[bind='previewResponseTextareaId']").val($.i18n("llm-chatcompletion/response-help-text"));
  });

  elmts.responseformatselector.on('change', function () {
    const selectedValue = $(this).val();
    const jsonSchemaTextarea = document.getElementById("jsonSchemaTextareaId");
    if (selectedValue === "json_schema") {
      jsonSchemaTextarea.removeAttribute("disabled");
    } else {
      jsonSchemaTextarea.setAttribute("disabled", "true");
    }
  });

  elmts.cancelButton.on('click', dismiss);

  elmts.okButton.on('click', function (event) {
    const colActionSelector = elmts.columnaction;
    var columnAction = colActionSelector.val();
    const llmSelector = elmts.llmselector;
    var selectedLLM = llmSelector.val();
    const responseformatSelector = elmts.responseformatselector;
    var selectedresponseFormat = responseformatSelector.val();
    var systemContent = jQueryTrim(elmts.systemPromptTextarea.val());
    var jsonSchema = jQueryTrim(elmts.jsonSchemaTextarea.val());

    if (selectedLLM === '' || selectedresponseFormat === '' || systemContent === '') {
      window.alert($.i18n('llm-chatcompletion/preview-missing-info'));
      return;
    }
    if (selectedresponseFormat === 'json_schema' && jsonSchema === '') {
      window.alert($.i18n('llm-chatconpletion/preview-missing-schema'));
      return;
    }

    event.preventDefault();
    var columnName = jQueryTrim(elmts.columnNameInput[0].value);
    if (!columnName.length) {
      alert($.i18n('llm-chatcompletion/warning-col-name'));
      return;
    }

    let delay = 1;

    Refine.postProcess(
      "llm-extension",
      "add-column-by-llm-processing",
      {},
      {
        baseColumnName: column.name,
        columnAction: columnAction,
        newColumnName: columnName,
        columnInsertIndex: columnIndex + 1,
        delay: delay,
        providerLabel: selectedLLM,
        responseFormat: selectedresponseFormat,
        systemContent: systemContent,
        jsonSchema: jsonSchema
      },
      { includeEngine: true, modelsChanged: true, cellsChanged: true, columnStatsChanged: true, rowIdsPreserved: true, recordIdsPreserved: true },
      { onDone: function () {
            Refine.postProcess(
                  "llm-extension",
                  "llm-prompt",
                  {},
                  {
                    operation: "add",
                    projectId: theProject.id,
                    providerLabel: selectedLLM,
                    responseFormat: selectedresponseFormat,
                    systemContent: systemContent,
                    jsonSchema: jsonSchema
                  }
                  );
            dismiss();
           }
      }
    );
  });

  this.initTabs();
};

LLMChatCompletionDialog.prototype.initTabs = function () {
  var self = this;

  $("#llm-preview-tabs").tabs({
    activate: function (event, ui) {
      var selectedTabId = ui.newPanel.attr("id");

      if (selectedTabId === "llm-preview-tab") {
        self._renderPreview(self.previewInputData);
      } else if (selectedTabId === "llm-history-tab") {
        self._renderHistory();
      } else if (selectedTabId === "llm-starred-tab") {
        self._renderStarred();
      }
    }
  });

  self._renderPreview(self.previewInputData);
};

LLMChatCompletionDialog.prototype._renderPreview = function (data) {
  var self = this;
  // labels
  var _previewResponseLabel = $.i18n('llm-chatcompletion/preview-response');
  var _previewRequestLabel = $.i18n('llm-chatcompletion/preview-request');
  var _previewButton = $.i18n('llm-chatcompletion/preview');
  var _llmPromptHelp = $.i18n("llm-chatcompletion/prompt-help");
  var _previewData = $.i18n("llm-chatcompletion/preview-label");
  var _previewResponseTextareaId = $.i18n("llm-chatcompletion/response-help-text");

  var container = this._elmts.llmPreviewContainer.empty();
  var previewPanel = $('<div></div>').addClass("preview-panel").appendTo(container);
  var previewContainer = $('<div></div>').addClass("preview-container").appendTo(previewPanel);

  // Preview source data control
  var inputItem = $('<div></div>').addClass("preview-item").appendTo(previewContainer);
  $('<label></label>')
    .addClass("preview-label")
    .attr("bind", "previewRequestLabel")
    .text(_previewRequestLabel)
    .appendTo(inputItem);
  $('<textarea></textarea>')
    .addClass("preview-textarea")
    .text(data)
    .attr({
      "bind": "previewRequestTextareaId",
      "spellcheck": "false",
      "disabled": "disabled"
    })
    .appendTo(inputItem);

  // Preview llm response
  var outputItem = $('<div></div>').addClass("preview-item").appendTo(previewContainer);
  $('<label></label>')
    .addClass("preview-label")
    .attr("bind", "previewResponseLabel")
    .text(_previewResponseLabel)
    .appendTo(outputItem);
  $('<textarea></textarea>')
    .addClass("preview-textarea")
    .text(_previewResponseTextareaId)
    .attr({
      "bind": "previewResponseTextareaId",
      "spellcheck": "false",
      "disabled": "disabled"
    })
    .appendTo(outputItem);

  // Create preview footer
  var previewFooter = $('<div></div>').addClass("preview-footer").appendTo(container);

  // Help link
  $('<a></a>')
    .addClass("button")
    .text(_llmPromptHelp)
    .attr({
      "bind": "llmPromptHelp",
      "href": "https://github.com/sunilnatraj/llm-extension/blob/master/llm-prompt-guide.md",
      "target": "_blank"
    })
    .appendTo(previewFooter);

  // Preview button
  $('<button></button>')
    .addClass("button button-primary")
    .text(_previewButton)
    .attr({
      "type": "preview",
      "bind": "previewButton",
      "id": "preview-button"
    })
    .appendTo(previewFooter);

  $(document).off("click", "#preview-button");
  $(document).on("click", "#preview-button", async function () {
    const llmSelector = self._elmts.llmselector;
    var selectedLLM = llmSelector.val();
    const responseformatSelector = self._elmts.responseformatselector;
    var selectedresponseFormat = responseformatSelector.val();

    if (selectedLLM === '' || selectedresponseFormat === '' || jQueryTrim(self._elmts.systemPromptTextarea.val()) === '') {
      window.alert($.i18n('llm-chatcompletion/preview-missing-info'));
      return;
    }
    if (selectedresponseFormat === 'json_schema' && jQueryTrim(self._elmts.jsonSchemaTextarea.val()) === '') {
      window.alert($.i18n('llm-chatconpletion/preview-missing-schema'));
      return;
    }

    var dismissBusy = DialogSystem.showBusy($.i18n('llm-extension/processing'));

    var llmProviderInfo = {}
    llmProviderInfo.providerLabel = selectedLLM;
    llmProviderInfo.subCommand = "preview";
    llmProviderInfo.responseFormat = selectedresponseFormat;
    llmProviderInfo.systemContent = jQueryTrim(self._elmts.systemPromptTextarea.val());
    llmProviderInfo.jsonSchema = jQueryTrim(self._elmts.jsonSchemaTextarea.val());
    llmProviderInfo.userContent = data; // self._elmts.previewRequestTextareaId.val();

    var response = "";
    try {
      response = await LLMManager.ProcessLLMRequest(llmProviderInfo);
      $(".preview-textarea[bind='previewResponseTextareaId']").val(response);
    } catch (error) {
      alert(error);
    }
    dismissBusy();

  });
};

LLMChatCompletionDialog.prototype._renderHistory = function () {
  var self = this;

  // labels
  var _actionLabel = $.i18n('llm-chatcompletion/history-action');
  var _sourceLabel = $.i18n('llm-chatcompletion/history-source');
  var _reuseButton = $.i18n('llm-chatcompletion/history-reuse');
  var _providerLabel = $.i18n("llm-chatcompletion/llm-selector");
  var _responseFormatLabel = $.i18n("llm-chatcompletion/responseformat-selector");
  var _jsonSchemaLabel = $.i18n("llm-chatcompletion/history-json-schema");
  var _promptLabel = $.i18n("llm-chatcompletion/history-prompt");
  var _thisProjectLabel = $.i18n("llm-chatcompletion/this-project");
  var _otherProjectLabel = $.i18n("llm-chatcompletion/other-project");
  var _starHint = $.i18n("llm-chatcompletion/star-hint");
  var _unStarHint = $.i18n("llm-chatcompletion/unstar-hint");

  var container = this._elmts.llmHistoryContainer.empty();
  var table = $('<table></table>').addClass("history-table").appendTo(container);
  var thead = $('<thead></thead>').appendTo(table);
  var headerRow = $('<tr></tr>').appendTo(thead);
  $('<th></th>').text(_actionLabel).appendTo(headerRow);
  $('<th></th>').text(_sourceLabel).appendTo(headerRow);
  $('<th></th>').text(_providerLabel).appendTo(headerRow);
  $('<th></th>').text(_responseFormatLabel).appendTo(headerRow);
  $('<th></th>').text(_promptLabel).appendTo(headerRow);
  $('<th></th>').text(_jsonSchemaLabel).appendTo(headerRow);

  var tbody = $('<tbody></tbody>').appendTo(table);

  // Add prompt records to table
  LLMManager.getPromptHistory(false).then(promptHistory => {
    for (let prompt of promptHistory) {
      var row = $('<tr></tr>').appendTo(tbody);

      var actionCell = $('<td></td>').appendTo(row);
      var actionContainer = $('<div></div>').addClass("action-container").appendTo(actionCell);

      // ✅ Star Icon (as a clickable `<a>`)
      var starIcon = $('<a href="javascript:void(0)">&nbsp;</a>') // Prevents navigation issues
          .addClass(prompt.starred ? "data-table-star-on" : "data-table-star-off")
          .attr("title", prompt.starred ? _unStarHint  : _starHint)
          .data("promptId", prompt.promptId) // Store promptId instead of full object
          .on("click", function (event) {
              event.preventDefault(); // Prevent accidental navigation

              var promptId = $(this).data("promptId");

              // ✅ Call API to toggle 'starred' state
              Refine.postProcess(
                  "llm-extension",
                  "llm-prompt",
                  {},
                  {
                      operation: "toggleStarred",
                      promptId: promptId
                  }
              );

              // ✅ Toggle class based on current state
              $(this).toggleClass("data-table-star-on data-table-star-off");
          });
      starIcon.appendTo(actionContainer);

      $('<img>')
          .attr("src", "extension/llm-extension/images/reuse.svg") // Path to the image
          .addClass("reuse-icon")
          .attr("title", _reuseButton)
          .data("prompt", prompt)
          .appendTo(actionContainer);

      $('<td></td>').text(prompt.projectId == theProject.id ? _thisProjectLabel : _otherProjectLabel).appendTo(row);
      $('<td></td>').text(prompt.providerLabel).appendTo(row);
      $('<td></td>').text(prompt.responseFormat).appendTo(row);
      $('<td></td>')
        .text(prompt.systemPrompt)
        .addClass("text-truncate")
        .appendTo(row);
      $('<td></td>')
        .text(prompt.jsonSchema)
        .addClass("text-truncate")
        .appendTo(row);
    }
  });

  $(document).off("click", ".reuse-icon");

  $(document).on("click", ".reuse-icon", function () {
    var promptData = $(this).data("prompt");

    Refine.postProcess(
          "llm-extension",
          "llm-prompt",
          {},
          {
            operation: "reuse",
            promptId: promptData.promptId
          }
    );

    // Set selected record details in controls
    $("#llm-selector").val(promptData.providerLabel);
    $("#responseformat-selector").val(promptData.responseFormat);
    $("#systemPromptTextareaId").val(promptData.systemPrompt);
    $("#jsonSchemaTextareaId").val(promptData.jsonSchema);

    $("#llm-preview-tabs").tabs();
    $("#llm-preview-tabs").tabs("option", "active", 0);  // Switch to the first tab (Preview)
  });
};

LLMChatCompletionDialog.prototype._renderStarred = function () {
  var self = this;

  // labels
  var _actionLabel = $.i18n('llm-chatcompletion/history-action');
  var _sourceLabel = $.i18n('llm-chatcompletion/history-source');
  var _reuseButton = $.i18n('llm-chatcompletion/history-reuse');
  var _providerLabel = $.i18n("llm-chatcompletion/llm-selector");
  var _responseFormatLabel = $.i18n("llm-chatcompletion/responseformat-selector");
  var _jsonSchemaLabel = $.i18n("llm-chatcompletion/history-json-schema");
  var _promptLabel = $.i18n("llm-chatcompletion/history-prompt");
  var _thisProjectLabel = $.i18n("llm-chatcompletion/this-project");
  var _otherProjectLabel = $.i18n("llm-chatcompletion/other-project");
  var _starHint = $.i18n("llm-chatcompletion/star-hint");
  var _unStarHint = $.i18n("llm-chatcompletion/unstar-hint");

  var container = this._elmts.llmStarredContainer.empty();
  var table = $('<table></table>').addClass("history-table").appendTo(container);
  var thead = $('<thead></thead>').appendTo(table);
  var headerRow = $('<tr></tr>').appendTo(thead);
  $('<th></th>').text(_actionLabel).appendTo(headerRow);
  $('<th></th>').text(_sourceLabel).appendTo(headerRow);
  $('<th></th>').text(_providerLabel).appendTo(headerRow);
  $('<th></th>').text(_responseFormatLabel).appendTo(headerRow);
  $('<th></th>').text(_promptLabel).appendTo(headerRow);
  $('<th></th>').text(_jsonSchemaLabel).appendTo(headerRow);

  var tbody = $('<tbody></tbody>').appendTo(table);

  // Add prompt records to table
  LLMManager.getPromptHistory(true).then(promptHistory => {
    for (let prompt of promptHistory) {
      var row = $('<tr></tr>').appendTo(tbody);

      var actionCell = $('<td></td>').appendTo(row);
      var actionContainer = $('<div></div>').addClass("action-container").appendTo(actionCell);

      $('<img>')
        .attr("src", "extension/llm-extension/images/remove.svg") // Path to the image
        .addClass("delete-icon")
        .attr("title", _unStarHint)
        .data("promptId", prompt.promptId)
        .appendTo(actionContainer);

      $('<img>')
          .attr("src", "extension/llm-extension/images/reuse.svg") // Path to the image
          .addClass("reuse-icon")
          .attr("title", _reuseButton)
          .data("prompt", prompt)
          .appendTo(actionContainer);

      $('<td></td>').text(prompt.projectId == theProject.id ? _thisProjectLabel : _otherProjectLabel).appendTo(row);
      $('<td></td>').text(prompt.providerLabel).appendTo(row);
      $('<td></td>').text(prompt.responseFormat).appendTo(row);
      $('<td></td>')
        .text(prompt.systemPrompt)
        .addClass("text-truncate")
        .appendTo(row);
      $('<td></td>')
        .text(prompt.jsonSchema)
        .addClass("text-truncate")
        .appendTo(row);
    }
  });

  $(document).off("click", ".reuse-icon");
  $(document).on("click", ".reuse-icon", function () {
    var promptData = $(this).data("prompt");

    Refine.postProcess(
          "llm-extension",
          "llm-prompt",
          {},
          {
            operation: "reuse",
            promptId: promptData.promptId
          }
    );

    // Set selected record details in controls
    $("#llm-selector").val(promptData.providerLabel);
    $("#responseformat-selector").val(promptData.responseFormat);
    $("#systemPromptTextareaId").val(promptData.systemPrompt);
    $("#jsonSchemaTextareaId").val(promptData.jsonSchema);

    $("#llm-preview-tabs").tabs();
    $("#llm-preview-tabs").tabs("option", "active", 0);  // Switch to the first tab (Preview)
  });

  $(document).off("click", ".delete-icon");
  $(document).on("click", ".delete-icon", function () {
    var promptId = $(this).data("promptId");
    Refine.postProcess(
        "llm-extension",
        "llm-prompt",
        {},
        {
            operation: "toggleStarred",
            promptId: promptId
        },
        {},
        { onDone: function () {
            self._renderStarred();
          }
        }
    );
  });
};