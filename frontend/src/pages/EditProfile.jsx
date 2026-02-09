import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { toast } from "sonner";
import { ArrowLeft, Save, KeyRound, User, Camera } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const API = `${BACKEND_URL}/api`;

const EditProfile = () => {
  const { user, token, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    avatar: "",
  });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    setSaving(true);
    try {
      const response = await axios.put(`${API}/users/profile`, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        bio: form.bio.trim(),
        avatar: form.avatar.trim(),
      });

      if (response.data.success) {
        toast.success("Profile updated successfully");
        await refreshUser();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    setChangingPassword(true);
    try {
      const response = await axios.put(`${API}/users/change-password`, {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });

      if (response.data.success) {
        toast.success("Password changed successfully");
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-9 w-9 rounded-full hover:bg-black/[0.04]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="gradient-text">Edit Profile</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Update your personal information and settings.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass rounded-xl p-1">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === "profile"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === "password"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <KeyRound className="h-3.5 w-3.5" />
          Password
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileSave} className="space-y-6">
          {/* Avatar Preview */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <Avatar className="h-20 w-20 border-2 border-black/10">
                  <AvatarImage src={form.avatar} />
                  <AvatarFallback className="bg-violet-100 text-violet-600 text-xl font-semibold">
                    {form.firstName?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground/60">Username and email cannot be changed</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="glass rounded-2xl p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="John"
                  className="h-11 bg-white border-black/[0.1] focus:border-violet-500/50 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Doe"
                  className="h-11 bg-white border-black/[0.1] focus:border-violet-500/50 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium">
                Bio
              </Label>
              <textarea
                id="bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell the world about yourself..."
                maxLength={500}
                rows={4}
                className="flex w-full rounded-xl border bg-white border-black/[0.1] focus:border-violet-500/50 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500/50 resize-none transition-colors"
              />
              <p className="text-xs text-muted-foreground text-right">
                {form.bio.length}/500
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar" className="text-sm font-medium">
                Avatar URL
              </Label>
              <Input
                id="avatar"
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
                className="h-11 bg-white border-black/[0.1] focus:border-violet-500/50 rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Paste a URL to an image. Supports JPG, PNG, and WebP.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 border-0 gap-2 px-6"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="glass rounded-2xl p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="oldPassword" className="text-sm font-medium">
                Current Password
              </Label>
              <Input
                id="oldPassword"
                type="password"
                value={passwords.oldPassword}
                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                placeholder="Enter current password"
                className="h-11 bg-white border-black/[0.1] focus:border-violet-500/50 rounded-xl"
              />
            </div>

            <div className="h-px bg-black/[0.06]" />

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="At least 6 characters"
                className="h-11 bg-white border-black/[0.1] focus:border-violet-500/50 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
                className="h-11 bg-white border-black/[0.1] focus:border-violet-500/50 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={changingPassword || !passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword}
              className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 border-0 gap-2 px-6"
            >
              <KeyRound className="h-3.5 w-3.5" />
              {changingPassword ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditProfile;
