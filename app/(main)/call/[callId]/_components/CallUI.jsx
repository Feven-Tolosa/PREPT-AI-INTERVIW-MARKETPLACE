// "use client";

// import { useEffect, useCallback, useState } from "react";

// // ─────────────────────────────────────────────────────────────
// // Stream Video
// // ─────────────────────────────────────────────────────────────

// import {
//   StreamTheme,
//   SpeakerLayout,
//   useCallStateHooks,
//   useCall,
//   CallingState,
//   CallControls,
// } from "@stream-io/video-react-sdk";

// import "@stream-io/video-react-sdk/dist/css/styles.css";

// // ─────────────────────────────────────────────────────────────
// // Stream Chat
// // ─────────────────────────────────────────────────────────────

// import {
//   Chat,
//   Channel,
//   MessageList,
//   Window,
//   useCreateChatClient,
// } from "stream-chat-react";

// import "stream-chat-react/dist/css/index.css";

// // ─────────────────────────────────────────────────────────────
// // UI
// // ─────────────────────────────────────────────────────────────

// import { Badge } from "@/components/ui/badge";

// import { MessageSquare, Sparkles, Loader2, Send } from "lucide-react";

// import AIQuestionsPanel from "./AIQuestions";

// // ─────────────────────────────────────────────────────────────
// // Custom Message Input
// // ─────────────────────────────────────────────────────────────

// function CustomMessageInput() {
//   const [message, setMessage] = useState("");

//   const sendMessage = async () => {
//     if (!message.trim()) return;

//     try {
//       const channel = window.__STREAM_CHAT_CHANNEL__;

//       if (!channel) return;

//       await channel.sendMessage({
//         text: message.trim(),
//       });

//       setMessage("");
//     } catch (error) {
//       console.error("Failed to send message:", error);
//     }
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter" && !event.shiftKey) {
//       event.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <div className="flex items-center gap-2 p-3 border-t border-white/10">
//       <input
//         type="text"
//         value={message}
//         onChange={(event) => setMessage(event.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder="Type a message..."
//         className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-stone-600 outline-none focus:border-amber-400/50"
//       />

//       <button
//         type="button"
//         onClick={sendMessage}
//         disabled={!message.trim()}
//         className="flex items-center justify-center rounded-lg bg-amber-400 p-2 text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
//       >
//         <Send size={16} />
//       </button>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // Call UI
// // ─────────────────────────────────────────────────────────────

// export default function CallUI({
//   callId,
//   isInterviewer,
//   booking,
//   onLeave,
//   apiKey,
//   token,
//   currentUser,
// }) {
//   const { useCallCallingState } = useCallStateHooks();

//   const call = useCall();

//   const callingState = useCallCallingState();

//   const [activeTab, setActiveTab] = useState("chat");

//   const [chatChannel, setChatChannel] = useState(null);

//   // ───────────────────────────────────────────────────────────
//   // Leave Call
//   // ───────────────────────────────────────────────────────────

//   const handleLeave = useCallback(async () => {
//     try {
//       if (call) {
//         const isRecording = call.state?.recording;

//         if (isRecording) {
//           await call.stopRecording().catch(() => {});
//         }

//         await call.leave().catch(() => {});
//       }
//     } finally {
//       onLeave();
//     }
//   }, [call, onLeave]);

//   // ───────────────────────────────────────────────────────────
//   // Create Chat Client
//   // ───────────────────────────────────────────────────────────

//   const chatClient = useCreateChatClient({
//     apiKey,

//     tokenOrProvider: token,

//     userData: {
//       id: currentUser.id,
//       name: currentUser.name,
//       image: currentUser.imageUrl,
//     },
//   });

//   // ───────────────────────────────────────────────────────────
//   // Create Chat Channel
//   // ───────────────────────────────────────────────────────────

//   useEffect(() => {
//     if (!chatClient || !booking) return;

//     const channel = chatClient.channel("messaging", callId, {
//       name: "Interview Chat",

//       members: [
//         booking.interviewer.clerkUserId,
//         booking.interviewee.clerkUserId,
//       ],
//     });

//     channel
//       .watch()
//       .then(() => {
//         setChatChannel(channel);

//         // Make the channel available to CustomMessageInput
//         window.__STREAM_CHAT_CHANNEL__ = channel;
//       })
//       .catch((error) => {
//         console.error("Failed to watch chat channel:", error);
//       });

//     return () => {
//       channel.stopWatching().catch(() => {});

//       setChatChannel(null);

//       window.__STREAM_CHAT_CHANNEL__ = null;
//     };
//   }, [chatClient, callId, booking]);

//   // ───────────────────────────────────────────────────────────
//   // Call Left
//   // ───────────────────────────────────────────────────────────

//   if (callingState === CallingState.LEFT) {
//     return (
//       <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center gap-3">
//         <p className="text-stone-400 text-sm">Leaving call…</p>
//       </div>
//     );
//   }

//   // ───────────────────────────────────────────────────────────
//   // Main UI
//   // ───────────────────────────────────────────────────────────

