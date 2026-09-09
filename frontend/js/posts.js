 // ==========================================
// POSTS JAVASCRIPT
// ==========================================

const POSTS_API = "http://localhost:5000/api/posts";
const COMMENTS_API = "http://localhost:5000/api/comments";


// ==========================================
// GET TOKEN
// ==========================================

function getAuthToken() {
    return localStorage.getItem("token");
}


// ==========================================
// CREATE POST
// ==========================================

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
            document.getElementById("category").value;

        const featuredImage =
            document.getElementById("featuredImage").value.trim();

        const status =
            document.getElementById("status").value;

        const message =
            document.getElementById("postMessage");

        const token =
            getAuthToken();


        if (!token) {

            message.textContent =
                "Please login first.";

            return;
        }


        message.textContent =
            "Creating post...";


        try {

            const response =
                await fetch(POSTS_API, {

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


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message ||
                    "Failed to create post.";

                return;
            }


            message.textContent =
                "Post created successfully!";


            createPostForm.reset();


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 1000);


        } catch (error) {

            console.error(
                "Create Post Error:",
                error
            );

            message.textContent =
                "Server error. Please try again.";

        }

    });

}


// ==========================================
// GET ALL PUBLISHED POSTS
// ==========================================

async function loadPosts() {

    const postsContainer =
        document.getElementById("postsContainer");

    const loadingMessage =
        document.getElementById("loadingMessage");

    const noPostsMessage =
        document.getElementById("noPostsMessage");

    const errorMessage =
        document.getElementById("errorMessage");


    if (!postsContainer) {
        return;
    }


    try {

        loadingMessage.style.display =
            "block";

        noPostsMessage.style.display =
            "none";

        errorMessage.textContent =
            "";


        const response =
            await fetch(POSTS_API);


        const data =
            await response.json();


        loadingMessage.style.display =
            "none";


        if (!response.ok) {

            errorMessage.textContent =
                data.message ||
                "Failed to load posts.";

            return;
        }


        displayPosts(data.posts);

    } catch (error) {

        console.error(
            "Load Posts Error:",
            error
        );


        loadingMessage.style.display =
            "none";

        errorMessage.textContent =
            "Unable to connect to server.";

    }

}


// ==========================================
// DISPLAY POSTS
// ==========================================

function displayPosts(posts) {

    const postsContainer =
        document.getElementById("postsContainer");

    const noPostsMessage =
        document.getElementById("noPostsMessage");


    if (!postsContainer) {
        return;
    }


    postsContainer.innerHTML = "";


    if (!posts || posts.length === 0) {

        noPostsMessage.style.display =
            "block";

        return;
    }


    noPostsMessage.style.display =
        "none";


    posts.forEach(post => {

        const card =
            document.createElement("div");


        card.className =
            "post-card";


        // ==================================
        // IMAGE
        // ==================================

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


        // ==================================
        // AUTHOR
        // ==================================

        const authorName =
            post.author?.name ||
            "Unknown Author";


        // ==================================
        // DATE
        // ==================================

        const date =
            post.createdAt
                ? new Date(post.createdAt)
                    .toLocaleDateString()
                : "";


        // ==================================
        // CARD HTML
        // ==================================

        card.innerHTML = `

            ${imageHTML}

            <div class="post-card-content">

                <span class="post-category">
                    ${post.category}
                </span>

                <h3>
                    ${post.title}
                </h3>

                <p>
                    ${getShortContent(post.content)}
                </p>

                <div class="post-author">
                    By ${authorName}
                    <br>
                    ${date}
                </div>

                <a
                    href="post.html?id=${post._id}"
                    class="read-more"
                >
                    Read More →
                </a>

            </div>

        `;


        postsContainer.appendChild(card);

    });

}


// ==========================================
// SHORT CONTENT
// ==========================================

function getShortContent(content) {

    if (!content) {
        return "";
    }


    if (content.length <= 120) {
        return content;
    }


    return content.substring(0, 120) + "...";

}


// ==========================================
// SEARCH POSTS
// ==========================================

