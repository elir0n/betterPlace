import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Camera, ArrowLeft, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface TaskVerificationScreenProps {
  taskTitle: string;
  taskReward: number;
  beforeImageUrl: string;
  onBack: () => void;
  onComplete: () => void;
}

export function TaskVerificationScreen({
  taskTitle,
  taskReward,
  beforeImageUrl,
  onBack,
  onComplete,
}: TaskVerificationScreenProps) {
  const [afterPhoto, setAfterPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleSubmit = () => {
    if (!afterPhoto) {
      return;
    }

    setIsSubmitting(true);
    setShowAnimation(true);

    // Simulate submission delay
    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2>Task Verification</h2>
              <p className="text-muted-foreground">{taskTitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Info Card */}
          <Card className="p-6 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2">Almost done!</h3>
                <p className="opacity-90">
                  Submit proof of completion to earn your tokens
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-1">💰</div>
                <div>{taskReward} Tokens</div>
              </div>
            </div>
          </Card>

          {/* Before Photo */}
          <Card className="p-6">
            <Label className="mb-3">Before</Label>
            <div className="relative rounded-xl overflow-hidden h-64 bg-[#F5F5F5]">
              <ImageWithFallback
                src={beforeImageUrl}
                alt="Before"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full">
                Original
              </div>
            </div>
          </Card>

          {/* After Photo */}
          <Card className="p-6">
            <Label className="mb-3">After (Proof of Work)</Label>
            <motion.div
              className={`relative rounded-xl overflow-hidden h-64 flex flex-col items-center justify-center cursor-pointer transition-all ${
                afterPhoto
                  ? "bg-[#4CAF50] bg-opacity-10 border-2 border-[#4CAF50]"
                  : "bg-[#F5F5F5] border-2 border-dashed border-border hover:border-[#4CAF50]"
              }`}
              onClick={() => !isSubmitting && setAfterPhoto(!afterPhoto)}
              whileHover={{ scale: afterPhoto ? 1 : 1.02 }}
            >
              {afterPhoto ? (
                <>
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09"
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-[#4CAF50] text-white px-3 py-1 rounded-full flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Completed
                  </div>
                </>
              ) : (
                <>
                  <Camera className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    Take or upload a photo of the completed task
                  </p>
                </>
              )}
            </motion.div>
          </Card>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!afterPhoto || isSubmitting}
            className="w-full h-14 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] hover:from-[#45a049] hover:to-[#5da95f] text-white rounded-full"
          >
            {isSubmitting ? "Submitting..." : "Submit for Approval"}
          </Button>
        </motion.div>
      </div>

      {/* Token Animation Overlay */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 1,
                times: [0, 0.6, 1],
                ease: "easeOut",
              }}
              className="bg-white rounded-3xl p-12 text-center shadow-2xl"
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-8xl mb-4"
              >
                💰
              </motion.div>
              <h2 className="mb-2">Task Approved!</h2>
              <p className="text-muted-foreground mb-4">
                You've earned {taskReward} tokens
              </p>
              <div className="flex items-center justify-center gap-2 text-[#FFC107]">
                <Sparkles className="w-5 h-5" />
                <span>+{taskReward} Tokens</span>
                <Sparkles className="w-5 h-5" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`font-medium mb-2 ${className}`}>{children}</div>;
}
