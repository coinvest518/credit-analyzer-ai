import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { blogPosts, BlogPost as BlogPostType } from '../blogData';

interface BlogListProps {
  onPostClick: (post: BlogPostType) => void;
}

export const BlogList: React.FC<BlogListProps> = ({ onPostClick }) => {
  const featuredPost = blogPosts.find(post => post.featured);
  const otherPosts = blogPosts.filter(post => !post.featured);

  React.useEffect(() => {
    document.title = 'Blog | AI Credit Report Analyzer';
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Credit Repair Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert insights, guides, and tips to help you understand and improve your credit score.
            </p>
          </div>

          {featuredPost && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-cyan-600 mb-8">Featured Article</h2>
              <div 
                className="bg-white rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => onPostClick(featuredPost)}
              >
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
                      {featuredPost.category}
                    </span>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                      {featuredPost.title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <span className="font-medium text-gray-900">{featuredPost.author}</span>
                      <span className="mx-3">·</span>
                      <span>{featuredPost.date}</span>
                      <span className="mx-3">·</span>
                      <span>8 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section>
            <h2 className="text-3xl font-bold text-cyan-600 mb-8">All Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <article 
                  key={post.id}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => onPostClick(post)}
                >
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium mb-3">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-gray-500 text-xs">
                      <span className="font-medium text-gray-900">{post.author}</span>
                      <span className="mx-2">·</span>
                      <span>{post.date}</span>
                      <span className="mx-2">·</span>
                      <span>8 min read</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};
