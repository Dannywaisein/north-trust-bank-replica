
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import Personal from "./pages/Personal";
import Business from "./pages/Business";
import Wealth from "./pages/Wealth";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import PrivateRoute from "./components/PrivateRoute";
import AccountDetails from "./pages/AccountDetails";
import Payments from "./pages/Payments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/personal" element={<Personal />} />
            <Route path="/business" element={<Business />} />
            <Route path="/wealth" element={<Wealth />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth/*" element={<Auth />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/accounts" element={<PrivateRoute><Accounts /></PrivateRoute>} />
            <Route path="/accounts/:accountId" element={<PrivateRoute><AccountDetails /></PrivateRoute>} />
            <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
            <Route path="/payments" element={<PrivateRoute><Payments /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/support" element={<PrivateRoute><Support /></PrivateRoute>} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
