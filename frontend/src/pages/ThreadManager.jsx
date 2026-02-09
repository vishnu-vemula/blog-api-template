import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import {
  Plus,
  Layers,
  Trash2,
  Pencil,
  GripVertical,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Eye,
  EyeOff,
  Search,
  ArrowRight,
  FileText,
  Calendar,
  Sparkles,
  Link2,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const API = `${BACKEND_URL}/api`;

const ThreadManager = () => {
  const { user, loading: authLoading } = useAuth();
  const [threads, setThreads] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedBlogIds, setSelectedBlogIds] = useState([]);
  const [showBlogPicker, setShowBlogPicker] = useState(false);
  const [blogSearch, setBlogSearch] = useState("");

  useEffect(() => {
    if (authLoading) return;
    fetchData();
  }, [authLoading]);

  const fetchData = async () => {
    try {
      const [threadsRes, blogsRes] = await Promise.allSettled([
        axios.get(`${API}/threads/user/my-threads`),
        axios.get(`${API}/blogs/user/my-blogs?limit=100`),
      ]);
      if (threadsRes.status === "fulfilled" && threadsRes.value.data.success) {
        setThreads(threadsRes.value.data.data.threads || []);
      } else if (threadsRes.status === "rejected") {
        console.error("Failed to fetch threads:", threadsRes.reason);
        toast.error(threadsRes.reason?.response?.data?.message || "Failed to load threads");
      }
      if (blogsRes.status === "fulfilled" && blogsRes.value.data.success) {
        setMyBlogs(blogsRes.value.data.data.blogs || []);
      } else if (blogsRes.status === "rejected") {
        console.error("Failed to fetch blogs:", blogsRes.reason);
        toast.error(blogsRes.reason?.response?.data?.message || "Failed to load your posts");
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Something went wrong loading your data");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedBlogIds([]);
    setCreating(false);
    setEditingId(null);
    setShowBlogPicker(false);
    setBlogSearch("");
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Thread title is required");
      return;
    }
    try {
      const res = await axios.post(`${API}/threads`, {
        title: title.trim(),
        description: description.trim(),
        blogIds: selectedBlogIds,
        status: "published",
      });
      if (res.data.success) {
        toast.success("Thread created!");
        resetForm();
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create thread");
    }
  };

  const handleUpdate = async () => {
    if (!title.trim() || !editingId) return;
    try {
      const res = await axios.put(`${API}/threads/${editingId}`, {
        title: title.trim(),
        description: description.trim(),
        blogIds: selectedBlogIds,
      });
      if (res.data.success) {
        toast.success("Thread updated!");
        resetForm();
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update thread");
    }
  };

  const handleDelete = async (threadId) => {
    if (!confirm("Delete this thread? The blog posts will not be deleted.")) return;
    try {
      await axios.delete(`${API}/threads/${threadId}`);
      toast.success("Thread deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete thread");
    }
  };

  const startEdit = (thread) => {
    setEditingId(thread.id);
    setTitle(thread.title);
    setDescription(thread.description || "");
    setSelectedBlogIds(thread.blogIds || []);
    setCreating(true);
  };

  const toggleBlog = (blogId) => {
    setSelectedBlogIds((prev) =>
      prev.includes(blogId) ? prev.filter((id) => id !== blogId) : [...prev, blogId]
    );
  };

  const moveBlog = (index, direction) => {
    const newIds = [...selectedBlogIds];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= newIds.length) return;
    [newIds[index], newIds[swapIndex]] = [newIds[swapIndex], newIds[index]];
    setSelectedBlogIds(newIds);
  };

  const getBlogTitle = (blogId) => {
    const blog = myBlogs.find((b) => b.id === blogId);
    return blog?.title || blogId;
  };

  const getBlogStatus = (blogId) => {
    const blog = myBlogs.find((b) => b.id === blogId);
    return blog?.status || "draft";
  };

  // Blogs already in other threads (not the one being edited)
  const blogsInOtherThreads = new Set();
  threads.forEach((t) => {
    if (t.id !== editingId) {
      t.blogIds?.forEach((id) => blogsInOtherThreads.add(id));
    }
  });

  const filteredBlogs = myBlogs.filter((b) =>
    b.title.toLowerCase().includes(blogSearch.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="max-w-3xl mx-auto w-full space-y-6">
        <div className="h-32 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-black/[0.02] rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full space-y-8 animate-in fade-in duration-500">

      {/* ─── Header ─── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-50 via-indigo-50/80 to-purple-50 border border-violet-100/60 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-violet-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">Threads</h1>
                <p className="text-sm text-muted-foreground">Link posts into ordered series</p>
              </div>
            </div>
          </div>
          {!creating && (
            <Button
              onClick={() => setCreating(true)}
              size="sm"
              className="gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 shadow-lg shadow-violet-500/25 h-10 px-5"
            >
              <Plus className="h-4 w-4" /> New Thread
            </Button>
          )}
        </div>
        {threads.length > 0 && (
          <div className="relative flex items-center gap-6 mt-5 pt-5 border-t border-violet-200/40">
            <div className="text-center">
              <p className="text-xl font-bold text-violet-700">{threads.length}</p>
              <p className="text-[11px] text-muted-foreground">Threads</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-indigo-700">{threads.reduce((sum, t) => sum + (t.postCount || 0), 0)}</p>
              <p className="text-[11px] text-muted-foreground">Linked Posts</p>
            </div>
          </div>
        )}
      </div>

      {/* ─── Create / Edit Form ─── */}
      {creating && (
        <div className="rounded-2xl border border-violet-200/60 bg-white shadow-xl shadow-violet-500/[0.04] overflow-hidden">
          {/* Form header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-violet-50/80 to-indigo-50/50 border-b border-violet-100/50">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                {editingId ? <Pencil className="h-3.5 w-3.5 text-white" /> : <Sparkles className="h-3.5 w-3.5 text-white" />}
              </div>
              <h3 className="text-base font-bold">{editingId ? "Edit Thread" : "New Thread"}</h3>
            </div>
            <button onClick={resetForm} className="h-8 w-8 rounded-lg hover:bg-black/[0.05] flex items-center justify-center transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Thread Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Building a REST API from scratch"
                className="w-full h-11 px-4 rounded-xl border border-black/[0.08] bg-black/[0.01] text-sm font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10 focus:bg-white transition-all"
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description <span className="font-normal normal-case text-muted-foreground/60">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of this thread series..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-black/[0.08] bg-black/[0.01] text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-black/[0.06]" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Posts</span>
              <div className="h-px flex-1 bg-black/[0.06]" />
            </div>

            {/* Selected blogs (ordered) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Thread Order
                  <span className="ml-2 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold">
                    {selectedBlogIds.length}
                  </span>
                </p>
              </div>

              {selectedBlogIds.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedBlogIds.map((blogId, index) => (
                    <div
                      key={blogId}
                      className="flex items-center gap-2.5 rounded-xl border border-black/[0.06] bg-white px-3 py-2.5 hover:border-violet-200/80 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-2 shrink-0">
                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/50 transition-colors" />
                        <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{getBlogTitle(blogId)}</p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                          {getBlogStatus(blogId) === "published" ? (
                            <><Eye className="h-2.5 w-2.5" /> Published</>
                          ) : (
                            <><EyeOff className="h-2.5 w-2.5" /> Draft</>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => moveBlog(index, -1)}
                          disabled={index === 0}
                          className="h-7 w-7 rounded-lg hover:bg-violet-50 flex items-center justify-center disabled:opacity-20 transition-colors"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveBlog(index, 1)}
                          disabled={index === selectedBlogIds.length - 1}
                          className="h-7 w-7 rounded-lg hover:bg-violet-50 flex items-center justify-center disabled:opacity-20 transition-colors"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => toggleBlog(blogId)}
                          className="h-7 w-7 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 flex items-center justify-center transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-black/[0.08] bg-black/[0.01] py-6 text-center">
                  <FileText className="h-6 w-6 text-muted-foreground/25 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No posts added yet</p>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowBlogPicker(!showBlogPicker); setBlogSearch(""); }}
                className="gap-2 rounded-xl text-xs h-9 border-dashed hover:border-violet-300 hover:bg-violet-50/50 transition-colors w-full"
              >
                <Plus className="h-3.5 w-3.5" /> {showBlogPicker ? "Hide Post Picker" : "Add Posts to Thread"}
              </Button>

              {/* Blog picker */}
              {showBlogPicker && (
                <div className="rounded-xl border border-black/[0.08] overflow-hidden bg-white shadow-sm">
                  {/* Search */}
                  <div className="relative border-b border-black/[0.06]">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
                    <input
                      type="text"
                      value={blogSearch}
                      onChange={(e) => setBlogSearch(e.target.value)}
                      placeholder="Search your posts..."
                      className="w-full h-10 pl-9 pr-4 text-sm bg-transparent focus:outline-none placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {filteredBlogs.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-xs text-muted-foreground">{myBlogs.length === 0 ? "No blog posts found. Write some posts first!" : "No posts match your search."}</p>
                      </div>
                    ) : (
                      filteredBlogs.map((blog) => {
                        const isSelected = selectedBlogIds.includes(blog.id);
                        const inOtherThread = blogsInOtherThreads.has(blog.id);
                        return (
                          <button
                            key={blog.id}
                            onClick={() => !inOtherThread && toggleBlog(blog.id)}
                            disabled={inOtherThread}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-all border-b border-black/[0.03] last:border-0 ${
                              inOtherThread
                                ? "opacity-35 cursor-not-allowed bg-black/[0.01]"
                                : isSelected
                                ? "bg-violet-50/80 hover:bg-violet-50"
                                : "hover:bg-black/[0.015]"
                            }`}
                          >
                            <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? "bg-violet-600 border-violet-600 shadow-sm shadow-violet-500/30" : "border-black/[0.12]"
                            }`}>
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-[13px]">{blog.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  {blog.status === "published" ? <Eye className="h-2.5 w-2.5" /> : <EyeOff className="h-2.5 w-2.5" />}
                                  {blog.status}
                                </span>
                                {blog.createdAt && (
                                  <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1">
                                    <Calendar className="h-2.5 w-2.5" />
                                    {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                  </span>
                                )}
                              </div>
                            </div>
                            {inOtherThread && (
                              <Badge variant="outline" className="text-[9px] shrink-0 border-amber-200 text-amber-600 bg-amber-50">Linked</Badge>
                            )}
                            {isSelected && (
                              <span className="text-[10px] font-bold text-violet-600 shrink-0">#{selectedBlogIds.indexOf(blog.id) + 1}</span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form footer */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 bg-black/[0.015] border-t border-black/[0.06]">
            <Button variant="ghost" onClick={resetForm} size="sm" className="rounded-xl text-muted-foreground hover:text-foreground">
              Cancel
            </Button>
            <Button
              onClick={editingId ? handleUpdate : handleCreate}
              size="sm"
              className="gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 shadow-lg shadow-violet-500/20 h-10 px-6"
            >
              <Check className="h-4 w-4" /> {editingId ? "Save Changes" : "Create Thread"}
            </Button>
          </div>
        </div>
      )}

      {/* ─── Thread List ─── */}
      {threads.length === 0 && !creating ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-black/[0.08] bg-black/[0.005]">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mx-auto mb-4">
            <Link2 className="h-7 w-7 text-violet-400" />
          </div>
          <p className="text-base font-semibold text-foreground/80">No threads yet</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
            Create a thread to link your blog posts into an ordered series readers can follow.
          </p>
          <Button
            onClick={() => setCreating(true)}
            size="sm"
            className="mt-5 gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 shadow-lg shadow-violet-500/20"
          >
            <Plus className="h-4 w-4" /> Create Your First Thread
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {threads.map((thread) => (
            <div
              key={thread.id}
              className="rounded-2xl border border-black/[0.06] bg-white hover:border-violet-200/60 hover:shadow-lg hover:shadow-violet-500/[0.03] transition-all duration-300 overflow-hidden"
            >
              {/* Thread header */}
              <div className="p-5 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <Link to={`/threads/${thread.id}`} className="flex-1 min-w-0 group">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                        <Layers className="h-3 w-3 text-white" />
                      </div>
                      <Badge variant="outline" className="text-[10px] font-medium">
                        {thread.postCount} {thread.postCount === 1 ? "post" : "posts"}
                      </Badge>
                      <Badge variant="outline" className={`text-[10px] font-medium ${
                        thread.status === "published"
                          ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                          : "text-amber-600 border-amber-200 bg-amber-50"
                      }`}>
                        {thread.status}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold leading-snug group-hover:text-violet-600 transition-colors">
                      {thread.title}
                    </h3>
                    {thread.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1 leading-relaxed">{thread.description}</p>
                    )}
                  </Link>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={() => startEdit(thread)}
                      className="h-8 w-8 rounded-lg text-muted-foreground/50 hover:text-foreground hover:bg-black/[0.04] flex items-center justify-center transition-all"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(thread.id)}
                      className="h-8 w-8 rounded-lg text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Blog timeline preview */}
              {thread.blogs && thread.blogs.length > 0 && (
                <div className="px-5 pb-5">
                  <div className="rounded-xl bg-black/[0.015] border border-black/[0.04] p-3">
                    <div className="space-y-0">
                      {thread.blogs.slice(0, 4).map((blog, i) => (
                        <Link
                          key={blog.id}
                          to={`/blogs/${blog.id}`}
                          className="flex items-center gap-3 py-2 group relative"
                        >
                          {/* Connector line */}
                          {i < Math.min(thread.blogs.length, 4) - 1 && (
                            <div className="absolute left-[11px] top-[28px] bottom-0 w-px bg-violet-200/60" />
                          )}
                          <span className="relative z-10 h-6 w-6 rounded-full bg-white border-2 border-violet-300 text-violet-600 text-[10px] font-bold flex items-center justify-center shrink-0 group-hover:border-violet-500 group-hover:bg-violet-50 transition-colors">
                            {i + 1}
                          </span>
                          <p className="text-[13px] font-medium truncate flex-1 group-hover:text-violet-600 transition-colors">
                            {blog.title}
                          </p>
                          <ArrowRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-violet-400 shrink-0 transition-colors" />
                        </Link>
                      ))}
                      {thread.blogs.length > 4 && (
                        <Link to={`/threads/${thread.id}`} className="flex items-center gap-3 py-2 group">
                          <span className="h-6 w-6 rounded-full bg-violet-50 border-2 border-violet-200 text-violet-500 text-[9px] font-bold flex items-center justify-center shrink-0">
                            +{thread.blogs.length - 4}
                          </span>
                          <p className="text-[13px] font-medium text-violet-600 group-hover:underline">
                            View all {thread.blogs.length} posts
                          </p>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThreadManager;
