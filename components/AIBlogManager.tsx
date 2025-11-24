import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SpinnerIcon } from './icons/Icons';
import type { BlogPost } from '../blogData';

interface AIBlogManagerProps {
  onClose: () => void;
  onSaveBlog: (blog: BlogPost) => void;
  existingBlogs: BlogPost[];
}

export const AIBlogManager: React.FC<AIBlogManagerProps> = ({ onClose, onSaveBlog, existingBlogs }) => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [category, setCategory] = useState('Credit Education');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<Partial<BlogPost> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = ['Credit Education', 'Legal Rights', 'How-To Guides', 'Success Stories', 'Industry News'];

  const generateBlog = async () => {
    if (!topic.trim()) {
      setError('Please enter a blog topic');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY! });
      
      const prompt = `You are an expert content writer specializing in credit repair, consumer rights, and financial education. 

Generate a comprehensive, SEO-optimized blog post about: "${topic}"

${keywords ? `Focus on these keywords: ${keywords}` : ''}

Category: ${category}

Requirements:
1. Create an engaging title (60-70 characters)
2. Write a compelling excerpt (150-160 characters)
3. Generate full blog content in markdown format with:
   - Clear headings (# ## ###)
   - Bullet points and numbered lists
   - Practical examples
   - Actionable advice
   - Professional tone
   - 1000-1500 words
4. Include meta description (150-160 characters)
5. Suggest 5-7 relevant keywords
6. Estimate read time in minutes

Format your response as JSON:
{
  "title": "Blog title here",
  "excerpt": "Brief excerpt here",
  "content": "Full markdown content here",
  "metaDescription": "SEO meta description",
  "keywords": ["keyword1", "keyword2"],
  "readTime": 7,
  "author": "AI Content Writer"
}`;

      const response = await ai.models.generateContent({ 
        model: 'gemini-2.5-pro', 
        contents: prompt 
      });

      const cleanedText = response.text.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
      const blogData = JSON.parse(cleanedText);

      const newBlog: Partial<BlogPost> = {
        ...blogData,
        id: Math.max(...existingBlogs.map(b => b.id), 0) + 1,
        category,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=800&h=600&fit=crop`,
        slug: blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        featured: false
      };

      setGeneratedBlog(newBlog);
    } catch (e: any) {
      setError(`Failed to generate blog: ${e.message}`);
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (generatedBlog) {
      onSaveBlog(generatedBlog as BlogPost);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-cyan-400">🤖 AI Blog Generator</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          {!generatedBlog ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Blog Topic *</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., How to Remove Collections from Credit Report"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Keywords (optional)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., credit repair, collections, FCRA"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={generateBlog}
                disabled={isGenerating}
                className="w-full px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-all disabled:opacity-50 disabled:cursor-wait flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <SpinnerIcon className="w-5 h-5 mr-2 animate-spin" />
                    Generating Blog Post...
                  </>
                ) : (
                  '✨ Generate Blog Post with AI'
                )}
              </button>
            </>
          ) : (
            <>
              <div className="bg-green-900/30 border border-green-700 text-green-300 p-4 rounded-lg">
                ✅ Blog post generated successfully!
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={generatedBlog.title}
                    onChange={(e) => setGeneratedBlog({...generatedBlog, title: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
                  <textarea
                    value={generatedBlog.excerpt}
                    onChange={(e) => setGeneratedBlog({...generatedBlog, excerpt: e.target.value})}
                    rows={2}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content Preview</label>
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto text-gray-300 text-sm whitespace-pre-wrap">
                    {generatedBlog.content?.substring(0, 500)}...
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
                    <input
                      type="text"
                      value={generatedBlog.author}
                      onChange={(e) => setGeneratedBlog({...generatedBlog, author: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Read Time (min)</label>
                    <input
                      type="number"
                      value={generatedBlog.readTime}
                      onChange={(e) => setGeneratedBlog({...generatedBlog, readTime: parseInt(e.target.value)})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Keywords</label>
                  <div className="flex flex-wrap gap-2">
                    {generatedBlog.keywords?.map((kw, i) => (
                      <span key={i} className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setGeneratedBlog(null)}
                  className="flex-1 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
                >
                  ← Generate New
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-all"
                >
                  💾 Save & Publish
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
