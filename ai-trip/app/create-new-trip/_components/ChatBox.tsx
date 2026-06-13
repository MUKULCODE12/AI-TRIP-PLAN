"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Send } from "lucide-react";
import React, { useState, useEffect, useRef, Suspense, useCallback } from "react";
import type { RefObject } from "react";
import { useSearchParams } from "next/navigation";
import EmptyBoxState from "./EmptyBoxState";
import GroupSizeUi from "./GroupSizeUi";
import BudgetUi from "./BudgetUi";
import SelectDaysUi from "./SelectDaysUi";
import FinalUi from "./FinalUi";
import axios from "axios";

import { useUserDetail } from "@/app/provider";

import { Message } from "@/types/chat";
import { sendMessage } from "@/services/ai.service";
import { useTripStore } from "@/store/tripStore";
const generateUUID = () => {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 15);
};


function ChatContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]);

  // Keep ref in sync with state so callbacks always have latest messages
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  
  const searchParams = useSearchParams();
  const hasTriggered = useRef(false);

 
  const { userDetail } = useUserDetail();
  const setTripData =
  useTripStore((state) => state.setTripData);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const onSend = useCallback(async (input?: string) => {
    const text = input ?? userInput;
    if (!text?.trim()) return;

    setLoading(true);
    const newMsg: Message = { role: "user", content: text };

    // Use ref to get latest messages, avoiding stale closure
    const updatedMessages = [...messagesRef.current, newMsg];

    setMessages(updatedMessages);
    setUserInput("");

    try {
      const res = await sendMessage(
  updatedMessages,
  false
);

if (res?.error) {
  throw new Error(res.error);
}

setMessages((prev) => [
  ...prev,
  {
    role: "assistant",
    content: res.responseText,
    ui: res.ui,
  },
]);
    } catch (error: any) {
      console.error("CHAT ERROR:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [userInput]);

  useEffect(() => {
    const prompt = searchParams.get("prompt");
    
    if (!hasTriggered.current) {
      if (prompt) {
        hasTriggered.current = true;
        onSend(prompt);
      } else if (messages.length === 0) {
        // Optional: Auto-start if they hit the page directly
      }
    }
  }, [searchParams, onSend, messages.length]);

  const handleFinalGenerate = async () => {
  if (!messages.length || !userDetail?.id) return;

  setLoading(true);

  try {
    const res = await sendMessage(
      messages,
      true
    );

    if (res?.error) {
      throw new Error(res.error);
    }

    const tripPlan = res.trip_plan;

    // Update itinerary panel
    setTripData({
      trip_plan: tripPlan,
    });

    await axios.post(
  `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/trips`,
  {
    tripId: generateUUID(),
    tripData: tripPlan,
    userId: userDetail?.id,
  }
);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "✨ Your trip has been generated and saved! Check the itinerary on the right panel.",
      },
    ]);
  } catch (error: any) {
    console.error("SAVE ERROR:", error);
  } finally {
    setLoading(false);
  }
};

  const RenderGenerativeUi = (ui?: string) => {
    switch (ui) {
      case "budget": return <BudgetUi onSelectedOption={onSend} />;
      case "groupSize": return <GroupSizeUi onSelectedOption={onSend} />;
      case "tripDuration": return <SelectDaysUi onSelectedOption={onSend} />;
      case "final": return <FinalUi viewTrip={handleFinalGenerate} disable={loading} />;
      default: return null;
    }
  }; 

  return (
    <div className="h-[85vh] flex flex-col">
      <section ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && <EmptyBoxState onSelectOption={onSend} />}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-4 py-2 rounded-2xl ${msg.role === "user" ? "bg-primary text-white" : "bg-gray-100 text-black shadow-sm"}`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.role === "assistant" && <div className="mt-4">{RenderGenerativeUi(msg.ui)}</div>}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-2xl">
              <Loader className="animate-spin h-5 w-5" />
            </div>
          </div>
        )}
      </section>

      <footer className="p-4">
        <div className="border rounded-2xl p-4 relative bg-white shadow-md">
          <Textarea
            placeholder="Plan your next adventure..."
            className="w-full h-24 border-none focus-visible:ring-0 resize-none text-base p-0"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => { 
              if (e.key === "Enter" && !e.shiftKey) { 
                e.preventDefault(); 
                onSend(); 
              } 
            }}
          />
          <Button
            size="icon"
            className="absolute bottom-4 right-4 rounded-full"
            onClick={() => onSend()}
            disabled={loading || !userInput.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

export default function ChatBox() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <Loader className="animate-spin" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}