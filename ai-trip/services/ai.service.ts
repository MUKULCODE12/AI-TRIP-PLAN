import axios from "axios";
import { Message } from "@/types/chat";

export const sendMessage = async (
  messages: Message[],
  isFinal = false
) => {
  const response = await axios.post("/api/aimodel", {
    messages,
    isFinal,
  });

  return response.data;
};