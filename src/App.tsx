import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import { AuthProvider } from "./contexts/AuthContext";
import { GuestProvider } from "./contexts/GuestContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const SkillsPage = lazy(() => import("./pages/SkillsPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const SubscribersPage = lazy(() => import("./pages/SubscribersPage"));
const BlogCommentsPage = lazy(() => import("./pages/BlogCommentsPage"));
const AdminModerationPage = lazy(() => import("./pages/AdminModerationPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const UnsubscribePage = lazy(() => import("./pages/UnsubscribePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingSpinner />}>
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/unsubscribe" element={<UnsubscribePage />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
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
