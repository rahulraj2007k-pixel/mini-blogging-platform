 // ==========================================
// API CONFIGURATION
// ==========================================

const BASE_URL =
    "https://mini-blogging-platform-br6r.onrender.com";

const POSTS_API =
    `${BASE_URL}/api/posts`;

const COMMENTS_API =
    `${BASE_URL}/api/comments`;


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

    const user =
        localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {

        return JSON.parse(user);

    } catch (error) {

        return null;

    }

}


// ==========================================
// CREATE POST
// ==========================================

const createPostForm =
    document.getElementById("createPostForm");


if (createPostForm) {

    createPostForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const token =
                getToken();


            if (!token) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "login.html";

                return;

            }


            const title =
                document
                    .getElementById("title")
                    .value
                    .trim();


            const content =
                document
                    .getElementById("content")
                    .value
                    .trim();


            const categoryElement =
                document.getElementById(
                    "category"
                );


            const category =
                categoryElement
                    ? categoryElement.value
                    : "General";


            const imageElement =
                document.getElementById(
                    "featuredImage"
                );


            const featuredImage =
                imageElement
                    ? imageElement.value.trim()
                    : "";


            const statusElement =
                document.getElementById(
                    "status"
                );


            const status =
                statusElement
                    ? statusElement.value
                    : "published";


            const message =
                document.getElementById(
                    "createPostMessage"
                );


            if (message) {

                message.textContent =
                    "Creating post...";

            }


            try {

                const response =
                    await fetch(
                        POSTS_API,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify({

                                    title:
                                        title,

                                    content:
                                        content,

                                    category:
                                        category,

                                    featuredImage:
                                        featuredImage,

                                    status:
                                        status

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to create post."
                    );

                }


                if (message) {

                    message.textContent =
                        "Post created successfully!";

                }


                alert(
                    "Post created successfully!"
                );


                window.location.href =
                    "dashboard.html";


            } catch (error) {

                console.error(
                    "Create Post Error:",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message;

                } else {

                    alert(
                        error.message
                    );

                }

            }

        }
    );

}


// ==========================================
// LOAD MY POSTS - DASHBOARD
// ==========================================

async function loadMyPosts(
    filter = "all"
) {

    const token =
        getToken();


    const postsContainer =
        document.getElementById(
            "postsContainer"
        );


    const loading =
        document.getElementById(
            "dashboardLoading"
        );


    const errorElement =
        document.getElementById(
            "dashboardError"
        );


    const noPosts =
        document.getElementById(
            "noMyPosts"
        );


    if (!postsContainer) {

        return;

    }


    if (!token) {

        window.location.href =
            "login.html";

        return;

    }


    if (loading) {

        loading.style.display =
            "block";

    }


    if (errorElement) {

        errorElement.textContent =
            "";

    }


    try {

        const response =
            await fetch(
                `${POSTS_API}/my-posts`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

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


        let posts =
            Array.isArray(data)
                ? data
                : data.posts || [];


        // ======================================
        // FILTER
        // ======================================

        if (
            filter === "published"
        ) {

            posts =
                posts.filter(
                    post =>
                        post.status ===
                        "published"
                );

        }


        if (
            filter === "draft"
        ) {

            posts =
                posts.filter(
                    post =>
                        post.status ===
                        "draft"
                );

        }


        if (
            posts.length === 0
        ) {

            postsContainer.innerHTML =
                "";


            if (noPosts) {

                noPosts.style.display =
                    "block";

            }

        } else {

            if (noPosts) {

                noPosts.style.display =
                    "none";

            }


            displayPosts(
                posts,
                postsContainer
            );

        }


    } catch (error) {

        console.error(
            "Load My Posts Error:",
            error
        );


        if (errorElement) {

            errorElement.textContent =
                error.message;

        }


    } finally {

        if (loading) {

            loading.style.display =
                "none";

        }

    }

}


// ==========================================
// LOAD ALL PUBLISHED POSTS - HOME PAGE
// ==========================================

async function loadPosts() {

    const postsContainer =
        document.getElementById(
            "postsContainer"
        );


    if (!postsContainer) {

        return;

    }


    const loadingMessage =
        document.getElementById(
            "loadingMessage"
        );


    const noPostsMessage =
        document.getElementById(
            "noPostsMessage"
        );


    const errorMessage =
        document.getElementById(
            "errorMessage"
        );


    // Loading

    if (loadingMessage) {

        loadingMessage.style.display =
            "block";

    }


    if (noPostsMessage) {

        noPostsMessage.style.display =
            "none";

    }


    if (errorMessage) {

        errorMessage.textContent =
            "";

    }


    try {

        const response =
            await fetch(
                POSTS_API
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load posts."
            );

        }


        let posts =
            Array.isArray(data)
                ? data
                : data.posts || [];


        // ======================================
        // HOME PAGE ONLY SHOW PUBLISHED POSTS
        // ======================================

        posts =
            posts.filter(
                post =>
                    post.status ===
                    "published"
            );


        if (loadingMessage) {

            loadingMessage.style.display =
                "none";

        }


        if (
            posts.length === 0
        ) {

            postsContainer.innerHTML =
                "";


            if (noPostsMessage) {

                noPostsMessage.style.display =
                    "block";

            } else {

                postsContainer.innerHTML = `

                    <div class="no-posts">

                        <h3>
                            No blogs found
                        </h3>

                        <p>
                            There are no published
                            blogs available.
                        </p>

                    </div>

                `;

            }


            return;

        }


        displayPosts(
            posts,
            postsContainer
        );


    } catch (error) {

        console.error(
            "Load Posts Error:",
            error
        );


        if (loadingMessage) {

            loadingMessage.style.display =
                "none";

        }


        if (errorMessage) {

            errorMessage.textContent =
                "Unable to load blogs.";

        } else {

            postsContainer.innerHTML = `

                <div class="error-message">

                    Unable to load blogs.

                </div>

            `;

        }

    }

}


