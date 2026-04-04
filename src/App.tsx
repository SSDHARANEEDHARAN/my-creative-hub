import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SkillsPage from "./pages/SkillsPage";
import ServicesPage from "./pages/ServicesPage";
import GalleryPage from "./pages/GalleryPage";
import ProjectsPage from "./pages/ProjectsPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import ArticlePage from "./pages/ArticlePage";
import BlogPostPage from "./pages/BlogPostPage";
import SubscribersPage from "./pages/SubscribersPage";
import BlogCommentsPage from "./pages/BlogCommentsPage";
import AdminModerationPage from "./pages/AdminModerationPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import IndustrialProjectsPage from "./pages/IndustrialProjectsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import UnsubscribePage from "./pages/UnsubscribePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { GuestProvider } from "./contexts/GuestContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ContentProtection from "./components/ContentProtection";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/article/:slug" element={<ArticlePage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/unsubscribe" element={<UnsubscribePage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ServicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscribers"
          element={
            <ProtectedRoute requireAdmin>
              <SubscribersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog-comments"
          element={
            <ProtectedRoute requireAdmin>
              <BlogCommentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/moderation"
          element={
            <ProtectedRoute requireAdmin>
              <AdminModerationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/industrial-projects" element={<IndustrialProjectsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <GuestProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ContentProtection />
                  <ScrollToTopButton />
                  <AnimatedRoutes />
                </BrowserRouter>
              </TooltipProvider>
            </GuestProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
