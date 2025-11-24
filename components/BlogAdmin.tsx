import React, { useState, useEffect } from 'react';
import { AIBlogManager } from './AIBlogManager';
import { AutoBlogAgent } from './AutoBlogAgent';
import { AdminAuth } from './AdminAuth';
import type { BlogPost } from '../blogData';

interface BlogAdminProps {
  onBackClick: () => void;
}

export const BlogAdmin: React.FC<BlogAdminProps> = ({ onBackClick }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [showAIManager, setShowAIManager] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [agentActive, setAgentActive] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const authToken = sessionStorage.getItem('blog_admin_auth');
    if (authToken === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load agent state from localStorage
  useEffect(() => {
    const savedAgentState = localStorage.getItem('blog_agent_active');
    if (savedAgentState === 'true') {
      setAgentActive(true);
    }
  }, []);

  const handleAgentToggle = (active: boolean) => {
    setAgentActive(active);
    localStorage.setItem('blog_agent_active', active.toString());
  };

  useEffect(() => {
    // Load blogs from localStorage
    const loadBlogs = () => {
      const savedBlogs = localStorage.getItem('ai_generated_blogs');
      if (savedBlogs) {
        setBlogs(JSON.parse(savedBlogs));
      }
    };
    
    loadBlogs();
    
    // Reload blogs every 10 seconds to catch new AI-generated posts
    const interval = setInterval(loadBlogs, 10000);
    return () => clearInterval(interval);
  }, []);

  const saveBlog = (blog: BlogPost) => {
    const updatedBlogs = [...blogs, blog];
    setBlogs(updatedBlogs);
    localStorage.setItem('ai_generated_blogs', JSON.stringify(updatedBlogs));
  };

  const deleteBlog = (id: number) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const updatedBlogs = blogs.filter(b => b.id !== id);
      setBlogs(updatedBlogs);
      localStorage.setItem('ai_generated_blogs', JSON.stringify(updatedBlogs));
    }
  };

  const toggleFeatured = (id: number) => {
    const updatedBlogs = blogs.map(b => 
      b.id === id ? { ...b, featured: !b.featured } : b
    );
    setBlogs(updatedBlogs);
    localStorage.setItem('ai_generated_blogs', JSON.stringify(updatedBlogs));
  };

  const exportBlogs = () => {
    const dataStr = JSON.stringify(blogs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blog-posts.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('blog_admin_auth');
    setIsAuthenticated(false);
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Autonomous Agent */}
        <div className="mb-8">
          <AutoBlogAgent isActive={agentActive} onToggle={handleAgentToggle} />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={onBackClick}
              className="text-cyan-400 hover:text-cyan-300 mb-4 flex items-center"
            >
              ← Back to Site
            </button>
            <h1 className="text-4xl font-bold text-cyan-400">🤖 AI Blog Manager</h1>
            <p className="text-gray-400 mt-2">Manage and generate blog posts with AI</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all"
            >
              🚪 Logout
            </button>
            <button
              onClick={exportBlogs}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
            >
              📥 Export
            </button>
            <button
              onClick={() => setShowAIManager(true)}
              className="px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-all shadow-lg"
            >
              ✨ Generate New Blog
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Posts</p>
            <p className="text-3xl font-bold text-white">{blogs.length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Featured</p>
            <p className="text-3xl font-bold text-cyan-400">{blogs.filter(b => b.featured).length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Categories</p>
            <p className="text-3xl font-bold text-green-400">{new Set(blogs.map(b => b.category)).size}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Avg Read Time</p>
            <p className="text-3xl font-bold text-yellow-400">
              {blogs.length > 0 ? Math.round(blogs.reduce((acc, b) => acc + b.readTime, 0) / blogs.length) : 0} min
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search blogs by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>

        {/* Blog List */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 border border-gray-700 rounded-lg">
            <p className="text-gray-400 text-lg mb-4">No blog posts yet</p>
            <button
              onClick={() => setShowAIManager(true)}
              className="px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-all"
            >
              ✨ Generate Your First Blog
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-cyan-500 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{blog.title}</h3>
                      {blog.featured && (
                        <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-semibold">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{blog.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-cyan-600 text-white text-xs px-2 py-1 rounded-full">
                        {blog.category}
                      </span>
                      <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                        📅 {blog.date}
                      </span>
                      <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                        ⏱️ {blog.readTime} min
                      </span>
                      <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                        ✍️ {blog.author}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {blog.keywords.slice(0, 5).map((kw, i) => (
                        <span key={i} className="text-gray-500 text-xs">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => toggleFeatured(blog.id)}
                      className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-500 transition-all"
                      title={blog.featured ? 'Unfeature' : 'Feature'}
                    >
                      ⭐
                    </button>
                    <button
                      onClick={() => deleteBlog(blog.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-500 transition-all"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Blog Manager Modal */}
      {showAIManager && (
        <AIBlogManager
          onClose={() => setShowAIManager(false)}
          onSaveBlog={saveBlog}
          existingBlogs={blogs}
        />
      )}
    </div>
  );
};