// ==========================================
// DISPLAY POSTS
// ==========================================

function displayPosts(
    posts,
    container
) {

    if (!container) {

        return;

    }


    // ======================================
    // NO POSTS
    // ======================================

    if (
        !posts ||
        posts.length === 0
    ) {

        container.innerHTML = `

            <div class="no-posts">

                <h3>
                    No posts yet
                </h3>

                <p>
                    No blog posts found.
                </p>

            </div>

        `;

        return;

    }


    // Clear

    container.innerHTML =
        "";


    // Dashboard check

    const isDashboard =
        window.location.pathname
            .includes(
                "dashboard.html"
            );


    // ======================================
    // CREATE EACH POST CARD
    // ======================================

    posts.forEach(
        post => {

            const postCard =
                document.createElement(
                    "div"
                );


            postCard.className =
                "post-card";


            // ==================================
            // IMAGE
            // ==================================

            const imageHTML =
                post.featuredImage
                    ? `

                        <img
                            src="${escapeHTML(
                                post.featuredImage
                            )}"
                            alt="${escapeHTML(
                                post.title ||
                                "Blog image"
                            )}"
                            class="post-card-image"
                            onerror="
                                this.style.display='none';
                            "
                        >

                    `
                    : `

                        <div
                            class="post-card-image no-image"
                        >
                            Mini Blog
                        </div>

                    `;


            // ==================================
            // AUTHOR
            // ==================================

            const authorName =
                post.author?.name ||
                post.authorName ||
                "Anonymous";


            // ==================================
            // DATE
            // ==================================

            const date =
                post.createdAt
                    ? new Date(
                        post.createdAt
                    ).toLocaleDateString()
                    : "";


            // ==================================
            // CATEGORY
            // ==================================

            const category =
                escapeHTML(
                    post.category ||
                    "General"
                );


            // ==================================
            // STATUS
            // ==================================

            const status =
                post.status
                    ? escapeHTML(
                        post.status
                    )
                    : "";


            // ==================================
            // DASHBOARD ACTIONS
            // ==================================

            const dashboardActions =
                isDashboard
                    ? `

                        <a
                            href="
                                edit-post.html?id=${post._id}
                            "
                            class="btn btn-primary"
                        >
                            ✏️ Edit
                        </a>


                        <button
                            class="btn btn-danger"
                            onclick="
                                deletePost('${post._id}')
                            "
                        >
                            🗑️ Delete
                        </button>

                    `
                    : "";


            // ==================================
            // SHORT CONTENT
            // ==================================

            const shortContent =
                (
                    post.content ||
                    ""
                ).substring(
                    0,
                    150
                );


            const contentSuffix =
                post.content &&
                post.content.length > 150
                    ? "..."
                    : "";


            // ==================================
            // COMPLETE POST CARD
            // ==================================

            postCard.innerHTML = `

                ${imageHTML}


                <div
                    class="post-card-content"
                >


                    <span
                        class="post-category"
                    >

                        ${category}

                    </span>


                    <h3>

                        ${escapeHTML(
                            post.title ||
                            "Untitled Post"
                        )}

                    </h3>


                    <p>

                        ${escapeHTML(
                            shortContent
                        )}

                        ${contentSuffix}

                    </p>


                    <div
                        class="post-meta"
                    >

                        <span>

                            By
                            ${escapeHTML(
                                authorName
                            )}

                        </span>


                        <span>

                            ${date}

                        </span>

                    </div>


                    <div
                        class="post-actions"
                    >


                        <button
                            class="btn btn-primary"
                            onclick="
                                viewPost('${post._id}')
                            "
                        >
                            📖 Read More
                        </button>


                        ${dashboardActions}


                        ${
                            status
                                ? `

                                    <span
                                        class="post-status"
                                    >
                                        ${status}
                                    </span>

                                `
                                : ""
                        }


                    </div>


                </div>

            `;


            container.appendChild(
                postCard
            );

        }
    );

}


