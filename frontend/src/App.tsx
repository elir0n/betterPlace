import { useState, useEffect } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { HomeScreen } from "./components/HomeScreen";
import { CreateTaskScreen } from "./components/CreateTaskScreen";
import { TaskVerificationScreen } from "./components/TaskVerificationScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { RequestDetailScreen } from "./components/RequestDetailScreen";
import { ChatScreen } from "./components/ChatScreen";
import { HelperProfileScreen } from "./components/HelperProfileScreen";
import { Toaster } from "./components/ui/sonner";
import { api } from "./services/api";

type Screen =
  | "login"
  | "home"
  | "create"
  | "verify"
  | "profile"
  | "request-detail"
  | "chat"
  | "helper-profile";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [userName, setUserName] = useState("Alex");
  const [tokens, setTokens] = useState(200);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectedHelperId, setSelectedHelperId] = useState<string | null>(null);
  const [selectedHelperName, setSelectedHelperName] = useState<string>("");
  const [previousScreen, setPreviousScreen] = useState<Screen>("home");

  // Notifications state
  const [hasUnreadMessages, setHasUnreadMessages] = useState(true);
  const [activeRequests, setActiveRequests] = useState([
    {
      id: "req-1",
      title: "Help with grocery shopping",
      hasUnread: true,
      helperCount: 2,
    },
    {
      id: "req-2",
      title: "Walk my dog",
      hasUnread: true,
      helperCount: 1,
    },
  ]);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const user = await api.auth.getProfile();
          setIsLoggedIn(true);
          setUserName(user.name);
          setTokens(user.tokenBalance);
          setCurrentScreen("home");
        } catch (error) {
          console.error("Auth check failed", error);
          localStorage.removeItem("token");
        }
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (username: string) => {
    // We assume token is already set by LoginScreen
    setIsLoggedIn(true);
    setUserName(username);
    setCurrentScreen("home");
    // Refresh profile to get tokens
    api.auth.getProfile().then(user => setTokens(user.tokenBalance));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("betterplace_logged_in");
    localStorage.removeItem("betterplace_username");
    setIsLoggedIn(false);
    setCurrentScreen("login");
  };

  const handleTaskVerificationComplete = () => {
    setTokens(tokens + 35); // Add reward for completed task
    setCurrentScreen("home");
  };

  const handleCreateTaskComplete = () => {
    setTokens(tokens - 25); // Deduct tokens for creating task
    setCurrentScreen("home");
  };

  const handleViewRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    // Mark all messages as read for this request
    setActiveRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, hasUnread: false } : req
      )
    );
    // Update unread status after state updates
    setActiveRequests(prevRequests => {
      const hasAnyUnread = prevRequests.some(req =>
        req.id !== requestId && req.hasUnread
      );
      setHasUnreadMessages(hasAnyUnread);
      return prevRequests;
    });
    setCurrentScreen("request-detail");
  };

  const handleChatWithHelper = (helperId: string, helperName: string) => {
    setSelectedHelperId(helperId);
    setSelectedHelperName(helperName);
    setPreviousScreen(currentScreen);
    setCurrentScreen("chat");
  };

  const handleViewHelperProfile = (helperId: string) => {
    setSelectedHelperId(helperId);
    setPreviousScreen(currentScreen);
    setCurrentScreen("helper-profile");
  };

  return (
    <div className="min-h-screen">
      {currentScreen === "login" && (
        <LoginScreen onLogin={handleLogin} />
      )}

      {currentScreen === "home" && (
        <HomeScreen
          userName={userName}
          tokens={tokens}
          onCreateTask={() => setCurrentScreen("create")}
          onViewProfile={() => setCurrentScreen("profile")}
          onLogout={handleLogout}
          hasUnreadMessages={hasUnreadMessages}
          activeRequests={activeRequests}
          onViewRequest={handleViewRequest}
        />
      )}

      {currentScreen === "create" && (
        <CreateTaskScreen
          onBack={() => setCurrentScreen("home")}
          onComplete={handleCreateTaskComplete}
          userTokens={tokens}
        />
      )}

      {currentScreen === "verify" && (
        <TaskVerificationScreen
          taskTitle="Clean local park"
          taskReward={35}
          beforeImageUrl="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09"
          onBack={() => setCurrentScreen("home")}
          onComplete={handleTaskVerificationComplete}
        />
      )}

      {currentScreen === "profile" && (
        <ProfileScreen
          userName={userName}
          tokens={tokens}
          onBack={() => setCurrentScreen("home")}
          onCreateTask={() => setCurrentScreen("create")}
          onViewRequest={handleViewRequest}
        />
      )}

      {currentScreen === "request-detail" && selectedRequestId && (
        <RequestDetailScreen
          requestId={selectedRequestId}
          onBack={() => setCurrentScreen("profile")}
          onChatWithHelper={handleChatWithHelper}
          onViewHelperProfile={handleViewHelperProfile}
        />
      )}

      {currentScreen === "chat" && selectedHelperId && (
        <ChatScreen
          helperId={selectedHelperId}
          helperName={selectedHelperName}
          onBack={() => setCurrentScreen(previousScreen)}
        />
      )}

      {currentScreen === "helper-profile" && selectedHelperId && (
        <HelperProfileScreen
          helperId={selectedHelperId}
          onBack={() => setCurrentScreen(previousScreen)}
        />
      )}

      <Toaster position="top-center" />
    </div>
  );
}