async function searchPosts(keyword) {

    const loadingMessage =
        document.getElementById("loadingMessage");

    const noPostsMessage =
        document.getElementById("noPostsMessage");

    const errorMessage =
        document.getElementById("errorMessage");


    if (!keyword.trim()) {

        loadPosts();

        return;
    }


    try {

        loadingMessage.style.display =
            "block";

        noPostsMessage.style.display =
            "none";

        errorMessage.textContent =
            "";


        const response =
            await fetch(
                `${POSTS_API}/search/posts?q=${encodeURIComponent(keyword)}`
            );


        const data =
            await response.json();


        loadingMessage.style.display =
            "none";


        if (!response.ok) {

            errorMessage.textContent =
                data.message ||
                "Search failed.";

            return;
        }


        displayPosts(data.posts);


    } catch (error) {

        console.error(
            "Search Error:",
            error
        );


        loadingMessage.style.display =
            "none";

        errorMessage.textContent =
            "Search failed. Please try again.";

    }

}


// ==========================================
// CATEGORY FILTER
// ==========================================

async function filterByCategory(category) {

    if (!category) {

        loadPosts();

        return;
    }


    const loadingMessage =
        document.getElementById("loadingMessage");

    const noPostsMessage =
        document.getElementById("noPostsMessage");

    const errorMessage =
        document.getElementById("errorMessage");


    try {

        loadingMessage.style.display =
            "block";

        noPostsMessage.style.display =
            "none";

        errorMessage.textContent =
            "";


        const response =
            await fetch(
                `${POSTS_API}/category/${encodeURIComponent(category)}`
            );


        const data =
            await response.json();


        loadingMessage.style.display =
            "none";


        if (!response.ok) {

            errorMessage.textContent =
                data.message ||
                "Category filter failed.";

            return;
        }


        displayPosts(data.posts);


    } catch (error) {

        console.error(
            "Category Error:",
            error
        );


        loadingMessage.style.display =
            "none";

        errorMessage.textContent =
            "Category filter failed.";

    }

}


// ==========================================
// GET SINGLE POST
// ==========================================

async function loadSinglePost() {

    const postContainer =
        document.getElementById("singlePost");


    if (!postContainer) {
        return;
    }


    const loading =
        document.getElementById("postLoading");

    const errorMessage =
        document.getElementById("postError");


    const params =
        new URLSearchParams(
            window.location.search
        );


    const postId =
        params.get("id");


    if (!postId) {

        loading.style.display =
            "none";

        errorMessage.textContent =
            "Post ID is missing.";

        return;
    }


    try {

        const response =
            await fetch(
                `${POSTS_API}/${postId}`
            );


        const data =
            await response.json();


        loading.style.display =
            "none";


        if (!response.ok) {

            errorMessage.textContent =
                data.message ||
                "Post not found.";

            return;
        }


        displaySinglePost(data.post);

        loadComments(postId);


    } catch (error) {

        console.error(
            "Single Post Error:",
            error
        );


        loading.style.display =
            "none";

        errorMessage.textContent =
            "Unable to load post.";

    }

}


// ==========================================
// DISPLAY SINGLE POST
// ==========================================

function displaySinglePost(post) {

    document.getElementById("postTitle")
        .textContent =
        post.title;


    document.getElementById("postCategory")
        .textContent =
        post.category;


    document.getElementById("postContent")
        .textContent =
        post.content;


    const image =
        document.getElementById("postImage");


    if (post.featuredImage) {

        image.src =
            post.featuredImage;

        image.style.display =
            "block";

    } else {

        image.style.display =
            "none";

    }


    const author =
        post.author?.name ||
        "Unknown Author";


    const email =
        post.author?.email ||
        "";


    document.getElementById("postAuthor")
        .textContent =
        author;


    document.getElementById("postAuthorEmail")
        .textContent =
        email;


    if (post.createdAt) {

        document.getElementById("postDate")
            .textContent =
            new Date(post.createdAt)
                .toLocaleString();

    }

}


// ==========================================
// LOAD COMMENTS
// ==========================================

