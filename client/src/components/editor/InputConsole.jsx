const InputConsole = ({ input, setInput }) => {

    const handleClear = () => {
        setInput("");
    }

    return (
        <div className="console-container">
            <div className="console-header">
                <div className="console-title">
                    <h3>Input</h3>
                </div>

                <button 
                    className="clear-button"
                    onClick={handleClear}
                >
                    Clear
                </button>
            </div>

            <textarea
                className="console-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input for your program..."
            />
        </div>
    );
};

export default InputConsole;