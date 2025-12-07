import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, Coins } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  distance: string;
  category: "person" | "nature";
  imageUrl: string;
  userId: string;
  userName: string;
}

interface TaskCardProps {
  task: Task;
  onHelp: (taskId: string) => void;
}

export function TaskCard({ task, onHelp }: TaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative h-40 sm:h-48 overflow-hidden bg-[#F5F5F5]">
          <ImageWithFallback
            src={task.imageUrl}
            alt={task.title}
            className="w-full h-full object-cover"
          />
          <Badge
            className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#FFC107] text-[#030213] hover:bg-[#FFC107] text-xs sm:text-sm"
          >
            <Coins className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            {task.reward} Tokens
          </Badge>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <h3 className="mb-2 text-base sm:text-lg">{task.title}</h3>
          <p className="text-muted-foreground mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
            {task.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{task.distance}</span>
            </div>
            <span className="text-muted-foreground truncate ml-2">by {task.userName}</span>
          </div>

          {/* CTA */}
          <Button
            onClick={() => onHelp(task.id)}
            className="w-full h-10 sm:h-12 bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-full text-sm sm:text-base"
          >
            I can help
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}