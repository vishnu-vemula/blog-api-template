import { useState, useEffect } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const API = `${BACKEND_URL}/api`;

const UserList = () => {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API}/users`);
        if (response.data.success) {
          setUsers(response.data.data.users);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (!authLoading && !isAdmin) {
    return <Navigate to="/blogs" replace />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text">Discover People</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Find developers, writers, and creators in the community.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl glass animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Link key={user.id} to={`/users/${user.id}`} className="group">
              <div className="glass rounded-2xl p-5 hover:bg-black/[0.02] transition-all duration-300 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-11 w-11 border-2 border-black/10 group-hover:border-violet-500/50 transition-colors">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="bg-violet-100 text-violet-600 text-sm font-semibold">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm group-hover:text-violet-600 transition-colors truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                  {user.bio || "No bio available."}
                </p>
                <div className="mt-4 flex items-center text-xs text-violet-600 font-medium group-hover:gap-2 gap-1 transition-all">
                  View profile <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
