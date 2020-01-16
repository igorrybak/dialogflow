import dialogflow from "dialogflow";
import * as dotenv from "dotenv";

dotenv.config();

const projectId = "demoagent-nbbtpj";
const sessionId = "123456";
const languageCode = "en";

const queries = [
    "Reserve a meeting room in Toronto office, there will be 5 of us",
    "Next monday at 3pm for 1 hour, please",
    "B",
];

const sessionClient = new dialogflow.SessionsClient();

const detectIntent = async (
    projectId: string,
    sessionId: string,
    query: string,
    languageCode: "en",
    contexts?: string,
) => {
    // The path to identify the agent that owns the created intent.
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: languageCode,
            },
        },
        queryParams: {},
    };

    if (contexts && contexts.length > 0) {
        request.queryParams = {
            contexts: contexts,
        };
    }

    const responses = await sessionClient.detectIntent(request);
    return responses[0];
};

const executeQueries = async (projectId: string, sessionId: string, queries: string[], languageCode: "en") => {
    // Keeping the context across queries let's us simulate an ongoing conversation with the bot
    let context;
    let intentResponse;
    for (const query of queries) {
        try {
            console.log(`Sending Query: ${query}`);
            intentResponse = await detectIntent(projectId, sessionId, query, languageCode, context);
            console.log("Detected intent");
            console.log(`Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`);
            // Use the context from this response for next queries
            context = intentResponse.queryResult.outputContexts;
        } catch (error) {
            console.log(error);
        }
    }
};
executeQueries(projectId, sessionId, queries, languageCode);
