import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ArrowLeft, Star, MessageCircle, Coins, MapPin } from "lucide-react";

interface Helper {
  id: string;
  name: string;
  rating: number;
  avatar: string;
  completedTasks: number;
  distance: string;
}

interface RequestDetailScreenProps {
  requestId: string;
  onBack: () => void;
  onChatWithHelper: (helperId: string, helperName: string) => void;
  onViewHelperProfile: (helperId: string) => void;
}

export function RequestDetailScreen({
  requestId,
  onBack,
  onChatWithHelper,
  onViewHelperProfile,
}: RequestDetailScreenProps) {
  // Mock request data
  const request = {
    id: requestId,
    title: "Fix my WiFi router",
    description:
      "My internet keeps dropping every few minutes. Need someone tech-savvy to help diagnose and fix the issue. Router is a TP-Link model.",
    reward: 25,
    imageUrl: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2",
    category: "Tech Support",
    postedDate: "2 hours ago",
    location: "Downtown Area",
  };

  // Mock helpers who have offered to help
  const helpers: Helper[] = [
    {
      id: "1",
      name: "Eric",
      rating: 4.8,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eric",
      completedTasks: 24,
      distance: "0.3 km away",
    },
    {
      id: "2",
      name: "Sarah",
      rating: 4.9,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      completedTasks: 42,
      distance: "0.5 km away",
    },
    {
      id: "3",
      name: "Mike",
      rating: 4.7,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      completedTasks: 18,
      distance: "0.8 km away",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header with Background Image */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#4CAF50] to-[#66BB6A]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={request.imageUrl}
            alt={request.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Header Content */}
        <div className="relative h-full max-w-4xl mx-auto px-6 py-6 flex flex-col">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full text-white hover:bg-white hover:bg-opacity-20 w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {/* Title and Reward */}
          <div className="mt-auto text-white">
            <Badge className="mb-3 bg-white/20 text-white hover:bg-white/20">
              {request.category}
            </Badge>
            <h2 className="mb-3">{request.title}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#FFC107] text-[#030213] px-4 py-2 rounded-full">
                <Coins className="w-5 h-5" />
                <span>{request.reward} Tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{request.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Request Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h3 className="mb-4">Description</h3>
            <p className="text-muted-foreground mb-4">{request.description}</p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>Posted {request.postedDate}</span>
            </div>
          </Card>
        </motion.div>

        {/* Offers Received */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3>Offers Received</h3>
              <Badge className="bg-[#FF3B30] text-white hover:bg-[#FF3B30]">
                {helpers.length} {helpers.length === 1 ? "offer" : "offers"}
              </Badge>
            </div>

            <div className="space-y-4">
              {helpers.map((helper, index) => (
                <motion.div
                  key={helper.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onViewHelperProfile(helper.id)}
                        className="cursor-pointer"
                      >
                        <Avatar className="w-16 h-16 border-2 border-[#4CAF50]">
                          <AvatarImage src={helper.avatar} />
                          <AvatarFallback>{helper.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </motion.div>

                      {/* Helper Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="mb-1">{helper.name}</h4>
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-[#FFC107] fill-[#FFC107]" />
                                <span>{helper.rating}</span>
                              </div>
                              <span>•</span>
                              <span>{helper.completedTasks} tasks completed</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{helper.distance}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          onClick={() => onChatWithHelper(helper.id, helper.name)}
                          className="w-full md:w-auto h-12 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] hover:from-[#45a049] hover:to-[#5da95f] text-white rounded-full mt-4"
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Chat with {helper.name}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {helpers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No offers yet. Check back soon!
                </p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Card className="p-6 bg-[#FFC107] bg-opacity-10 border-[#FFC107] border-opacity-30">
            <div className="flex gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="mb-2">Tips for choosing a helper</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Check their rating and completed tasks</li>
                  <li>• Chat to discuss details before accepting</li>
                  <li>• Choose someone nearby for faster help</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