// ==========================================
// VIEW SINGLE POST
// ==========================================

function viewPost(
    postId
) {

    window.location.href =
        `post.html?id=${postId}`;

}


// ==========================================
// LOAD SINGLE POST
// ==========================================

async function loadSinglePost() {

    const container =
        document.getElementById(
            "singlePost"
        );


    if (!container) {

        return;

    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const postId =
        params.get("id");


    if (!postId) {

        container.innerHTML = `

            <div class="error-message">

                Post ID not found.

            </div>

        `;

        return;

    }


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
                "Post not found."
            );

        }


        const post =
            data.post ||
            data;


        const authorName =
            post.author?.name ||
            post.authorName ||
            "Anonymous";


        const date =
            post.createdAt
                ? new Date(
                    post.createdAt
                ).toLocaleDateString()
                : "";


        const imageHTML =
            post.featuredImage
                ? `

                    <img
                        src="${escapeHTML(
                            post.featuredImage
                        )}"
                        alt="${escapeHTML(
                            post.title ||
                            "Blog image"
                        )}"
                        class="single-post-image"
                    >

                `
                : "";


        container.innerHTML = `

            ${imageHTML}


            <article
                class="single-post-content"
            >


                <span
                    class="post-category"
                >

                    ${escapeHTML(
                        post.category ||
                        "General"
                    )}

                </span>


                <h1>

                    ${escapeHTML(
                        post.title ||
                        "Untitled Post"
                    )}

                </h1>


                <div
                    class="post-meta"
                >

                    <span>

                        By
                        ${escapeHTML(
                            authorName
                        )}

                    </span>


                    <span>

                        ${date}

                    </span>

                </div>


                <div
                    class="post-content"
                >

                    ${escapeHTML(
                        post.content ||
                        ""
                    ).replace(
                        /\n/g,
                        "<br>"
                    )}

                </div>


            </article>

        `;


        loadComments(
            postId
        );


    } catch (error) {

        console.error(
            "Load Single Post Error:",
            error
        );


        container.innerHTML = `

            <div
                class="error-message"
            >

                ${escapeHTML(
                    error.message
                )}

            </div>

        `;

    }

}


// ==========================================
// SEARCH POSTS
// ==========================================

