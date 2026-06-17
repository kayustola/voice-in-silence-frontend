let allPosts = [];
const container = document.querySelector(".articles .container");

async function loadPosts() {
  const slug = new URLSearchParams(window.location.search).get("slug");

  const res = await fetch("https://voice-in-silence-api.onrender.com/posts/");
  const posts = await res.json();
  allPosts = posts;

 // ======================
// SINGLE ARTICLE VIEW
// ======================
if (slug) {
  const post = posts.find(p => p.slug === slug);
  if (!post) return;

  const commentsRes = await fetch(`https://voice-in-silence-api.onrender.com/comments/?post=${post.id}`);
  const comments = await commentsRes.json();

  container.innerHTML = `
    <section class="article-page">
      <div class="article-content">

        <a href="articles.html" class="back-btn">← Back to Articles</a>

        <div class="article-meta">
          <span class="category">${post.category || "General"}</span>
          <span class="date">${new Date(post.created_at).toLocaleDateString()}</span>
        </div>

        ${post.featured_image ? `
          <img src="${post.featured_image}" class="article-img" />
        ` : `
          <div class="article-img-placeholder"></div>
        `}

        <h1>${post.title}</h1>

        <div class="article-body">
          ${post.content ? post.content.replace(/\n/g, "<br>") : ""}
        </div>

        <!-- COMMENTS SECTION -->
        <div class="comments-section">
          <h3>Comments</h3>

          <form id="commentForm">
            <input type="text" id="name" placeholder="Your name" required />
            <textarea id="message" placeholder="Write a comment..." required></textarea>
            <button type="submit">Post Comment</button>
          </form>

          <div id="commentsList">
            ${renderComments(comments)}
          </div>
        </div>

      </div>
    </section>
  `;

  // COMMENT SUBMIT
  const form = document.querySelector("#commentForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value;
    const message = document.querySelector("#message").value;

    await fetch("https://voice-in-silence-api.onrender.com/comments/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post: post.id,
        name,
        message
      })
    });

    location.reload();
  });

  return;
}
  // ======================
  // LIST VIEW
  // ======================
  container.innerHTML = `
    <div class="cards">
      ${posts.map(post => `
        <div class="card">
          <h4>${post.title}</h4>
          <p class="category">${post.category || "General"}</p>
          <p>${(post.content || "").slice(0, 120)}...</p>
          <a href="articles.html?slug=${post.slug}">Read More</a>
        </div>
      `).join("")}
    </div>
  `;
}

loadPosts();


// ======================
// COMMENT RENDER
// ======================
function renderComments(comments) {
  if (!comments.length) return "<p>No comments yet.</p>";

  return comments.map(c => `
    <div class="comment" data-id="${c.id}">
      <div class="comment-header">
        <strong>${c.name}</strong>

        <div class="comment-actions">
          <button onclick="editComment(${c.id}, \`${(c.message || "").replace(/`/g, "\\`")}\`)">Edit</button>
          <button onclick="deleteComment(${c.id})">Delete</button>
        </div>
      </div>

      <p>${c.message}</p>
    </div>
  `).join("");
}


// ======================
// DELETE COMMENT
// ======================
async function deleteComment(id) {
  await fetch(`https://voice-in-silence-api.onrender.com/comments/${id}/delete/`, {
    method: "DELETE"
  });

  location.reload();
}


// ======================
// EDIT COMMENT
// ======================
async function editComment(id, oldMessage) {
  const newMessage = prompt("Edit comment:", oldMessage);

  if (!newMessage) return;

  await fetch(`https://voice-in-silence-api.onrender.com/comments/${id}/edit/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: newMessage
    })
  });

  location.reload();
}


// ======================
// SCROLL PROGRESS
// ======================
window.addEventListener("scroll", () => {
  const progressBar = document.querySelector(".read-progress");
  if (!progressBar) return;

  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;

  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + "%";
});


// ======================
// THEME TOGGLE
// ======================
const toggle = document.querySelector("#themeToggle");

if (toggle) {
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      toggle.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    } else {
      toggle.textContent = "🌙";
      localStorage.setItem("theme", "light");
    }
  });

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    toggle.textContent = "☀️";
  }
}


// ======================
// SEARCH
// ======================
const searchInput = document.querySelector("#searchInput");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();

    const filtered = allPosts.filter(post =>
      (post.title || "").toLowerCase().includes(value) ||
      (post.content || "").toLowerCase().includes(value)
    );

    container.innerHTML = `
      <div class="cards">
        ${filtered.map(post => `
          <div class="card">
            <h4>${post.title}</h4>
            <p>${(post.content || "").slice(0, 120)}...</p>
            <a href="articles.html?slug=${post.slug}">Read More</a>
          </div>
        `).join("")}
      </div>
    `;
  });
}


// ======================
// CATEGORY (optional fallback)
// ======================
function renderCategory(post) {
  return post.category || "General";
}