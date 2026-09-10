 // ==========================================
// MINI BLOGGING PLATFORM - POSTS.JS
// ==========================================

const BASE_URL = "https://mini-blogging-platform-br6r.onrender.com";

const POSTS_API = `${BASE_URL}/api/posts`;
const COMMENTS_API = `${BASE_URL}/api/comments`;


// ==========================================
// GET TOKEN
// ==========================================

function getToken() {
    return localStorage.getItem("token");
}


// ==========================================
// GET LOGGED IN USER
// ==========================================

function getLoggedInUser() {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        console.error("User Data Error:", error);
        return null;
    }
}


// ==========================================
// CREATE POST
// ==========================================

const createPostForm = document.getElementById("createPostForm");

if (createPostForm) {

    createPostForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const titleElement = document.getElementById("title");
        const categoryElement = document.getElementById("category");
        const featuredImageElement = document.getElementById("featuredImage");
        const contentElement = document.getElementById("content");
        const statusElement = document.getElementById("status");

        const title = titleElement ? titleElement.value.trim() : "";
        const category = categoryElement ? categoryElement.value : "";
        const content = contentElement ? contentElement.value.trim() : "";

        const featuredImage = featuredImageElement
            ? featuredImageElement.value.trim()
            : "";

        const status = statusElement
            ? statusElement.value
            : "draft";

        // Optional message element
        const message = document.getElementById("createPostMessage");

        if (message) {
            message.textContent = "Creating post...";
        }

        // Basic validation
        if (!title || !category || !content) {

            if (message) {
                message.textContent = "Please fill all required fields.";
            } else {
                alert("Please fill all required fields.");
            }

            return;
        }

        const token = getToken();

        if (!token) {
            alert("Please login first.");
            window.location.href = "login.html";
            return;
        }

        try {

            const response = await fetch(POSTS_API, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    title,
                    content,
                    category,
                    featuredImage,
                    status
                })

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create post");
            }

            if (message) {
                message.textContent = "Post created successfully!";
            }

            alert("Post created successfully!");

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error("Create Post Error:", error);

            if (message) {
                message.textContent = error.message;
            } else {
                alert(error.message);
            }
        }

    });
}


// ==========================================
// LOAD MY POSTS
// ==========================================

async function loadMyPosts(filter = "all") {

    const postsContainer = document.getElementById("postsContainer");

    if (!postsContainer) {
        return;
    }

    const token = getToken();

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    postsContainer.innerHTML = "<p>Loading posts...</p>";

    try {

        const response = await fetch(`${POSTS_API}/my-posts`, {

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load posts");
        }

        let posts = Array.isArray(data) ? data : data.posts || [];

        // Filter
        if (filter === "published") {
            posts = posts.filter(post => post.status === "published");
        }

        if (filter === "drafts") {
            posts = posts.filter(post => post.status === "draft");
        }

        displayPosts(posts, postsContainer);

    } catch (error) {

        console.error("Load My Posts Error:", error);

        postsContainer.innerHTML = `
            <p class="error-message">
                Unable to load posts.
            </p>
        `;
    }
}


// ==========================================
// LOAD ALL POSTS
// ==========================================

async function loadPosts() {

    const postsContainer = document.getElementById("postsContainer");

    if (!postsContainer) {
        return;
    }

    postsContainer.innerHTML = "<p>Loading posts...</p>";

    try {

        const response = await fetch(POSTS_API);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load posts");
        }

        const posts = Array.isArray(data)
            ? data
            : data.posts || [];

        displayPosts(posts, postsContainer);

    } catch (error) {

        console.error("Load Posts Error:", error);

        postsContainer.innerHTML = `
            <p class="error-message">
                Unable to load posts.
            </p>
        `;
    }
}


// ==========================================
// DISPLAY POSTS
// ==========================================

