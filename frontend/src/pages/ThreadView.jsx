import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Layers,
  ChevronRight,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const API = `${BACKEND_URL}/api`;

const readingTime = (content) => {
  if (!content) return "1 min";
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min`;
};

const ThreadView = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const res = await axios.get(`${API}/threads/${threadId}`);
        if (res.data.success) {
          setThread(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch thread", error);
        toast.error("Failed to load thread");
      } finally {
        setLoading(false);
      }
    };
    fetchThread();
  }, [threadId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto w-full space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-black/[0.05] rounded-lg" />
        <div className="h-12 w-full bg-black/[0.05] rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-black/[0.03] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="max-w-3xl mx-auto w-full text-center py-20">
        <p className="text-muted-foreground text-lg">Thread not found.</p>
        <Link to="/blogs">
          <Button variant="ghost" className="mt-4 gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Feed
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full space-y-8 animate-in fade-in duration-500">

      {/* Back */}
      <Link to="/blogs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Feed
      </Link>

      {/* Thread Header */}
      <header className="space-y-5">
        <div className="flex items-center gap-2">
          <Badge className="bg-violet-100 text-violet-700 border-violet-200 text-xs gap-1">
            <Layers className="h-3 w-3" /> Thread
          </Badge>
          <Badge variant="outline" className="text-xs">
            {thread.postCount} {thread.postCount === 1 ? "post" : "posts"}
          </Badge>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
          {thread.title}
        </h1>

        {thread.description && (
          <p className="text-lg text-muted-foreground leading-relaxed">{thread.description}</p>
        )}

        {/* Author */}
        {thread.author && (
          <div className="flex items-center gap-3">
            <Link to={`/profile/${thread.author.id}`}>
              <Avatar className="h-10 w-10 border-2 border-black/10 hover:border-violet-500/50 transition-colors">
                <AvatarImage src={thread.author.avatar} />
                <AvatarFallback className="bg-violet-100 text-violet-600 text-sm font-semibold">
                  {thread.author.firstName?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link to={`/profile/${thread.author.id}`} className="text-sm font-semibold hover:text-violet-600 transition-colors">
                {thread.author.firstName} {thread.author.lastName}
              </Link>
              <p className="text-xs text-muted-foreground">
                @{thread.author.username}
              </p>
            </div>
          </div>
        )}

        <div className="h-px bg-black/[0.06]" />
      </header>

      {/* Thread Timeline */}
      <div className="relative">
        {/* Vertical connector line */}
        {thread.blogs && thread.blogs.length > 1 && (
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-300 via-violet-200 to-transparent" />
        )}

        <div className="space-y-0">
          {thread.blogs?.map((blog, index) => (
            <div key={blog.id} className="relative flex gap-5">
              {/* Timeline node */}
              <div className="relative z-10 flex flex-col items-center shrink-0">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm border-2 ${
                  index === 0
                    ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white border-violet-300"
                    : "bg-white text-violet-600 border-violet-200"
                }`}>
                  {index + 1}
                </div>
              </div>

              {/* Card */}
              <Link
                to={`/blogs/${blog.id}`}
                className="flex-1 group glass rounded-2xl p-5 mb-4 hover:bg-black/[0.02] transition-all duration-300 border border-transparent hover:border-violet-200/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <h3 className="text-lg font-bold leading-snug group-hover:text-violet-600 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {readingTime(blog.excerpt)} read
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  {blog.coverImage ? (
                    <div className="hidden sm:block h-20 w-28 shrink-0 rounded-xl overflow-hidden">
                      <img src={blog.coverImage} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="hidden sm:flex h-20 w-28 shrink-0 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 items-center justify-center">
                      <span className="text-lg font-bold text-violet-300">{index + 1}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-3 text-xs text-violet-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Read post <ChevronRight className="h-3 w-3" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Thread end marker */}
      {thread.blogs && thread.blogs.length > 0 && (
        <div className="flex items-center gap-3 pl-3">
          <div className="h-6 w-6 rounded-full bg-violet-100 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-violet-400" />
          </div>
          <span className="text-xs text-muted-foreground font-medium">End of thread</span>
        </div>
      )}
    </div>
  );
};

export default ThreadView;
