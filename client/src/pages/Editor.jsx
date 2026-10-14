import {useCallback, useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import InputConsole from '../components/editor/InputConsole';
import OutputConsole from '../components/editor/OutputConsole';
import api from '../services/api';
import CodeEditor from '../components/editor/CodeEditor';
import ExecutionHistory from '../components/editor/ExecutionHistory';

const Editor = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const isEditing = Boolean(id);

    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [executionError, setExecutionError] = useState("");
    const [running, setRunning] = useState(false);
    const [executionStatus, setExecutionStatus] = useState("");
    const [executionTime, setExecutionTime] = useState(null);
    const [executionMemory, setExecutionMemory] = useState(null);

    const [editorTheme, setEditorTheme] =useState("dark");
    const [fontSize, setFontSize] = useState(14);

    const [execution, setExecutoins] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState("");

    const[message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [activePanel, setActivePanel] = useState("input");

    const fetchExecutionsHistory = useCallback(async() => {
      if(!id){
        setExecutoins([]);
        return
      }

      setHistoryError("");
      setHistoryLoading(true);

      try{
        const response = await api.get(
          `/execution/code/${id}`
        );
        setExecutoins(Array.isArray(response.data) ? response.data : []);
      }
      catch (error) {
        console.error("Failed to fetch execution history", error);
        setHistoryError(error.response?.data?.message || "Faled to load excution history.");
      }
      finally{
        setHistoryLoading(false);
      }
    }, [id]);

    useEffect(() => {
        if (!isEditing) {
          setLoading(false);
          return;
        }
        let cancelled = false;
        const fetchCode = async () => {
            try {
                const response = await api.get(`/codes/${id}`);
                if(cancelled) return;
                const {title, language, sourceCode} = response.data;
                setTitle(title || "");
                setLanguage(language || "javascript");
                setCode(sourceCode || "");
                fetchExecutionsHistory();
            }catch (err) {
                console.error("Failed to fetch code:", err);
                setError(err.response?.data?.message || 'Failed to fetch code. Please try again later.');
            }
            finally {
              if(!cancelled) setLoading(false);
            }
        };
        fetchCode();
        return () => {cancelled = true; };
    }, [id, isEditing, fetchExecutionsHistory]); 

    const handleSave = async () => {
        setMessage("");
        setError("");

        if(!title.trim()){
            setError("Please enter program title before saving");
            return
        }

        if (!code.trim()) {
            setError("Code cannot be empty")
            return
        }

        setSaving(true);

        try{
            if (isEditing) {
                await api.put(`/codes/${id}`, {
                    title,
                    language,
                    sourceCode: code,
                });

                setMessage("Program updated successfully.");
            } else {
                const response = await api.post("/codes", {
                    title,
                    language,
                    sourceCode: code,
                });

                setMessage("Program saved successfully.");

                navigate(`/editor/${response.data._id}`, {
                    replace: true,
                });
            }
        }
        catch(error){
            console.error("Save Error", error);

            setError(error.response?.data?.message || "Failed to save code");
        }
        finally{
            setSaving(false);
        }
    };

    const clearExecution = () => {
      setOutput("");
      setExecutionError("");
      setExecutionStatus("");
      setExecutionTime(null);
      setExecutionMemory(null);
    }

    const handleRun = async () => {
        if(!code.trim()){
            setExecutionError("Please enter code before running");
            setActivePanel("output");
            return;
        }

        setRunning(true);
        setActivePanel("output");
        setOutput("");
        setExecutionError("");
        setExecutionStatus("");
        setExecutionTime(null);
        setExecutionMemory(null);

        try{
            const response = await api.post("/execute", {
                codeId: id || null,
                language,
                sourceCode: code,
                stdin: input,
            });

            const result = response.data;

            setExecutionStatus(result.status || "");
            setExecutionTime(result.time ?? null);
            setExecutionMemory(result.memory ?? null);

            if(result.compileOutput){
                setExecutionError(result.compileOutput);
            } else if(result.stderr) {
                setExecutionError(result.stderr);
            } else {
                setOutput(result.stdout || "Program executes successfully.");
            }
            if(id){
              await fetchExecutionsHistory();
            }
        }
        catch(error){
            console.error("Execution error: ", error);
            setExecutionError(
                error.response?.data?.message || "Failed to execute code."
            );
        }
        finally{
            setRunning(false);
        }
    };

    const handleSelectExecution = (execution) => {
      setExecutionStatus(execution.status || "");
      setExecutionTime(execution.time ?? null);
      setExecutionMemory(execution.memory ?? null);

      if(execution.compileOutput){
        setExecutionError(execution.compileOutput);
        setOutput("");
      } else if(execution.stderr) {
        setExecutionError(execution.stderr);
        setOutput("");
      }else {
        setExecutionError("");
        setOutput(
          execution.stdout || "Program executed successfully"
        );
      }
      setInput(execution.stdin || "");
      setActivePanel('output');
    };

    const handleRestoreCode = (execution) => {
      const confirmed = window.confirm("Replace the current code with historical version?");

      if(!confirmed){
        return;
      }

      setCode(execution.sourceCode || "");
      setInput(execution.stdin || "");

      setLanguage(execution.language);
      clearExecution()

      setMessage("Historical code restored. Save if you want to update your program");
      setActivePanel("input");
    }

    if(loading) {
      return <div className='editor-loading'><span className='editor-loading-spinner'/>Loading your program</div>
    }

    return (
        <div className={`editor-page editor-page-${editorTheme}`}>
            <header className="editor-topbar">
                <button className="editor-brand" onClick={() => navigate("/dashboard")} aria-label="Back to dashboard">
                    <span className="editor-brand-mark">&lt;/&gt;</span>
                    <span>Code<span className="editor-brand-accent">Edit</span></span>
                </button>
                <div className="editor-breadcrumb"><span>/</span> {isEditing ? "Edit program" : "New program"}</div>
                <div className="editor-topbar-spacer" />
                <span className={`editor-save-state ${message ? "is-saved" : ""}`}>
                    <span className="editor-state-dot" />{message || "Ready to code"}
                </span>
                <button className="editor-dashboard-link" onClick={() => navigate("/dashboard")}>My programs</button>
            </header>

            {(error || message) && (
                <div className={`editor-alert ${error ? "editor-alert-error" : "editor-alert-success"}`} role="status">
                    <span>{error || message}</span>
                    <button onClick={() => { setError(""); setMessage(""); }} aria-label="Dismiss message">×</button>
                </div>
            )}

            <section className="editor-toolbar">
                <div className="editor-title-group">
                    <label className="editor-field-label" htmlFor="program-title">PROGRAM NAME</label>
                    <input id="program-title" className="editor-title-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Untitled program" />
                </div>
                <div className="editor-toolbar-divider" />
                <div className="editor-language-group">
                    <label className="editor-field-label" htmlFor="program-language">LANGUAGE</label>
                    <select id="program-language" className="editor-language-select" value={language} onChange={(event) => setLanguage(event.target.value)}>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                    </select>
                </div>
                <div className="editor-toolbar-spacer" />
                <div className="editor-display-controls">
                    <select className="editor-theme-select" value={editorTheme} onChange={(event) => setEditorTheme(event.target.value)} aria-label="Editor theme">
                        <option value="dark">Dark theme</option>
                        <option value="light">Light theme</option>
                    </select>
                    <div className="editor-font-control" aria-label="Editor font size">
                        <button onClick={() => setFontSize((size) => Math.max(10, size - 1))} aria-label="Decrease font size">−</button>
                        <span>{fontSize}px</span>
                        <button onClick={() => setFontSize((size) => Math.min(24, size + 1))} aria-label="Increase font size">+</button>
                    </div>
                </div>
                <button className="editor-save-button" onClick={handleSave} disabled={saving}>
                    <span>↧</span>{saving ? "Saving…" : "Save"}
                </button>
                <button className="editor-run-button" onClick={handleRun} disabled={running}>
                    <span>{running ? "◌" : "▶"}</span>{running ? "Running…" : "Run code"}
                </button>
            </section>

            <main className="editor-workspace editor-workspace-v2">
                <section className="code-panel editor-code-panel">
                    <div className="editor-panel-heading">
                        <div className="editor-panel-title"><span className="editor-live-dot" /> <span>EDITOR</span><span className="editor-file-label">{title.trim() || "untitled"}.{language === "javascript" ? "js" : language === "python" ? "py" : language === "java" ? "java" : "cpp"}</span></div>
                        <span className="editor-panel-hint">{language === "javascript" ? "JavaScript" : language === "cpp" ? "C++" : language[0].toUpperCase() + language.slice(1)}</span>
                    </div>
                    <div className="code-editor-wrapper">
                        <CodeEditor language={language} code={code} onChange={setCode} theme={editorTheme} fontSize={fontSize} />
                    </div>
                    <footer className="editor-statusbar"><span>⌘ Editor ready</span><span>UTF-8</span><span>Spaces: 4</span><span>Ln {code ? code.split("\n").length : 1}</span></footer>
                </section>

                <aside className="editor-side-panel">
                    <div className="editor-side-tabs" role="tablist" aria-label="Program panels">
                        <button className={activePanel === "input" ? "active" : ""} onClick={() => setActivePanel("input")} role="tab" aria-selected={activePanel === "input"}><span>⌨</span> Input</button>
                        <button className={activePanel === "output" ? "active" : ""} onClick={() => setActivePanel("output")} role="tab" aria-selected={activePanel === "output"}><span>›_</span> Output{executionStatus && <i className={executionStatus === "Accepted" ? "status-good" : "status-bad"} />}</button>
                        <button className={activePanel === "history" ? "active" : ""} onClick={() => { setActivePanel("history"); if (id && executions.length === 0 && !historyLoading) fetchExecutionsHistory(); }} role="tab" aria-selected={activePanel === "history"}><span>◷</span> History</button>
                    </div>
                    <div className="editor-side-content">
                        {activePanel === "input" && <InputConsole input={input} setInput={setInput} />}
                        {activePanel === "output" && <OutputConsole output={output} error={executionError} status={executionStatus} time={executionTime} memory={executionMemory} running={running} onClear={clearExecution} />}
                        {activePanel === "history" && (
                            <div className="editor-history-content">
                                <div className="editor-history-intro"><strong>Recent runs</strong><span>Previous executions for this program</span></div>
                                {!id && <p className="history-empty">Save this program first to keep its execution history.</p>}
                                {id && <ExecutionHistory executions={execution} loading={historyLoading} error={historyError} onSelect={handleSelectExecution} onRestore={handleRestoreCode} />}
                            </div>
                        )}
                    </div>
                    <div className="editor-side-footer"><span className="editor-live-dot" /> Local workspace <span>•</span> {language.toUpperCase()}</div>
                </aside>
            </main>
        </div>
      );
    };

export default Editor;
