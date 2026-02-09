import { useState, useEffect, useRef } from 'react';
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Copy, Check, BookOpen, Key, Users, MessageSquare, Heart, FolderTree, Zap, Shield, Globe, Terminal, Menu, X } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const methodColors = {
  GET: "bg-blue-100 text-blue-700 border-blue-200",
  POST: "bg-green-100 text-green-700 border-green-200",
  PUT: "bg-amber-100 text-amber-700 border-amber-200",
  DELETE: "bg-red-100 text-red-700 border-red-200",
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="absolute top-2.5 right-2.5 p-1.5 rounded-md hover:bg-black/[0.04] text-muted-foreground hover:text-foreground transition-colors">
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
};

const CodeBlock = ({ code, lang = "bash" }) => (
  <div className="relative group">
    <pre className="bg-slate-900 text-slate-200 rounded-xl p-4 text-[13px] font-mono leading-relaxed overflow-x-auto">
      <code>{code}</code>
    </pre>
    <CopyButton text={code} />
  </div>
);

const JsonBlock = ({ data }) => {
  const formatted = JSON.stringify(data, null, 2);
  return <CodeBlock code={formatted} lang="json" />;
};

const ParamTable = ({ params }) => (
  <div className="rounded-xl border overflow-hidden">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-black/[0.02] border-b">
          <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Field</th>
          <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Type</th>
          <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Required</th>
          <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Description</th>
        </tr>
      </thead>
      <tbody>
        {params.map((p, i) => (
          <tr key={i} className="border-b last:border-0 hover:bg-black/[0.01]">
            <td className="px-4 py-2.5 font-mono text-xs text-violet-600">{p.name}</td>
            <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{p.type}</td>
            <td className="px-4 py-2.5">
              {p.required
                ? <span className="text-[10px] font-bold uppercase text-red-500">Required</span>
                : <span className="text-[10px] font-bold uppercase text-muted-foreground">Optional</span>
              }
            </td>
            <td className="px-4 py-2.5 text-muted-foreground text-xs">{p.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const EndpointBlock = ({ method, path, desc, auth, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-4 hover:bg-black/[0.01] transition-colors text-left">
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${methodColors[method]}`}>{method}</span>
        <code className="text-sm font-mono font-medium flex-1">{path}</code>
        <span className="text-xs text-muted-foreground hidden sm:inline mr-2">{desc}</span>
        {auth && auth !== "None" && (
          <Badge variant="outline" className="text-[10px] mr-1 shrink-0">{auth}</Badge>
        )}
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="border-t px-5 py-5 space-y-5 bg-black/[0.01]">
          {children}
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ id, icon: Icon, label, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all text-left ${
      active
        ? "bg-violet-100 text-violet-700 shadow-sm"
        : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03]"
    }`}
  >
    <Icon className="h-3.5 w-3.5 shrink-0" />
    {label}
    {active && <div className="ml-auto w-1 h-1 rounded-full bg-violet-500" />}
  </button>
);

// ─── Main Docs Component ──────────────────────────────────────────────────────

const sections = [
  { id: "overview", icon: BookOpen, label: "Overview" },
  { id: "auth", icon: Shield, label: "Authentication" },
  { id: "users", icon: Users, label: "Users" },
  { id: "api-keys", icon: Key, label: "API Keys" },
  { id: "blogs", icon: Terminal, label: "Blogs" },
  { id: "categories", icon: FolderTree, label: "Categories" },
  { id: "comments", icon: MessageSquare, label: "Comments" },
  { id: "likes", icon: Heart, label: "Likes" },
  { id: "errors", icon: Zap, label: "Errors" },
];

const Docs = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Scroll-spy: track which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sidebarContent = (
    <nav className="space-y-1">
      <div className="px-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <BookOpen className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight">API Docs</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <Badge className="bg-green-100 text-green-700 border-green-200 text-[9px]">v1.0</Badge>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[9px]">REST</Badge>
          <Badge className="bg-violet-100 text-violet-700 border-violet-200 text-[9px]">JSON</Badge>
        </div>
      </div>
      <div className="h-px bg-black/[0.06] mx-3 mb-2" />
      <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Getting Started</p>
      {sections.slice(0, 2).map((s) => (
        <SidebarItem key={s.id} {...s} active={activeSection === s.id} onClick={scrollTo} />
      ))}
      <div className="h-px bg-black/[0.06] mx-3 my-2" />
      <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Resources</p>
      {sections.slice(2, 8).map((s) => (
        <SidebarItem key={s.id} {...s} active={activeSection === s.id} onClick={scrollTo} />
      ))}
      <div className="h-px bg-black/[0.06] mx-3 my-2" />
      <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Reference</p>
      {sections.slice(8).map((s) => (
        <SidebarItem key={s.id} {...s} active={activeSection === s.id} onClick={scrollTo} />
      ))}
      <div className="h-px bg-black/[0.06] mx-3 my-2" />
      <div className="px-3 pt-1">
        <div className="rounded-xl bg-black/[0.02] border border-black/[0.06] p-3 space-y-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Base URL</p>
          <code className="block bg-slate-900 text-slate-200 px-2.5 py-1.5 rounded-lg text-[11px] font-mono break-all">{BACKEND_URL}/api</code>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] animate-in fade-in duration-500">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 border-r border-black/[0.06]">
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 px-3 scrollbar-none">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-40 h-11 w-11 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-xl shadow-violet-500/30 flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Menu className="h-4.5 w-4.5" />
      </button>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-white border-r border-black/[0.06] p-4 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold">Navigation</span>
              <button onClick={() => setSidebarOpen(false)} className="h-7 w-7 rounded-lg hover:bg-black/[0.04] flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 max-w-4xl mx-auto px-6 lg:px-10 py-10 space-y-10">

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* OVERVIEW */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="overview" className="scroll-mt-20 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-violet-600" /> Overview
        </h2>
        <div className="glass rounded-2xl p-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            The WorksAndBlogs API is a RESTful JSON API for managing a developer blogging platform. It supports user authentication, blog CRUD, categories, comments, likes, and programmatic access via API keys.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border p-4 space-y-2">
              <h4 className="text-sm font-semibold">All responses follow this shape:</h4>
              <JsonBlock data={{ success: true, data: "...", message: "optional" }} />
            </div>
            <div className="rounded-xl border p-4 space-y-2">
              <h4 className="text-sm font-semibold">Error responses:</h4>
              <JsonBlock data={{ success: false, message: "Error description", errors: ["field-level errors (if validation)"] }} />
            </div>
          </div>
          <div className="rounded-xl border p-4 space-y-2">
            <h4 className="text-sm font-semibold">Pagination</h4>
            <p className="text-xs text-muted-foreground">List endpoints support pagination via query parameters:</p>
            <ParamTable params={[
              { name: "page", type: "number", required: false, desc: "Page number (default: 1)" },
              { name: "limit", type: "number", required: false, desc: "Items per page (default: 10, max: 100)" },
            ]} />
            <p className="text-xs text-muted-foreground mt-2">Paginated responses include:</p>
            <JsonBlock data={{ success: true, data: { blogs: ["..."], total: 42, page: 1, totalPages: 5 } }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* AUTHENTICATION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="auth" className="scroll-mt-20 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-5 w-5 text-violet-600" /> Authentication
        </h2>
        <div className="glass rounded-2xl p-6 space-y-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            The API supports two authentication methods. Use JWT for user-facing operations (login, profile, creating content). Use API Keys for programmatic/external access to blog content.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-violet-100 text-violet-700 border-violet-200">JWT Bearer Token</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Obtained after login or registration. Expires in 7 days. Include in the <code className="text-violet-600">Authorization</code> header.</p>
              <CodeBlock code={`Authorization: Bearer eyJhbGciOiJIUzI1NiIs...`} />
              <p className="text-[11px] text-muted-foreground"><strong>Used for:</strong> Profile management, creating/editing blogs, comments, likes, API key management</p>
            </div>
            <div className="rounded-xl border p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">API Key</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Generated from the dashboard. Never expires. Include in the <code className="text-violet-600">x-api-key</code> header.</p>
              <CodeBlock code={`x-api-key: cc_a1b2c3d4e5f6...`} />
              <p className="text-[11px] text-muted-foreground"><strong>Used for:</strong> Creating blogs, fetching your own blogs from external apps, CI/CD pipelines</p>
            </div>
          </div>

          <div className="rounded-xl border p-5 space-y-3">
            <h4 className="text-sm font-semibold">JWT Token Payload</h4>
            <p className="text-xs text-muted-foreground">The decoded JWT contains:</p>
            <JsonBlock data={{ userId: "uuid-string", email: "user@example.com", role: "user", iat: 1700000000, exp: 1700604800 }} />
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-xs text-amber-800 font-medium">
              <strong>Important:</strong> API keys are shown only once when created. Store them securely. If lost, delete the key and create a new one. Never expose keys in client-side code.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* USERS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="users" className="scroll-mt-20 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-5 w-5 text-violet-600" /> Users
        </h2>
        <div className="space-y-3">

          {/* Register */}
          <EndpointBlock method="POST" path="/users/register" desc="Create a new account" auth="None">
            <h4 className="text-sm font-semibold">Request Body</h4>
            <ParamTable params={[
              { name: "email", type: "string", required: true, desc: "Valid email address" },
              { name: "username", type: "string", required: true, desc: "3-30 characters, unique" },
              { name: "password", type: "string", required: true, desc: "Minimum 6 characters" },
              { name: "firstName", type: "string", required: true, desc: "User's first name" },
              { name: "lastName", type: "string", required: true, desc: "User's last name" },
            ]} />
            <h4 className="text-sm font-semibold">Example Request</h4>
            <CodeBlock code={`curl -X POST ${BACKEND_URL}/api/users/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "sarah@example.com",
    "username": "sarahchen",
    "password": "securePass123",
    "firstName": "Sarah",
    "lastName": "Chen"
  }'`} />
            <h4 className="text-sm font-semibold">Response <Badge className="bg-green-100 text-green-700 text-[10px]">201</Badge></h4>
            <JsonBlock data={{
              success: true,
              data: {
                user: { id: "uuid", email: "sarah@example.com", username: "sarahchen", firstName: "Sarah", lastName: "Chen", bio: "", avatar: "", role: "user", isActive: true, createdAt: "2024-01-15T...", updatedAt: "2024-01-15T..." },
                token: "eyJhbGciOiJIUzI1NiIs..."
              }
            }} />
          </EndpointBlock>

          {/* Login */}
          <EndpointBlock method="POST" path="/users/login" desc="Authenticate and get JWT" auth="None">
            <h4 className="text-sm font-semibold">Request Body</h4>
            <ParamTable params={[
              { name: "email", type: "string", required: true, desc: "Registered email address" },
              { name: "password", type: "string", required: true, desc: "Account password" },
            ]} />
            <h4 className="text-sm font-semibold">Example Request</h4>
            <CodeBlock code={`curl -X POST ${BACKEND_URL}/api/users/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "sarah@example.com", "password": "securePass123"}'`} />
            <h4 className="text-sm font-semibold">Response <Badge className="bg-green-100 text-green-700 text-[10px]">200</Badge></h4>
            <JsonBlock data={{
              success: true,
              data: {
                user: { id: "uuid", email: "sarah@example.com", username: "sarahchen", firstName: "Sarah", lastName: "Chen", role: "user", "...": "..." },
                token: "eyJhbGciOiJIUzI1NiIs..."
              }
            }} />
          </EndpointBlock>

          {/* Get Profile */}
          <EndpointBlock method="GET" path="/users/profile" desc="Get current user's profile" auth="JWT">
            <h4 className="text-sm font-semibold">Example Request</h4>
            <CodeBlock code={`curl ${BACKEND_URL}/api/users/profile \\
  -H "Authorization: Bearer <token>"`} />
            <h4 className="text-sm font-semibold">Response <Badge className="bg-green-100 text-green-700 text-[10px]">200</Badge></h4>
            <JsonBlock data={{
              success: true,
              data: { id: "uuid", email: "sarah@example.com", username: "sarahchen", firstName: "Sarah", lastName: "Chen", bio: "Full-stack developer", avatar: "https://...", role: "user", isActive: true, createdAt: "...", updatedAt: "..." }
            }} />
          </EndpointBlock>

          {/* Update Profile */}
          <EndpointBlock method="PUT" path="/users/profile" desc="Update profile info" auth="JWT">
            <h4 className="text-sm font-semibold">Request Body</h4>
            <ParamTable params={[
              { name: "firstName", type: "string", required: false, desc: "Updated first name" },
              { name: "lastName", type: "string", required: false, desc: "Updated last name" },
              { name: "bio", type: "string", required: false, desc: "Bio text (max 500 chars)" },
              { name: "avatar", type: "string", required: false, desc: "Avatar image URL" },
            ]} />
            <h4 className="text-sm font-semibold">Example Request</h4>
            <CodeBlock code={`curl -X PUT ${BACKEND_URL}/api/users/profile \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"bio": "Writing about React and Node.js", "avatar": "https://example.com/me.jpg"}'`} />
          </EndpointBlock>

          {/* Change Password */}
          <EndpointBlock method="PUT" path="/users/change-password" desc="Change account password" auth="JWT">
            <h4 className="text-sm font-semibold">Request Body</h4>
            <ParamTable params={[
              { name: "oldPassword", type: "string", required: true, desc: "Current password" },
              { name: "newPassword", type: "string", required: true, desc: "New password (min 6 chars)" },
            ]} />
            <h4 className="text-sm font-semibold">Example Request</h4>
            <CodeBlock code={`curl -X PUT ${BACKEND_URL}/api/users/change-password \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"oldPassword": "securePass123", "newPassword": "newSecurePass456"}'`} />
          </EndpointBlock>

          {/* Delete Account */}
          <EndpointBlock method="DELETE" path="/users/profile" desc="Delete your account" auth="JWT">
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-xs text-red-800 font-medium"><strong>Warning:</strong> This permanently deactivates your account. This action cannot be undone.</p>
            </div>
            <CodeBlock code={`curl -X DELETE ${BACKEND_URL}/api/users/profile \\
  -H "Authorization: Bearer <token>"`} />
          </EndpointBlock>

          {/* Public user endpoints */}
          <EndpointBlock method="GET" path="/users" desc="List all users (paginated)" auth="None">
            <h4 className="text-sm font-semibold">Query Parameters</h4>
            <ParamTable params={[
              { name: "page", type: "number", required: false, desc: "Page number (default: 1)" },
              { name: "limit", type: "number", required: false, desc: "Items per page (default: 10)" },
            ]} />
            <CodeBlock code={`curl "${BACKEND_URL}/api/users?page=1&limit=20"`} />
          </EndpointBlock>

          <EndpointBlock method="GET" path="/users/username/:username" desc="Get user by username" auth="None">
            <CodeBlock code={`curl ${BACKEND_URL}/api/users/username/sarahchen`} />
          </EndpointBlock>

          <EndpointBlock method="GET" path="/users/:userId" desc="Get user by ID" auth="None">
            <CodeBlock code={`curl ${BACKEND_URL}/api/users/550e8400-e29b-41d4-a716-446655440000`} />
          </EndpointBlock>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* API KEYS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="api-keys" className="scroll-mt-20 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Key className="h-5 w-5 text-violet-600" /> API Keys
        </h2>
        <div className="glass rounded-2xl p-5 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            API keys let you access the blog API from external applications, scripts, or CI/CD pipelines. Keys are scoped to your user account — any blog created with your API key is owned by you.
          </p>
        </div>
        <div className="space-y-3">

          <EndpointBlock method="POST" path="/api-keys" desc="Generate a new API key" auth="JWT">
            <h4 className="text-sm font-semibold">Request Body</h4>
            <ParamTable params={[
              { name: "name", type: "string", required: true, desc: "A label for this key (e.g. 'My Blog Site')" },
            ]} />
            <h4 className="text-sm font-semibold">Example Request</h4>
            <CodeBlock code={`curl -X POST ${BACKEND_URL}/api/api-keys \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My Portfolio Site"}'`} />
            <h4 className="text-sm font-semibold">Response <Badge className="bg-green-100 text-green-700 text-[10px]">201</Badge></h4>
            <JsonBlock data={{
              success: true,
              data: { key: "cc_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6", id: "key-id", name: "My Portfolio Site", createdAt: "2024-01-15T..." }
            }} />
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
              <p className="text-xs text-amber-800 font-medium"><strong>Copy the key now!</strong> The full key is only returned once. After this, only the prefix is visible.</p>
            </div>
          </EndpointBlock>

          <EndpointBlock method="GET" path="/api-keys" desc="List your API keys" auth="JWT">
            <CodeBlock code={`curl ${BACKEND_URL}/api/api-keys \\
  -H "Authorization: Bearer <token>"`} />
            <h4 className="text-sm font-semibold">Response <Badge className="bg-green-100 text-green-700 text-[10px]">200</Badge></h4>
            <JsonBlock data={{
              success: true,
              data: [
                { id: "key-id", name: "My Portfolio Site", prefix: "cc_a1b2", lastUsed: "2024-01-20T...", isActive: true, createdAt: "2024-01-15T..." }
              ]
            }} />
          </EndpointBlock>

          <EndpointBlock method="DELETE" path="/api-keys/:id" desc="Revoke an API key" auth="JWT">
            <CodeBlock code={`curl -X DELETE ${BACKEND_URL}/api/api-keys/key-id \\
  -H "Authorization: Bearer <token>"`} />
          </EndpointBlock>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BLOGS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="blogs" className="scroll-mt-20 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Terminal className="h-5 w-5 text-violet-600" /> Blogs
        </h2>
        <div className="glass rounded-2xl p-5 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            The core content resource. Blogs support Markdown/HTML content, tags, categories, cover images, draft/published/archived statuses, and public/private visibility. Authenticated with either JWT or API Key.
          </p>
        </div>
        <div className="space-y-3">

          {/* Create Blog */}
          <EndpointBlock method="POST" path="/blogs" desc="Create a new blog post" auth="JWT / API Key">
            <h4 className="text-sm font-semibold">Request Body</h4>
            <ParamTable params={[
              { name: "title", type: "string", required: true, desc: "Blog title (max 200 chars)" },
              { name: "content", type: "string", required: true, desc: "Blog content (Markdown or HTML)" },
              { name: "excerpt", type: "string", required: false, desc: "Short summary (max 500 chars, auto-generated if omitted)" },
              { name: "coverImage", type: "string", required: false, desc: "URL to cover image" },
              { name: "categoryId", type: "string", required: false, desc: "Category UUID" },
              { name: "tags", type: "string[]", required: false, desc: 'Array of tag strings, e.g. ["react", "nodejs"]' },
              { name: "status", type: "string", required: false, desc: '"draft" or "published" (default: "draft")' },
              { name: "isPublic", type: "boolean", required: false, desc: "Visibility (default: true)" },
            ]} />
            <h4 className="text-sm font-semibold">Example — with JWT</h4>
            <CodeBlock code={`curl -X POST ${BACKEND_URL}/api/blogs \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Building REST APIs with Express.js",
    "content": "# Introduction\\nIn this guide...",
    "tags": ["express", "nodejs", "api"],
    "status": "published"
  }'`} />
            <h4 className="text-sm font-semibold">Example — with API Key</h4>
            <CodeBlock code={`curl -X POST ${BACKEND_URL}/api/blogs \\
  -H "x-api-key: cc_a1b2c3d4e5f6..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Automated Post from CI/CD",
    "content": "This post was published via API key.",
    "status": "published"
  }'`} />
            <h4 className="text-sm font-semibold">Response <Badge className="bg-green-100 text-green-700 text-[10px]">201</Badge></h4>
            <JsonBlock data={{
              success: true,
              data: {
                id: "uuid", title: "Building REST APIs with Express.js", slug: "building-rest-apis-with-expressjs",
                content: "# Introduction...", excerpt: "In this guide...", authorId: "user-uuid",
                author: { id: "user-uuid", username: "sarahchen", firstName: "Sarah", lastName: "Chen" },
                tags: ["express", "nodejs", "api"], status: "published", isPublic: true,
                viewCount: 0, likeCount: 0, commentCount: 0,
                publishedAt: "2024-01-15T...", createdAt: "2024-01-15T...", updatedAt: "2024-01-15T..."
              }
            }} />
          </EndpointBlock>

          {/* Get All Blogs */}
          <EndpointBlock method="GET" path="/blogs" desc="List all published blogs" auth="None">
            <h4 className="text-sm font-semibold">Query Parameters</h4>
            <ParamTable params={[
              { name: "page", type: "number", required: false, desc: "Page number" },
              { name: "limit", type: "number", required: false, desc: "Items per page" },
              { name: "search", type: "string", required: false, desc: "Search in title/content" },
              { name: "tags", type: "string", required: false, desc: "Filter by tag" },
              { name: "categoryId", type: "string", required: false, desc: "Filter by category" },
              { name: "status", type: "string", required: false, desc: "Filter by status" },
            ]} />
            <CodeBlock code={`curl "${BACKEND_URL}/api/blogs?page=1&limit=10&tags=react"`} />
          </EndpointBlock>

          {/* Get Popular */}
          <EndpointBlock method="GET" path="/blogs/popular" desc="Get popular blogs by view count" auth="None">
            <CodeBlock code={`curl "${BACKEND_URL}/api/blogs/popular?limit=5"`} />
          </EndpointBlock>

          {/* Get by Tag */}
          <EndpointBlock method="GET" path="/blogs/tag/:tag" desc="Get blogs by tag" auth="None">
            <CodeBlock code={`curl ${BACKEND_URL}/api/blogs/tag/react`} />
          </EndpointBlock>

          {/* Get by Slug */}
          <EndpointBlock method="GET" path="/blogs/slug/:slug" desc="Get blog by URL slug" auth="None">
            <CodeBlock code={`curl ${BACKEND_URL}/api/blogs/slug/building-rest-apis-with-expressjs`} />
          </EndpointBlock>

          {/* Get by Author */}
          <EndpointBlock method="GET" path="/blogs/author/:authorId" desc="Get blogs by author" auth="None">
            <CodeBlock code={`curl ${BACKEND_URL}/api/blogs/author/user-uuid`} />
          </EndpointBlock>

          {/* Get by ID */}
          <EndpointBlock method="GET" path="/blogs/:blogId" desc="Get a single blog by ID" auth="None">
            <CodeBlock code={`curl ${BACKEND_URL}/api/blogs/blog-uuid`} />
          </EndpointBlock>

          {/* My Blogs */}
          <EndpointBlock method="GET" path="/blogs/user/my-blogs" desc="Get your own blogs (all statuses)" auth="JWT / API Key">
            <CodeBlock code={`curl ${BACKEND_URL}/api/blogs/user/my-blogs \\
  -H "Authorization: Bearer <token>"`} />
          </EndpointBlock>

          {/* Update Blog */}
          <EndpointBlock method="PUT" path="/blogs/:blogId" desc="Update a blog post" auth="JWT / API Key">
            <h4 className="text-sm font-semibold">Request Body</h4>
            <ParamTable params={[
              { name: "title", type: "string", required: false, desc: "Updated title (max 200 chars)" },
              { name: "content", type: "string", required: false, desc: "Updated content" },
              { name: "excerpt", type: "string", required: false, desc: "Updated excerpt (max 500 chars)" },
              { name: "coverImage", type: "string", required: false, desc: "Updated cover image URL" },
              { name: "categoryId", type: "string", required: false, desc: "Updated category" },
              { name: "tags", type: "string[]", required: false, desc: "Updated tags array" },
              { name: "status", type: "string", required: false, desc: '"draft", "published", or "archived"' },
              { name: "isPublic", type: "boolean", required: false, desc: "Updated visibility" },
            ]} />
            <CodeBlock code={`curl -X PUT ${BACKEND_URL}/api/blogs/blog-uuid \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Updated Title", "tags": ["react", "updated"]}'`} />
          </EndpointBlock>

          {/* Delete Blog */}
          <EndpointBlock method="DELETE" path="/blogs/:blogId" desc="Delete a blog post" auth="JWT / API Key">
            <CodeBlock code={`curl -X DELETE ${BACKEND_URL}/api/blogs/blog-uuid \\
  -H "Authorization: Bearer <token>"`} />
          </EndpointBlock>

          {/* Publish / Unpublish */}
          <EndpointBlock method="POST" path="/blogs/:blogId/publish" desc="Publish a draft blog" auth="JWT / API Key">
            <CodeBlock code={`curl -X POST ${BACKEND_URL}/api/blogs/blog-uuid/publish \\
  -H "Authorization: Bearer <token>"`} />
          </EndpointBlock>

          <EndpointBlock method="POST" path="/blogs/:blogId/unpublish" desc="Unpublish (revert to draft)" auth="JWT / API Key">
            <CodeBlock code={`curl -X POST ${BACKEND_URL}/api/blogs/blog-uuid/unpublish \\
  -H "Authorization: Bearer <token>"`} />
          </EndpointBlock>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CATEGORIES */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="categories" className="scroll-mt-20 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FolderTree className="h-5 w-5 text-violet-600" /> Categories
        </h2>
        <div className="glass rounded-2xl p-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Categories organize blogs into a hierarchical tree. Categories support nesting via <code className="text-violet-600">parentId</code>. Slugs are auto-generated from the name.
          </p>
        </div>
        <div className="space-y-3">

          <EndpointBlock method="POST" path="/categories" desc="Create a category" auth="JWT">
            <ParamTable params={[
              { name: "name", type: "string", required: true, desc: "Category name (max 100 chars)" },
              { name: "description", type: "string", required: false, desc: "Description (max 500 chars)" },
              { name: "parentId", type: "string", required: false, desc: "Parent category ID for nesting" },
            ]} />
            <CodeBlock code={`curl -X POST ${BACKEND_URL}/api/categories \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Web Development", "description": "Frontend and backend web dev"}'`} />
            <h4 className="text-sm font-semibold">Response <Badge className="bg-green-100 text-green-700 text-[10px]">201</Badge></h4>
            <JsonBlock data={{
              success: true,
              data: { id: "uuid", name: "Web Development", slug: "web-development", description: "Frontend and backend web dev", isActive: true, blogCount: 0, createdAt: "...", updatedAt: "..." }
            }} />
          </EndpointBlock>

          <EndpointBlock method="GET" path="/categories" desc="List all categories" auth="None">
            <CodeBlock code={`curl ${BACKEND_URL}/api/categories`} />
          </EndpointBlock>

          <EndpointBlock method="GET" path="/categories/tree" desc="Get category tree (nested)" auth="None">
            <p className="text-xs text-muted-foreground">Returns categories in a nested tree structure based on parentId relationships.</p>
            <CodeBlock code={`curl ${BACKEND_URL}/api/categories/tree`} />
          </EndpointBlock>

          <EndpointBlock method="GET" path="/categories/slug/:slug" desc="Get category by slug" auth="None">
            <CodeBlock code={`curl ${BACKEND_URL}/api/categories/slug/web-development`} />
          </EndpointBlock>

          <EndpointBlock method="GET" path="/categories/:categoryId" desc="Get category by ID" auth="None">
            <CodeBlock code={`curl ${BACKEND_URL}/api/categories/category-uuid`} />
          </EndpointBlock>

          <EndpointBlock method="PUT" path="/categories/:categoryId" desc="Update a category" auth="JWT">
            <ParamTable params={[
              { name: "name", type: "string", required: false, desc: "Updated name (max 100)" },
              { name: "description", type: "string", required: false, desc: "Updated description (max 500)" },
              { name: "parentId", type: "string", required: false, desc: "Updated parent category" },
              { name: "isActive", type: "boolean", required: false, desc: "Active status" },
            ]} />
          </EndpointBlock>

          <EndpointBlock method="DELETE" path="/categories/:categoryId" desc="Delete a category" auth="JWT">
            <CodeBlock code={`curl -X DELETE ${BACKEND_URL}/api/categories/category-uuid \\
  -H "Authorization: Bearer <token>"`} />
          </EndpointBlock>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* COMMENTS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="comments" className="scroll-mt-20 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-violet-600" /> Comments
        </h2>
        <div className="glass rounded-2xl p-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Comments are attached to blog posts. They support nested replies via <code className="text-violet-600">parentId</code>. Comments can be edited and deleted by their author. Max 2000 characters.
          </p>
        </div>
        <div className="space-y-3">

          <EndpointBlock method="POST" path="/comments" desc="Add a comment" auth="JWT">
            <ParamTable params={[
              { name: "blogId", type: "string", required: true, desc: "ID of the blog to comment on" },
              { name: "content", type: "string", required: true, desc: "Comment text (max 2000 chars)" },
              { name: "parentId", type: "string", required: false, desc: "Parent comment ID (for replies)" },
            ]} />
            <CodeBlock code={`curl -X POST ${BACKEND_URL}/api/comments \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"blogId": "blog-uuid", "content": "Great article! Very helpful."}'`} />
            <h4 className="text-sm font-semibold">Response <Badge className="bg-green-100 text-green-700 text-[10px]">201</Badge></h4>
            <JsonBlock data={{
              success: true,
              data: {
                id: "comment-uuid", blogId: "blog-uuid", authorId: "user-uuid",
                author: { id: "user-uuid", username: "sarahchen", firstName: "Sarah", lastName: "Chen" },
                content: "Great article! Very helpful.", isEdited: false, isDeleted: false, likeCount: 0,
                createdAt: "...", updatedAt: "..."
              }
            }} />
          </EndpointBlock>

          <EndpointBlock method="GET" path="/comments/blog/:blogId" desc="Get comments for a blog" auth="None">
            <p className="text-xs text-muted-foreground">Returns comments with nested replies included.</p>
            <CodeBlock code={`curl "${BACKEND_URL}/api/comments/blog/blog-uuid?page=1&limit=20"`} />
          </EndpointBlock>

          <EndpointBlock method="GET" path="/comments/author/:authorId" desc="Get comments by a user" auth="None">
            <CodeBlock code={`curl ${BACKEND_URL}/api/comments/author/user-uuid`} />
          </EndpointBlock>

          <EndpointBlock method="GET" path="/comments/:commentId" desc="Get a single comment" auth="None">
            <CodeBlock code={`curl ${BACKEND_URL}/api/comments/comment-uuid`} />
          </EndpointBlock>

          <EndpointBlock method="PUT" path="/comments/:commentId" desc="Edit your comment" auth="JWT">
            <ParamTable params={[
              { name: "content", type: "string", required: true, desc: "Updated comment text (max 2000 chars)" },
            ]} />
            <CodeBlock code={`curl -X PUT ${BACKEND_URL}/api/comments/comment-uuid \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"content": "Updated comment text."}'`} />
          </EndpointBlock>

          <EndpointBlock method="DELETE" path="/comments/:commentId" desc="Delete your comment" auth="JWT">
            <CodeBlock code={`curl -X DELETE ${BACKEND_URL}/api/comments/comment-uuid \\
  -H "Authorization: Bearer <token>"`} />
          </EndpointBlock>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* LIKES */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="likes" className="scroll-mt-20 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Heart className="h-5 w-5 text-violet-600" /> Likes
        </h2>
        <div className="glass rounded-2xl p-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Likes work as a toggle — calling the endpoint again removes the like. You can like both blogs and comments. The <code className="text-violet-600">targetType</code> field determines what you're liking.
          </p>
        </div>
        <div className="space-y-3">

          <EndpointBlock method="POST" path="/likes/toggle" desc="Like or unlike a target" auth="JWT">
            <ParamTable params={[
              { name: "targetId", type: "string", required: true, desc: "ID of the blog or comment" },
              { name: "targetType", type: "string", required: true, desc: '"blog" or "comment"' },
            ]} />
            <h4 className="text-sm font-semibold">Like a blog post</h4>
            <CodeBlock code={`curl -X POST ${BACKEND_URL}/api/likes/toggle \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"targetId": "blog-uuid", "targetType": "blog"}'`} />
            <h4 className="text-sm font-semibold">Like a comment</h4>
            <CodeBlock code={`curl -X POST ${BACKEND_URL}/api/likes/toggle \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"targetId": "comment-uuid", "targetType": "comment"}'`} />
          </EndpointBlock>

          <EndpointBlock method="GET" path="/likes/status/:targetType/:targetId" desc="Check like status & count" auth="Optional JWT">
            <p className="text-xs text-muted-foreground">If authenticated, <code className="text-violet-600">isLiked</code> reflects the current user's like status. Otherwise it's always <code>false</code>.</p>
            <CodeBlock code={`curl ${BACKEND_URL}/api/likes/status/blog/blog-uuid \\
  -H "Authorization: Bearer <token>"`} />
            <h4 className="text-sm font-semibold">Response</h4>
            <JsonBlock data={{ success: true, data: { isLiked: true, likeCount: 42 } }} />
          </EndpointBlock>

          <EndpointBlock method="GET" path="/likes/target/:targetType/:targetId" desc="Get users who liked a target" auth="None">
            <CodeBlock code={`curl ${BACKEND_URL}/api/likes/target/blog/blog-uuid`} />
          </EndpointBlock>

          <EndpointBlock method="GET" path="/likes/my-likes" desc="Get all your likes" auth="JWT">
            <CodeBlock code={`curl ${BACKEND_URL}/api/likes/my-likes \\
  -H "Authorization: Bearer <token>"`} />
          </EndpointBlock>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ERRORS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="errors" className="scroll-mt-20 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Zap className="h-5 w-5 text-violet-600" /> Error Codes
        </h2>
        <div className="glass rounded-2xl p-6 space-y-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            All errors return a consistent JSON shape. HTTP status codes follow REST conventions.
          </p>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black/[0.02] border-b">
                  <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Meaning</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Common Causes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { code: "200", meaning: "OK", cause: "Successful GET, PUT, DELETE" },
                  { code: "201", meaning: "Created", cause: "Successful POST (resource created)" },
                  { code: "400", meaning: "Bad Request", cause: "Validation errors, missing required fields" },
                  { code: "401", meaning: "Unauthorized", cause: "Missing/invalid/expired JWT or API key" },
                  { code: "403", meaning: "Forbidden", cause: "Insufficient permissions (e.g. editing another user's blog)" },
                  { code: "404", meaning: "Not Found", cause: "Resource doesn't exist" },
                  { code: "409", meaning: "Conflict", cause: "Duplicate email or username on registration" },
                  { code: "422", meaning: "Unprocessable", cause: "Valid JSON but semantic errors" },
                  { code: "500", meaning: "Server Error", cause: "Unexpected server-side error" },
                ].map((e, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-black/[0.01]">
                    <td className="px-4 py-2.5">
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        e.code.startsWith("2") ? "bg-green-100 text-green-700" :
                        e.code.startsWith("4") ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>{e.code}</span>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-xs">{e.meaning}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{e.cause}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-sm font-semibold">Validation Error Example</h4>
          <JsonBlock data={{
            success: false,
            message: "Validation failed",
            errors: [
              { field: "email", message: "Valid email is required" },
              { field: "password", message: "Password must be at least 6 characters" }
            ]
          }} />

          <h4 className="text-sm font-semibold">Auth Error Example</h4>
          <JsonBlock data={{ success: false, message: "Invalid or expired token" }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* QUICK START */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="scroll-mt-20 space-y-6 pb-16">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Globe className="h-5 w-5 text-violet-600" /> Quick Start
        </h2>
        <div className="glass rounded-2xl p-6 space-y-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Get up and running in 3 steps. Register, get your token, and start publishing.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="h-6 w-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
              <div className="space-y-2 flex-1">
                <p className="text-sm font-semibold">Register an account</p>
                <CodeBlock code={`curl -X POST ${BACKEND_URL}/api/users/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "you@example.com",
    "username": "yourname",
    "password": "yourpassword",
    "firstName": "Your",
    "lastName": "Name"
  }'`} />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="h-6 w-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              <div className="space-y-2 flex-1">
                <p className="text-sm font-semibold">Save the token from the response</p>
                <CodeBlock code={`export TOKEN="eyJhbGciOiJIUzI1NiIs..."`} />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="h-6 w-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
              <div className="space-y-2 flex-1">
                <p className="text-sm font-semibold">Publish your first blog</p>
                <CodeBlock code={`curl -X POST ${BACKEND_URL}/api/blogs \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "My First Post",
    "content": "Hello world! This is my first blog post on WorksAndBlogs.",
    "tags": ["hello", "first-post"],
    "status": "published"
  }'`} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-4 space-y-2">
            <h4 className="text-sm font-semibold">Using JavaScript (fetch)</h4>
            <CodeBlock code={`const response = await fetch('${BACKEND_URL}/api/blogs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({
    title: 'My First Post',
    content: 'Hello world!',
    tags: ['hello'],
    status: 'published'
  })
});

const data = await response.json();
console.log(data);
// → { success: true, data: { id: "...", title: "My First Post", ... } }`} />
          </div>

          <div className="rounded-xl border p-4 space-y-2">
            <h4 className="text-sm font-semibold">Using API Key (external app)</h4>
            <CodeBlock code={`// First, generate an API key from the dashboard or via API
// Then use it in your external app:

const response = await fetch('${BACKEND_URL}/api/blogs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'cc_a1b2c3d4e5f6...'
  },
  body: JSON.stringify({
    title: 'Published from my portfolio site',
    content: 'This was posted programmatically!',
    status: 'published'
  })
});`} />
          </div>
        </div>
      </section>

      </main>
    </div>
  );
};

export default Docs;
