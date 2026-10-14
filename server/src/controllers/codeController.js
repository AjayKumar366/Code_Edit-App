import Code from "../models/code.js";

const createCode = async (req, res) => {
    try{
        const { title, language, sourceCode } = req.body;

        if(!title || !language || !sourceCode) {
            return res.status(400).json({ message: "Title, language, and source code are required" });
        }

        const code = await Code.create({    
            title,
            language,
            sourceCode,
            user: req.user._id,
        });
        return res.status(201).json(code);
    } catch (error) {
        console.error("Create code error:", error);
        
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getCodes = async (req, res) => {
    try{
        const codes = await Code.find({
            user: req.user._id,
        }).sort({
            updatedAt: -1,
        });

        return res.json(codes);
    } catch (error) {
        console.error("Get codes error:", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};

const getCodeById = async (req, res) => {
    try{
        const code = await Code.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if(!code) {
            return res.status(404).json({
                message: "Code not found",
            });
        }

        return res.json(code);
    } catch (error) {
        console.error("Get code by ID error:", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};

const updateCode = async (req, res) => {
    try{
        const { title, language, sourceCode } = req.body;

        const code = await Code.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if(!code) {
            return res.status(404).json({
                message: "Code not found",
            });
        }

        code.title = title ?? code.title;
        code.language = language ?? code.language;
        code.sourceCode = sourceCode ?? code.sourceCode;

        const updatedCode = await code.save();

        return res.json(updatedCode);
    } catch (error) {
        console.error("Update code error:", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};

const deleteCode = async (req, res) => {
    try{
        const code = await Code.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if(!code) {
            return res.status(404).json({
                message: "Code not found",
            });
        }

        await code.deleteOne();

        return res.json({
            message: "Code deleted successfully",
        });
    } catch (error) {
        console.error("Delete code error:", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};

export {
    createCode,
    getCodes,
    getCodeById,
    updateCode,
    deleteCode
};
