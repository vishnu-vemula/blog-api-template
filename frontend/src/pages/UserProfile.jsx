import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { CalendarDays, Settings, UserPlus, UserCheck, Users, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const API = `${BACKEND_URL}/api`;

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);

  // Follow list dialog
  const [showFollowList, setShowFollowList] = useState(null); // 'followers' | 'following' | null
  const [followList, setFollowList] = useState([]);
  const [followListLoading, setFollowListLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, blogsRes, followRes] = await Promise.allSettled([
          axios.get(`${API}/users/${userId}`),
          axios.get(`${API}/blogs/author/${userId}`),
          axios.get(`${API}/follows/status/${userId}`),
        ]);

        if (userRes.status === "fulfilled" && userRes.value.data.success) {
          setUser(userRes.value.data.data);
        } else if (userRes.status === "rejected") {
          console.error("Failed to fetch user:", userRes.reason);
          toast.error(userRes.reason?.response?.data?.message || "Failed to load user profile");
        }
        if (blogsRes.status === "fulfilled" && blogsRes.value.data.success) {
          setBlogs(blogsRes.value.data.data.blogs || []);
        } else if (blogsRes.status === "rejected") {
          console.error("Failed to fetch blogs:", blogsRes.reason);
        }
        if (followRes.status === "fulfilled" && followRes.value.data.success) {
          setIsFollowing(followRes.value.data.data.isFollowing);
          setFollowersCount(followRes.value.data.data.followersCount);
          setFollowingCount(followRes.value.data.data.followingCount);
        } else if (followRes.status === "rejected") {
          console.error("Failed to fetch follow status:", followRes.reason);
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        toast.error("Something went wrong loading the profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error("Please log in to follow users");
      return;
    }
    setFollowLoading(true);
    try {
      const res = await axios.post(`${API}/follows/toggle`, { userId });
      if (res.data.success) {
        setIsFollowing(res.data.data.followed);
        setFollowersCount((prev) => (res.data.data.followed ? prev + 1 : prev - 1));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to follow user");
    } finally {
      setFollowLoading(false);
    }
  };

  const openFollowList = async (type) => {
    setShowFollowList(type);
    setFollowListLoading(true);
    try {
      const res = await axios.get(`${API}/follows/${userId}/${type}?limit=50`);
      if (res.data.success) {
        setFollowList(res.data.data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch follow list", error);
    } finally {
      setFollowListLoading(false);
    }
  };

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
            <div className="flex items-center gap-2">
              {currentUser && currentUser.id === user.id ? (
                <Link to="/edit-profile">
                  <Button variant="outline" size="sm" className="gap-2 rounded-full">
                    <Settings className="h-3.5 w-3.5" />
                    Edit Profile
                  </Button>
                </Link>
              ) : currentUser ? (
                <Button
                  onClick={handleFollow}
                  disabled={followLoading}
                  size="sm"
                  className={`gap-2 rounded-full transition-all ${
                    isFollowing
                      ? "bg-white text-foreground border border-black/[0.1] hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 shadow-lg shadow-violet-500/20"
                  }`}
                >
                  {isFollowing ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Follow List Dialog */}
      {showFollowList && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowFollowList(null)} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-black/[0.06] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-black/[0.06]">
              <h3 className="text-sm font-bold capitalize">{showFollowList}</h3>
              <button onClick={() => setShowFollowList(null)} className="h-8 w-8 rounded-lg hover:bg-black/[0.04] flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {followListLoading ? (
                <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
              ) : followList.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">No {showFollowList} yet.</div>
              ) : (
                followList.map((u) => (
                  <Link
                    key={u.id}
                    to={`/profile/${u.id}`}
                    onClick={() => setShowFollowList(null)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-black/[0.02] transition-colors border-b border-black/[0.04] last:border-0"
                  >
                    <Avatar className="h-9 w-9 border border-black/10">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback className="bg-violet-100 text-violet-600 text-xs font-semibold">
                        {u.firstName?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-muted-foreground">@{u.username}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bio & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold text-sm">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {user.bio || "This user hasn't written a bio yet."}
            </p>

            {/* Follow Stats */}
            <div className="flex items-center gap-4 pt-3 border-t border-black/[0.06]">
              <button onClick={() => openFollowList('followers')} className="text-center hover:text-violet-600 transition-colors">
                <p className="text-lg font-bold">{followersCount}</p>
                <p className="text-[11px] text-muted-foreground">Followers</p>
              </button>
              <button onClick={() => openFollowList('following')} className="text-center hover:text-violet-600 transition-colors">
                <p className="text-lg font-bold">{followingCount}</p>
                <p className="text-[11px] text-muted-foreground">Following</p>
              </button>
              <div className="text-center">
                <p className="text-lg font-bold">{blogs.length}</p>
                <p className="text-[11px] text-muted-foreground">Posts</p>
              </div>
            </div>

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