async function searchPosts(
    query
) {

    const container =
        document.getElementById(
            "postsContainer"
        );


    if (!container) {

        return;

    }


    if (!query) {

        loadPosts();

        return;

    }


    try {

        const response =
            await fetch(
                `${POSTS_API}/search/posts?query=${encodeURIComponent(
                    query
                )}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Search failed."
            );

        }


        let posts =
            Array.isArray(data)
                ? data
                : data.posts || [];


        // Home page should only show published

        const isHome =
            !window.location.pathname
                .includes(
                    "dashboard"
                );


        if (isHome) {

            posts =
                posts.filter(
                    post =>
                        post.status ===
                        "published"
                );

        }


        displayPosts(
            posts,
            container
        );


    } catch (error) {

        console.error(
            "Search Error:",
            error
        );


        container.innerHTML = `

            <div
                class="error-message"
            >

                Search failed.

            </div>

        `;

    }

}


// ==========================================
// FILTER BY CATEGORY
// ==========================================

async function filterByCategory(
    category
) {

    const container =
        document.getElementById(
            "postsContainer"
        );


    if (!container) {

        return;

    }


    if (
        !category ||
        category === "all"
    ) {

        loadPosts();

        return;

    }


    try {

        const response =
            await fetch(
                `${POSTS_API}/category/${encodeURIComponent(
                    category
                )}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Category filter failed."
            );

        }


        let posts =
            Array.isArray(data)
                ? data
                : data.posts || [];


        // Home page only published

        const isHome =
            !window.location.pathname
                .includes(
                    "dashboard"
                );


        if (isHome) {

            posts =
                posts.filter(
                    post =>
                        post.status ===
                        "published"
                );

        }


        displayPosts(
            posts,
            container
        );


    } catch (error) {

        console.error(
            "Category Error:",
            error
        );


        container.innerHTML = `

            <div
                class="error-message"
            >

                Unable to filter posts.

            </div>

        `;

    }

}


// ==========================================
// DELETE POST
// ==========================================

async function deletePost(
    postId
) {

    const token =
        getToken();


    if (!token) {

        alert(
            "Please login first."
        );

        window.location.href =
            "login.html";

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this post?"
        );


    if (!confirmed) {

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

            throw new Error(
                data.message ||
                "Failed to delete post."
            );

        }


        alert(
            "Post deleted successfully!"
        );


        loadMyPosts(
            "all"
        );


    } catch (error) {

        console.error(
            "Delete Post Error:",
            error
        );


        alert(
            error.message
        );

    }

}


// ==========================================
// LOAD COMMENTS
// ==========================================

async function loadComments(
    postId
) {

    const commentsContainer =
        document.getElementById(
            "commentsContainer"
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

            throw new Error(
                data.message ||
                "Failed to load comments."
            );

        }


        const comments =
            Array.isArray(data)
                ? data
                : data.comments || [];


        if (
            comments.length === 0
        ) {

            commentsContainer.innerHTML = `

                <p>
                    No comments yet.
                </p>

            `;

            return;

        }


        commentsContainer.innerHTML =
            comments
                .map(
                    comment => `

                        <div
                            class="comment"
                        >

                            <strong>

                                ${escapeHTML(
                                    comment.author?.name ||
                                    comment.authorName ||
                                    "Anonymous"
                                )}

                            </strong>


                            <p>

                                ${escapeHTML(
                                    comment.text ||
                                    ""
                                )}

                            </p>

                        </div>

                    `
                )
                .join("");


    } catch (error) {

        console.error(
            "Load Comments Error:",
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

    commentForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const token =
                getToken();


            if (!token) {

                alert(
                    "Please login to comment."
                );

                window.location.href =
                    "login.html";

                return;

            }


            const params =
                new URLSearchParams(
                    window.location.search
                );


            const postId =
                params.get("id");


            const commentInput =
                document.getElementById(
                    "commentText"
                );


            if (!commentInput) {

                return;

            }


            const text =
                commentInput.value.trim();


            if (!text) {

                alert(
                    "Please enter a comment."
                );

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

                            body:
                                JSON.stringify({
                                    text: text
                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to add comment."
                    );

                }


                commentInput.value =
                    "";


                loadComments(
                    postId
                );


            } catch (error) {

                console.error(
                    "Add Comment Error:",
                    error
                );


                alert(
                    error.message
                );

            }

        }
    );

}


// ==========================================
// LOAD EDIT POST
// ==========================================

