import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from './Header';
import { Footer } from './Footer';
import { BlogPost as BlogPostType } from '../blogData';

interface BlogPostProps {
  post: BlogPostType;
  onBackClick: () => void;
}

export const BlogPost: React.FC<BlogPostProps> = ({ post, onBackClick }) => {
  const canonicalUrl = `https://disputeai.xyz/blog/${post.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription,
    "image": post.image,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Credit Report Analyzer",
      "logo": {
        "@type": "ImageObject",
        "url": "https://disputeai.xyz/logo.png"
      }
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "keywords": post.keywords.join(", ")
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | AI Credit Report Analyzer</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.keywords.join(", ")} />
        <meta name="author" content={post.author} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:image" content={post.image} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="AI Credit Report Analyzer" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        <meta name="twitter:image" content={post.image} />
        
        {/* Article specific */}
        <meta property="article:published_time" content={new Date(post.date).toISOString()} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        <meta property="article:tag" content={post.keywords.join(", ")} />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gray-900 text-gray-200">
        <Header onBlogClick={onBackClick} />
        
        <main className="max-w-3xl mx-auto px-6 py-16">
          <button 
            onClick={onBackClick}
            className="mb-12 text-gray-400 hover:text-gray-100 font-normal flex items-center text-sm transition-colors"
          >
            ← Back to Blog
          </button>

          <article>
            <header className="mb-12">
              <span className="inline-block px-4 py-1.5 bg-cyan-900/50 text-cyan-300 rounded-full text-sm font-medium mb-6 border border-cyan-700/50">
                {post.category}
              </span>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center text-gray-400 text-base">
                <span className="font-medium text-gray-100">{post.author}</span>
                <span className="mx-3 text-gray-500">·</span>
                <span>{post.date}</span>
                <span className="mx-3 text-gray-500">·</span>
                <span>{post.readTime} min read</span>
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
              className="blog-content prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(post.content) }}
            />
          </article>

          <div className="mt-16 pt-8 border-t border-gray-700 text-center">
            <button 
              onClick={onBackClick}
              className="inline-flex items-center px-6 py-3 text-gray-400 hover:text-gray-100 font-medium transition-colors"
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
  
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-gray-100 mt-12 mb-4">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-gray-100 mt-16 mb-6">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-gray-100 mt-16 mb-6">$1</h1>');
  
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-100">$1</strong>');
  
  html = html.replace(/^\- (.*$)/gim, '<li class="mb-3 text-gray-300 leading-relaxed">$1</li>');
  html = html.replace(/(<li.*<\/li>)/s, '<ul class="my-8 space-y-2">$1</ul>');
  
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 text-gray-100 p-6 rounded-lg my-8 overflow-x-auto"><code>$1</code></pre>');
  
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-cyan-300 px-2 py-1 rounded text-sm font-mono">$1</code>');
  
  html = html.split('\n\n').map(para => {
    para = para.trim();
    if (!para.match(/^<[h|u|p|l|d]/)) {
      return `<p class="text-xl text-gray-300 leading-relaxed mb-8 font-serif">${para}</p>`;
    }
    return para;
  }).join('\n');
  
  return html;
}
