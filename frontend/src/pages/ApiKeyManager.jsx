import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { Copy, Trash2, Key, Plus } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const API = `${BACKEND_URL}/api`;

const ApiKeyManager = () => {
  const { token, loading: authLoading } = useAuth();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchKeys = async () => {
    try {
      const response = await axios.get(`${API}/api-keys`);
      if (response.data.success) {
        setKeys(response.data.data);
      }
    } catch (error) {
      console.error("Fetch keys error:", error);
      toast.error("Failed to fetch API keys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && !authLoading) fetchKeys();
  }, [token, authLoading]);

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;

    try {
      const response = await axios.post(`${API}/api-keys`, { name: newKeyName });
      if (response.data.success) {
        setCreatedKey(response.data.data); // Contains the full key only once
        fetchKeys();
        setNewKeyName("");
        toast.success("API Key created successfully");
      }
    } catch (error) {
      console.error("Create key error:", error);
      toast.error(error.response?.data?.message || "Failed to create API key");
    }
  };

  const handleDeleteKey = async (id) => {
    if (!confirm("Are you sure you want to delete this API key? This action cannot be undone.")) return;
    
    try {
      await axios.delete(`${API}/api-keys/${id}`);
      setKeys(keys.filter((k) => k.id !== id));
      toast.success("API Key deleted");
    } catch (error) {
      console.error("Delete key error:", error);
      toast.error("Failed to delete API key");
    }
  };

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed"; // Avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          toast.success("Copied to clipboard");
        } else {
          toast.error("Failed to copy");
        }
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="gradient-text">API Keys</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage keys to access the platform programmatically.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 border-0 gap-2">
              <Plus className="h-3.5 w-3.5" /> Generate Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] glass-strong border-black/[0.08] rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Give your key a name to identify it later.
              </DialogDescription>
            </DialogHeader>
            {!createdKey ? (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Key Name</Label>
                  <Input
                    id="name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="My Blog Site"
                    className="h-11 bg-white border-black/[0.1] focus:border-violet-500/50 rounded-xl"
                  />
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <p className="text-sm text-emerald-600 font-medium mb-3">
                    Key generated! Copy it now — you won't see it again.
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/[0.04] p-2.5 rounded-lg border border-black/[0.08] font-mono text-xs break-all text-foreground">
                      {createdKey.key}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(createdKey.key)}
                      className="shrink-0 h-9 w-9 hover:bg-black/[0.04]"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              {!createdKey ? (
                <Button onClick={handleCreateKey} disabled={!newKeyName.trim()} className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0">
                  Create Key
                </Button>
              ) : (
                <Button variant="ghost" onClick={() => { setIsDialogOpen(false); setCreatedKey(null); }} className="rounded-xl">
                  Done
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-black/[0.06]">
          <h3 className="font-semibold text-sm">Your Keys</h3>
          <p className="text-xs text-muted-foreground mt-0.5">These keys allow external apps to fetch your blogs.</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-black/[0.02] border-black/[0.06]">
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Prefix</TableHead>
              <TableHead className="text-xs">Created</TableHead>
              <TableHead className="text-xs">Last Used</TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground text-sm">
                  Loading...
                </TableCell>
              </TableRow>
            ) : keys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground text-sm">
                  No API keys yet. Generate one to get started.
                </TableCell>
              </TableRow>
            ) : (
              keys.map((key) => (
                <TableRow key={key.id} className="hover:bg-black/[0.02] border-black/[0.06]">
                  <TableCell className="font-medium text-sm flex items-center gap-2">
                    <Key className="h-3.5 w-3.5 text-violet-600" /> {key.name}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {key.prefix}••••
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(key.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteKey(key.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ApiKeyManager;