async function loadComments(postId) {

    const commentsContainer =
        document.getElementById(
            "commentsContainer"
        );

    const noCommentsMessage =
        document.getElementById(
            "noCommentsMessage"
        );


    if (!commentsContainer) {
        return;
    }


    try {

        const response =
            await fetch(
                `${COMMENTS_API}/${postId}`
            );


        const data =
            await response.json();


        if (!response.ok) {
            return;
        }


        commentsContainer.innerHTML =
            "";


        if (
            !data.comments ||
            data.comments.length === 0
        ) {

            noCommentsMessage.style.display =
                "block";

            return;
        }


        noCommentsMessage.style.display =
            "none";


        data.comments.forEach(comment => {

            const commentDiv =
                document.createElement("div");


            commentDiv.className =
                "comment";


            const author =
                comment.author?.name ||
                "User";


            const date =
                comment.createdAt
                    ? new Date(comment.createdAt)
                        .toLocaleString()
                    : "";


            commentDiv.innerHTML = `

                <div class="comment-author">
                    ${author}
                </div>

                <div class="comment-date">
                    ${date}
                </div>

                <div class="comment-text">
                    ${comment.text}
                </div>

            `;


            commentsContainer.appendChild(
                commentDiv
            );

        });


    } catch (error) {

        console.error(
            "Comments Error:",
            error
        );

    }

}


// ==========================================
// ADD COMMENT
// ==========================================

const commentForm =
    document.getElementById(
        "commentForm"
    );


if (commentForm) {

    const token =
        getAuthToken();


    const commentFormContainer =
        document.getElementById(
            "commentFormContainer"
        );


    const loginCommentMessage =
        document.getElementById(
            "loginCommentMessage"
        );


    if (token) {

        commentFormContainer.style.display =
            "block";

        loginCommentMessage.style.display =
            "none";

    } else {

        commentFormContainer.style.display =
            "none";

        loginCommentMessage.style.display =
            "block";

    }


    commentForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const params =
                new URLSearchParams(
                    window.location.search
                );


            const postId =
                params.get("id");


            const text =
                document.getElementById(
                    "commentText"
                ).value.trim();


            const message =
                document.getElementById(
                    "commentMessage"
                );


            if (!postId) {

                message.textContent =
                    "Post ID is missing.";

                return;
            }


            if (!text) {

                message.textContent =
                    "Please write a comment.";

                return;
            }


            try {

                message.textContent =
                    "Adding comment...";


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

                    message.textContent =
                        data.message ||
                        "Failed to add comment.";

                    return;
                }


                message.textContent =
                    "Comment added successfully!";


                document.getElementById(
                    "commentText"
                ).value = "";


                loadComments(postId);


            } catch (error) {

                console.error(
                    "Add Comment Error:",
                    error
                );


                message.textContent =
                    "Unable to add comment.";

            }

        }
    );

}


// ==========================================
// EDIT POST
// ==========================================

const editPostForm =
    document.getElementById(
        "editPostForm"
    );


if (editPostForm) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const postId =
        params.get("id");


    const token =
        getAuthToken();


    const message =
        document.getElementById(
            "editPostMessage"
        );


    if (!token) {

        message.textContent =
            "Please login first.";

    }


    if (postId && token) {

        loadPostForEdit(postId);

    }


    editPostForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (!token) {

                message.textContent =
                    "Please login first.";

                return;
            }


            if (!postId) {

                message.textContent =
                    "Post ID is missing.";

                return;
            }


            const title =
                document.getElementById(
                    "title"
                ).value.trim();


            const content =
                document.getElementById(
                    "content"
                ).value.trim();


            const category =
                document.getElementById(
                    "category"
                ).value;


            const featuredImage =
                document.getElementById(
                    "featuredImage"
                ).value.trim();


            const status =
                document.getElementById(
                    "status"
                ).value;


            try {

                message.textContent =
                    "Updating post...";


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

                }, 1000);


            } catch (error) {

                console.error(
                    "Update Error:",
                    error
                );


                message.textContent =
                    "Unable to update post.";

            }

        }
    );

}


// ==========================================
// LOAD POST FOR EDIT
// ==========================================

