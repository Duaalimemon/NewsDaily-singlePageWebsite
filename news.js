const apiKey = "c9ee895820c741a3b23f991f6f30f373"; // apna API key
const country = "us";

const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");
const categoryBtns = document.querySelectorAll(".category-btn");
const newsGrid = document.getElementById("newsGrid");
const loadingEl = document.getElementById("loading");

// ----------------------
// Show/Hide Sections
// ----------------------
function showSection(id) {
  // sab hide
  sections.forEach(s => s.classList.remove("active"));

  // agar News section se hatt rahe hain → usko clear karo
  if (id !== "news") {
    newsGrid.innerHTML = "";
    loadingEl.style.display = "none";
    categoryBtns.forEach(b => b.classList.remove("active"));
  }

  // show selected section
  const target = document.getElementById(id);
  if (target) target.classList.add("active");

  // nav active highlight
  navLinks.forEach(a => a.classList.toggle("active", a.dataset.section === id));
}

// ----------------------
// Nav clicks
// ----------------------
document.getElementById("mainNav").addEventListener("click", function (e) {
  const a = e.target.closest(".nav-link");
  if (!a) return;
  e.preventDefault();
  showSection(a.dataset.section);
});

// ----------------------
// Category clicks
// ----------------------
document.getElementById("categories").addEventListener("click", function (e) {
  const btn = e.target.closest(".category-btn");
  if (!btn) return;

  const cat = btn.dataset.category || "general";

  categoryBtns.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  showSection("news");
  fetchNews(cat);
});

// ----------------------
// Fetch news
// ----------------------
async function fetchNews(category = "general") {
  newsGrid.innerHTML = "";
  loadingEl.style.display = "block";

  try {
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${encodeURIComponent(category)}&apiKey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    loadingEl.style.display = "none";

    if (!data.articles?.length) {
      newsGrid.innerHTML = "<p>No articles found.</p>";
      return;
    }

    renderArticles(data.articles);
  } catch (err) {
    loadingEl.style.display = "none";
    console.error("Fetch error:", err);
    newsGrid.innerHTML = "<p>Error loading news.</p>";
  }
}

// ----------------------
// Render news cards
// ----------------------
function renderArticles(articles) {
  newsGrid.innerHTML = "";
  for (const art of articles) {
    const img = art.urlToImage || "https://via.placeholder.com/800x400?text=No+Image";
    const card = document.createElement("article");
    card.className = "news-card";
    card.innerHTML = `
      <img class="news-image" src="${img}" alt="${escapeHtml(art.title || '')}" />
      <h3>${escapeHtml(art.title || 'No title')}</h3>
      <p>${escapeHtml(art.description || '')}</p>
      <div style="margin-top:8px;display:flex;gap:8px;align-items:center;justify-content:space-between">
        <small>${escapeHtml(art.source?.name || '')} • ${new Date(art.publishedAt || '').toLocaleDateString()}</small>
        <a class="read-more" href="${art.url || '#'}" target="_blank" rel="noopener">Read</a>
      </div>
    `;
    newsGrid.appendChild(card);
  }
}

function escapeHtml(text) {
  return text ? text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;") : "";
}

// ----------------------
// Default load
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  showSection("home");      // pehle Home dikhayega
  fetchNews("general");     // default General news
});

// ----------------------
// Toggle navbar (mobile bars)
// ----------------------
function toggleMenu() {
  document.getElementById("mainNav").classList.toggle("show");
}


document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    // sab sections hide
    document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));

    // jis section pe click hua use active karo
    const sectionId = this.getAttribute("data-section");
    document.getElementById(sectionId).classList.add("active");

    // mobile menu close
    document.getElementById("mainNav").classList.remove("show");
  });
});
