// 🔁 Rotating Quotes
const quotes = [
  "You're not behind — you're being built.",
  "Discipline and accountablity creates freedom.",
  "Silent growth makes the loudest impact.",
  "Purpose doesn’t shout — it moves in quiet conviction.",
  "Voice in silence speaks louder than noise.",
  "Manhood begins where excuses end.",
  "Being a man isn’t about dominance. It’s about responsibility.",
  "A man doesn't prove himself by reacting — he proves himself by remaining.",
  "You can't conquer the world if you haven't conquered your own urges.",
  "True masculinity is quiet strength backed by unshakable values.",
  "Provision isn’t just money — it’s presence, protection, and perspective.",
  "A boy wants to be seen. A man builds in silence.",
  "Masculinity isn’t toxic — immaturity is.",
  "Real men create structure. Weak men create chaos.",
  "Emotions don’t make you weak. Lack of control does.",
];

let index = 0;
const quoteElement = document.getElementById("rotating-quote");

setInterval(() => {
  index = (index + 1) % quotes.length;
  quoteElement.textContent = `"${quotes[index]}"`;
}, 5000);

// 🔎 Scroll Reveal Animation
const reveals = document.querySelectorAll(".reveal");

function revealElements() {
  for (let el of reveals) {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("visible");
    }
  }
}

window.addEventListener("scroll", revealElements);
window.addEventListener("load", revealElements);

// ⬆️ Scroll-To-Top Button
const scrollBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


async function loadPosts() {
    try {
        const response = await fetch("https://voice-in-silence-api.onrender.com/posts/");
        const posts = await response.json();

        const container = document.querySelector(".cards");

        container.innerHTML = "";

        posts.forEach(post => {
            container.innerHTML += `
                <div class="card">
                    <h4>${post.title}</h4>
                    <p>${post.excerpt}</p>
                    <a href="articles.html?slug=${post.slug}">Read More</a>
                </div>
            `;
        });

    } catch (error) {
        console.log("Error:", error);
    }
}

loadPosts();