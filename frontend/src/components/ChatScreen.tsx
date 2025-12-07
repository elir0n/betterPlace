import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowLeft, Send, Star } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface ChatScreenProps {
  helperId: string;
  helperName: string;
  onBack: () => void;
}

export function ChatScreen({
  helperId,
  helperName,
  onBack,
}: ChatScreenProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: helperId,
      text: "Hi! I saw your WiFi router issue. I have experience with TP-Link routers and can help!",
      timestamp: "10:23 AM",
      isOwn: false,
    },
    {
      id: "2",
      senderId: "me",
      text: "That would be great! When are you available?",
      timestamp: "10:25 AM",
      isOwn: true,
    },
    {
      id: "3",
      senderId: helperId,
      text: "I can come by this afternoon around 2 PM if that works for you?",
      timestamp: "10:26 AM",
      isOwn: false,
    },
  ]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Simulate helper response after a delay
    setTimeout(() => {
      const responses = [
        "Sounds good! I'll bring my toolkit.",
        "Perfect! See you then.",
        "Great! Looking forward to helping you.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          senderId: helperId,
          text: randomResponse,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: false,
        },
      ]);
    }, 1500);
  };

  return (
    <div className="h-screen bg-[#F5F5F5] flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <Avatar className="w-12 h-12 border-2 border-[#4CAF50]">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${helperName}`}
              />
              <AvatarFallback>{helperName.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h4>{helperName}</h4>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Star className="w-4 h-4 text-[#FFC107] fill-[#FFC107]" />
                <span>4.8</span>
                <span className="mx-1">•</span>
                <span className="text-[#4CAF50]">Active now</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-6 py-6">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md ${
                  message.isOwn ? "order-2" : "order-1"
                }`}
              >
                <div
                  className={`rounded-2xl px-5 py-3 ${
                    message.isOwn
                      ? "bg-[#4CAF50] text-white rounded-br-sm"
                      : "bg-white rounded-bl-sm shadow-sm"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
                <p
                  className={`text-muted-foreground mt-1 px-2 ${
                    message.isOwn ? "text-right" : "text-left"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              className="flex-1 h-12 rounded-full"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="h-12 w-12 rounded-full bg-[#4CAF50] hover:bg-[#45a049] text-white p-0 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {[
              "What time works?",
              "Do you need my address?",
              "Thanks for helping!",
            ].map((quick, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => setInputMessage(quick)}
                className="rounded-full whitespace-nowrap"
              >
                {quick}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
