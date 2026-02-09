import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { MessageCircle, ThumbsUp, Bookmark } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const API = `${BACKEND_URL}/api`;

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API}/blogs`);
        if (response.data.success) {
          setBlogs(response.data.data.blogs);
        }
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full">
      {/* Feed Header */}
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
              {/* Author */}
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

              {/* Content */}
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
                
                {/* Thumbnail */}
                <div className="hidden sm:block h-24 w-32 shrink-0 rounded-xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-violet-300">Aa</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
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
    </div>
  );
};

export default BlogList;