//   return (
//     <div className="min-h-[92vh] bg-[#0a0a0b] flex flex-col overflow-hidden">
//       {/* ─────────────────────────────────────────────── */}
//       {/* TOP BAR */}
//       {/* ─────────────────────────────────────────────── */}

//       <div className="flex items-center justify-between px-6 py-3 border-b border-white/8 shrink-0">
//         <div className="flex items-center gap-2">
//           <Badge
//             variant="outline"
//             className="border-white/10 text-stone-500 text-xs"
//           >
//             {booking.interviewer.name}

//             <span className="text-stone-700 mx-1.5">×</span>

//             {booking.interviewee.name}
//           </Badge>

//           {isInterviewer && (
//             <Badge
//               variant="outline"
//               className="border-amber-400/20 bg-amber-400/5 text-amber-400 text-xs"
//             >
//               Interviewer
//             </Badge>
//           )}
//         </div>
//       </div>

//       {/* ─────────────────────────────────────────────── */}
//       {/* BODY */}
//       {/* ─────────────────────────────────────────────── */}

//       <div className="flex flex-1 min-h-0">
//         {/* ───────────────────────────────────────────── */}
//         {/* VIDEO AREA */}
//         {/* ───────────────────────────────────────────── */}

//         <div className="flex flex-col flex-1 min-w-0">
//           <StreamTheme>
//             <SpeakerLayout participantBarPosition="bottom" />

//             <CallControls onLeave={handleLeave} />
//           </StreamTheme>
//         </div>

//         {/* ───────────────────────────────────────────── */}
//         {/* RIGHT PANEL */}
//         {/* ───────────────────────────────────────────── */}

//         <div className="w-85 shrink-0 flex flex-col border-l border-white/8 bg-[#0a0a0b]">
//           {/* ─────────────────────────────────────────── */}
//           {/* TABS */}
//           {/* ─────────────────────────────────────────── */}

//           <div className="flex border-b border-white/8 shrink-0">
//             {/* CHAT TAB */}

//             <button
//               type="button"
//               onClick={() => setActiveTab("chat")}
//               className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${
//                 activeTab === "chat"
//                   ? "text-amber-400 border-b-2 border-amber-400"
//                   : "text-stone-500 hover:text-stone-300"
//               }`}
//             >
//               <MessageSquare size={13} />
//               Chat
//             </button>

//             {/* AI QUESTIONS TAB */}

//             {isInterviewer && (
//               <button
//                 type="button"
//                 onClick={() => setActiveTab("ai")}
//                 className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${
//                   activeTab === "ai"
//                     ? "text-amber-400 border-b-2 border-amber-400"
//                     : "text-stone-500 hover:text-stone-300"
//                 }`}
//               >
//                 <Sparkles size={13} />
//                 AI Questions
//               </button>
//             )}
//           </div>

//           {/* ─────────────────────────────────────────── */}
//           {/* PANEL CONTENT */}
//           {/* ─────────────────────────────────────────── */}

//           <div className="flex-1 min-h-0 overflow-hidden">
//             {/* CHAT */}

//             {activeTab === "chat" ? (
//               chatClient && chatChannel ? (
//                 <Chat client={chatClient} theme="str-chat__theme-dark">
//                   <Channel channel={chatChannel}>
//                     <Window>
//                       <MessageList />

//                       <CustomMessageInput />
//                     </Window>
//                   </Channel>
//                 </Chat>
//               ) : (
//                 <div className="flex items-center justify-center h-full">
//                   <Loader2 size={18} className="text-stone-600 animate-spin" />
//                 </div>
//               )
//             ) : (
//               /* AI QUESTIONS */

//               <div className="p-4 h-full overflow-y-scroll max-h-screen">
//                 <AIQuestionsPanel categories={booking.categories} />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useCallback, useState } from "react";

// ─────────────────────────────────────────────────────────────
// Stream Video
// ─────────────────────────────────────────────────────────────