async function loadEditPost() {

    const editForm =
        document.getElementById(
            "editPostForm"
        );


    if (!editForm) {

        return;

    }


    const token =
        getToken();


    if (!token) {

        window.location.href =
            "login.html";

        return;

    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const postId =
        params.get("id");


    if (!postId) {

        alert(
            "Post ID not found."
        );

        return;

    }


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
                "Failed to load post."
            );

        }


        const post =
            data.post ||
            data;


        const titleElement =
            document.getElementById(
                "title"
            );


        if (titleElement) {

            titleElement.value =
                post.title || "";

        }


        const contentElement =
            document.getElementById(
                "content"
            );


        if (contentElement) {

            contentElement.value =
                post.content || "";

        }


        const categoryElement =
            document.getElementById(
                "category"
            );


        if (categoryElement) {

            categoryElement.value =
                post.category || "";

        }


        const imageElement =
            document.getElementById(
                "featuredImage"
            );


        if (imageElement) {

            imageElement.value =
                post.featuredImage || "";

        }


        const statusElement =
            document.getElementById(
                "status"
            );


        if (statusElement) {

            statusElement.value =
                post.status ||
                "published";

        }


    } catch (error) {

        console.error(
            "Load Edit Post Error:",
            error
        );


        alert(
            error.message
        );

    }

}


// ==========================================
// UPDATE POST
// ==========================================

const editPostForm =
    document.getElementById(
        "editPostForm"
    );


if (editPostForm) {

    editPostForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const token =
                getToken();


            if (!token) {

                window.location.href =
                    "login.html";

                return;

            }


            const params =
                new URLSearchParams(
                    window.location.search
                );


            const postId =
                params.get("id");


            if (!postId) {

                alert(
                    "Post ID not found."
                );

                return;

            }


            const title =
                document
                    .getElementById(
                        "title"
                    )
                    .value
                    .trim();


            const content =
                document
                    .getElementById(
                        "content"
                    )
                    .value
                    .trim();


            const categoryElement =
                document.getElementById(
                    "category"
                );


            const category =
                categoryElement
                    ? categoryElement.value
                    : "";


            const imageElement =
                document.getElementById(
                    "featuredImage"
                );


            const featuredImage =
                imageElement
                    ? imageElement.value.trim()
                    : "";


            const statusElement =
                document.getElementById(
                    "status"
                );


            const status =
                statusElement
                    ? statusElement.value
                    : "published";


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

                            body:
                                JSON.stringify({

                                    title:
                                        title,

                                    content:
                                        content,

                                    category:
                                        category,

                                    featuredImage:
                                        featuredImage,

                                    status:
                                        status

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to update post."
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


                alert(
                    error.message
                );

            }

        }
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================
// DOM CONTENT LOADED
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const path =
            window.location.pathname;


        // ======================================
        // HOME PAGE
        // ======================================

        if (
            path.endsWith(
                "index.html"
            ) ||
            path.endsWith("/")
        ) {

            if (
                document.getElementById(
                    "postsContainer"
                )
            ) {

                loadPosts();

            }

        }


        // ======================================
        // DASHBOARD
        // ======================================

        if (
            path.includes(
                "dashboard"
            )
        ) {

            if (
                document.getElementById(
                    "postsContainer"
                )
            ) {

                loadMyPosts(
                    "all"
                );

            }

        }


        // ======================================
        // DASHBOARD FILTER BUTTONS
        // ======================================

        const filterButtons =
            document.querySelectorAll(
                ".filter-btn"
            );


        filterButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        // Remove active
                        filterButtons.forEach(
                            btn => {

                                btn.classList.remove(
                                    "active"
                                );

                            }
                        );


                        // Add active
                        this.classList.add(
                            "active"
                        );


                        const filter =
                            this.dataset.filter;


                        if (
                            filter ===
                            "all"
                        ) {

                            loadMyPosts(
                                "all"
                            );

                        }


                        else if (
                            filter ===
                            "published"
                        ) {

                            loadMyPosts(
                                "published"
                            );

                        }


                        else if (
                            filter ===
                            "draft"
                        ) {

                            loadMyPosts(
                                "draft"
                            );

                        }

                    }
                );

            }
        );


        // ======================================
        // SINGLE POST
        // ======================================

        if (
            path.includes(
                "post.html"
            )
        ) {

            loadSinglePost();

        }


        // ======================================
        // EDIT POST
        // ======================================

        if (
            path.includes(
                "edit-post.html"
            )
        ) {

            loadEditPost();

        }

    }
);