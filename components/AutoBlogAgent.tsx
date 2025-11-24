import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { blogPosts, BlogPost } from '../blogData';

interface AutoBlogAgentProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

export const AutoBlogAgent: React.FC<AutoBlogAgentProps> = ({ isActive, onToggle }) => {
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'generating' | 'publishing'>('idle');
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [nextRun, setNextRun] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [intervalHours, setIntervalHours] = useState(2);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 20));
  };

  const analyzeExistingBlogs = async (): Promise<string> => {
    const savedBlogs = localStorage.getItem('ai_generated_blogs');
    const aiBlogs = savedBlogs ? JSON.parse(savedBlogs) : [];
    const allBlogs = [...blogPosts, ...aiBlogs];

    const blogSummary = allBlogs.map(b => ({
      title: b.title,
      category: b.category,
      keywords: b.keywords,
      date: b.date
    }));

    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY! });
    
    const prompt = `You are an AI blog content strategist for a credit repair website.

Analyze these existing blog posts:
${JSON.stringify(blogSummary, null, 2)}

Based on this analysis:
1. Identify content gaps (topics not covered)
2. Find trending credit repair topics
3. Suggest the BEST topic for the next blog post
4. Consider SEO value and user engagement

Respond with JSON:
{
  "suggestedTopic": "Specific blog topic here",
  "reasoning": "Why this topic is valuable",
  "targetKeywords": ["keyword1", "keyword2", "keyword3"],
  "category": "Credit Education or Legal Rights or How-To Guides",
  "estimatedValue": "high/medium/low"
}`;

    const response = await ai.models.generateContent({ 
      model: 'gemini-2.5-flash', 
      contents: prompt 
    });

    let cleanedText = response.text.trim();
    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    return cleanedText;
  };

  const generateBlogPost = async (strategy: any): Promise<BlogPost> => {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY! });
    
    const prompt = `You are an expert credit repair content writer.

Create a comprehensive blog post about: "${strategy.suggestedTopic}"

Target Keywords: ${strategy.targetKeywords.join(', ')}
Category: ${strategy.category}

Requirements:
- Title: Engaging, SEO-optimized (60-70 chars)
- Excerpt: Compelling summary (150-160 chars)
- Content: 1200-1800 words in markdown format
  * Use clear headings (# ## ###)
  * Include actionable advice
  * Add real examples
  * Professional but accessible tone
  * Include legal references (FCRA, FDCPA) where relevant
- Meta description: SEO-optimized (150-160 chars)
- Keywords: 5-7 relevant terms
- Read time: Estimate in minutes

Generate the blog post content.`;

    const response = await ai.models.generateContent({ 
      model: 'gemini-2.5-flash', 
      contents: prompt 
    });

    const content = response.text.trim();
    
    // Create blog data manually to avoid JSON parsing issues
    const blogData = {
      title: strategy.suggestedTopic,
      excerpt: content.substring(0, 160).trim() + '...',
      content: content,
      metaDescription: content.substring(0, 155).trim() + '...',
      keywords: strategy.targetKeywords,
      readTime: Math.ceil(content.split(' ').length / 200),
      author: 'AI Content Agent'
    };

    const savedBlogs = localStorage.getItem('ai_generated_blogs');
    const existingBlogs = savedBlogs ? JSON.parse(savedBlogs) : [];
    
    const newBlog: BlogPost = {
      ...blogData,
      id: Math.max(...existingBlogs.map((b: BlogPost) => b.id), ...blogPosts.map(b => b.id), 0) + 1,
      category: strategy.category,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      image: `https://images.unsplash.com/photo-${Date.now() % 1000000000}?w=800&h=600&fit=crop`,
      slug: blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      featured: false
    };

    return newBlog;
  };

  const publishBlog = (blog: BlogPost) => {
    const savedBlogs = localStorage.getItem('ai_generated_blogs');
    const existingBlogs = savedBlogs ? JSON.parse(savedBlogs) : [];
    const updatedBlogs = [...existingBlogs, blog];
    localStorage.setItem('ai_generated_blogs', JSON.stringify(updatedBlogs));
  };

  const runBlogAgent = async () => {
    try {
      setStatus('analyzing');
      addLog('🔍 Analyzing existing blog content...');
      
      const strategyJson = await analyzeExistingBlogs();
      const strategy = JSON.parse(strategyJson);
      
      addLog(`💡 Strategy: ${strategy.suggestedTopic} (${strategy.estimatedValue} value)`);
      
      setStatus('generating');
      addLog('✍️ Generating new blog post...');
      
      const newBlog = await generateBlogPost(strategy);
      
      setStatus('publishing');
      addLog(`📝 Publishing: "${newBlog.title}"`);
      
      publishBlog(newBlog);
      
      addLog(`✅ Successfully published blog #${newBlog.id}`);
      setLastRun(new Date().toLocaleString());
      setStatus('idle');
      
    } catch (error: any) {
      const errorMsg = error.message.length > 100 ? error.message.substring(0, 100) + '...' : error.message;
      addLog(`❌ Error: ${errorMsg}`);
      setStatus('idle');
    }
  };

  useEffect(() => {
    if (!isActive) {
      setNextRun(null);
      return;
    }

    const calculateNextRun = () => {
      const next = new Date();
      next.setHours(next.getHours() + intervalHours);
      setNextRun(next.toLocaleString());
    };

    // Check if API key is available
    if (!import.meta.env.VITE_GOOGLE_AI_API_KEY) {
      addLog('❌ Error: Google AI API key not configured');
      onToggle(false);
      return;
    }

    calculateNextRun();
    addLog('🚀 Agent started - running first analysis...');
    runBlogAgent();

    const interval = setInterval(() => {
      addLog('⏰ Scheduled run triggered');
      runBlogAgent();
      calculateNextRun();
    }, intervalHours * 60 * 60 * 1000);

    return () => {
      clearInterval(interval);
      addLog('⏸️ Agent paused');
    };
  }, [isActive, intervalHours]);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400 mb-2">🤖 Autonomous Blog Agent</h2>
          <p className="text-gray-400 text-sm">AI automatically analyzes, creates, and publishes blog posts</p>
        </div>
        <button
          onClick={() => onToggle(!isActive)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            isActive 
              ? 'bg-red-600 hover:bg-red-500 text-white' 
              : 'bg-green-600 hover:bg-green-500 text-white'
          }`}
        >
          {isActive ? '⏸️ Pause Agent' : '▶️ Start Agent'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Status</p>
          <p className="text-xl font-bold text-white capitalize flex items-center">
            {status === 'idle' && '💤 Idle'}
            {status === 'analyzing' && '🔍 Analyzing'}
            {status === 'generating' && '✍️ Writing'}
            {status === 'publishing' && '📤 Publishing'}
          </p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Last Run</p>
          <p className="text-sm font-mono text-white">{lastRun || 'Never'}</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Next Run</p>
          <p className="text-sm font-mono text-cyan-400">{nextRun || 'Not scheduled'}</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Run Interval (hours)
        </label>
        <input
          type="number"
          min="1"
          max="24"
          value={intervalHours}
          onChange={(e) => setIntervalHours(parseInt(e.target.value))}
          disabled={isActive}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
        />
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-300">Activity Log</h3>
          <button
            onClick={() => setLogs([])}
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            Clear
          </button>
        </div>
        <div className="space-y-1 max-h-64 overflow-y-auto font-mono text-xs">
          {logs.length === 0 ? (
            <p className="text-gray-500">No activity yet...</p>
          ) : (
            logs.map((log, i) => (
              <p key={i} className="text-gray-400">{log}</p>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={runBlogAgent}
          disabled={status !== 'idle'}
          className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🚀 Run Now
        </button>
        <button
          onClick={() => {
            const savedBlogs = localStorage.getItem('ai_generated_blogs');
            if (savedBlogs) {
              const blogs = JSON.parse(savedBlogs);
              addLog(`📊 Total AI blogs: ${blogs.length}`);
            }
          }}
          className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
        >
          📊 Check Stats
        </button>
      </div>
    </div>
  );
};
