const ExecutionHistory = ({
    executions,
    loading,
    error,
    onSelect,
    onRestore
}) => {
    if (loading) return <div className="editor-history-state"><span className="editor-loading-spinner" />Loading execution history…</div>;
    if (error) return <p className="history-error">{error}</p>;
    if (!executions.length) return <p className="history-empty">No runs saved yet. Execute this program to start building its history.</p>;
    return <div className="execution-history">
        {executions.map((execution) => <div className="history-item" key={execution._id}>
            <button className="history-result-button" onClick={() => onSelect(execution)}>
                <div className="history-item-main">
                    <span className={`history-status ${execution.status === "Accepted" ? "success" : "failed"}`}><span className="history-status-dot" />{execution.status || "Unknown"}</span>
                    <span className="history-date">{execution.createdAt ? new Date(execution.createdAt).toLocaleString() : "Date unavailable"}</span>
                </div>
                <div className="history-metadata"><span>{(execution.language || "javascript").toUpperCase()}</span>{execution.time != null && <span>{execution.time}s</span>}</div>
            </button>
            <button className="restore-code-button" onClick={() => onRestore(execution)}>Restore code</button>
        </div>)}
    </div>;
};

export default ExecutionHistory;