import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Plus, Wallet, Star, Settings, HelpCircle, LogOut, MessageSquare } from "lucide-react";

interface SidebarNavigationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  tokens: number;
  onCreateTask: () => void;
  onViewProfile: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
  onLogout?: () => void;
  activeRequests?: Array<{
    id: string;
    title: string;
    hasUnread: boolean;
    helperCount: number;
  }>;
  onViewRequest?: (requestId: string) => void;
}

export function SidebarNavigation({
  open,
  onOpenChange,
  userName,
  tokens,
  onCreateTask,
  onViewProfile,
  onSettings,
  onHelp,
  onLogout,
  activeRequests = [],
  onViewRequest,
}: SidebarNavigationProps) {
  const handleProfileClick = () => {
    onOpenChange(false);
    onViewProfile();
  };

  const handleCreateTask = () => {
    onOpenChange(false);
    onCreateTask();
  };

  const handleSettings = () => {
    onOpenChange(false);
    onSettings?.();
  };

  const handleHelp = () => {
    onOpenChange(false);
    onHelp?.();
  };

  const handleLogout = () => {
    onOpenChange(false);
    onLogout?.();
  };

  const handleViewRequest = (requestId: string) => {
    onOpenChange(false);
    onViewRequest?.(requestId);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[90%] sm:w-[85%] md:w-[400px] p-0 bg-white"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>
            Access your profile, create tasks, and manage settings
          </SheetDescription>
        </SheetHeader>

        <div className="h-full flex flex-col">
          {/* Fixed Header Section - Profile */}
          <motion.div
            onClick={handleProfileClick}
            whileTap={{ scale: 0.98 }}
            className="bg-[#4CAF50] p-4 sm:p-6 cursor-pointer active:bg-[#45a049] flex-shrink-0"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-white flex-shrink-0">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Unity" />
                <AvatarFallback className="bg-white text-[#4CAF50]">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h3 className="text-white mb-1 sm:mb-2 text-base sm:text-lg truncate">{userName}</h3>
                <Badge className="bg-[#FFC107] text-black hover:bg-[#FFD54F] border-0 mb-1 sm:mb-2 text-xs">
                  Super Helper
                </Badge>
                <div className="flex items-center gap-3 sm:gap-4 text-white text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-white" />
                    <span>4.9</span>
                  </div>
                  <div>
                    <span>23 tasks</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            
            {/* Token Section */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FFD54F] flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                </div>
                <div className="min-w-0">
                  <div className="text-black text-base sm:text-lg">{tokens} Tokens</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Available Balance
                  </div>
                </div>
              </div>
            </div>

            {/* Create Task Button */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
              <Button
                onClick={handleCreateTask}
                className="w-full h-12 sm:h-14 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] hover:from-[#45a049] hover:to-[#5da95f] text-white rounded-2xl shadow-sm text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Create New Task
              </Button>
            </div>

            {/* Active Requests */}
            {activeRequests.length > 0 && (
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
                <h4 className="text-gray-900 mb-3">My Active Requests</h4>
                <nav className="space-y-1 sm:space-y-2">
                  {activeRequests.map((request) => (
                    <motion.button
                      key={request.id}
                      onClick={() => handleViewRequest(request.id)}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-start gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left relative"
                    >
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-900 text-sm sm:text-base truncate">
                            {request.title}
                          </span>
                          {request.hasUnread && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full flex-shrink-0"
                            />
                          )}
                        </div>
                        <div className="text-gray-500 text-xs sm:text-sm">
                          {request.helperCount} {request.helperCount === 1 ? 'helper' : 'helpers'} interested
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </nav>
              </div>
            )}

            {/* Menu Items */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 pb-8">
              <nav className="space-y-1 sm:space-y-2">
                <motion.button
                  onClick={handleSettings}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                  <span className="text-gray-900 text-sm sm:text-base">Settings</span>
                </motion.button>

                <motion.button
                  onClick={handleHelp}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                >
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                  <span className="text-gray-900 text-sm sm:text-base">Help & Support</span>
                </motion.button>

                <motion.button
                  onClick={handleLogout}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                  <span className="text-gray-900 text-sm sm:text-base">Log Out</span>
                </motion.button>
              </nav>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}