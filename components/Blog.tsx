import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BlogPost as BlogPostComponent } from './BlogPost';
import { blogPosts } from '../blogData';

interface BlogProps {
  onBackClick?: () => void;
}

export const Blog: React.FC<BlogProps> = ({ onBackClick }) => {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  if (selectedPost !== null) {
    const post = blogPosts.find(p => p.id === selectedPost);
    if (post) {
      return <BlogPostComponent post={post} onBackClick={() => setSelectedPost(null)} />;
    }
  }
  const featuredPost = blogPosts.find(post => post.featured);
  const editorPicks = blogPosts.filter(post => !post.featured).slice(0, 6);
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBlogClick={onBackClick} />
      
      <main className="container mx-auto px-4 py-12">
        {/* Editor Pick Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Editor Pick</h2>
            <a href="#" className="text-cyan-600 hover:text-cyan-700 font-medium">
              View All Posts →
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Card */}
            {featuredPost && (
              <div 
                onClick={() => setSelectedPost(featuredPost.id)}
                className="lg:col-span-1 relative rounded-xl overflow-hidden shadow-lg group cursor-pointer h-[500px]"
              >
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <span className="inline-block px-3 py-1 bg-cyan-600 rounded-full text-xs font-medium mb-3">
                    {featuredPost.category}
                  </span>
                  <h3 className="text-2xl font-bold mb-2">{featuredPost.title}</h3>
                  <p className="text-gray-200 text-sm mb-3">{featuredPost.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-300">
                    <span>{featuredPost.author}</span>
                    <span className="mx-2">•</span>
                    <span>{featuredPost.date}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Grid of smaller cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {editorPicks.map(post => (
                <div 
                  key={post.id} 
                  onClick={() => setSelectedPost(post.id)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium mb-3">
                      {post.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Post Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Post</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map(post => (
              <div 
                key={post.id} 
                onClick={() => setSelectedPost(post.id)}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-cyan-600 text-white rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{post.author}</span>
                    <span className="mx-2">•</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
