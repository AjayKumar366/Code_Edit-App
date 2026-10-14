import {useMemo} from 'react';
import CodeMirror from '@uiw/react-codemirror';

import {javascript} from '@codemirror/lang-javascript';
import {python} from '@codemirror/lang-python';
import {java} from '@codemirror/lang-java';
import {cpp} from '@codemirror/lang-cpp';

import {githubLight,} from '@uiw/codemirror-theme-github';
import {dracula} from "@uiw/codemirror-theme-dracula"

const CodeEditor = ({language, code, onChange, theme, fontSize}) => {
    const languageExtensions = useMemo(() => {
        switch (language) {
            case 'javascript':
                return javascript();
            case 'python':
                return python();
            case 'java':
                return java();
            case 'cpp':
                return cpp();
            default:
                return javascript();
        }
    }, [language]);

    const editorTheme = theme === "dark" ? dracula : githubLight;

    return (
        <div style={{
            height: "100%",
            fontSize: `${fontSize}px`,
        }} >
            <CodeMirror
                value={code}
                height="100%"
                extensions={[languageExtensions]}
                theme={editorTheme}
                onChange={(value) => {onChange(value)}}

                basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    dropCursor: true,
                    allowMultipleSelections: true,
                    indentOnInput: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    rectangularSelection: true,
                    highlightSelectionMatches: true,
                    searchKeymap: true,
                }}
            />
        </div>
        
    );
};

export default CodeEditor;
