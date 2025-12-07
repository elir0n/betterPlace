import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Sprout, HandHeart, CheckCircle2 } from "lucide-react";

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const tasks = [
    {
      id: "food",
      title: "Deliver food to a neighbor",
      description: "Help someone in your community with a meal delivery",
      icon: HandHeart,
      tokens: 50,
    },
    {
      id: "park",
      title: "Clean a local park spot",
      description: "Make your neighborhood greener and cleaner",
      icon: Sprout,
      tokens: 50,
    },
  ];

  const handleTaskSelect = (taskId: string) => {
    setSelectedTask(taskId);
    setProgress(50);
  };

  const handleStart = () => {
    setProgress(100);
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F5F5] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Illustration */}
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full bg-[#4CAF50] opacity-20 absolute inset-0 blur-xl" />
            <div className="w-32 h-32 rounded-full bg-[#4CAF50] flex items-center justify-center relative">
              <HandHeart className="w-16 h-16 text-white" />
            </div>
          </motion.div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Welcome to Unity</h1>
          <p className="text-muted-foreground">
            A community marketplace where good deeds become rewards
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Your Progress</span>
            <span className="text-[#FFC107]">{progress}/100 Tokens</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Task Selection */}
        <div className="mb-8">
          <h3 className="mb-4 text-center">Choose your first deed</h3>
          <div className="grid gap-4">
            {tasks.map((task) => {
              const Icon = task.icon;
              return (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`p-6 cursor-pointer transition-all ${
                      selectedTask === task.id
                        ? "border-[#4CAF50] border-2 bg-[#4CAF50] bg-opacity-5"
                        : "hover:border-[#4CAF50] hover:border-opacity-50"
                    }`}
                    onClick={() => handleTaskSelect(task.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                          selectedTask === task.id
                            ? "bg-[#4CAF50]"
                            : "bg-[#F5F5F5]"
                        }`}
                      >
                        <Icon
                          className={`w-8 h-8 ${
                            selectedTask === task.id
                              ? "text-white"
                              : "text-[#4CAF50]"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4>{task.title}</h4>
                          {selectedTask === task.id && (
                            <CheckCircle2 className="w-6 h-6 text-[#4CAF50]" />
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {task.description}
                        </p>
                        <div className="inline-flex items-center gap-2 bg-[#FFC107] bg-opacity-20 text-[#FFC107] px-3 py-1 rounded-full">
                          <span>💰</span>
                          <span>{task.tokens} Tokens</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleStart}
          disabled={!selectedTask}
          className="w-full h-14 bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-full"
        >
          {selectedTask ? "Start Your Journey" : "Select a Task to Begin"}
        </Button>

        <p className="text-center text-muted-foreground mt-4">
          Join thousands of helpers making a difference
        </p>
      </motion.div>
    </div>
  );
}
