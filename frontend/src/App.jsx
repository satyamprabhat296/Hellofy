import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import FriendsPage from "./pages/FriendsPage.jsx";
import PairCodingRoom from "./pages/PairCodingRoom";
import ResourcesPage from "./pages/ResourcesPage";
  
import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate
                to={!isAuthenticated ? "/login" : "/onboarding"}
                replace
              />
            )
          }
        />

        {/* SIGN UP */}
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate
                to={isOnboarded ? "/" : "/onboarding"}
                replace
              />
            )
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate
                to={isOnboarded ? "/" : "/onboarding"}
                replace
              />
            )
          }
        />

        {/* NOTIFICATIONS */}
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate
                to={!isAuthenticated ? "/login" : "/onboarding"}
                replace
              />
            )
          }
        />

        {/* FRIENDS */}
        <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <FriendsPage />
              </Layout>
            ) : (
              <Navigate
                to={!isAuthenticated ? "/login" : "/onboarding"}
                replace
              />
            )
          }
        />

        {/* CALL */}
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate
                to={!isAuthenticated ? "/login" : "/onboarding"}
                replace
              />
            )
          }
        />

        {/* CHAT */}
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate
                to={!isAuthenticated ? "/login" : "/onboarding"}
                replace
              />
            )
          }
        />

        {/* ONBOARDING */}
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* PAIR CODING */}
        <Route
          path="/pair-coding/:roomId"
          element={<PairCodingRoom />}
        />

        {/* RESOURCES */}
        <Route
          path="/resources"
          element={<ResourcesPage />}
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
