import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TaskCard, Task } from "./TaskCard";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Users, Sprout, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { SidebarNavigation } from "./SidebarNavigation";
import { api } from "../services/api";

interface HomeScreenProps {
  userName: string;
  tokens: number;
  onCreateTask: () => void;
  onViewProfile: () => void;
  onLogout?: () => void;
  hasUnreadMessages?: boolean;
  activeRequests?: Array<{
    id: string;
    title: string;
    hasUnread: boolean;
    helperCount: number;
  }>;
  onViewRequest?: (requestId: string) => void;
}

export function HomeScreen({
  userName,
  tokens,
  onCreateTask,
  onViewProfile,
  onLogout,
  hasUnreadMessages = false,
  activeRequests = [],
  onViewRequest,
}: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<"person" | "nature">("person");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const backendTasks = await api.tasks.list();
        const mappedTasks: Task[] = backendTasks.map((t: any) => ({
          id: t._id,
          title: t.title,
          description: t.description,
          reward: t.tokenReward,
          distance: "0.5 km away", // Mock distance for now
          category: ['cleaning', 'maintenance', 'pet-care'].includes(t.category) ? 'nature' : 'person',
          imageUrl: t.photos?.[0] || "https://images.unsplash.com/photo-1606904825846-647eb07f5be2",
          userId: t.creator._id,
          userName: t.creator.name
        }));
        setTasks(mappedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
        toast.error("Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => task.category === activeTab);

  const handleHelp = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    toast.success(`You've offered to help with "${task?.title}"! The requester will contact you shortly.`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onViewProfile}
                className="cursor-pointer"
              >
                <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-[#4CAF50]">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Unity" />
                  <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                </Avatar>
              </motion.div>
              <div>
                <h2 className="text-base sm:text-xl">Hello, {userName}! 👋</h2>
                <p className="text-muted-foreground text-xs sm:text-sm">Ready to make a difference?</p>
              </div>
            </div>

            {/* Hamburger Menu Icon */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(true)}
              className="p-2 sm:p-3 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors relative"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
              {hasUnreadMessages && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    scale: {
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut"
                    }
                  }}
                  className="absolute top-1 right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-white shadow-sm"
                />
              )}
            </motion.button>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "person" | "nature")}
          >
            <TabsList className="w-full h-12 sm:h-14 bg-[#F5F5F5] p-1">
              <TabsTrigger
                value="person"
                className="flex-1 h-full rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Help a Person</span>
                <span className="xs:hidden">Person</span>
              </TabsTrigger>
              <TabsTrigger
                value="nature"
                className="flex-1 h-full rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
              >
                <Sprout className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Help Nature</span>
                <span className="xs:hidden">Nature</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Task Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {isLoading ? (
          <div className="text-center py-12">Loading tasks...</div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onHelp={handleHelp} />
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12 sm:py-20">
                <p className="text-muted-foreground text-sm sm:text-base">
                  No tasks available in this category yet.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sidebar Navigation */}
      <SidebarNavigation
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        userName={userName}
        tokens={tokens}
        onCreateTask={onCreateTask}
        onViewProfile={onViewProfile}
        onSettings={() => toast.info("Settings coming soon!")}
        onHelp={() => toast.info("Help & Support coming soon!")}
        onLogout={onLogout}
        activeRequests={activeRequests}
        onViewRequest={onViewRequest}
      />
    </div>
  );
}