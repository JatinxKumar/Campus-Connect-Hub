import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Clubs from "./pages/Clubs";
import Events from "./pages/Events";
import JoinClub from "./pages/JoinClub";
import EventRegistration from "./pages/EventRegistration";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/home" element={<Home />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/clubs/:id/join" element={<JoinClub />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id/register" element={<EventRegistration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/logout" element={<Logout />} />
              <Route
                path="/admin"
                element={(
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                )}
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
