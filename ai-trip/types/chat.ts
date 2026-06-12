export interface Message {
  role: "user" | "assistant";
  content: string;
  ui?: string;
}