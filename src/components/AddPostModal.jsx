import { useState } from "react";
import { supabase } from "../supabase";
import { v4 as uuidv4 } from "uuid";

export default function AddPostModal({ setShowModal }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Art");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!imageFile || !title) return;

    setLoading(true);

    // Generate unique filename
    const fileName = `${uuidv4()}.${imageFile.name.split(".").pop()}`;

    // Upload image
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, imageFile);

    if (uploadError) {
      alert("Upload failed");
      setLoading(false);
      return;
    }

    // Get public URL
    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    const imageUrl = data.publicUrl;

    // Insert into database
    const { error: dbError } = await supabase
      .from("posts")
      .insert([
        {
          title,
          image_url: imageUrl,
          category,
          likes: 0,
          saved: false
        }
      ]);

    if (dbError) {
      alert("Database error");
      setLoading(false);
      return;
    }

    setLoading(false);
    setShowModal(false);
    window.location.reload(); // simple refresh for now
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create Post</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Art</option>
          <option>Design</option>
          <option>Quotes</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Publishing..." : "Publish"}
        </button>

        <button onClick={() => setShowModal(false)}>Cancel</button>
      </div>
    </div>
  );
}