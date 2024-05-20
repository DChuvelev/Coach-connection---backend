import OpenAI from "openai";

const openai = new OpenAI();

interface MessageContent {
  type: string;
  text: {
    value: string;
    annotations: string[];
  };
}

export const communicateWithAssistant = async ({
  message,
  assistantId,
}: {
  message: string;
  assistantId: string;
}): Promise<string | undefined> => {
  const thread = await openai.beta.threads.create();

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistantId,
    instructions: "",
  });

  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    for (const message of messages.data.reverse()) {
      // resp += `${message.role} > ${message.content[0].}`;
      if (message.role === "assistant") {
        const answer = message.content[0] as unknown as MessageContent;
        return answer.text.value;
      }
    }
  } else {
    throw new Error("Failed to get a valid response from Assistant.");
  }
};
