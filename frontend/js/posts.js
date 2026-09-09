 const BASE_URL = "https://mini-blogging-platform-br6r.onrender.com";

const POSTS_API = `${BASE_URL}/api/posts`;
const COMMENTS_API = `${BASE_URL}/api/comments`;


// ===============================
// GET TOKEN
// ===============================

function getToken() {
    return localStorage.getItem("token");
}


// ===============================
// CREATE POST
// ===============================

const createPostForm =
    document.getElementById("createPostForm");

if (createPostForm) {

    createPostForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const title =
            document.getElementById("title").value.trim();

        const content =
            document.getElementById("content").value.trim();

        const category =
            document.getElementById("category").value.trim();

        const featuredImageElement =
            document.getElementById("featuredImage");

        const statusElement =
            document.getElementById("status");

        const featuredImage =
            featuredImageElement
                ? featuredImageElement.value.trim()
                : "";

        const status =
            statusElement
                ? statusElement.value
                : "draft";

        const message =
            document.getElementById("createPostMessage");

        message.textContent = "Creating post...";

        try {

            const response = await fetch(POSTS_API, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
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

                message.textContent =
                    data.message || "Failed to create post.";

                return;
            }

            message.textContent =
                "Post created successfully!";

            createPostForm.reset();

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 700);

        } catch (error) {

            console.error("Create Post Error:", error);

            message.textContent =
                "Unable to connect to server.";
        }

    });

}


// ===============================
// DISPLAY POSTS
// ===============================

function displayPosts(posts, container) {

    if (!container) return;

    if (!posts || posts.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h2>No posts found</h2>
                <p>There are no blog posts available.</p>
            </div>
        `;

        return;
    }


    container.innerHTML = posts.map(post => {

        const imageHTML = post.featuredImage
            ? `
                <img
                    src="${post.featuredImage}"
                    alt="${post.title}"
                    class="post-card-image"
                >
            `
            : `
                <div class="post-card-image no-image">
                    Mini Blog
                </div>
            `;


        const authorName =
            post.author?.name || "Unknown Author";


        const postDate =
            post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : "";


        return `
            <article class="post-card">

                ${imageHTML}

                <div class="post-card-content">

                    <span class="post-category">
                        ${post.category}
                    </span>

                    <h2>
                        ${post.title}
                    </h2>

                    <p>
                        ${post.content.substring(0, 150)}
                        ${post.content.length > 150 ? "..." : ""}
                    </p>

                    <div class="post-meta">

                        <span>
                            By ${authorName}
                        </span>

                        <span>
                            ${postDate}
                        </span>

                    </div>

                    <a
                        href="post.html?id=${post._id}"
                        class="btn btn-primary"
                    >
                        Read More
                    </a>

                </div>

            </article>
        `;

    }).join("");
}


// ===============================
// LOAD PUBLISHED POSTS
// ===============================

async function loadPosts() {

    const postsContainer =
        document.getElementById("postsContainer");

    const loading =
        document.getElementById("postsLoading");

    const errorMessage =
        document.getElementById("postsError");

    if (!postsContainer) return;

    if (loading) {
        loading.style.display = "block";
    }

    if (errorMessage) {
        errorMessage.textContent = "";
    }


    try {

        const response =
            await fetch(POSTS_API);

        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Failed to load posts."
            );
        }


        displayPosts(
            data.posts,
            postsContainer
        );


    } catch (error) {

        console.error("Load Posts Error:", error);

        if (errorMessage) {

            errorMessage.textContent =
                "Unable to load posts.";
        }

    } finally {

        if (loading) {
            loading.style.display = "none";
        }

    }
}


// ===============================
// SEARCH POSTS
// ===============================

async function searchPosts(keyword) {

    if (!keyword) {

        loadPosts();

        return;
    }


    const postsContainer =
        document.getElementById("postsContainer");

    const errorMessage =
        document.getElementById("postsError");


    if (!postsContainer) return;


    try {

        const response =
            await fetch(
                `${POSTS_API}/search/posts?q=${encodeURIComponent(keyword)}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Search failed."
            );
        }


        displayPosts(
            data.posts,
            postsContainer
        );


    } catch (error) {

        console.error("Search Error:", error);

        if (errorMessage) {

            errorMessage.textContent =
                "Search failed.";
        }

    }
}


