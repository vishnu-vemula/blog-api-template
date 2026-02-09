import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";
import Layout from "./components/layout/Layout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApiKeyManager from "./pages/ApiKeyManager";
import UserList from "./pages/UserList";
import UserProfile from "./pages/UserProfile";
import BlogList from "./pages/BlogList";
import Home from "./pages/Home";
import EditProfile from "./pages/EditProfile";
import Docs from "./pages/Docs";
import UserPublicPage from "./pages/UserPublicPage";
import CreateBlog from "./pages/CreateBlog";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/blogs" replace />;
  return children;
};

// Subdomain handling wrapper
const SubdomainRouter = () => {
  const [subdomain, setSubdomain] = useState(null);

  useEffect(() => {
    const host = window.location.host;
    // Split host by dots
    const parts = host.split('.');
    
    // Check if we have a subdomain
    // localhost:3000 -> parts.length = 1 (localhost:3000) -> no subdomain
    // username.localhost:3000 -> parts.length = 2 -> subdomain = username
    // domain.com -> parts.length = 2 -> no subdomain (usually) - simple logic for now
    // username.domain.com -> parts.length = 3 -> subdomain = username
    
    // Simple logic: if localhost and > 1 part, or domain and > 2 parts
    // Skip IP addresses (e.g. 127.0.0.1)
    let currentSubdomain = null;
    const isIP = /^\d+\.\d+\.\d+\.\d+/.test(host);

    if (!isIP) {
      if (host.includes('localhost')) {
        if (parts.length > 1 && parts[0] !== 'www') {
          currentSubdomain = parts[0];
        }
      } else {
        // Production logic (simplified)
        if (parts.length > 2 && parts[0] !== 'www') {
          currentSubdomain = parts[0];
        }
      }
    }
    
    setSubdomain(currentSubdomain);
  }, []);

  if (subdomain) {
    return <UserPublicPage username={subdomain} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="api-keys" element={<ProtectedRoute><ApiKeyManager /></ProtectedRoute>} />
        <Route path="users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
        <Route path="profile/:userId" element={<UserProfile />} />
        <Route path="blogs" element={<BlogList />} />
        <Route path="write" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
        <Route path="edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="docs" element={<Docs />} />
        <Route path="u/:username" element={<UserPublicPageWrapper />} />
      </Route>
    </Routes>
  );
};

const UserPublicPageWrapper = () => {
  const { username } = useParams();
  return <UserPublicPage username={username} />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SubdomainRouter />
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
