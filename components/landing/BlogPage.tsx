import React from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Blog } from "../Blog";
import { useNavigate } from "react-router-dom";

const BlogPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <Blog onBackClick={() => navigate('/')} />
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;
