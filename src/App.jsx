import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import PostCard from "./components/PostCard";
import AddPostModal from "./components/AddPostModal";
import { supabase } from "./supabase";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  // 🔥 Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setPosts(data);
      } else {
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  const toggleLike = async (id) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const { error } = await supabase
      .from("posts")
      .update({ likes: post.likes + 1 })
      .eq("id", id);

    if (!error) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, likes: p.likes + 1 } : p
        )
      );
    }
  };

  const toggleSave = async (id) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const { error } = await supabase
      .from("posts")
      .update({ saved: !post.saved })
      .eq("id", id);

    if (!error) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, saved: !p.saved } : p
        )
      );
    }
  };

  const filteredPosts =
    filter === "All"
      ? posts
      : posts.filter((post) => post.category === filter);

  return (
    <>
      <Navbar setShowModal={setShowModal} setFilter={setFilter} />

      <div className="content">
        <div className="grid">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                toggleLike={toggleLike}
                toggleSave={toggleSave}
              />
            ))
          ) : (
            <p className="empty-message">No posts yet. Create one ✨</p>
          )}
        </div>
      </div>

      {showModal && (
        <AddPostModal setShowModal={setShowModal} />
      )}
    </>
  );
}