// ===============================
// CATEGORY FILTER
// ===============================

async function filterByCategory(category) {

    if (!category) {

        loadPosts();

        return;
    }


    const postsContainer =
        document.getElementById("postsContainer");

    const errorMessage =
        document.getElementById("postsError");


    if (!postsContainer) return;


    try {

        const response =
            await fetch(
                `${POSTS_API}/category/${encodeURIComponent(category)}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Category filter failed."
            );
        }


        displayPosts(
            data.posts,
            postsContainer
        );


    } catch (error) {

        console.error(
            "Category Filter Error:",
            error
        );

        if (errorMessage) {

            errorMessage.textContent =
                "Category filter failed.";
        }

    }
}


// ===============================
// LOAD SINGLE POST
// ===============================

async function loadSinglePost() {

    const postContainer =
        document.getElementById("singlePostContainer");

    if (!postContainer) return;


    const params =
        new URLSearchParams(window.location.search);

    const postId =
        params.get("id");


    if (!postId) {

        postContainer.innerHTML = `
            <div class="error-message">
                Post ID is missing.
            </div>
        `;

        return;
    }


    try {

        const response =
            await fetch(`${POSTS_API}/${postId}`);


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Post not found."
            );
        }


        const post =
            data.post;


        const imageHTML = post.featuredImage
            ? `
                <img
                    src="${post.featuredImage}"
                    alt="${post.title}"
                    class="single-post-image"
                >
            `
            : "";


        const authorName =
            post.author?.name || "Unknown Author";


        const postDate =
            post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : "";


        postContainer.innerHTML = `

            <article class="single-post">

                ${imageHTML}

                <span class="post-category">
                    ${post.category}
                </span>

                <h1>
                    ${post.title}
                </h1>

                <div class="single-post-meta">

                    <span>
                        By ${authorName}
                    </span>

                    <span>
                        ${postDate}
                    </span>

                </div>

                <div class="single-post-content">
                    ${post.content}
                </div>

            </article>
        `;


        loadComments(postId);


    } catch (error) {

        console.error(
            "Load Single Post Error:",
            error
        );

        postContainer.innerHTML = `
            <div class="error-message">
                Unable to load post.
            </div>
        `;

    }
}


// ===============================
// LOAD COMMENTS
// ===============================

async function loadComments(postId) {

    const commentsContainer =
        document.getElementById("commentsContainer");

    const commentsCount =
        document.getElementById("commentsCount");


    if (!commentsContainer) return;


    try {

        const response =
            await fetch(`${COMMENTS_API}/${postId}`);


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Failed to load comments."
            );
        }


        if (commentsCount) {

            commentsCount.textContent =
                data.count || 0;
        }


        if (!data.comments || data.comments.length === 0) {

            commentsContainer.innerHTML = `
                <p class="no-comments">
                    No comments yet.
                </p>
            `;

            return;
        }


        commentsContainer.innerHTML =
            data.comments.map(comment => {

                const authorName =
                    comment.author?.name ||
                    "Unknown User";


                const commentDate =
                    comment.createdAt
                        ? new Date(
                            comment.createdAt
                        ).toLocaleDateString()
                        : "";


                return `
                    <div class="comment">

                        <div class="comment-header">

                            <strong>
                                ${authorName}
                            </strong>

                            <span>
                                ${commentDate}
                            </span>

                        </div>

                        <p>
                            ${comment.text}
                        </p>

                    </div>
                `;

            }).join("");


    } catch (error) {

        console.error(
            "Load Comments Error:",
            error
        );

        commentsContainer.innerHTML = `
            <p class="error-message">
                Unable to load comments.
            </p>
        `;
    }
}


// ===============================
// ADD COMMENT
// ===============================

const commentForm =
    document.getElementById("commentForm");

if (commentForm) {

    commentForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        if (!getToken()) {

            alert("Please login to comment.");

            window.location.href = "login.html";

            return;
        }


        const params =
            new URLSearchParams(window.location.search);

        const postId =
            params.get("id");


        const commentInput =
            document.getElementById("commentText");

        const commentMessage =
            document.getElementById("commentMessage");


        const text =
            commentInput.value.trim();


        if (!text) {

            commentMessage.textContent =
                "Please enter a comment.";

            return;
        }


        commentMessage.textContent =
            "Adding comment...";


        try {

            const response =
                await fetch(
                    `${COMMENTS_API}/${postId}`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                            "Authorization":
                                `Bearer ${getToken()}`
                        },

                        body: JSON.stringify({
                            text
                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                commentMessage.textContent =
                    data.message ||
                    "Failed to add comment.";

                return;
            }


            commentInput.value = "";

            commentMessage.textContent =
                "Comment added successfully!";


            loadComments(postId);


        } catch (error) {

            console.error(
                "Add Comment Error:",
                error
            );

            commentMessage.textContent =
                "Unable to connect to server.";
        }

    });

}


// ===============================
// LOAD EDIT POST
// ===============================

async function loadEditPost() {

    const editForm =
        document.getElementById("editPostForm");

    if (!editForm) return;


    const params =
        new URLSearchParams(window.location.search);

    const postId =
        params.get("id");


    if (!postId) return;


    try {

        const response =
            await fetch(`${POSTS_API}/${postId}`);


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Post not found."
            );
        }


        const post =
            data.post;


        document.getElementById("title").value =
            post.title || "";


        document.getElementById("content").value =
            post.content || "";


        document.getElementById("category").value =
            post.category || "";


        const imageInput =
            document.getElementById("featuredImage");

        if (imageInput) {

            imageInput.value =
                post.featuredImage || "";
        }


        const statusInput =
            document.getElementById("status");

        if (statusInput) {

            statusInput.value =
                post.status || "draft";
        }


    } catch (error) {

        console.error(
            "Load Edit Post Error:",
            error
        );
    }
}


// ===============================
// UPDATE POST
// ===============================

if (document.getElementById("editPostForm")) {

    document
        .getElementById("editPostForm")
        .addEventListener("submit", async (event) => {

            event.preventDefault();


            const params =
                new URLSearchParams(
                    window.location.search
                );

            const postId =
                params.get("id");


            const title =
                document.getElementById("title")
                    .value.trim();


            const content =
                document.getElementById("content")
                    .value.trim();


            const category =
                document.getElementById("category")
                    .value.trim();


            const featuredImageElement =
                document.getElementById(
                    "featuredImage"
                );


            const statusElement =
                document.getElementById("status");


            const featuredImage =
                featuredImageElement
                    ? featuredImageElement.value.trim()
                    : "";


            const status =
                statusElement
                    ? statusElement.value
                    : "draft";


            const message =
                document.getElementById(
                    "editPostMessage"
                );


            message.textContent =
                "Updating post...";


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
                                    `Bearer ${getToken()}`
                            },

                            body: JSON.stringify({

                                title,
                                content,
                                category,
                                featuredImage,
                                status

                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    message.textContent =
                        data.message ||
                        "Failed to update post.";

                    return;
                }


                message.textContent =
                    "Post updated successfully!";


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 700);


            } catch (error) {

                console.error(
                    "Update Post Error:",
                    error
                );

                message.textContent =
                    "Unable to connect to server.";
            }

        });

}


// ===============================
// LOAD MY POSTS
// ===============================

async function loadMyPosts() {

    const postsContainer =
        document.getElementById(
            "myPostsContainer"
        );

    const loading =
        document.getElementById(
            "dashboardLoading"
        );

    const errorMessage =
        document.getElementById(
            "dashboardError"
        );

    const noPosts =
        document.getElementById("noMyPosts");


    if (!postsContainer) return;


    if (loading) {
        loading.style.display = "block";
    }


    try {

        const response =
            await fetch(
                `${POSTS_API}/my-posts`,
                {

                    headers: {
                        "Authorization":
                            `Bearer ${getToken()}`
                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load your posts."
            );
        }


        if (data.posts.length === 0) {

            postsContainer.innerHTML = "";

            if (noPosts) {
                noPosts.style.display = "block";
            }

            return;
        }


        if (noPosts) {
            noPosts.style.display = "none";
        }


        displayDashboardPosts(
            data.posts,
            postsContainer
        );


    } catch (error) {

        console.error(
            "Load My Posts Error:",
            error
        );

        if (errorMessage) {

            errorMessage.textContent =
                "Unable to load your posts.";
        }

    } finally {

        if (loading) {
            loading.style.display = "none";
        }

    }
}


// ===============================
// DISPLAY DASHBOARD POSTS
// ===============================

function displayDashboardPosts(
    posts,
    container
) {

    container.innerHTML =
        posts.map(post => {

            const statusClass =
                post.status === "published"
                    ? "published"
                    : "draft";


            const imageHTML = post.featuredImage
                ? `
                    <img
                        src="${post.featuredImage}"
                        alt="${post.title}"
                        class="post-card-image"
                    >
                `
                : `
                    <div class="post-card-image no-image">
                        Mini Blog
                    </div>
                `;


            return `
                <article class="post-card">

                    ${imageHTML}

                    <div class="post-card-content">

                        <span class="post-category">
                            ${post.category}
                        </span>

                        <h2>
                            ${post.title}
                        </h2>

                        <p>
                            ${post.content.substring(0, 120)}
                            ${post.content.length > 120 ? "..." : ""}
                        </p>

                        <span class="status-badge ${statusClass}">
                            ${post.status}
                        </span>

                        <div class="dashboard-actions">

                            ${
                                post.status === "published"
                                    ? `
                                        <a
                                            href="post.html?id=${post._id}"
                                            class="btn btn-primary"
                                        >
                                            View
                                        </a>
                                    `
                                    : ""
                            }

                            <a
                                href="edit-post.html?id=${post._id}"
                                class="btn btn-secondary"
                            >
                                Edit
                            </a>

                            <button
                                class="btn btn-danger delete-post-btn"
                                data-id="${post._id}"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </article>
            `;

        }).join("");


    // Delete buttons

    const deleteButtons =
        container.querySelectorAll(
            ".delete-post-btn"
        );


    deleteButtons.forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const postId =
                    button.dataset.id;


                const confirmed =
                    confirm(
                        "Are you sure you want to delete this post?"
                    );


                if (!confirmed) return;


                try {

                    const response =
                        await fetch(
                            `${POSTS_API}/${postId}`,
                            {

                                method: "DELETE",

                                headers: {

                                    "Authorization":
                                        `Bearer ${getToken()}`
                                }

                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        alert(
                            data.message ||
                            "Failed to delete post."
                        );

                        return;
                    }


                    alert(
                        "Post deleted successfully!"
                    );


                    loadMyPosts();


                } catch (error) {

                    console.error(
                        "Delete Post Error:",
                        error
                    );

                    alert(
                        "Unable to connect to server."
                    );
                }

            }
        );

    });

}


// ===============================
// DASHBOARD FILTER
// ===============================

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        async () => {

            filterButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add("active");


            const filter =
                button.dataset.filter;


            const postsContainer =
                document.getElementById(
                    "myPostsContainer"
                );


            if (!postsContainer) return;


            try {

                const response =
                    await fetch(
                        `${POSTS_API}/my-posts`,
                        {

                            headers: {

                                "Authorization":
                                    `Bearer ${getToken()}`
                            }

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to load posts."
                    );
                }


                let filteredPosts =
                    data.posts;


                if (filter === "published") {

                    filteredPosts =
                        data.posts.filter(
                            post =>
                                post.status ===
                                "published"
                        );
                }


                if (filter === "draft") {

                    filteredPosts =
                        data.posts.filter(
                            post =>
                                post.status ===
                                "draft"
                        );
                }


                if (filteredPosts.length === 0) {

                    postsContainer.innerHTML = `
                        <div class="empty-state">
                            <h2>No posts found</h2>
                            <p>
                                No ${filter} posts available.
                            </p>
                        </div>
                    `;

                    return;
                }


                displayDashboardPosts(
                    filteredPosts,
                    postsContainer
                );


            } catch (error) {

                console.error(
                    "Dashboard Filter Error:",
                    error
                );
            }

        }
    );

});


// ===============================
// AUTO LOAD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadPosts();

        loadSinglePost();

        loadEditPost();

        loadMyPosts();

    }
);