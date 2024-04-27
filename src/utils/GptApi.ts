import { ASSISTANT_ID, BASE_URL, OPENAI_API_KEY } from "./constants";

import OpenAI from "openai";

const openai = new OpenAI();

interface MessageContent {
  type: string;
  text: {
    value: string;
    annotations: string[];
  };
}

export const communicateWithAssistant = async (message: string) => {
  const thread = await openai.beta.threads.create();
  const msg = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: message,
  });

  let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: ASSISTANT_ID,
    instructions: "",
  });

  let resp: string = "";
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

// interface ApiResponse {
//   ok: boolean;
//   status: number;
//   json: () => Promise<any>;
// }

// interface AssistantResponse {
//   data?: any;
//   error?: string;
// }

// // Function to send a message to the assistant
// async function sendMessageToAssistant(
//   assistantId: string,
//   message: string
// ): Promise<AssistantResponse> {
//   try {
//     const response: ApiResponse = await fetch(
//       `${BASE_URL}/${assistantId}/messages`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           role: "user",
//           content: message,
//         }),
//       }
//     );

//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     const json = await response.json();
//     return { data: json };
//   } catch (error) {
//     console.error("Error sending message to assistant:", error);
//     return { error: `Failed to send message: ${error}` };
//   }
// }

// export async function communicateWithAssistant(message: string): Promise<any> {
//   const response = await sendMessageToAssistant(ASSISTANT_ID, message);
//   if (response.data) {
//     return response.data;
//   } else if (response.error) {
//     throw new Error(response.error);
//   } else {
//     throw new Error("Failed to get a valid response from Assistant.");
//   }
// }
