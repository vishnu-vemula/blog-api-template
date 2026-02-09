import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Zap } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      toast.success("Account created successfully!");
      navigate("/");
    } else {
      toast.error(result.message);
    }
  };

  const inputClass = "h-11 bg-white border-black/[0.1] focus:border-violet-500/50 rounded-xl";

  return (
    <div className="relative flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] px-6 py-12 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-violet-200/60 rounded-full blur-[150px] animate-float -z-10" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-200/40 rounded-full blur-[120px] animate-float-slow -z-10" />

      {/* Logo */}
      <div className="mb-8 flex flex-col items-center space-y-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
          <Zap className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">Join the WorksAndBlogs community</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm glass-strong rounded-2xl p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">First name</Label>
              <Input id="firstName" name="firstName" required className={inputClass} value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">Last name</Label>
              <Input id="lastName" name="lastName" required className={inputClass} value={formData.lastName} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">Username</Label>
            <Input id="username" name="username" required className={inputClass} value={formData.username} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required className={inputClass} value={formData.email} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input id="password" name="password" type="password" required className={inputClass} value={formData.password} onChange={handleChange} />
          </div>
          <Button 
            type="submit" 
            className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 border-0 font-medium mt-2" 
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-600 hover:text-violet-700 font-medium transition-colors">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
