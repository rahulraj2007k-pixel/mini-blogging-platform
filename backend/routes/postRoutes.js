 const express = require("express");
const Post = require("../models/Post");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// CREATE NEW POST
// ==========================================
router.post("/", protect, async (req, res) => {
    try {

        const {
            title,
            content,
            category,
            featuredImage,
            status
        } = req.body;


        // Check required fields
        if (!title || !content || !category) {
            return res.status(400).json({
                message: "Title, content and category are required"
            });
        }


        // Create post
        const post = await Post.create({
            title,
            content,
            category,
            featuredImage: featuredImage || "",

            // Only published or draft allowed
            status: status === "published"
                ? "published"
                : "draft",

            // Logged-in user becomes author
            author: req.user._id
        });


        res.status(201).json({
            message: "Post created successfully",
            post
        });


    } catch (error) {

        console.error("Create Post Error:", error);

        res.status(500).json({
            message: "Failed to create post",
            error: error.message
        });

    }
});


// ==========================================
// GET MY POSTS
// Published + Draft
// ==========================================
router.get("/my-posts", protect, async (req, res) => {
    try {

        const posts = await Post.find({
            author: req.user._id
        })
            .populate("author", "name email bio")
            .sort({ createdAt: -1 });


        res.status(200).json({
            count: posts.length,
            posts
        });


    } catch (error) {

        console.error("Get My Posts Error:", error);

        res.status(500).json({
            message: "Failed to get your posts",
            error: error.message
        });

    }
});


// ==========================================
// GET ALL PUBLISHED POSTS
// ==========================================
router.get("/", async (req, res) => {
    try {

        const posts = await Post.find({
            status: "published"
        })
            .populate("author", "name email bio")
            .sort({ createdAt: -1 });


        res.status(200).json({
            count: posts.length,
            posts
        });


    } catch (error) {

        console.error("Get Posts Error:", error);

        res.status(500).json({
            message: "Failed to get posts",
            error: error.message
        });

    }
});


// ==========================================
// SEARCH POSTS
// IMPORTANT: Keep BEFORE /:id
// ==========================================
router.get("/search/posts", async (req, res) => {
    try {

        const { q } = req.query;


        if (!q) {
            return res.status(400).json({
                message: "Please provide a search keyword"
            });
        }


        const posts = await Post.find({
            status: "published",

            $or: [
                {
                    title: {
                        $regex: q,
                        $options: "i"
                    }
                },
                {
                    content: {
                        $regex: q,
                        $options: "i"
                    }
                }
            ]

        })
            .populate("author", "name email bio")
            .sort({ createdAt: -1 });


        res.status(200).json({
            count: posts.length,
            posts
        });


    } catch (error) {

        console.error("Search Error:", error);

        res.status(500).json({
            message: "Search failed",
            error: error.message
        });

    }
});


// ==========================================
// FILTER POSTS BY CATEGORY
// IMPORTANT: Keep BEFORE /:id
// ==========================================
router.get("/category/:category", async (req, res) => {
    try {

        const posts = await Post.find({

            status: "published",

            category: {
                $regex: `^${req.params.category}$`,
                $options: "i"
            }

        })
            .populate("author", "name email bio")
            .sort({ createdAt: -1 });


        res.status(200).json({
            count: posts.length,
            posts
        });


    } catch (error) {

        console.error(
            "Category Filter Error:",
            error
        );

        res.status(500).json({
            message: "Category filter failed",
            error: error.message
        });

    }
});


// ==========================================
// GET SINGLE PUBLISHED POST
// ==========================================
router.get("/:id", async (req, res) => {
    try {

        const post = await Post.findOne({

            _id: req.params.id,

            status: "published"

        })
            .populate("author", "name email bio");


        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }


        res.status(200).json({
            post
        });


    } catch (error) {

        console.error(
            "Get Single Post Error:",
            error
        );

        res.status(500).json({
            message: "Failed to get post",
            error: error.message
        });

    }
});


// ==========================================
// UPDATE OWN POST
// ==========================================
router.put("/:id", protect, async (req, res) => {
    try {

        const post =
            await Post.findById(req.params.id);


        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }


        // Check ownership
        if (
            post.author.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({
                message: "You can only edit your own posts"
            });

        }


        const {
            title,
            content,
            category,
            featuredImage,
            status
        } = req.body;


        // Update fields
        post.title =
            title || post.title;

        post.content =
            content || post.content;

        post.category =
            category || post.category;


        if (featuredImage !== undefined) {

            post.featuredImage =
                featuredImage;

        }


        if (
            status === "draft" ||
            status === "published"
        ) {

            post.status = status;

        }


        await post.save();


        res.status(200).json({
            message: "Post updated successfully",
            post
        });


    } catch (error) {

        console.error(
            "Update Post Error:",
            error
        );

        res.status(500).json({
            message: "Failed to update post",
            error: error.message
        });

    }
});


// ==========================================
// DELETE OWN POST
// ==========================================
router.delete("/:id", protect, async (req, res) => {
    try {

        const post =
            await Post.findById(req.params.id);


        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }


        // Check ownership
        if (
            post.author.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({
                message: "You can only delete your own posts"
            });

        }


        await post.deleteOne();


        res.status(200).json({
            message: "Post deleted successfully"
        });


    } catch (error) {

        console.error(
            "Delete Post Error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete post",
            error: error.message
        });

    }
});


module.exports = router;