const projects = [
  {
    name: "Binance Futures Bot",
    summary: "Binance Futures SMA-crossover bot with testnet execution, dry runs, reporting, protection logic, and paper trading.",
    tags: ["Python", "Trading", "Automation"],
    repoUrl: "https://github.com/majdbenchobba/binance-futures-bot",
  },
  {
    name: "AI Web Scraper",
    summary: "Python scraper for structured product-page extraction, CSV export, and summary charts.",
    tags: ["Python", "Scraping", "CLI"],
    repoUrl: "https://github.com/majdbenchobba/ai-web-scraper",
  },
  {
    name: "Trade Export Normalizer",
    summary: "CLI tool for cleaning and normalizing broker or exchange trade exports into a consistent CSV format.",
    tags: ["Python", "CSV", "Tooling"],
    repoUrl: "https://github.com/majdbenchobba/trade-export-normalizer",
  },
  {
    name: "YT Music Downloader",
    summary: "Utility for saving YouTube or YouTube Music audio as WAV files.",
    tags: ["Python", "Audio", "Utility"],
    repoUrl: "https://github.com/majdbenchobba/ytmusic-downloader",
  },
];

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";

  // Content is curated locally; this renderer does not consume external data.
  card.innerHTML = `
    <div class="project-meta"><span class="project-type">Public repository</span></div>
    <h3>${project.name}</h3>
    <p class="project-summary">${project.summary}</p>
    <div class="project-tags">
      ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
    </div>
    <div class="project-links">
      <a class="project-link" href="${project.repoUrl}" target="_blank" rel="noreferrer" aria-label="Open ${project.name} repository">Open repo</a>
    </div>
  `;
  return card;
}

const projectGrid = document.querySelector("#project-grid");
if (projectGrid) {
  projectGrid.replaceChildren(...projects.map(createProjectCard));
  projectGrid.classList.add(`count-${projects.length}`);
}

// Preserve dropdown behavior on any case-study pages using this script.
const projectNavMenus = [...document.querySelectorAll(".project-nav-menu")];
projectNavMenus.forEach((menu) => {
  menu.addEventListener("toggle", () => {
    if (menu.open) {
      projectNavMenus.forEach((other) => {
        if (other !== menu) other.removeAttribute("open");
      });
    }
  });
});
if (projectNavMenus.length) {
  document.addEventListener("click", (event) => {
    projectNavMenus.forEach((menu) => {
      if (!menu.contains(event.target)) menu.removeAttribute("open");
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      projectNavMenus.forEach((menu) => menu.removeAttribute("open"));
    }
  });
}
