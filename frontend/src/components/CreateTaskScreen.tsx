import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Card } from "./ui/card";
import {
  Wifi,
  Home,
  Trees,
  Wrench,
  GraduationCap,
  ShoppingBag,
  ArrowLeft,
  Camera,
  Mic,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../services/api";

interface CreateTaskScreenProps {
  onBack: () => void;
  onComplete: () => void;
  userTokens: number;
}

export function CreateTaskScreen({
  onBack,
  onComplete,
  userTokens,
}: CreateTaskScreenProps) {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState([25]);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: "tech", label: "Tech Support", icon: Wifi, color: "#2196F3" },
    { id: "home", label: "Home Help", icon: Home, color: "#FF9800" },
    { id: "outdoor", label: "Outdoor", icon: Trees, color: "#4CAF50" },
    { id: "repair", label: "Repairs", icon: Wrench, color: "#9C27B0" },
    { id: "education", label: "Teaching", icon: GraduationCap, color: "#E91E63" },
    { id: "shopping", label: "Shopping", icon: ShoppingBag, color: "#00BCD4" },
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep(2);
  };

  const getSuggestedReward = () => {
    if (selectedCategory === "tech") return { min: 20, max: 50, suggested: 30 };
    if (selectedCategory === "home") return { min: 30, max: 60, suggested: 40 };
    if (selectedCategory === "outdoor") return { min: 25, max: 50, suggested: 35 };
    if (selectedCategory === "repair") return { min: 35, max: 70, suggested: 50 };
    if (selectedCategory === "education")
      return { min: 40, max: 80, suggested: 60 };
    return { min: 20, max: 60, suggested: 30 };
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (reward[0] > userTokens) {
      toast.error(`You only have ${userTokens} tokens available`);
      return;
    }

    setIsLoading(true);
    try {
      // Map frontend categories to backend enum
      const categoryMap: Record<string, string> = {
        tech: 'tech-help',
        home: 'cleaning',
        outdoor: 'maintenance',
        repair: 'maintenance',
        education: 'tutoring',
        shopping: 'shopping'
      };

      await api.tasks.create({
        title,
        description,
        category: categoryMap[selectedCategory || ''] || 'other',
        tokenReward: reward[0],
        location: { address: "Tel Aviv", coordinates: [34.7818, 32.0853] } // Hardcoded for now as frontend doesn't have location picker yet
      });

      toast.success(`Task "${title}" created successfully! 🎉`);
      setTimeout(() => {
        onComplete();
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  const suggested = getSuggestedReward();
  // Ensure max is at least min, and cap at userTokens if possible, but don't break if userTokens < min (just show error)
  const maxReward = Math.max(suggested.min, Math.min(suggested.max, userTokens));
  const isBalanceLow = userTokens < suggested.min;

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
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2>Create a Task</h2>
              <p className="text-muted-foreground">Step {step} of 3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Step 1: Category Selection */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="mb-6">What kind of help do you need?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card
                      className="p-6 cursor-pointer hover:shadow-lg transition-all text-center"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <div
                        className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <Icon className="w-8 h-8" style={{ color: category.color }} />
                      </div>
                      <h4>{category.label}</h4>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h3 className="mb-6">Describe your task</h3>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Fix my WiFi router"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 h-12"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="description">Description</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#2196F3]"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Voice input
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Provide more details about what you need help with..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 min-h-32"
                  />
                </div>

                <div>
                  <Label>Photo (Optional)</Label>
                  <div
                    className="mt-2 border-2 border-dashed border-border rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-[#4CAF50] transition-colors"
                    onClick={() => setHasPhoto(!hasPhoto)}
                  >
                    <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      {hasPhoto ? "Photo added ✓" : "Take or upload a photo"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!title || !description}
                  className="flex-1 h-12 bg-[#4CAF50] hover:bg-[#45a049] text-white"
                >
                  Next
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Reward */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h3 className="mb-6">Set the reward</h3>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Token Amount</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💰</span>
                      <span className={`text-xl font-bold ${isBalanceLow ? "text-red-500" : "text-[#FFC107]"}`}>
                        {reward[0]} Tokens
                      </span>
                    </div>
                  </div>

                  <Slider
                    value={reward}
                    onValueChange={setReward}
                    min={suggested.min}
                    max={maxReward}
                    step={5}
                    className="mb-2"
                    disabled={isBalanceLow}
                  />

                  <div className="flex justify-between text-muted-foreground">
                    <span>{suggested.min}</span>
                    <span>
                      Suggested: {suggested.suggested}
                    </span>
                    <span>{maxReward}</span>
                  </div>

                  {isBalanceLow && (
                    <p className="text-red-500 text-sm mt-2">
                      You need at least {suggested.min} tokens for this category.
                    </p>
                  )}
                </div>

                <div className="bg-[#FFC107] bg-opacity-10 border border-[#FFC107] border-opacity-30 rounded-xl p-4">
                  <p className="text-[#030213]">
                    💡 <strong>Tip:</strong> Higher rewards attract more helpers! You have{" "}
                    <strong>{userTokens} tokens</strong> available.
                  </p>
                </div>

                {/* Task Summary */}
                <div className="bg-[#F5F5F5] rounded-xl p-4">
                  <h4 className="mb-3">Task Summary</h4>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      <strong>Category:</strong>{" "}
                      {categories.find((c) => c.id === selectedCategory)?.label}
                    </p>
                    <p>
                      <strong>Title:</strong> {title}
                    </p>
                    <p>
                      <strong>Reward:</strong> {reward[0]} tokens
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 h-12"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || isBalanceLow}
                  className="flex-1 h-12 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] hover:from-[#45a049] hover:to-[#5da95f] text-white"
                >
                  {isLoading ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
