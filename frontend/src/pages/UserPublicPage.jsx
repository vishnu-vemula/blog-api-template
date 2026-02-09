import { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { CalendarDays, TrendingUp, Zap, ExternalLink } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const API = `${BACKEND_URL}/api`;

const UserPublicPage = ({ username }) => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await axios.get(`${API}/users/username/${username}`);
        
        if (userRes.data.success) {
          const userData = userRes.data.data;
          setUser(userData);
          
          const blogsRes = await axios.get(`${API}/blogs/author/${userData.id}`);
          if (blogsRes.data.success) {
            setBlogs(blogsRes.data.data.blogs || []);
          }
        }
      } catch (err) {
        console.error("Failed to fetch public page data", err);
        setError("User not found or connection error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center animate-pulse">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <p className="text-sm">Loading {username}'s blog...</p>
      </div>
    </div>
  );

  if (error || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-background text-red-500">
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold">404</p>
        <p className="text-sm text-muted-foreground">{error || "User not found"}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full glass border-b border-black/[0.06]">
        <div className="mx-auto max-w-4xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-7 w-7 border border-black/10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-violet-100 text-violet-600 text-[10px] font-semibold">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-sm tracking-tight">{user.firstName}'s Blog</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground rounded-full">
              Subscribe
            </Button>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground gap-1.5 rounded-full">
                <Zap className="h-3 w-3" /> WorksAndBlogs
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Profile Hero */}
      <section className="relative overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-violet-200 via-indigo-200 to-purple-200 animate-in fade-in duration-1000" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-200/60 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-[300px] h-[300px] bg-indigo-200/40 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <div className="mx-auto max-w-4xl px-6 -mt-24 relative z-10">
          <div className="flex flex-col sm:flex-row gap-8 items-end">
            <div className="relative group">
              <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-4 border-background shadow-2xl ring-4 ring-violet-200 transition-transform group-hover:scale-105 duration-300">
                <AvatarImage src={user.avatar} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white text-4xl font-bold">
                  {user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-green-500 border-4 border-background shadow-lg" />
            </div>
            
            <div className="flex-1 pb-4 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{user.firstName} {user.lastName}</h1>
                <Badge variant="secondary" className="bg-violet-100 text-violet-700 border-violet-200">Pro Author</Badge>
              </div>
              <p className="text-lg text-muted-foreground font-medium">@{user.username}</p>
              {user.bio && (
                <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">{user.bio}</p>
              )}
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-violet-600" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span>{blogs.length} Posts</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pb-4">
               <Button className="rounded-full bg-violet-600 text-white hover:bg-violet-700 font-semibold shadow-lg shadow-violet-500/20">
                  Follow
               </Button>
               <Button variant="outline" className="rounded-full border-black/10 hover:bg-black/[0.03] backdrop-blur-sm">
                  <ExternalLink className="h-4 w-4" />
               </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Latest Posts</span>
          </h2>
          <div className="flex gap-2">
             <Badge variant="outline" className="cursor-pointer hover:bg-black/[0.03] transition-colors px-3 py-1">All</Badge>
             <Badge variant="outline" className="cursor-pointer hover:bg-black/[0.03] transition-colors px-3 py-1 text-muted-foreground border-transparent">Popular</Badge>
          </div>
        </div>

        {blogs.length > 0 ? (
          <div className="grid gap-6">
            {blogs.map((blog) => (
              <article key={blog._id} className="group relative flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-white/80 border border-black/[0.06] hover:bg-white hover:border-black/[0.1] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-violet-500/5">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium">Article</span>
                    <span>•</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-violet-600 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    {blog.excerpt || blog.content.substring(0, 150)}...
                  </p>
                  <div className="pt-2 flex items-center gap-4">
                    <span className="text-xs font-medium text-violet-600 group-hover:underline decoration-violet-600/50 underline-offset-4 flex items-center gap-1">
                      Read article <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                </div>
                {blog.coverImage && (
                  <div className="sm:w-48 h-32 rounded-xl overflow-hidden bg-muted/20 ring-1 ring-black/10 group-hover:ring-violet-500/20 transition-all">
                    <img src={blog.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl border border-dashed border-black/10 bg-black/[0.01]">
            <p className="text-muted-foreground">No posts yet.</p>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-black/[0.06] py-8 mt-12">
        <div className="mx-auto max-w-4xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">Published on WorksAndBlogs</p>
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Zap className="h-3 w-3" /> Create your own blog
          </a>
        </div>
      </footer>
    </div>
  );
};

export default UserPublicPage;
