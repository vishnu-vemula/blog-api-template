import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { CalendarDays, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const API = `${BACKEND_URL}/api`;

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, blogsRes] = await Promise.all([
          axios.get(`${API}/users/${userId}`),
          axios.get(`${API}/blogs/author/${userId}`),
        ]);

        if (userRes.data.success) setUser(userRes.data.data);
        if (blogsRes.data.success) setBlogs(blogsRes.data.data.blogs || []);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading profile...</div>;
  if (!user) return <div className="flex items-center justify-center py-20 text-red-500">User not found</div>;

  return (
    <div className="max-w-3xl mx-auto w-full space-y-8">
      {/* Profile Header */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Banner */}
        <div className="h-36 bg-gradient-to-r from-violet-200 via-indigo-200 to-purple-200" />
        
        {/* Avatar + Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="bg-violet-100 text-violet-600 text-2xl font-semibold">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 pb-1 flex-1">
              <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
            {currentUser && currentUser.id === user.id && (
              <Link to="/edit-profile">
                <Button variant="outline" size="sm" className="gap-2 rounded-full">
                  <Settings className="h-3.5 w-3.5" />
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bio & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold text-sm">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {user.bio || "This user hasn't written a bio yet."}
            </p>
            <div className="pt-3 border-t border-black/[0.06]">
              <div className="flex items-center text-xs text-muted-foreground gap-2">
                <CalendarDays className="h-3.5 w-3.5" />
                Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-indigo-600 block" />
            Posts
          </h2>
          
          {blogs.length === 0 ? (
            <div className="glass rounded-2xl text-center py-12">
              <p className="text-sm text-muted-foreground">No posts yet.</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <article key={blog.id} className="glass rounded-2xl p-5 hover:bg-black/[0.02] transition-all duration-300 cursor-pointer group">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="text-base font-semibold leading-snug group-hover:text-violet-600 transition-colors">
                    {blog.title}
                  </h3>
                  <span className="text-[11px] text-muted-foreground shrink-0">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                  {blog.excerpt || blog.content.substring(0, 150)}...
                </p>
                <div className="flex items-center gap-1.5">
                  {blog.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[11px] px-2 py-0.5 bg-black/[0.03] border-black/[0.06]">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