function displayPosts(posts, container) {

    if (!container) {
        return;
    }

    if (!posts || posts.length === 0) {

        container.innerHTML = `
            <div class="no-posts">
                <h3>No posts yet</h3>
                <p>You haven't created any blog posts.</p>
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    posts.forEach(post => {

        const postCard = document.createElement("div");

        postCard.className = "post-card";

        const imageHTML = post.featuredImage
            ? `
                <img
                    src="${escapeHTML(post.featuredImage)}"
                    alt="${escapeHTML(post.title || "Blog image")}"
                    class="post-card-image"
                    onerror="this.style.display='none';"
                >
              `
            : `
                <div class="post-card-image no-image">
                    Mini Blog
                </div>
              `;

        const authorName =
            post.author?.name ||
            post.authorName ||
            "Anonymous";

        const date = post.createdAt
            ? new Date(post.createdAt).toLocaleDateString()
            : "";

        postCard.innerHTML = `

            ${imageHTML}

            <div class="post-card-content">

                <span class="post-category">
                    ${escapeHTML(post.category || "General")}
                </span>

                <h3>
                    ${escapeHTML(post.title || "Untitled Post")}
                </h3>

                <p>
                    ${escapeHTML(
                        (post.content || "").substring(0, 150)
                    )}${post.content && post.content.length > 150 ? "..." : ""}
                </p>

                <div class="post-meta">
                    <span>
                        By ${escapeHTML(authorName)}
                    </span>

                    <span>
                        ${date}
                    </span>
                </div>

                <div class="post-actions">

                    <button
                        class="btn btn-primary"
                        onclick="viewPost('${post._id}')"
                    >
                        Read More
                    </button>

                    ${
                        post.status
                            ? `<span class="post-status">${escapeHTML(post.status)}</span>`
                            : ""
                    }

                </div>

            </div>
        `;

        container.appendChild(postCard);
    });
}


// ==========================================
// VIEW SINGLE POST
// ==========================================

function viewPost(postId) {

    if (!postId) {
        return;
    }

    window.location.href = `post.html?id=${postId}`;
}


// ==========================================
// GET SINGLE POST
// ==========================================

async function loadSinglePost() {

    const postContainer =
        document.getElementById("postContainer") ||
        document.getElementById("singlePost");

    if (!postContainer) {
        return;
    }

    const params = new URLSearchParams(window.location.search);

    const postId = params.get("id");

    if (!postId) {

        postContainer.innerHTML = `
            <p>Post not found.</p>
        `;

        return;
    }

    postContainer.innerHTML = "<p>Loading post...</p>";

    try {

        const response = await fetch(`${POSTS_API}/${postId}`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load post");
        }

        const post = data.post || data;

        const authorName =
            post.author?.name ||
            post.authorName ||
            "Anonymous";

        const date = post.createdAt
            ? new Date(post.createdAt).toLocaleDateString()
            : "";

        postContainer.innerHTML = `

            ${
                post.featuredImage
                    ? `
                        <img
                            src="${escapeHTML(post.featuredImage)}"
                            alt="${escapeHTML(post.title)}"
                            class="post-detail-image"
                        >
                      `
                    : ""
            }

            <div class="post-detail">

                <span class="post-category">
                    ${escapeHTML(post.category || "General")}
                </span>

                <h1>
                    ${escapeHTML(post.title || "Untitled")}
                </h1>

                <div class="post-meta">
                    <span>
                        By ${escapeHTML(authorName)}
                    </span>

                    <span>
                        ${date}
                    </span>
                </div>

                <div class="post-content">
                    ${escapeHTML(post.content || "")}
                </div>

            </div>
        `;

        loadComments(postId);

    } catch (error) {

        console.error("Load Single Post Error:", error);

        postContainer.innerHTML = `
            <p class="error-message">
                Unable to load post.
            </p>
        `;
    }
}


// ==========================================
// SEARCH POSTS
// ==========================================

async function searchPosts(query) {

    const postsContainer =
        document.getElementById("postsContainer");

    if (!postsContainer) {
        return;
    }

    if (!query || !query.trim()) {
        loadPosts();
        return;
    }

    postsContainer.innerHTML = "<p>Searching...</p>";

    try {

        const response = await fetch(
            `${POSTS_API}/search/posts?query=${encodeURIComponent(query.trim())}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Search failed");
        }

        const posts = Array.isArray(data)
            ? data
            : data.posts || [];

        displayPosts(posts, postsContainer);

    } catch (error) {

        console.error("Search Error:", error);

        postsContainer.innerHTML = `
            <p class="error-message">
                Search failed.
            </p>
        `;
    }
}


// ==========================================
// FILTER BY CATEGORY
// ==========================================

async function filterByCategory(category) {

    const postsContainer =
        document.getElementById("postsContainer");

    if (!postsContainer) {
        return;
    }

    if (!category || category === "all") {
        loadPosts();
        return;
    }

    postsContainer.innerHTML = "<p>Loading posts...</p>";

    try {

        const response = await fetch(
            `${POSTS_API}/category/${encodeURIComponent(category)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Category filter failed");
        }

        const posts = Array.isArray(data)
            ? data
            : data.posts || [];

        displayPosts(posts, postsContainer);

    } catch (error) {

        console.error("Category Filter Error:", error);

        postsContainer.innerHTML = `
            <p class="error-message">
                Unable to filter posts.
            </p>
        `;
    }
}


// ==========================================
// DELETE POST
// ==========================================

async function deletePost(postId) {

    if (!postId) {
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
        return;
    }

    const token = getToken();

    if (!token) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(
            `${POSTS_API}/${postId}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to delete post"
            );
        }

        alert("Post deleted successfully!");

        loadMyPosts();

    } catch (error) {

        console.error("Delete Post Error:", error);

        alert(error.message);
    }
}


// ==========================================
// LOAD COMMENTS
// ==========================================

