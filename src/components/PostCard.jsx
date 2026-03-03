export default function PostCard({ post, toggleLike }) {
  return (
    <div className="card">
      <img src={post.image_url} alt={post.title} />
      <h3>{post.title}</h3>
      <button onClick={() => toggleLike(post.id)}>
        ❤️ {post.likes}
      </button>
    </div>
  );
}