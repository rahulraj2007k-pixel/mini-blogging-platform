const express = require("express");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// ADD COMMENT
// ==========================================
router.post("/:postId", protect, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Comment text is required"
            });
        }

        // Check if post exists and is published
        const post = await Post.findOne({
            _id: req.params.postId,
            status: "published"
        });

        if (!post) {
            return res.status(404).json({
                message: "Published post not found"
            });
        }

        const comment = await Comment.create({
            text: text.trim(),
            author: req.user._id,
            post: req.params.postId
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate("author", "name email bio");

        res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });

    } catch (error) {
        console.error("Add Comment Error:", error);

        res.status(500).json({
            message: "Failed to add comment",
            error: error.message
        });
    }
});


// ==========================================
// GET COMMENTS FOR A POST
// ==========================================
router.get("/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({
            post: req.params.postId
        })
            .populate("author", "name email bio")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: comments.length,
            comments
        });

    } catch (error) {
        console.error("Get Comments Error:", error);

        res.status(500).json({
            message: "Failed to get comments",
            error: error.message
        });
    }
});


module.exports = router;