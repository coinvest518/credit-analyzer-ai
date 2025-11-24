import React, { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BlogPost as BlogPostType } from '../blogData';

interface BlogPostProps {
  post: BlogPostType;
  onBackClick: () => void;
}

export const BlogPost: React.FC<BlogPostProps> = ({ post, onBackClick }) => {
  useEffect(() => {
    document.title = `${post.title} | AI Credit Report Analyzer`;
  }, [post.title]);

  return (
    <>
      <div className="min-h-screen bg-white">
        <Header onHomeClick={onBackClick} showHomeButton={true} />
        
        <main className="max-w-3xl mx-auto px-6 py-16">
          <button 
            onClick={onBackClick}
            className="mb-12 text-gray-600 hover:text-gray-900 font-normal flex items-center text-sm transition-colors"
          >
            ← Back to Blog
          </button>

          <article>
            <header className="mb-12">
              <span className="inline-block px-4 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium mb-6">
                {post.category}
              </span>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center text-gray-600 text-base">
                <span className="font-medium text-gray-900">{post.author}</span>
                <span className="mx-3 text-gray-400">·</span>
                <span>{post.date}</span>
                <span className="mx-3 text-gray-400">·</span>
                <span>8 min read</span>
              </div>
            </header>

            <div className="mb-12">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-auto rounded-lg"
              />
            </div>

            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(post.content) }}
            />
          </article>

          <div className="mt-16 pt-8 border-t border-gray-200 text-center">
            <button 
              onClick={onBackClick}
              className="inline-flex items-center px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              ← Back to All Posts
            </button>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

function formatMarkdown(markdown: string): string {
  let html = markdown.trim();
  
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-gray-900 mt-12 mb-4">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-gray-900 mt-16 mb-6">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-gray-900 mt-16 mb-6">$1</h1>');
  
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  
  html = html.replace(/^\- (.*$)/gim, '<li class="mb-3 text-gray-800 leading-relaxed">$1</li>');
  html = html.replace(/(<li.*<\/li>)/s, '<ul class="my-8 space-y-2">$1</ul>');
  
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-6 rounded-lg my-8 overflow-x-auto"><code>$1</code></pre>');
  
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm font-mono">$1</code>');
  
  html = html.split('\n\n').map(para => {
    para = para.trim();
    if (!para.match(/^<[h|u|p|l|d]/)) {
      return `<p class="text-xl text-gray-800 leading-relaxed mb-8">${para}</p>`;
    }
    return para;
  }).join('\n');
  
  return html;
}
