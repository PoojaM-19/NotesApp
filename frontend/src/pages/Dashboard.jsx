
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  const [total, setTotal] = useState(0);
const [selectedTag, setSelectedTag] = useState("");
  useEffect(() => {
  fetchNotes();
}, [search, page, selectedTag]);

useEffect(() => {
  if (!message) return;

  const timer = setTimeout(() => {
    setMessage("");
  }, 3000);

  return () => clearTimeout(timer);
}, [message]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await API.get("/notes", {
     params: {
  search,
  page,
  limit: 6,
  tag: selectedTag,
}, });

      setNotes(response.data.data);
      setPages(response.data.pages || 1);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const openCreateForm = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setTags("");
    setMessage("");
    setShowForm(true);
  };

  const openEditForm = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags?.join(", ") || "");
    setMessage("");
    setShowForm(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const noteData = {
        title,
        content,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      };

      if (editingNote) {
        await API.put(`/notes/${editingNote._id}`, noteData);
        setMessage("Note updated successfully!");
      } else {
        await API.post("/notes", noteData);
        setMessage("Note created successfully!");
      }

      setShowForm(false);
      setEditingNote(null);
      setTitle("");
      setContent("");
      setTags("");

      await fetchNotes();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save note.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");

    if (!confirmed) return;

    try {
      await API.delete(`/notes/${noteId}`);
      setMessage("Note deleted successfully!");

      if (notes.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await fetchNotes();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to delete note.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <h2 className="sidebar-logo">NotesApp.</h2>

        <div className="sidebar-menu">
          <p className="menu-heading">MENU</p>

          <div className="menu-item active">📒 All Notes</div>

          <div
            className="menu-item"
            onClick={() => navigate("/profile")}
          >
            👤 My Profile
          </div>
        </div>

        <button className="sidebar-logout" onClick={handleLogout}>
          ↪ Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>{user?.role === "admin" ? "All Notes" : "My Notes"}</h1>
            <p>Organize your thoughts in one place.</p>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{user?.name}</strong>
              <span>{user?.role}</span>
            </div>
          </div>
        </header>

        <section className="notes-toolbar">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search your notes..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <select
  value={selectedTag}
  onChange={(e) => {
    setSelectedTag(e.target.value);
    setPage(1);
  }}
>
  <option value="">All Tags</option>
  <option value="study">Study</option>
  <option value="work">Work</option>
  <option value="personal">Personal</option>
  <option value="other">other</option>

</select>

          <button className="create-note-button" onClick={openCreateForm}>
            + Create Note
          </button>

          <div className="notes-count">
            {total} total notes
          </div>
        </section>

{message && (
  <div className="toast-message">
    {message}
  </div>
)}
        {showForm && (
          <section className="create-note-form">
            <h2>{editingNote ? "Edit Note" : "Create a New Note"}</h2>

            <form onSubmit={handleSaveNote}>
              <div className="form-group">
                <label>Note Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  minLength={3}
                  maxLength={120}
                  required
                  placeholder="Enter note title"
                />
              </div>

              <div className="form-group">
                <label>Note Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  required
                  placeholder="Write your note..."
                />
              </div>

              <div className="form-group">
                <label>Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="study, work, personal"
                />
                <small>Separate tags with commas.</small>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={saving} className="save-note-button">
                  {saving ? "Saving..." : editingNote ? "Update Note" : "Save Note"}
                </button>

                <button
                  type="button"
                  className="cancel-note-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {loading ? (
          <div className="empty-state">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h2>No notes found</h2>
            <p>Your notes will appear here.</p>
          </div>
        ) : (
          <section className="notes-grid">
            {notes.map((note) => {
              const isOwner =
                note.owner?._id === user?.id ||
                note.owner?._id === user?._id;

              const canDelete = isOwner || user?.role === "admin";

              return (
                <article className="note-card" key={note._id}>
                  <h3>{note.title}</h3>
                  <p className="note-content">{note.content}</p>

                  <div className="note-tags">
                    {note.tags?.map((tag, index) => (
                      <span key={index}>#{tag}</span>
                    ))}
                  </div>

                  {user?.role === "admin" && note.owner && (
                    <p className="note-owner">
                      Owner: {note.owner.name}
                    </p>
                  )}

                  <span className="note-date">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>

                  <div className="note-actions">
                    {isOwner && (
                      <button
                        className="edit-note-button"
                        onClick={() => openEditForm(note)}
                      >
                        Edit
                      </button>
                    )}

                    {canDelete && (
                      <button
                        className="delete-note-button"
                        onClick={() => handleDeleteNote(note._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {!loading && pages > 1 && (
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </button>

            <span>Page {page} of {pages}</span>

            <button
              disabled={page === pages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