async function loadPostForEdit(postId) {

    try {

        const response =
            await fetch(
                `${POSTS_API}/${postId}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            document.getElementById(
                "editPostMessage"
            ).textContent =
                data.message ||
                "Post not found.";

            return;
        }


        const post =
            data.post;


        document.getElementById(
            "title"
        ).value =
            post.title || "";


        document.getElementById(
            "content"
        ).value =
            post.content || "";


        document.getElementById(
            "category"
        ).value =
            post.category || "";


        document.getElementById(
            "featuredImage"
        ).value =
            post.featuredImage || "";


        document.getElementById(
            "status"
        ).value =
            post.status || "published";


    } catch (error) {

        console.error(
            "Load Edit Post Error:",
            error
        );

    }

}


// ==========================================
// DASHBOARD - GET MY POSTS
// ==========================================

async function loadDashboardPosts() {

    const container =
        document.getElementById(
            "myPostsContainer"
        );


    if (!container) {
        return;
    }


    const token =
        getAuthToken();


    if (!token) {

        window.location.href =
            "login.html";

        return;
    }


    const loading =
        document.getElementById(
            "dashboardLoading"
        );

    const errorMessage =
        document.getElementById(
            "dashboardError"
        );


    try {

        loading.style.display =
            "block";

        errorMessage.textContent =
            "";


        const response =
            await fetch(
                `${POSTS_API}/my-posts`,
                {

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }

                }
            );


        const data =
            await response.json();


        loading.style.display =
            "none";


        if (!response.ok) {

            errorMessage.textContent =
                data.message ||
                "Failed to load your posts.";

            return;
        }


        dashboardPosts =
            data.posts || [];


        displayDashboardPosts(
            dashboardPosts
        );


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );


        loading.style.display =
            "none";

        errorMessage.textContent =
            "Unable to load dashboard.";

    }

}


// ==========================================
// DASHBOARD POSTS STORAGE
// ==========================================

let dashboardPosts = [];


// ==========================================
// DISPLAY DASHBOARD POSTS
// ==========================================

function displayDashboardPosts(posts) {

    const container =
        document.getElementById(
            "myPostsContainer"
        );


    const noPosts =
        document.getElementById(
            "noMyPosts"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    if (!posts || posts.length === 0) {

        noPosts.style.display =
            "block";

        return;
    }


    noPosts.style.display =
        "none";


    posts.forEach(post => {

        const card =
            document.createElement("div");


        card.className =
            "dashboard-post-card";


        const statusClass =
            post.status === "published"
                ? "status-published"
                : "status-draft";


        const statusText =
            post.status === "published"
                ? "Published"
                : "Draft";


        card.innerHTML = `

            <h3>
                ${post.title}
            </h3>

            <span
                class="post-status ${statusClass}"
            >
                ${statusText}
            </span>

            <p>
                ${getShortContent(post.content)}
            </p>

            <p>
                <strong>Category:</strong>
                ${post.category}
            </p>

            <div class="dashboard-actions">

                <a
                    href="edit-post.html?id=${post._id}"
                    class="edit-btn"
                >
                    Edit
                </a>

                ${
                    post.status === "published"
                    ? `
                        <a
                            href="post.html?id=${post._id}"
                            class="btn btn-secondary"
                        >
                            View
                        </a>
                    `
                    : ""
                }

                <button
                    class="delete-btn"
                    onclick="deletePost('${post._id}')"
                >
                    Delete
                </button>

            </div>

        `;


        container.appendChild(card);

    });

}


// ==========================================
// DASHBOARD FILTER BUTTONS
// ==========================================

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


if (filterButtons.length > 0) {

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                const filter =
                    button.dataset.filter;


                filterDashboardPosts(
                    filter
                );

            }
        );

    });

}


// ==========================================
// FILTER DASHBOARD POSTS
// ==========================================

function filterDashboardPosts(filter) {

    let filteredPosts =
        dashboardPosts;


    if (filter === "published") {

        filteredPosts =
            dashboardPosts.filter(
                post =>
                    post.status === "published"
            );

    }


    if (filter === "draft") {

        filteredPosts =
            dashboardPosts.filter(
                post =>
                    post.status === "draft"
            );

    }


    displayDashboardPosts(
        filteredPosts
    );

}


// ==========================================
// DELETE POST
// ==========================================

async function deletePost(postId) {

    const token =
        getAuthToken();


    if (!token) {

        alert(
            "Please login first."
        );

        return;
    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this post?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${POSTS_API}/${postId}`,
                {

                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
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


        loadDashboardPosts();


    } catch (error) {

        console.error(
            "Delete Error:",
            error
        );


        alert(
            "Unable to delete post."
        );

    }

}


// ==========================================
// START HOME PAGE
// ==========================================

if (
    document.getElementById(
        "postsContainer"
    )
) {

    loadPosts();

}


// ==========================================
// START SINGLE POST PAGE
// ==========================================

if (
    document.getElementById(
        "singlePost"
    )
) {

    loadSinglePost();

}


// ==========================================
// START DASHBOARD
// ==========================================

if (
    document.getElementById(
        "myPostsContainer"
    )
) {

    loadDashboardPosts();

}