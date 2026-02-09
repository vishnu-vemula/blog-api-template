import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { 
  ArrowRight, Code2, Database, Globe, Zap, Shield, Terminal, Sparkles,
  Smartphone, Monitor, Key, BarChart3, PenSquare, User, BookOpen,
  Star, Github, Twitter, Heart, ChevronRight, Play, Mail, MapPin
} from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col w-full">
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[100vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        
        {/* Animated background layers */}
        <div className="absolute inset-0 -z-10">
          {/* Primary gradient orbs */}
          <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-violet-200/60 rounded-full blur-[180px] animate-float" />
          <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] bg-indigo-200/50 rounded-full blur-[160px] animate-float-slow" />
          <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-fuchsia-200/40 rounded-full blur-[120px] animate-float-slower" />
          <div className="absolute bottom-[30%] left-[15%] w-[250px] h-[250px] bg-cyan-200/30 rounded-full blur-[100px] animate-float" />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
          
          {/* Radial fade */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_75%)]" />
        </div>

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center py-20">
          
          {/* Left: Copy */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              <span className="text-violet-700 font-medium">Now in public beta</span>
              <ChevronRight className="h-3 w-3 text-violet-500" />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[1.0]">
              <span className="block bg-clip-text text-transparent bg-gradient-to-b from-gray-900 via-gray-900 to-gray-600">
                Code it.
              </span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600">
                Write it.
              </span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-b from-gray-600 to-gray-400">
                Ship it.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              The API-first blogging platform for developers. Write in Markdown, manage via REST API, and own your content — forever.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center">
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 text-base rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 text-white shadow-2xl shadow-violet-500/30 border-0 gap-2.5 font-semibold">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/docs">
                <Button variant="ghost" size="lg" className="h-14 px-8 text-base rounded-2xl border border-black/[0.08] hover:bg-black/[0.03] text-foreground gap-2.5 font-medium">
                  <Play className="h-4 w-4 fill-current" />
                  View Docs
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-5 lg:justify-start justify-center pt-2">
              <div className="flex -space-x-2.5">
                {[
                  "bg-gradient-to-br from-violet-500 to-purple-600",
                  "bg-gradient-to-br from-indigo-500 to-blue-600",
                  "bg-gradient-to-br from-fuchsia-500 to-pink-600",
                  "bg-gradient-to-br from-cyan-500 to-teal-600",
                ].map((bg, i) => (
                  <div key={i} className={`h-9 w-9 rounded-full ${bg} border-2 border-background flex items-center justify-center text-[10px] font-bold text-white`}>
                    {["AK", "SC", "JP", "ML"][i]}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Loved by <span className="text-foreground font-semibold">2,000+</span> developers</p>
              </div>
            </div>
          </div>

          {/* Right: Floating code card */}
          <div className="relative lg:pl-8 hidden lg:block">
            {/* Main code card */}
            <div className="glass-strong rounded-2xl p-1 glow-lg relative z-10">
              <div className="rounded-xl bg-background/90 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-black/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <span className="text-[11px] text-muted-foreground font-mono">fetch-posts.js</span>
                  </div>
                </div>
                <div className="p-5 font-mono text-[13px] leading-relaxed bg-slate-900 text-slate-300">
                  <div><span className="text-violet-400">const</span> <span className="text-cyan-300">response</span> <span className="text-slate-400">=</span> <span className="text-violet-400">await</span> <span className="text-yellow-300">fetch</span><span className="text-slate-500">(</span></div>
                  <div className="pl-4"><span className="text-green-400">'https://api.worksandblogs.app/posts'</span><span className="text-slate-500">,</span></div>
                  <div className="pl-4"><span className="text-slate-500">{"{"}</span> <span className="text-cyan-300">headers</span><span className="text-slate-500">:</span> <span className="text-slate-500">{"{"}</span></div>
                  <div className="pl-8"><span className="text-green-400">'Authorization'</span><span className="text-slate-500">:</span> <span className="text-green-400">{"`"}Bearer {"${"}</span><span className="text-orange-300">API_KEY</span><span className="text-green-400">{"}"}{"`"}</span></div>
                  <div className="pl-4"><span className="text-slate-500">{"}"} {"}"}</span></div>
                  <div><span className="text-slate-500">);</span></div>
                  <div className="mt-3"><span className="text-violet-400">const</span> <span className="text-cyan-300">posts</span> <span className="text-slate-400">=</span> <span className="text-violet-400">await</span> <span className="text-cyan-300">response</span><span className="text-slate-500">.</span><span className="text-yellow-300">json</span><span className="text-slate-500">();</span></div>
                  <div className="mt-1 text-slate-600">// → {"{}"} success: true, data: [...] {"{}"}</div>
                </div>
              </div>
            </div>

            {/* Floating stat card - top right */}
            <div className="absolute -top-4 -right-4 glass-strong rounded-xl p-3.5 z-20 animate-float-slow">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-green-100 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Views</p>
                  <p className="text-lg font-bold">12.4K</p>
                </div>
              </div>
            </div>

            {/* Floating API key card - bottom left */}
            <div className="absolute -bottom-6 -left-2 glass-strong rounded-xl p-3.5 z-20 animate-float">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Key className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">API Key Created</p>
                  <p className="text-sm font-semibold font-mono text-green-600">cc_live_••••k8f2</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom trust bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-black/[0.04] bg-white/60 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-6 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {[
              { icon: Shield, text: "SOC 2 Compliant" },
              { icon: Zap, text: "99.9% Uptime" },
              { icon: Globe, text: "Edge Network" },
              { icon: Database, text: "Open Source" },
              { icon: Terminal, text: "REST API" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground/50 text-xs">
                <item.icon className="h-3.5 w-3.5" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DASHBOARD PREVIEW */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-100/80 rounded-full blur-[200px] -z-10" />
        
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14 space-y-4">
            <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest">Dashboard</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500">Everything at a glance</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A powerful dashboard to manage your content, API keys, and analytics.
            </p>
          </div>

          {/* Dashboard Mockup */}
          <div className="glass-strong rounded-2xl p-1.5 glow-lg mx-auto max-w-5xl">
            <div className="rounded-xl bg-background/80 overflow-hidden">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-black/[0.06]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="glass rounded-lg px-4 py-1 text-[11px] text-muted-foreground w-64 text-center">
                    worksandblogs.app/dashboard
                  </div>
                </div>
              </div>
              
              {/* Dashboard content mockup */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Stat cards */}
                {[
                  { icon: BookOpen, label: "Published", value: "24", sub: "articles", color: "text-violet-600" },
                  { icon: BarChart3, label: "Total Views", value: "12.4K", sub: "this month", color: "text-indigo-600" },
                  { icon: Key, label: "API Keys", value: "3", sub: "active", color: "text-purple-600" },
                ].map((stat, i) => (
                  <div key={i} className="glass rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground">{stat.sub}</p>
                  </div>
                ))}
                
                {/* Recent posts mockup */}
                <div className="md:col-span-2 glass rounded-xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">Recent Posts</p>
                  <div className="space-y-2.5">
                    {[
                      { title: "Building REST APIs with Express.js", date: "Jan 15", views: "2.1K" },
                      { title: "React Server Components Deep Dive", date: "Jan 12", views: "1.8K" },
                      { title: "TypeScript Generics Explained", date: "Jan 8", views: "3.2K" },
                    ].map((post, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-black/[0.04] last:border-0">
                        <div>
                          <p className="text-sm font-medium">{post.title}</p>
                          <p className="text-[11px] text-muted-foreground">{post.date}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{post.views} views</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions mockup */}
                <div className="glass rounded-xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">Quick Actions</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-black/[0.03] cursor-pointer">
                      <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center">
                        <PenSquare className="h-3.5 w-3.5 text-violet-600" />
                      </div>
                      <span className="text-sm">New Article</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-black/[0.03] cursor-pointer">
                      <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Key className="h-3.5 w-3.5 text-indigo-600" />
                      </div>
                      <span className="text-sm">Generate API Key</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-black/[0.03] cursor-pointer">
                      <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-purple-600" />
                      </div>
                      <span className="text-sm">Edit Profile</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PROFILE PAGES SHOWCASE */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-28 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-100/60 rounded-full blur-[150px] -z-10" />
        
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div className="space-y-6">
              <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest">Profile Pages</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500">
                  Your own subdomain.
                </span>
                <br />
                <span className="text-muted-foreground text-2xl md:text-3xl font-bold">
                  username.worksandblogs.app
                </span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every developer gets a personal blog page on their own subdomain. Share your profile link anywhere — it's your developer portfolio, powered by your API.
              </p>
              <ul className="space-y-3">
                {[
                  "Custom subdomain for every user",
                  "Auto-generated from your published articles",
                  "Beautiful, responsive design out of the box",
                  "SEO-optimized with Open Graph tags",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="h-5 w-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                      <div className="h-1.5 w-1.5 rounded-full bg-violet-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register">
                <Button className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 border-0 gap-2 mt-2">
                  Claim Your Page <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Right: Profile mockup */}
            <div className="glass-strong rounded-2xl p-1.5 glow-md">
              <div className="rounded-xl bg-background/80 overflow-hidden">
                {/* Mini browser bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-black/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="glass rounded-md px-3 py-0.5 text-[10px] text-muted-foreground">
                      sarah.worksandblogs.app
                    </div>
                  </div>
                </div>
                
                {/* Profile content */}
                <div className="p-5">
                  <div className="h-20 rounded-xl bg-gradient-to-r from-violet-100 via-indigo-100 to-purple-100 mb-4" />
                  <div className="flex items-center gap-3 -mt-10 mb-4 px-2">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 border-4 border-background flex items-center justify-center text-white font-bold text-lg">S</div>
                    <div className="pt-6">
                      <p className="font-bold text-sm">Sarah Chen</p>
                      <p className="text-[11px] text-muted-foreground">@sarahchen</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 px-2">Full-stack developer. Writing about React, Node.js, and the modern web.</p>
                  
                  {/* Mock articles */}
                  <div className="space-y-2.5">
                    {["React Server Components in 2024", "Building Type-Safe APIs", "My Developer Setup"].map((title, i) => (
                      <div key={i} className="glass rounded-lg p-3 hover:bg-black/[0.02] transition-colors">
                        <p className="text-xs font-medium">{title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Jan {15 - i * 3} · 5 min read</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FEATURES GRID */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-100/60 rounded-full blur-[150px] -z-10" />
        
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14 space-y-4">
            <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest">Features</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500">Built for developers</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to write, publish, and grow your developer brand.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Globe, title: "API-First Design", desc: "Generate API keys and fetch your content programmatically from anywhere." },
              { icon: Code2, title: "Markdown & Code", desc: "Write in Markdown with syntax highlighting for 100+ languages." },
              { icon: Database, title: "Own Your Data", desc: "No lock-in. Export everything. Open source backend you control." },
              { icon: Shield, title: "Secure by Default", desc: "Token-based auth, rate limiting, and encrypted API keys." },
              { icon: Zap, title: "Lightning Fast", desc: "Optimized queries, edge caching, and sub-100ms responses." },
              { icon: Terminal, title: "Developer DX", desc: "RESTful API, comprehensive docs, and SDKs for popular frameworks." },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group glass rounded-2xl p-6 hover:bg-black/[0.02] transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5"
              >
                <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center mb-4 group-hover:bg-violet-200 transition-colors">
                  <feature.icon className="h-5 w-5 text-violet-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MOBILE APP SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-100/60 rounded-full blur-[150px] -z-10" />
        
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Phone mockups */}
            <div className="flex items-center justify-center gap-4 lg:order-1 order-2">
              {/* Phone 1 - Feed */}
              <div className="glass-strong rounded-[2rem] p-2 w-48 -rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="rounded-[1.5rem] bg-background/90 overflow-hidden">
                  <div className="h-6 bg-background flex items-center justify-center">
                    <div className="w-16 h-1 rounded-full bg-black/10" />
                  </div>
                  <div className="p-3 space-y-2.5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-5 w-5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                        <Zap className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-[9px] font-bold">Feed</span>
                    </div>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="glass rounded-lg p-2 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <div className="h-4 w-4 rounded-full bg-violet-100" />
                          <div className="h-1.5 w-12 rounded bg-black/10" />
                        </div>
                        <div className="h-1.5 w-full rounded bg-black/[0.06]" />
                        <div className="h-1.5 w-3/4 rounded bg-black/[0.04]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phone 2 - Profile */}
              <div className="glass-strong rounded-[2rem] p-2 w-48 rotate-3 hover:rotate-0 transition-transform duration-500 mt-8">
                <div className="rounded-[1.5rem] bg-background/90 overflow-hidden">
                  <div className="h-6 bg-background flex items-center justify-center">
                    <div className="w-16 h-1 rounded-full bg-black/10" />
                  </div>
                  <div className="p-3">
                    <div className="h-12 rounded-lg bg-gradient-to-r from-violet-100 to-indigo-100 mb-3" />
                    <div className="flex items-center gap-2 -mt-5 mb-3 px-1">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 border-2 border-background" />
                      <div className="pt-3 space-y-0.5">
                        <div className="h-1.5 w-14 rounded bg-black/15" />
                        <div className="h-1 w-10 rounded bg-black/[0.06]" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {[1, 2].map(i => (
                        <div key={i} className="glass rounded-lg p-2 space-y-1">
                          <div className="h-1.5 w-full rounded bg-black/[0.06]" />
                          <div className="h-1.5 w-2/3 rounded bg-black/[0.04]" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Text */}
            <div className="space-y-6 lg:order-2 order-1">
              <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest">Mobile App</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500">
                  Write anywhere.
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-500 to-gray-300">
                  Publish everywhere.
                </span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Take WorksAndBlogs with you. Read your feed, manage your blog, and publish articles on the go with our native mobile apps.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button className="glass-strong rounded-xl px-5 py-3 flex items-center gap-3 hover:bg-black/[0.03] transition-colors group">
                  <svg className="h-7 w-7 text-gray-900" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground leading-none">Download on the</p>
                    <p className="text-sm font-semibold">App Store</p>
                  </div>
                </button>
                <button className="glass-strong rounded-xl px-5 py-3 flex items-center gap-3 hover:bg-black/[0.03] transition-colors group">
                  <svg className="h-6 w-6 text-gray-900" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/></svg>
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground leading-none">Get it on</p>
                    <p className="text-sm font-semibold">Google Play</p>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">4.9 rating · 2K+ reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CTA SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-100/80 rounded-full blur-[250px]" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-fuchsia-100/60 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-indigo-100/60 rounded-full blur-[120px]" />
        </div>
        
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="glass-strong rounded-3xl p-10 md:p-16 relative overflow-hidden">
            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[2px] bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
            
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm">
                <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                <span className="text-violet-700 font-medium">Free forever for developers</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-extrabold tracking-[-0.03em]">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-900 via-gray-900 to-gray-500">
                  Start building
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600">
                  something great.
                </span>
              </h2>

              <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Join thousands of developers who write, ship, and grow with WorksAndBlogs. Your subdomain, your API, your rules.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link to="/register">
                  <Button size="lg" className="h-14 px-10 text-base rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 text-white shadow-2xl shadow-violet-500/30 border-0 gap-2.5 font-semibold">
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/docs">
                  <Button variant="ghost" size="lg" className="h-14 px-8 text-base rounded-2xl border border-black/[0.08] hover:bg-black/[0.03] text-foreground font-medium">
                    Read the Docs
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-black/[0.06] mt-8">
                {[
                  { value: "10K+", label: "Developers" },
                  { value: "50K+", label: "Articles Published" },
                  { value: "99.9%", label: "Uptime SLA" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <footer className="w-full border-t border-black/[0.06] relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
        
        <div className="mx-auto max-w-6xl px-6">
          {/* Main footer grid */}
          <div className="py-16 grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12">
            
            {/* Brand column */}
            <div className="col-span-2 md:col-span-4 space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Zap className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">WorksAndBlogs</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                The API-first blogging platform built for developers who want to own their content and grow their brand.
              </p>
              <div className="flex items-center gap-2">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/[0.04] transition-all">
                  <Github className="h-4 w-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/[0.04] transition-all">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="mailto:hello@worksandblogs.app" className="h-9 w-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/[0.04] transition-all">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/blogs" className="hover:text-foreground transition-colors">Blog Feed</Link></li>
                <li><Link to="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link to="/api-keys" className="hover:text-foreground transition-colors">API Keys</Link></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Changelog</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Pricing</span></li>
              </ul>
            </div>

            {/* Developers */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-sm font-semibold mb-4">Developers</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/docs" className="hover:text-foreground transition-colors">API Reference</Link></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">SDKs</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Status Page</span></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><span className="hover:text-foreground transition-colors cursor-pointer">About</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Blog</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Careers</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Contact</span></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Cookie Policy</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">GDPR</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-black/[0.06] py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>&copy; {new Date().getFullYear()} WorksAndBlogs. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Crafted with</span>
              <Heart className="h-3 w-3 text-red-400 fill-red-400" />
              <span>for developers, by developers.</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
