import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { MessageCircle, ThumbsUp, Bookmark, Home, TrendingUp, BookOpen, PenSquare, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const API = `${BACKEND_URL}/api`;

const BlogList = () => {
  const { logout } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const trendingTags = useMemo(() => {
    const counts = blogs.reduce((acc, blog) => {
      if (Array.isArray(blog.tags)) {
        blog.tags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
      }
      return acc;
    }, {});
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [blogs]);

  const suggestedAuthors = useMemo(() => {
    const map = new Map();
    blogs.forEach((blog) => {
      if (blog.author && !map.has(blog.author.id)) {
        map.set(blog.author.id, blog.author);
      }
    });
    return Array.from(map.values()).slice(0, 3);
  }, [blogs]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API}/blogs`);
        if (response.data.success) {
          setBlogs(response.data.data.blogs);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        toast.error(error.response?.data?.message || "Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-2xl border border-black/[0.06] bg-white/70 backdrop-blur p-3 space-y-1">
                <Link to="/blogs">
                  <Button variant="ghost" className="w-full justify-start gap-2 text-sm h-10 text-foreground bg-black/[0.04] hover:bg-black/[0.06]">
                    <Home className="h-4 w-4" /> Feed
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="ghost" className="w-full justify-start gap-2 text-sm h-10 text-muted-foreground hover:text-foreground">
                    <TrendingUp className="h-4 w-4" /> Explore
                  </Button>
                </Link>
                <Link to="/docs">
                  <Button variant="ghost" className="w-full justify-start gap-2 text-sm h-10 text-muted-foreground hover:text-foreground">
                    <BookOpen className="h-4 w-4" /> Docs
                  </Button>
                </Link>
              </div>
              <Link to="/write">
                <Button className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 border-0 gap-2">
                  <PenSquare className="h-4 w-4" /> Write
                </Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm h-10 text-muted-foreground hover:text-foreground" onClick={logout}>
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          </aside>

          <main className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Feed</h1>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="rounded-full text-xs bg-black/[0.05] text-foreground">Relevant</Button>
                <Button variant="ghost" size="sm" className="rounded-full text-xs text-muted-foreground hover:text-foreground">Latest</Button>
                <Button variant="ghost" size="sm" className="rounded-full text-xs text-muted-foreground hover:text-foreground">Top</Button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-44 rounded-2xl glass animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <article key={blog.id} className="group glass rounded-2xl p-6 hover:bg-black/[0.02] transition-all duration-300">
                    <Link to={`/users/${blog.author.id}`} className="flex items-center gap-3 mb-4 group/author">
                      <Avatar className="h-9 w-9 border-2 border-black/10">
                        <AvatarImage src={blog.author.avatar} />
                        <AvatarFallback className="bg-violet-100 text-violet-600 text-xs font-semibold">
                          {blog.author.firstName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium group-hover/author:text-violet-600 transition-colors">
                          {blog.author.firstName} {blog.author.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · 5 min read
                        </p>
                      </div>
                    </Link>

                    <div className="flex gap-5">
                      <div className="flex-1 min-w-0">
                        <Link to={`/blogs/${blog.id}`} className="block">
                          <h2 className="text-lg font-bold leading-snug group-hover:text-violet-600 transition-colors mb-2">
                            {blog.title}
                          </h2>
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {blog.excerpt || blog.content.substring(0, 150)}...
                          </p>
                        </Link>
                        
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {blog.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="font-normal text-[11px] px-2 py-0.5 bg-black/[0.03] border-black/[0.06] hover:bg-black/[0.06] cursor-pointer">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="hidden sm:block h-24 w-32 shrink-0 rounded-xl overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                          <span className="text-xl font-bold text-violet-300">Aa</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-black/[0.04]">
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground text-xs gap-1.5">
                          <ThumbsUp className="h-3.5 w-3.5" /> 24
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground text-xs gap-1.5">
                          <MessageCircle className="h-3.5 w-3.5" /> Comment
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Bookmark className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>

          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-2xl border border-black/[0.06] bg-white/70 backdrop-blur p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Trending</h3>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  {trendingTags.length > 0 ? (
                    trendingTags.map(([tag, count]) => (
                      <div key={tag} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">#{tag}</span>
                        <span className="text-xs text-muted-foreground">{count} posts</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No trends yet</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-black/[0.06] bg-white/70 backdrop-blur p-4">
                <h3 className="text-sm font-semibold mb-3">Who to follow</h3>
                <div className="space-y-3">
                  {suggestedAuthors.length > 0 ? (
                    suggestedAuthors.map((author) => (
                      <Link key={author.id} to={`/users/${author.id}`} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-black/10">
                          <AvatarImage src={author.avatar} />
                          <AvatarFallback className="bg-violet-100 text-violet-600 text-[10px] font-semibold">
                            {author.firstName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{author.firstName} {author.lastName}</p>
                          <p className="text-xs text-muted-foreground truncate">@{author.username}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
                          Follow
                        </Button>
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No suggestions yet</p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
