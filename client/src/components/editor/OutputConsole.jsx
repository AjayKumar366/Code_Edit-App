const OutputConsole = ({ output, error, status, time, memory, running, onClear}) => (
   <div className="console-container editor-console-container">
        <div className="console-header">
            <div className="console-title">
                <h3>{running ? "Running program" : "Program output"}</h3>
                {!running && status && <span className={`execute-status ${status === "Accepted" ? "success" : "failed"}`}>{status}</span>}
            </div>
            <button className="clear-button" onClick={onClear} disabled={running}>Clear</button>
        </div>
        <div className={`console-output ${error ? "error" : ""}`}>
            {running ? <div className="editor-running-state"><span className="editor-loading-spinner" />Executing your code…</div>
                : error ? <pre>{error}</pre>
                : output ? <pre>{output}</pre>
                : <div className="editor-output-empty"><span>›_</span><strong>Nothing to show yet</strong><p>Run your program to see the output here.</p></div>}
        </div>
        {!running && (time != null || memory != null) && <div className="execution-info">
            {time != null && <span><b>Time</b> {time}s</span>}{memory != null && <span><b>Memory</b> {memory} KB</span>}
        </div>}
    </div>
); 

export default OutputConsole;