async function loadComments(postId) {

    const commentsContainer =
        document.getElementById("commentsContainer");

    if (!commentsContainer) {
        return;
    }

    commentsContainer.innerHTML =
        "<p>Loading comments...</p>";

    try {

        const response = await fetch(
            `${COMMENTS_API}/${postId}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load comments"
            );
        }

        const comments = Array.isArray(data)
            ? data
            : data.comments || [];

        if (comments.length === 0) {

            commentsContainer.innerHTML =
                "<p>No comments yet.</p>";

            return;
        }

        commentsContainer.innerHTML = "";

        comments.forEach(comment => {

            const commentDiv =
                document.createElement("div");

            commentDiv.className = "comment";

            const authorName =
                comment.author?.name ||
                comment.authorName ||
                "Anonymous";

            const date = comment.createdAt
                ? new Date(
                    comment.createdAt
                  ).toLocaleDateString()
                : "";

            commentDiv.innerHTML = `

                <strong>
                    ${escapeHTML(authorName)}
                </strong>

                <p>
                    ${escapeHTML(comment.text || "")}
                </p>

                <small>
                    ${date}
                </small>
            `;

            commentsContainer.appendChild(commentDiv);
        });

    } catch (error) {

        console.error("Load Comments Error:", error);

        commentsContainer.innerHTML =
            "<p>Unable to load comments.</p>";
    }
}


// ==========================================
// ADD COMMENT
// ==========================================

const commentForm =
    document.getElementById("commentForm");

if (commentForm) {

    commentForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const params =
                new URLSearchParams(
                    window.location.search
                );

            const postId = params.get("id");

            const commentInput =
                document.getElementById("commentText");

            if (!postId || !commentInput) {
                return;
            }

            const text =
                commentInput.value.trim();

            if (!text) {
                alert("Please write a comment.");
                return;
            }

            const token = getToken();

            if (!token) {
                alert("Please login to comment.");
                window.location.href = "login.html";
                return;
            }

            try {

                const response =
                    await fetch(
                        `${COMMENTS_API}/${postId}`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({
                                text
                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to add comment"
                    );
                }

                commentInput.value = "";

                alert("Comment added successfully!");

                loadComments(postId);

            } catch (error) {

                console.error(
                    "Add Comment Error:",
                    error
                );

                alert(error.message);
            }
        }
    );
}


// ==========================================
// EDIT POST
// ==========================================

const editPostForm =
    document.getElementById("editPostForm");

if (editPostForm) {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const postId = params.get("id");

    if (postId) {
        loadEditPost(postId);
    }

    editPostForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            if (!postId) {
                alert("Post ID missing.");
                return;
            }

            const titleElement =
                document.getElementById("title");

            const categoryElement =
                document.getElementById("category");

            const featuredImageElement =
                document.getElementById("featuredImage");

            const contentElement =
                document.getElementById("content");

            const statusElement =
                document.getElementById("status");

            const title =
                titleElement
                    ? titleElement.value.trim()
                    : "";

            const category =
                categoryElement
                    ? categoryElement.value
                    : "";

            const featuredImage =
                featuredImageElement
                    ? featuredImageElement.value.trim()
                    : "";

            const content =
                contentElement
                    ? contentElement.value.trim()
                    : "";

            const status =
                statusElement
                    ? statusElement.value
                    : "draft";

            if (!title || !category || !content) {
                alert("Please fill all required fields.");
                return;
            }

            const token = getToken();

            if (!token) {
                window.location.href = "login.html";
                return;
            }

            try {

                const response =
                    await fetch(
                        `${POSTS_API}/${postId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({
                                title,
                                category,
                                featuredImage,
                                content,
                                status
                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to update post"
                    );
                }

                alert(
                    "Post updated successfully!"
                );

                window.location.href =
                    "dashboard.html";

            } catch (error) {

                console.error(
                    "Update Post Error:",
                    error
                );

                alert(error.message);
            }
        }
    );
}


// ==========================================
// LOAD POST FOR EDITING
// ==========================================

async function loadEditPost(postId) {

    try {

        const response =
            await fetch(
                `${POSTS_API}/${postId}`
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to load post"
            );
        }

        const post =
            data.post || data;

        const titleElement =
            document.getElementById("title");

        const categoryElement =
            document.getElementById("category");

        const featuredImageElement =
            document.getElementById("featuredImage");

        const contentElement =
            document.getElementById("content");

        const statusElement =
            document.getElementById("status");

        if (titleElement) {
            titleElement.value =
                post.title || "";
        }

        if (categoryElement) {
            categoryElement.value =
                post.category || "";
        }

        if (featuredImageElement) {
            featuredImageElement.value =
                post.featuredImage || "";
        }

        if (contentElement) {
            contentElement.value =
                post.content || "";
        }

        if (statusElement) {
            statusElement.value =
                post.status || "draft";
        }

    } catch (error) {

        console.error(
            "Load Edit Post Error:",
            error
        );

        alert("Unable to load post.");
    }
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // Dashboard
        if (
            document.getElementById(
                "postsContainer"
            )
        ) {

            const path =
                window.location.pathname;

            if (
                path.includes("dashboard")
            ) {
                loadMyPosts("all");
            }
        }

        // Single post page
        if (
            window.location.pathname.includes(
                "post.html"
            )
        ) {
            loadSinglePost();
        }

    }
);