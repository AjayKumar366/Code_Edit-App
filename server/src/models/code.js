import mongoose from "mongoose";

const codeSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        language: {
            type: String,
            required: true,
            trim: true,
        },
        sourceCode: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Code = mongoose.model("Code", codeSchema);
export default Code;