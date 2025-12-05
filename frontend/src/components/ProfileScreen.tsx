import { motion } from "motion/react";
import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Star,
  TrendingUp,
  Award,
  Calendar,
  Plus,
  Minus,
  ChevronDown,
} from "lucide-react";

interface ProfileScreenProps {
  userName: string;
  tokens: number;
  onBack: () => void;
  onCreateTask: () => void;
  onViewRequest?: (requestId: string) => void;
}

interface Transaction {
  id: string;
  type: "earned" | "spent";
  amount: number;
  description: string;
  date: string;
}

interface ActiveRequest {
  id: string;
  title: string;
  reward: number;
  imageUrl: string;
  offerCount: number;
}

export function ProfileScreen({
  userName,
  tokens,
  onBack,
  onCreateTask,
  onViewRequest,
}: ProfileScreenProps) {
  const [isTransactionExpanded, setIsTransactionExpanded] = useState(false);
  const [visibleTransactionCount, setVisibleTransactionCount] = useState(3);

  const transactions: Transaction[] = [
    {
      id: "1",
      type: "earned",
      amount: 35,
      description: "Cleaned Park",
      date: "Today",
    },
    {
      id: "2",
      type: "earned",
      amount: 30,
      description: "Fed Community Cats",
      date: "Yesterday",
    },
    {
      id: "3",
      type: "spent",
      amount: 25,
      description: "WiFi Help",
      date: "2 days ago",
    },
    {
      id: "4",
      type: "earned",
      amount: 50,
      description: "Taught Computer Basics",
      date: "3 days ago",
    },
    {
      id: "5",
      type: "spent",
      amount: 20,
      description: "Garden Watering",
      date: "4 days ago",
    },
    {
      id: "6",
      type: "earned",
      amount: 40,
      description: "Moved Furniture",
      date: "5 days ago",
    },
    {
      id: "7",
      type: "earned",
      amount: 45,
      description: "Grocery Shopping Help",
      date: "6 days ago",
    },
    {
      id: "8",
      type: "spent",
      amount: 30,
      description: "Dog Walking",
      date: "1 week ago",
    },
    {
      id: "9",
      type: "earned",
      amount: 25,
      description: "Tutoring Math",
      date: "1 week ago",
    },
    {
      id: "10",
      type: "earned",
      amount: 35,
      description: "Home Cleaning",
      date: "1 week ago",
    },
    {
      id: "11",
      type: "spent",
      amount: 15,
      description: "Plant Care",
      date: "2 weeks ago",
    },
    {
      id: "12",
      type: "earned",
      amount: 55,
      description: "Car Wash",
      date: "2 weeks ago",
    },
    {
      id: "13",
      type: "earned",
      amount: 30,
      description: "Book Exchange",
      date: "2 weeks ago",
    },
    {
      id: "14",
      type: "spent",
      amount: 20,
      description: "Tech Support",
      date: "3 weeks ago",
    },
    {
      id: "15",
      type: "earned",
      amount: 40,
      description: "Painting Help",
      date: "3 weeks ago",
    },
  ];

  const handleExpandTransactions = () => {
    setIsTransactionExpanded(true);
    setVisibleTransactionCount(10);
  };

  const handleShowMoreTransactions = () => {
    setVisibleTransactionCount((prev) => Math.min(prev + 10, transactions.length));
  };

  const visibleTransactions = transactions.slice(0, visibleTransactionCount);
  const hasMoreTransactions = visibleTransactionCount < transactions.length;

  const stats = {
    rating: 4.9,
    tasksCompleted: 23,
    helpedPeople: 18,
    memberSince: "Jan 2024",
  };

  const totalEarned = transactions
    .filter((t) => t.type === "earned")
    .reduce((sum, t) => sum + t.amount, 0);

  const activeRequests: ActiveRequest[] = [
    {
      id: "1",
      title: "Fix my WiFi router",
      reward: 25,
      imageUrl: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2",
      offerCount: 3,
    },
    {
      id: "2",
      title: "Help with Gardening",
      reward: 30,
      imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
      offerCount: 5,
    },
    {
      id: "3",
      title: "Move Heavy Furniture",
      reward: 40,
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
      offerCount: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full mb-3 sm:mb-4 text-white hover:bg-white hover:bg-opacity-20 w-8 h-8 sm:w-10 sm:h-10"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {/* Profile Header */}
          <div className="flex items-start gap-3 sm:gap-6 mb-4 sm:mb-6">
            <Avatar className="w-16 h-16 sm:w-24 sm:h-24 border-2 sm:border-4 border-white shadow-lg flex-shrink-0">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Unity" />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 flex-wrap">
                <h2 className="text-lg sm:text-2xl truncate">{userName}</h2>
                <Badge className="bg-[#FFC107] text-[#030213] hover:bg-[#FFC107] text-xs sm:text-sm whitespace-nowrap">
                  <Star className="w-2 h-2 sm:w-3 sm:h-3 mr-1 fill-current" />
                  Super Helper
                </Badge>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                <span className="text-base sm:text-xl">{stats.rating}</span>
                <span className="opacity-80 text-xs sm:text-base">• {stats.tasksCompleted} tasks</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-3 sm:p-5 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] flex items-center justify-center mb-2 sm:mb-3 shadow-md">
                  <span className="text-xl sm:text-3xl">🎯</span>
                </div>
                <div className="text-xl sm:text-3xl text-[#030213] mb-1">{stats.tasksCompleted}</div>
                <div className="text-muted-foreground text-xs sm:text-sm text-center">Completed</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-3 sm:p-5 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#FFC107] to-[#FFD54F] flex items-center justify-center mb-2 sm:mb-3 shadow-md">
                  <span className="text-xl sm:text-3xl">🤝</span>
                </div>
                <div className="text-xl sm:text-3xl text-[#030213] mb-1">{stats.helpedPeople}</div>
                <div className="text-muted-foreground text-xs sm:text-sm text-center">People Helped</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-3 sm:p-5 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#2196F3] to-[#64B5F6] flex items-center justify-center mb-2 sm:mb-3 shadow-md">
                  <span className="text-xl sm:text-3xl">📅</span>
                </div>
                <div className="text-sm sm:text-xl text-[#030213] mb-1">{stats.memberSince}</div>
                <div className="text-muted-foreground text-xs sm:text-sm text-center">Member Since</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Wallet Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-8"
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h3 className="mb-0 sm:mb-1 text-base sm:text-lg">Token Wallet</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">Your community currency</p>
              </div>
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFC107]" />
            </div>

            <div className="bg-gradient-to-r from-[#FFC107] to-[#FFD54F] rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 text-[#030213]">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="opacity-80 mb-1 text-xs sm:text-sm">Available Balance</p>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-2xl sm:text-4xl">💰</span>
                    <h1 className="text-xl sm:text-3xl truncate">{tokens} Tokens</h1>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="opacity-80 mb-1 text-xs sm:text-sm">Total Earned</p>
                  <div className="flex items-center gap-1 justify-end">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-lg sm:text-2xl">{totalEarned}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={onCreateTask}
              className="w-full h-10 sm:h-12 bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-full text-sm sm:text-base"
            >
              Use Tokens to Create Task
            </Button>
          </Card>
        </motion.div>

        {/* Active Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 sm:mb-8"
        >
          <Card className="p-4 sm:p-6">
            <h3 className="mb-4 sm:mb-6 text-base sm:text-lg">My Active Requests</h3>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 -mx-2 px-2">
              {activeRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  onClick={() => onViewRequest?.(request.id)}
                  className="relative flex-shrink-0 w-40 sm:w-48 cursor-pointer"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Notification Badge */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-6 h-6 sm:w-8 sm:h-8 bg-[#FF3B30] rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-xs sm:text-sm">{request.offerCount}</span>
                    </div>

                    {/* Image */}
                    <div className="relative h-24 sm:h-32 overflow-hidden bg-[#F5F5F5]">
                      <img
                        src={request.imageUrl}
                        alt={request.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4">
                      <h4 className="mb-1 sm:mb-2 truncate text-sm sm:text-base">{request.title}</h4>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-1 text-[#FFC107]">
                          <span>💰</span>
                          <span>{request.reward}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {request.offerCount} {request.offerCount === 1 ? "offer" : "offers"}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 sm:p-6">
            <h3 className="mb-4 sm:mb-6 text-base sm:text-lg">Transaction History</h3>

            <div className="space-y-2 sm:space-y-4">
              {visibleTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-[#F5F5F5] transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                    <div
                      className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        transaction.type === "earned"
                          ? "bg-[#4CAF50] bg-opacity-10"
                          : "bg-[#2196F3] bg-opacity-10"
                      }`}
                    >
                      {transaction.type === "earned" ? (
                        <Plus
                          className={`w-4 h-4 sm:w-6 sm:h-6 ${
                            transaction.type === "earned"
                              ? "text-[#4CAF50]"
                              : "text-[#2196F3]"
                          }`}
                        />
                      ) : (
                        <Minus
                          className={`w-4 h-4 sm:w-6 sm:h-6 ${
                            transaction.type === "earned"
                              ? "text-[#4CAF50]"
                              : "text-[#2196F3]"
                          }`}
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm sm:text-base truncate">{transaction.description}</h4>
                      <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-sm">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{transaction.date}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-right flex-shrink-0 ${
                      transaction.type === "earned"
                        ? "text-[#4CAF50]"
                        : "text-[#2196F3]"
                    }`}
                  >
                    <div className="flex items-center gap-1 text-sm sm:text-base">
                      {transaction.type === "earned" ? "+" : "-"}
                      {transaction.amount}
                      <span className="text-xs sm:text-sm">💰</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Expand/Show More Controls */}
            {!isTransactionExpanded && transactions.length > 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-4 sm:mt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExpandTransactions}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-[#F5F5F5] hover:bg-[#E0E0E0] transition-colors text-sm sm:text-base"
                >
                  <span className="text-muted-foreground">View More</span>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                </motion.button>
              </motion.div>
            )}

            {isTransactionExpanded && hasMoreTransactions && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-4 sm:mt-6"
              >
                <Button
                  onClick={handleShowMoreTransactions}
                  variant="ghost"
                  className="text-[#4CAF50] hover:text-[#45a049] hover:bg-[#4CAF50] hover:bg-opacity-10 text-sm sm:text-base"
                >
                  Show More
                </Button>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Achievement Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 sm:mt-8"
        >
          <Card className="p-4 sm:p-6">
            <h3 className="mb-4 sm:mb-6 text-base sm:text-lg">Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              {[
                { icon: "🌱", label: "First Deed", unlocked: true },
                { icon: "🔥", label: "10 Streak", unlocked: true },
                { icon: "⭐", label: "Top Helper", unlocked: true },
                { icon: "🏆", label: "100 Tasks", unlocked: false },
              ].map((badge, index) => (
                <div
                  key={index}
                  className={`text-center p-3 sm:p-4 rounded-xl ${
                    badge.unlocked
                      ? "bg-gradient-to-br from-[#FFC107] to-[#FFD54F]"
                      : "bg-[#F5F5F5] opacity-50"
                  }`}
                >
                  <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">{badge.icon}</div>
                  <div className="text-[#030213] text-xs sm:text-sm">{badge.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}