const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        featuredImage: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft"
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema);