"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const GenerateProgramPage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  type ChatMessage = { content: string; role: "user" | "assistant" | string };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [callEnded, setCallEnded] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // SOLUTION to get rid of "Meeting has ended" error
  useEffect(() => {
    const originalError = console.error;
    //override console.error to ignore "Meeting has ended" error
    console.error = (msg?, ...args) => {
      if (
        msg &&
        (msg.includes("Meeting has ended") ||
          (args[0] && args[0].toString().includes("Meeting has ended")))
      ) {
        console.log("Ignored error: Meeting has ended");
        return; // don't pass the origional handler
      }
      // pass all other errors to the origional handler
      return originalError(msg, ...args);
    };

    // restore origional console.error on unmount
    return () => {
      console.error = originalError;
    };
  }, []);

  //auto-scroll messages
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  //navigate to profile page after call ended
  useEffect(() => {
    if (callEnded) {
      const redirectTimer = setTimeout(() => {
        router.push("/profile");
      }, 1500);
      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router]);

  //setup event listeners for vapi
  useEffect(() => {
    const handleCallStart = () => {
      console.log("Call started");
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };

    const handleCallEnd = () => {
      console.log("Call ended");
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    };

    const handleSpeechStart = () => {
      console.log("AI started speaking");
      setIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
      console.log("AI finished speaking");
      setIsSpeaking(false);
    };

    type VapiMessage = {
      type?: string;
      transcriptType?: string;
      transcript?: string;
      role?: string;
    };
    const handleMessage = (message: VapiMessage) => {
      if (
        message?.type === "transcript" &&
        message?.transcriptType === "final" &&
        typeof message.transcript === "string" &&
        typeof message.role === "string"
      ) {
        const newMessage: ChatMessage = {
          content: message.transcript,
          role: message.role,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const handleError = (error: any) => {
      console.log("Vapi error:", error);
      setConnecting(false);
      setCallActive(false);
    };

    // Attach listeners (no chaining; .on returns void in some SDK versions)
    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("message", handleMessage);
    vapi.on("error", handleError);

    // cleanup event listeners on unmount
    return () => {
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("message", handleMessage);
      vapi.off("error", handleError);
    };
  }, []);

  const toggleCall = async () => {
    if (callActive) vapi.stop();
    else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);

        const fullName = user?.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : "Friend";

        const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
        const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;

        if (assistantId) {
          await vapi.start({
            assistantId,
            metadata: {
              full_name: fullName,
              user_id: user?.id,
            },
          });
        } else if (workflowId) {
          await vapi.start({
            workflowId,
            variableValues: {
              full_name: fullName,
              user_id: user?.id,
            },
          });
        } else {
          throw new Error(
            "Missing NEXT_PUBLIC_VAPI_ASSISTANT_ID (preferred) or NEXT_PUBLIC_VAPI_WORKFLOW_ID"
          );
        }
      } catch (error) {
        console.log("Failed to start call", error);
        setConnecting(false);
      }
    }
  };

  return (
  <div className="flex flex-col min-h-screen text-foreground overflow-hidden pb-6 pt-24">
    <div className="container mx-auto px-4 h-full max-w-5xl">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-mono">
          <span >
            Generate your
          </span>
          <span className="text-primary uppercase"> Fitness Programme</span>
        </h1>
          <p className="text-muted-foreground mt-2">
            Have a voice conversation with our AI assistant to create your personalized plan
          </p>
      </div>

      {/* VIDEO CALL AREA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* AI ASSISTANT CARD */}
        <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative">
        <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
          {/* AI VOICE ANIMATION */}
          <div 
          className={`absolute inset-0 ${
            isSpeaking ? "opacity-30" : "opacity-0"
          } transition-opacity duration-300`}>
            {/* Voice Wave Animation when Speaking */}
            <div className="absolute left-0 right-0 top-1/2-translate-y-1/2 flex justify-center items-center h-20">
            {[...Array(5)].map((_, i) => (
              <div 
              key={i}
              className={`mx-1 h-16 w-1 bg-primary rounded-full ${isSpeaking ? "animate-sound-wave" : ""}`} style={{animationDelay: `${i* 0.1}s`,
            height: isSpeaking ? `${Math.random() * 50 + 20}%` : "5%",
          }} />
            ))}
            </div>
          </div>

          {/* AI IMAGE */}
          <div className="relative size-32 mb-4">
            <div className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${
              isSpeaking ? "animate-pulse" : ""
            }`} />
            <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center border border-border overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10"></div>
              <img
                src="/ai-avatar.png"
                alt="AI Assistant"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

            <h2 className="text-xl font-bold text-foreground">Ai Assistant Trainer</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Fitness & Diet Coach
            </p>

            {/* SPEAKING INDICATOR */}
            <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border ${
                  isSpeaking ? "border-primary" : ""
                }`}
              >
              <div 
              className={`w-2 h-2 rounded-full ${
                isSpeaking ? "bg-green-500 animate-pulse" : "bg-muted"
              }`} />

              <span className="text-xs text-muted-foreground">
                  {isSpeaking ? "Speaking..." : callActive ? "Listening" : callEnded ? "Redirecting to profile..." : "Waiting..."}
                </span>
              </div>
          </div>
        </Card>

        {/* USER CARD */}
        <Card className="bg-card/90 backdrop-blur-sm border overflow-hidden relative">
        <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
          {/* USER IMAGE */}
          <div className="relative size-32 mb-4">
            <img src={user?.imageUrl}
             alt="User" 
             className="size-full object-cover rounded-full" />
          </div>
            <h2 className="text-xl font-bold text-foreground">Me</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {user ? user.firstName + " " + user.lastName || " " : "Guest"}
            </p>

            {/* User Ready Text */}
            <div className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border`}
            >
              <div className={`w-2 h-2 rounded-full bg-green-500`} />
              <span className="text-xs text-muted-foreground">Ready</span>
            </div>
        </div>
        </Card>
      </div>

      {/* MESSAGE COUNTER */}
      {messages.length > 0 && (
        <div
        ref={messageContainerRef}
        className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 mb-8 h-64 overflow-y-auto transition-all duration-300 scroll-smooth"
        >
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div 
              key={index}
              className="message-item animate-fadeIn">
                 <div className="font-semibold text-xs text-muted-foreground mb-1">
                  {msg.role === "assistant" ? "Ai Assistant Trainer" : "Me"}
              </div>
              <p className="text-foreground">
                {msg.content}
              </p>
              </div>
            ))}

            {callEnded && (
              <div className="message-Item animate-fadeIn">
                <div className="font-semibold text-xs text-primary mb-1">
                  System:
                </div>
                <p className="text-foreground">
                  Your personalized fitness program has been generated and saved to your profile. Redirecting to your profile...
                </p>
              </div> 
              )}
          </div>
        </div>
      )}

      {/* CALL CONTROLS */}
      <div className="w-full flex justify-center gap-4">
        <Button
            className={`w-40 text-xl rounded-3xl ${
              callActive
                ? "bg-destructive hover:bg-destructive/90"
                : callEnded
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-primary hover:bg-primary/90"
            } text-white relative`}
            onClick={toggleCall}
            disabled={connecting || callEnded}
            >
              {connecting && ( <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75"></span>)}
              <span>
              {callActive ? "End Call" : connecting ? "Connecting..." : callEnded ? "View Profile" : "Start Call"}
              </span>
        </Button>
      </div>
    </div>
  </div>
)
};

export default GenerateProgramPage;
