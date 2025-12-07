import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Award,
  CheckCircle2,
} from "lucide-react";

interface HelperProfileScreenProps {
  helperId: string;
  onBack: () => void;
}

export function HelperProfileScreen({
  helperId,
  onBack,
}: HelperProfileScreenProps) {
  // Mock helper data
  const helper = {
    id: helperId,
    name: "Eric",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Eric`,
    rating: 4.8,
    tasksCompleted: 24,
    memberSince: "Aug 2023",
    location: "Downtown Area",
    bio: "Tech enthusiast with 5+ years of experience helping people with their technology needs. Specialized in networking, WiFi routers, and smart home devices.",
    badges: [
      { icon: "💻", label: "Tech Expert", unlocked: true },
      { icon: "⚡", label: "Quick Responder", unlocked: true },
      { icon: "🌟", label: "Top Rated", unlocked: true },
    ],
    recentReviews: [
      {
        id: "1",
        userName: "Sarah M.",
        rating: 5,
        comment: "Very knowledgeable and patient. Fixed my WiFi issue quickly!",
        date: "2 days ago",
      },
      {
        id: "2",
        userName: "John D.",
        rating: 5,
        comment: "Great helper! Explained everything clearly.",
        date: "1 week ago",
      },
      {
        id: "3",
        userName: "Emma L.",
        rating: 4,
        comment: "Helpful and friendly. Would recommend!",
        date: "2 weeks ago",
      },
    ],
    skills: [
      "WiFi Troubleshooting",
      "Router Setup",
      "Network Security",
      "Smart Home",
      "Computer Repair",
    ],
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2196F3] to-[#42A5F5] text-white">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full mb-4 text-white hover:bg-white hover:bg-opacity-20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {/* Profile Header */}
          <div className="flex items-start gap-6 mb-6">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={helper.avatar} />
              <AvatarFallback>{helper.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2>{helper.name}</h2>
                <Badge className="bg-[#FFC107] text-[#030213] hover:bg-[#FFC107]">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Top Rated
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 fill-white" />
                <span className="text-xl">{helper.rating}</span>
                <span className="opacity-80">
                  • {helper.tasksCompleted} tasks completed
                </span>
              </div>
              <div className="flex items-center gap-4 opacity-90">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{helper.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {helper.memberSince}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-[#030213]">95%</div>
              <div className="text-muted-foreground">Response Rate</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl mb-1">✓</div>
              <div className="text-[#030213]">98%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl mb-1">🕒</div>
              <div className="text-[#030213]">&lt;1h</div>
              <div className="text-muted-foreground">Avg Response</div>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h3 className="mb-4">About</h3>
            <p className="text-muted-foreground">{helper.bio}</p>
          </Card>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h3 className="mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {helper.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-[#4CAF50] bg-opacity-10 text-[#4CAF50] hover:bg-[#4CAF50] hover:bg-opacity-20"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h3 className="mb-4">Achievements</h3>
            <div className="grid grid-cols-3 gap-4">
              {helper.badges.map((badge, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-[#FFC107] to-[#FFD54F]"
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <div className="text-[#030213]">{badge.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3>Recent Reviews</h3>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#FFC107] fill-[#FFC107]" />
                <span>{helper.rating} average</span>
              </div>
            </div>

            <div className="space-y-4">
              {helper.recentReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-[#F5F5F5]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="mb-1">{review.userName}</h4>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-[#FFC107] fill-[#FFC107]"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}