import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { toast } from "sonner";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowLeft,
  Calendar,
  Eye,
  Clock,
  Heart,
  Send,
  MoreHorizontal,
  Pencil,
  Trash2,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const API = `${BACKEND_URL}/api`;

const BlogDetail = () => {
  const { blogId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const [blogRes, commentsRes] = await Promise.all([
          axios.get(`${API}/blogs/${blogId}`),
          axios.get(`${API}/comments/blog/${blogId}`),
        ]);
        if (blogRes.data.success) {
          setBlog(blogRes.data.data);
          setLikeCount(blogRes.data.data.likeCount || 0);
        }
        if (commentsRes.data.success) {
          setComments(commentsRes.data.data.comments || commentsRes.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch blog", error);
        toast.error("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  // Check like status
  useEffect(() => {
    if (!blogId) return;
    const checkLike = async () => {
      try {
        const res = await axios.get(`${API}/likes/status/blog/${blogId}`);
        if (res.data.success) {
          setLiked(res.data.data.liked || false);
          setLikeCount(res.data.data.count || 0);
        }
      } catch {
        // ignore — user might not be logged in
      }
    };
    checkLike();
  }, [blogId]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like posts");
      return;
    }
    try {
      const res = await axios.post(`${API}/likes/toggle`, {
        targetType: "blog",
        targetId: blogId,
      });
      if (res.data.success) {
        setLiked(res.data.data.liked);
        setLikeCount((prev) => (res.data.data.liked ? prev + 1 : prev - 1));
      }
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    setSubmittingComment(true);
    try {
      const res = await axios.post(`${API}/comments`, {
        blogId,
        content: commentText.trim(),
      });
      if (res.data.success) {
        setComments((prev) => [res.data.data, ...prev]);
        setCommentText("");
        toast.success("Comment added");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog post? This cannot be undone.")) return;
    try {
      await axios.delete(`${API}/blogs/${blogId}`);
      toast.success("Blog deleted");
      navigate("/blogs");
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const readingTime = (content) => {
    if (!content) return "1 min";
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const mins = Math.max(1, Math.ceil(words / 200));
    return `${mins} min read`;
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto w-full space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-black/[0.05] rounded-lg" />
        <div className="h-12 w-full bg-black/[0.05] rounded-lg" />
        <div className="h-6 w-64 bg-black/[0.05] rounded-lg" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-black/[0.03] rounded" style={{ width: `${90 - i * 5}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto w-full text-center py-20">
        <p className="text-muted-foreground text-lg">Blog post not found.</p>
        <Link to="/blogs">
          <Button variant="ghost" className="mt-4 gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Feed
          </Button>
        </Link>
      </div>
    );
  }

  const isAuthor = user && blog.authorId === user.id;

  return (
    <div className="max-w-3xl mx-auto w-full space-y-8 animate-in fade-in duration-500">

      {/* Back button */}
      <Link to="/blogs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Feed
      </Link>

      {/* Article Header */}
      <header className="space-y-6">
        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal text-[11px] px-2.5 py-0.5 bg-violet-50 text-violet-600 border-violet-200">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
          {blog.title}
        </h1>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-lg text-muted-foreground leading-relaxed">{blog.excerpt}</p>
        )}

        {/* Author + Meta */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link to={blog.author ? `/profile/${blog.author.id}` : "#"}>
              <Avatar className="h-10 w-10 border-2 border-black/10 hover:border-violet-500/50 transition-colors">
                <AvatarImage src={blog.author?.avatar} />
                <AvatarFallback className="bg-violet-100 text-violet-600 text-sm font-semibold">
                  {blog.author?.firstName?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link to={blog.author ? `/profile/${blog.author.id}` : "#"} className="text-sm font-semibold hover:text-violet-600 transition-colors">
                {blog.author?.firstName} {blog.author?.lastName}
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {readingTime(blog.content)}
                </span>
                {blog.viewCount > 0 && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {blog.viewCount} views
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <Bookmark className="h-4 w-4" />
            </Button>
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 bg-white border border-black/[0.08] rounded-xl p-1 shadow-xl">
                  <DropdownMenuItem className="rounded-lg cursor-pointer gap-2 text-sm">
                    <Pencil className="h-3.5 w-3.5" /> Edit Post
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="rounded-lg cursor-pointer gap-2 text-sm text-red-500 focus:text-red-600 focus:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" /> Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="h-px bg-black/[0.06]" />
      </header>

      {/* Thread Navigation Banner */}
      {blog.thread && (
        <div className="glass rounded-2xl p-4 border border-violet-200/50 bg-violet-50/30">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <Link to={`/threads/${blog.thread.id}`} className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Layers className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold group-hover:text-violet-600 transition-colors">{blog.thread.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  Post {blog.thread.currentIndex + 1} of {blog.thread.totalPosts}
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              {blog.thread.previousBlogId && (
                <Link to={`/blogs/${blog.thread.previousBlogId}`}>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs rounded-lg border-violet-200 hover:bg-violet-50">
                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                  </Button>
                </Link>
              )}
              {blog.thread.nextBlogId && (
                <Link to={`/blogs/${blog.thread.nextBlogId}`}>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs rounded-lg border-violet-200 hover:bg-violet-50">
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1 bg-violet-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all"
              style={{ width: `${((blog.thread.currentIndex + 1) / blog.thread.totalPosts) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="rounded-2xl overflow-hidden border border-black/[0.06]">
          <img src={blog.coverImage} alt={blog.title} className="w-full h-auto object-cover" />
        </div>
      )}

      {/* Article Content */}
      <article
        className="prose prose-gray max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
          prose-p:leading-relaxed prose-p:text-[15px] prose-p:text-gray-700
          prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline
          prose-code:bg-black/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono
          prose-pre:bg-slate-900 prose-pre:text-slate-200 prose-pre:rounded-xl
          prose-blockquote:border-violet-300 prose-blockquote:bg-violet-50/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1
          prose-img:rounded-xl prose-img:border prose-img:border-black/[0.06]
          prose-li:text-[15px] prose-li:text-gray-700
          prose-strong:text-gray-900"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Engagement Bar */}
      <div className="flex items-center justify-between py-4 border-y border-black/[0.06]">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`h-9 px-3 rounded-full gap-2 text-sm font-medium transition-all ${
              liked
                ? "text-red-500 bg-red-50 hover:bg-red-100"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
            {likeCount}
          </Button>
          <Button variant="ghost" size="sm" className="h-9 px-3 rounded-full gap-2 text-sm text-muted-foreground hover:text-foreground">
            <MessageCircle className="h-4 w-4" />
            {comments.length}
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="h-9 px-3 rounded-full gap-2 text-sm text-muted-foreground hover:text-foreground" onClick={handleShare}>
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </div>

      {/* Comments Section */}
      <section className="space-y-6 pb-16">
        <h3 className="text-lg font-bold tracking-tight">
          Comments ({comments.length})
        </h3>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleComment} className="flex gap-3">
            <Avatar className="h-9 w-9 border-2 border-black/10 shrink-0">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-violet-100 text-violet-600 text-xs font-semibold">
                {user.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 h-10 px-4 rounded-full border border-black/[0.1] bg-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 transition-all"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!commentText.trim() || submittingComment}
                className="h-10 w-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 shadow-lg shadow-violet-500/20 shrink-0 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="glass rounded-2xl p-5 text-center">
            <p className="text-sm text-muted-foreground">
              <Link to="/login" className="text-violet-600 font-medium hover:underline">Log in</Link> to join the conversation.
            </p>
          </div>
        )}

        {/* Comment List */}
        {comments.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-dashed border-black/[0.08]">
            <MessageCircle className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No comments yet. Be the first to share your thoughts.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 group">
                <Link to={comment.author ? `/profile/${comment.author.id}` : "#"}>
                  <Avatar className="h-8 w-8 border border-black/10 shrink-0">
                    <AvatarImage src={comment.author?.avatar} />
                    <AvatarFallback className="bg-violet-100 text-violet-600 text-[10px] font-semibold">
                      {comment.author?.firstName?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="glass rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Link to={comment.author ? `/profile/${comment.author.id}` : "#"} className="text-sm font-semibold hover:text-violet-600 transition-colors">
                        {comment.author?.firstName} {comment.author?.lastName}
                      </Link>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      {comment.isEdited && (
                        <span className="text-[10px] text-muted-foreground italic">(edited)</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogDetail;