import {
  StreamTheme,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
  CallingState,
  CallControls,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

// ─────────────────────────────────────────────────────────────
// Stream Chat
// ─────────────────────────────────────────────────────────────

import {
  Chat,
  Channel,
  MessageList,
  Window,
  useCreateChatClient,
} from "stream-chat-react";

import "stream-chat-react/dist/css/index.css";

// ─────────────────────────────────────────────────────────────
// UI
// ─────────────────────────────────────────────────────────────

import { Badge } from "@/components/ui/badge";
import { MessageSquare, Sparkles, Loader2, Send } from "lucide-react";

import AIQuestionsPanel from "./AIQuestions";

// ─────────────────────────────────────────────────────────────
// Custom Message Input
// ─────────────────────────────────────────────────────────────

function CustomMessageInput({ channel }) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || !channel || isSending) {
      return;
    }

    try {
      setIsSending(true);

      await channel.sendMessage({
        text,
      });

      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t border-white/10">
      <input
        type="text"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={isSending}
        className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-stone-600 outline-none focus:border-amber-400/50 disabled:opacity-50"
      />

      <button
        type="button"
        onClick={sendMessage}
        disabled={!message.trim() || isSending}
        className="flex items-center justify-center rounded-lg bg-amber-400 p-2 text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Call UI
// ─────────────────────────────────────────────────────────────

export default function CallUI({
  callId,
  isInterviewer,
  booking,
  onLeave,
  apiKey,
  token,
  currentUser,
}) {
  const { useCallCallingState } = useCallStateHooks();

  const call = useCall();

  const callingState = useCallCallingState();

  const [activeTab, setActiveTab] = useState("chat");

  const [chatChannel, setChatChannel] = useState(null);

  // ───────────────────────────────────────────────────────────
  // Create Stream Chat Client
  // ───────────────────────────────────────────────────────────

  const chatClient = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,

    userData: {
      id: currentUser.id,
      name: currentUser.name || currentUser.id,
      image: currentUser.imageUrl || undefined,
    },
  });

  // ───────────────────────────────────────────────────────────
  // Create Chat Channel
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!chatClient || !booking || !callId) {
      return;
    }

    let cancelled = false;

    const setupChannel = async () => {
      try {
        const channel = chatClient.channel("messaging", callId, {
          name: "Interview Chat",

          members: [
            booking.interviewer.clerkUserId,
            booking.interviewee.clerkUserId,
          ],
        });

        await channel.watch();

        if (cancelled) {
          return;
        }

        setChatChannel(channel);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to watch chat channel:", error);
        }
      }
    };

    setupChannel();

    return () => {
      cancelled = true;

      setChatChannel(null);

      // Do not call:
      // chatClient.disconnect()
      // chatClient.disconnectUser()
      // channel.stopWatching()
      //
      // The useCreateChatClient hook manages the client lifecycle.
    };
  }, [chatClient, callId, booking]);

  // ───────────────────────────────────────────────────────────
  // Leave Call
  // ───────────────────────────────────────────────────────────

  const handleLeave = useCallback(async () => {
    try {
      if (call) {
        const isRecording = call.state?.recording;

        if (isRecording) {
          await call.stopRecording().catch(() => {});
        }

        await call.leave().catch(() => {});
      }
    } finally {
      onLeave();
    }
  }, [call, onLeave]);

  // ───────────────────────────────────────────────────────────
  // Call Left
  // ───────────────────────────────────────────────────────────

  if (callingState === CallingState.LEFT) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center gap-3">
        <p className="text-stone-400 text-sm">Leaving call…</p>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────
  // Main UI
  // ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-[92vh] bg-[#0a0a0b] flex flex-col overflow-hidden">
      {/* TOP BAR */}

      <div className="flex items-center justify-between px-6 py-3 border-b border-white/8 shrink-0">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-white/10 text-stone-500 text-xs"
          >
            {booking.interviewer.name}

            <span className="text-stone-700 mx-1.5">×</span>

            {booking.interviewee.name}
          </Badge>

          {isInterviewer && (
            <Badge
              variant="outline"
              className="border-amber-400/20 bg-amber-400/5 text-amber-400 text-xs"
            >
              Interviewer
            </Badge>
          )}
        </div>
      </div>

      {/* BODY */}

      <div className="flex flex-1 min-h-0">
        {/* VIDEO AREA */}

        <div className="flex flex-col flex-1 min-w-0">
          <StreamTheme>
            <SpeakerLayout participantBarPosition="bottom" />

            <CallControls onLeave={handleLeave} />
          </StreamTheme>
        </div>

        {/* RIGHT PANEL */}

        <div className="w-85 shrink-0 flex flex-col border-l border-white/8 bg-[#0a0a0b]">
          {/* TABS */}

          <div className="flex border-b border-white/8 shrink-0">
            {/* CHAT TAB */}

            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${
                activeTab === "chat"
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-stone-500 hover:text-stone-300"
              }`}
            >
              <MessageSquare size={13} />
              Chat
            </button>

            {/* AI QUESTIONS TAB */}

            {isInterviewer && (
              <button
                type="button"
                onClick={() => setActiveTab("ai")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${
                  activeTab === "ai"
                    ? "text-amber-400 border-b-2 border-amber-400"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                <Sparkles size={13} />
                AI Questions
              </button>
            )}
          </div>

          {/* PANEL CONTENT */}

          <div className="flex-1 min-h-0 overflow-hidden">
            {/* CHAT */}

            {activeTab === "chat" ? (
              chatClient && chatChannel ? (
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={chatChannel}>
                    <Window>
                      <MessageList />

                      <CustomMessageInput channel={chatChannel} />
                    </Window>
                  </Channel>
                </Chat>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Loader2 size={18} className="text-stone-600 animate-spin" />
                </div>
              )
            ) : (
              /* AI QUESTIONS */

              <div className="p-4 h-full overflow-y-scroll max-h-screen">
                <AIQuestionsPanel categories={booking.categories} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
