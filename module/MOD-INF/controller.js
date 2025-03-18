/*
 * Controller for AU extension.
 *
 * This is run in the Butterfly (ie Refine) server context using the Rhino
 * Javascript interpreter.
 */

var html = "text/html";
var encoding = "UTF-8";
var ClientSideResourceManager = Packages.com.google.refine.ClientSideResourceManager;

function registerCommands() {
  var RS = Packages.com.google.refine.RefineServlet;
  RS.registerCommand(module, "llm-management", Packages.org.openrefine.extensions.llmExtension.cmd.LLMProviderCommand());
  RS.registerCommand(module, "llm-connect", Packages.org.openrefine.extensions.llmExtension.cmd.LLMConnectCommand());
  RS.registerCommand(module, "llm-prompt", Packages.org.openrefine.extensions.llmExtension.cmd.LLMPromptCommand());
  RS.registerCommand(module, "add-column-by-llm-processing", Packages.org.openrefine.extensions.llmExtension.cmd.AddColumnByLLMProcessingCommand());
}

function registerOperations() {
    Packages.com.google.refine.operations.OperationRegistry.registerOperation(
            module, "column-addition-by-llm-processing", Packages.org.openrefine.extensions.llmExtension.operations.ColumnAdditionByLLMProcessingOperation);
}
/*
 * Function invoked to initialize the extension.
 */
function init() {

  registerCommands();
  registerOperations();

  // Script files to inject into /project page
  ClientSideResourceManager.addPaths(
    "project/scripts",
    module,
    [
      "scripts/menu.js",
      "scripts/llm-manager.js",
      "scripts/llm-chatcompletion.js",
      "scripts/dialogs/manage-llm.js"
    ]
  );

  // Style files to inject into /project page
  ClientSideResourceManager.addPaths(
    "project/styles",
    module,
    [
      "styles/manage-llm.css",
      "styles/llm-provider-detail.css",
      "styles/llm-chatcompletion-dialog.css",
      "styles/project-injection.css"
    ]
  );

    ClientSideResourceManager.addPaths(
      "images",
      module,
      [
        "images/reuse.svg",
        "images/remove.svg"
      ]
    );

  // Here you can register all sorts of server-side components following the extension points listed in:
  // https://openrefine.org/docs/technical-reference/writing-extensions#server-side-ajax-commands
}


