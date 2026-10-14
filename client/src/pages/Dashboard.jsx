import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/useAuth';

import api from '../services/api';
import { useMemo } from 'react';

const languageNames = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  cpp: "C++",
};

const languageIcons = {
  javascript: "JS",
  python: "Py",
  java: "J",
  cpp: "C++",
}

const formatDate = (date) => {
  if(!date) return "Date unavailable";

  const parasedDate = new Date(date);
  if(Number.isNaN(parasedDate.getTime())) return "Date unavailable";

  return parasedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const Dashboard = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [languageFilter, setLanguageFilter] = useState("all");

    useEffect(() => {
        const fetchCodes = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await api.get('/codes');
                setCodes(Array.isArray(response.data) ? response.data: []);
            }catch (err) {
                console.error("Failed to fetch codes:", err);

                setError(err.response?.data?.message || 'Failed to fetch codes. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCodes();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    const filteredCodes = useMemo(() => {
      const normalizedSearch = searchTerm.trim().toLocaleLowerCase();

      return codes.filter((code) => {
        const title = (code.title || "").toLowerCase();
        const language = (code.language || "").toLowerCase();

        const matchesSearch = title.includes(normalizedSearch) || language.includes(normalizedSearch);

        const matchesLanguage = languageFilter === "all" || language === languageFilter;

        return matchesSearch && matchesLanguage;
      });
    }, [codes, searchTerm, languageFilter]);

    const handleDelete = async () => {
        if(!deleteId || deleting) return;

        setDeleting(true);
        setDeleteError("");

        try{
            await api.delete(`/codes/${deleteId}`);

            setCodes((prevCodes) =>
                prevCodes.filter((code) => code._id !== deleteId)
            );

            setDeleteId(null);
        }
        catch(error) {
            console.error("Delete error:", error);
            setDeleteError(error.response?.data?.message || "Couldn't delete this program. Please try again.")
        }
        finally{
            setDeleting(false);
        }
    }

    const selectedCode = codes.find((code) => code._id === deleteId);

    return (
        <div className="dashboard-page">
            <header className="dashboard-navbar">
                <button
                    className="dashboard-brand"
                    onClick={() => navigate("/dashboard")}
                    aria-label="Code Edit dashboard"
                >
                    <span className="dashboard-brand-mark">{"</>"}</span>
                    <span>Code<span className="dashboard-brand-accent">Edit</span></span>
                </button>

                <div className="dashboard-nav-right">
                    <span className="dashboard-nav-caption">Your workspace</span>
                    <div className="dashboard-user-avatar" aria-hidden="true">
                        {(user?.username || "U").trim().charAt(0).toUpperCase()}
                    </div>
                    <div className="dashboard-user-details">
                        <span className="dashboard-user-name">
                            {user?.username || "Developer"}
                        </span>
                        <span className="dashboard-user-role">Developer</span>
                    </div>
                    <button className="dashboard-logout" onClick={handleLogout}>
                        Log out <span aria-hidden="true">↗</span>
                    </button>
                </div>
            </header>

            <main className="dashboard-main">
                <section className="dashboard-welcome">
                    <div className="dashboard-welcome-copy">
                        <div className="dashboard-eyebrow">
                            <span className="dashboard-eyebrow-dot" />
                            YOUR CODING WORKSPACE
                        </div>
                        <h1>
                            Welcome back, <span>{user?.username || "Developer"}</span>
                        </h1>
                        <p>
                            Pick up where you left off, or start building something new.
                        </p>
                    </div>

                    <button
                        className="dashboard-create-button"
                        onClick={() => navigate("/editor")}
                    >
                        <span className="dashboard-create-plus">＋</span>
                        New program
                    </button>
                </section>

                <section className="dashboard-summary" aria-label="Program summary">
                    <div className="dashboard-summary-icon">{"</>"}</div>
                    <div>
                        <span className="dashboard-summary-label">Saved programs</span>
                        <strong>{loading ? "—" : codes.length}</strong>
                    </div>
                    <div className="dashboard-summary-divider" />
                    <div className="dashboard-summary-note">
                        <span className="dashboard-summary-note-dot" />
                        <span>{codes.length === 1 ? "One project in your workspace" : "Your projects, all in one place"}</span>
                    </div>
                </section>

                <section className="dashboard-program-section">
                    <div className="dashboard-section-heading">
                        <div>
                            <h2>Your programs</h2>
                            <p>Manage and continue working on your saved code.</p>
                        </div>
                        <span className="dashboard-count-pill">
                            {loading ? "Loading…" : `${filteredCodes.length} ${filteredCodes.length === 1 ? "program" : "programs"}`}
                        </span>
                    </div>

                    <div className="dashboard-toolbar">
                        <label className="dashboard-search">
                            <span className="dashboard-search-icon" aria-hidden="true">⌕</span>
                            <input
                                type="search"
                                placeholder="Search by program name or language…"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                aria-label="Search programs"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    className="dashboard-search-clear"
                                    onClick={() => setSearchTerm("")}
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </label>

                        <label className="dashboard-filter">
                            <span>Language</span>
                            <select
                                value={languageFilter}
                                onChange={(event) => setLanguageFilter(event.target.value)}
                                aria-label="Filter by language"
                            >
                                <option value="all">All languages</option>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                            </select>
                        </label>
                    </div>

                    {error && (
                        <div className="dashboard-alert dashboard-alert-error" role="alert">
                            <span>{error}</span>
                            <button onClick={() => window.location.reload()}>Try again</button>
                        </div>
                    )}

                    {deleteError && (
                        <div className="dashboard-alert dashboard-alert-error" role="alert">
                            {deleteError}
                        </div>
                    )}

                    {loading ? (
                        <div className="dashboard-state-card">
                            <div className="dashboard-spinner" />
                            <h3>Loading your workspace</h3>
                            <p>Fetching your saved programs…</p>
                        </div>
                    ) : !error && codes.length === 0 ? (
                        <div className="dashboard-state-card dashboard-empty-state">
                            <div className="dashboard-empty-icon">{"{ }"}</div>
                            <h3>Your next idea starts here</h3>
                            <p>You haven't saved any programs yet. Create one and it will show up here.</p>
                            <button
                                className="dashboard-create-button"
                                onClick={() => navigate("/editor")}
                            >
                                <span className="dashboard-create-plus">＋</span>
                                Create your first program
                            </button>
                        </div>
                    ) : !error && filteredCodes.length === 0 ? (
                        <div className="dashboard-state-card dashboard-no-results">
                            <div className="dashboard-empty-icon">⌕</div>
                            <h3>No matching programs</h3>
                            <p>Try another search or change the language filter.</p>
                            <button
                                className="dashboard-secondary-button"
                                onClick={() => {
                                    setSearchTerm("");
                                    setLanguageFilter("all");
                                }}
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div className="dashboard-program-grid">
                            {filteredCodes.map((code) => {
                                const language = (code.language || "javascript").toLowerCase();
                                const icon = languageIcons[language] || "</>";
                                const languageLabel = languageNames[language] || code.language || "Unknown";

                                return (
                                    <article className="dashboard-program-card" key={code._id}>
                                        <div className="dashboard-card-top">
                                            <div className={`dashboard-language-icon dashboard-language-${language}`}>
                                                {icon}
                                            </div>
                                            <button
                                                className="dashboard-card-menu"
                                                onClick={() => {
                                                    setDeleteError("");
                                                    setDeleteId(code._id);
                                                }}
                                                aria-label={`Delete ${code.title}`}
                                                title="Delete program"
                                            >
                                              x
                                            </button>
                                        </div>

                                        <button
                                            className="dashboard-card-title-button"
                                            onClick={() => navigate(`/editor/${code._id}`)}
                                        >
                                            <h3>{code.title || "Untitled program"}</h3>
                                        </button>

                                        <span className="dashboard-language-label">{languageLabel}</span>

                                        <div className="dashboard-card-footer">
                                            <div className="dashboard-updated">
                                                <span aria-hidden="true">◷</span>
                                                <span>Updated {formatDate(code.updatedAt || code.createdAt)}</span>
                                            </div>
                                            <button
                                                className="dashboard-open-button"
                                                onClick={() => navigate(`/editor/${code._id}`)}
                                            >
                                                Open <span aria-hidden="true">→</span>
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                <footer className="dashboard-footer">
                    <span><span className="dashboard-footer-mark">{"</>"}</span> CodeEdit</span>
                    <span>Write. Run. Build.</span>
                </footer>
            </main>

            {deleteId && (
                <div
                    className="dashboard-modal-backdrop"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !deleting) {
                            setDeleteId(null);
                            setDeleteError("");
                        }
                    }}
                >
                    <section
                        className="dashboard-delete-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="dashboard-delete-title"
                    >
                        <div className="dashboard-delete-icon">!</div>
                        <h2 id="dashboard-delete-title">Delete this program?</h2>
                        <p>
                            <strong>{selectedCode?.title || "This program"}</strong> will be removed from your workspace.
                            This action cannot be undone.
                        </p>
                        {deleteError && <p className="dashboard-dialog-error">{deleteError}</p>}
                        <div className="dashboard-dialog-actions">
                            <button
                                className="dashboard-secondary-button"
                                onClick={() => {
                                    setDeleteId(null);
                                    setDeleteError("");
                                }}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="dashboard-confirm-delete"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting…" : "Delete program"}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default Dashboard;