package org.openrefine.extensions.llmExtension.cmd;

import com.google.refine.commands.Command;
import com.google.refine.commands.HttpUtilities;
import org.openrefine.extensions.llmExtension.LLMConfiguration;
import org.openrefine.extensions.llmExtension.LLMUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class LLMProviderCommand extends Command {
    private static final Logger logger = LoggerFactory.getLogger("LLMProviderCommand");

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        List<LLMConfiguration> llmProviders = LLMUtils.getLLMProviders();
        respondJSON(response, llmProviders);
    }

    @Override
    public void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpUtilities.respond(response, "error", "DELETE not supported");
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if (!hasValidCSRFToken(request)) {
            respondCSRFError(response);
            return;
        }
        String crudOperation = request.getParameter("crudOperation");
        LLMConfiguration llmConfiguration = getLLMConfiguration(request);
        if ( crudOperation.equals("add")) {
            LLMUtils.addLLMProvider(llmConfiguration);
        } else if ( crudOperation.equals("update")) {
            String updateKey = request.getParameter("updateKey");
            LLMUtils.updateLLMProvider(updateKey, llmConfiguration);
        } else if ( crudOperation.equals("delete")) {
            LLMUtils.deleteLLMProvider(llmConfiguration);
        }

        List<LLMConfiguration> llmProviders = LLMUtils.getLLMProviders();
        respondJSON(response, llmProviders);
    }

    @Override
    public void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpUtilities.respond(response, "error", "PUT not supported");
    }

    protected LLMConfiguration getLLMConfiguration(HttpServletRequest request) {
        LLMConfiguration llmConfiguration = new LLMConfiguration();

        llmConfiguration.setLabel(request.getParameter("label"));
        llmConfiguration.setApiURL(request.getParameter("apiURL"));
        llmConfiguration.setModelName(request.getParameter("modelName"));
        llmConfiguration.setApiKey(request.getParameter("apiKey"));
        llmConfiguration.setTemperature(Double.parseDouble(request.getParameter("temperature")));
        llmConfiguration.setMaxTokens(Integer.parseInt(request.getParameter("maxTokens")));
        if (! request.getParameter("topP").isEmpty()) {
            llmConfiguration.setTopP(Double.parseDouble(request.getParameter("topP")));
        }
        if (! request.getParameter("seed").isEmpty()) {
            llmConfiguration.setSeed(Integer.parseInt(request.getParameter("seed")));
        }
        if (! request.getParameter("waitTime").isEmpty()) {
            llmConfiguration.setWaitTime(Integer.parseInt(request.getParameter("waitTime")));
        }
        return llmConfiguration;
    }

}
