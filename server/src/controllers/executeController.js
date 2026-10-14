import axios from "axios";
import Execution from "../models/Execution.js";
import Code from "../models/code.js";

const languageIds = {
    javascript: 63, 
    python: 71,
    java: 62,
    cpp:54,
};

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const executeCode = async (req, res) => {
    try{
        const {codeId, language, sourceCode, stdin =""} = req.body;
        
        if(codeId) {
            const code = await Code.findOne({
                _id: codeId,
                user: req.user._id,
            });

            if(!code) {
                return res.status(404).json({
                    message: "Code not found or you don't have permission to execute it",
                });
            }
        }

        if(!language || !sourceCode) {
            return res.status(400).json({
                message: "Language and Source code is required"
            });
        }

        const languageId = languageIds[language];

        if(!languageId){
            return res.status(400).json({
                message: "Unsupported programming language",
            });
        }

        const submissionResponse = await axios.post(
            `${process.env.JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
            {
                source_code: sourceCode,
                language_id: languageId,
                stdin,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const { token } = submissionResponse.data ;

        for(let attempt=0; attempt<20; attempt++){
            await sleep(2000);

            const resultResponse = await axios.get(
                `${process.env.JUDGE0_URL}/submissions/${token}?base64_encoded=false`
            );

            const result = resultResponse.data;

            if(codeId) {
                await Execution.create({
                    code: codeId,
                    user: req.user._id,
                    language,
                    sourceCode,
                    stdin,
                    stdout: result.stdout || "",
                    stderr: result.stderr || "",
                    compileOutput: result.compile_output || "",
                    status: result.status?.description || "Unknown",
                    time: result.time || null,
                    memory: result.memory || null,
                });
            }

            if(result.status?.id === 1 || result.status?.id ===2){
                continue;
            }

            return res.status(200).json({
                stdout: result.stdout || "",
                stderr: result.stderr || "",
                compileOutput: result.compile_output || "",
                status: result.status?.description || "Unknown",
                memory: result.memory || null,
                time: result.time || null,
            });
        }

        return res.status(201).json({
            token,
        });
    }
    catch(error){
        console.error("Code Execution submission error: ", 
            error.response?.data || error.message
        );

        return res.status(500).json({
            message:"Failed to submit code for execution",
        });
    }
};

const getExecutionHistory = async (req, res) => {
    try {
        const { codeId } = req.params;

        const code = await Code.findOne({
            _id: codeId,
            user: req.user._id,
        });

        if(!code) {
            return res.status(404).json({
                message: "Code not found or you don't have permission to view its execution history",
            });
        }

        const executions = await Execution.find({
            code: codeId,
            user: req.user._id,
        }).sort({ createdAt: -1 }).select("language sourceCode stdin status time memory stdout stderr compileOutput createdAt");

        return res.status(200).json(executions);
    }
    catch(error) {
        console.error("Get Execution History error: ", 
            error.response?.data || error.message
        );

        return res.status(500).json({
            message:"Failed to retrieve execution history",
        });
    }
};

export {executeCode, getExecutionHistory};