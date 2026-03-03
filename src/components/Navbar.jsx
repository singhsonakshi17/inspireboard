import { useState } from "react";

export default function Navbar({ setShowModal }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        Inspire<span>Board</span>
      </div>

      <div
        className="hamburger"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        ☰
      </div>

      <div className={`nav-actions ${menuOpen ? "open" : ""}`}>
        <input className="search" placeholder="Search inspiration..." />
        <button className="add-btn" onClick={() => setShowModal(true)}>
          ✨ Create
        </button>
      </div>
    </nav>
  );
}

