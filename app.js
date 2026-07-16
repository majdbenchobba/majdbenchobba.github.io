const filters = [
  { id: "all", label: "All projects" },
  { id: "creative", label: "Creative" },
  { id: "code", label: "Code" },
];

const projects = [
  {
    name: "Design and Video Portfolio",
    type: "creative",
    typeLabel: "Creative",
    status: "Live site",
    summary:
      "GitHub Pages portfolio for campaign systems, event visuals, and editorial PDF work.",
    tags: ["GitHub Pages", "Portfolio", "Design"],
    repoUrl: "https://github.com/majdbenchobba/design-and-video-portfolio",
    liveUrl: "https://majdbenchobba.github.io/design-and-video-portfolio/",
    featured: true,
  },
  {
    name: "Binance Futures Bot",
    type: "code",
    typeLabel: "Code",
    status: "Testnet verified",
    summary:
      "Testnet-first Binance Futures bot with dry runs, reporting, protection logic, and paper-run support.",
    tags: ["Python", "Trading", "Automation"],
    repoUrl: "https://github.com/majdbenchobba/binance-futures-bot",
  },
  {
    name: "AI Web Scraper",
    type: "code",
    typeLabel: "Code",
    status: "Published utility",
    summary:
      "Python scraper for product pages with CSV export and simple summary charts.",
    tags: ["Python", "Scraping", "CLI"],
    repoUrl: "https://github.com/majdbenchobba/ai-web-scraper",
  },
  {
    name: "Trade Export Normalizer",
    type: "code",
    typeLabel: "Code",
    status: "Published utility",
    summary:
      "CLI tool that normalizes broker and exchange trade CSV exports for later analysis.",
    tags: ["Python", "CSV", "Tooling"],
    repoUrl: "https://github.com/majdbenchobba/trade-export-normalizer",
  },
  {
    name: "YT Music Downloader",
    type: "code",
    typeLabel: "Code",
    status: "Published utility",
    summary:
      "Utility for saving YouTube or YouTube Music audio as WAV files.",
    tags: ["Python", "Audio", "Utility"],
    repoUrl: "https://github.com/majdbenchobba/ytmusic-downloader",
  },
];

const state = { activeFilter: "all" };

const filterRow = document.querySelector("#filter-row");
const projectGrid = document.querySelector("#project-grid");

function filteredProjects() {
  return state.activeFilter === "all"
    ? projects
    : projects.filter((project) => project.type === state.activeFilter);
}

function renderFilters() {
  filterRow.innerHTML = "";

  filters.forEach((filter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-chip${state.activeFilter === filter.id ? " is-active" : ""}`;
    button.textContent = filter.label;
    button.addEventListener("click", () => {
      state.activeFilter = filter.id;
      renderFilters();
      renderProjects();
    });
    filterRow.appendChild(button);
  });
}

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";

  const links = [
    `<a class="project-link" href="${project.repoUrl}" target="_blank" rel="noreferrer">Open repo</a>`,
  ];

  if (project.liveUrl) {
    links.unshift(
      `<a class="project-link" href="${project.liveUrl}" target="_blank" rel="noreferrer">Open live site</a>`
    );
  }

  card.innerHTML = `
    <div class="project-meta">
      <span class="project-type">${project.typeLabel}</span>
      <span class="project-status">${project.status}</span>
    </div>
    <h3>${project.name}</h3>
    <p class="project-summary">${project.summary}</p>
    <div class="project-tags">
      ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
    </div>
    <div class="project-links">${links.join("")}</div>
  `;

  return card;
}

function renderProjects() {
  const visibleProjects = filteredProjects();
  projectGrid.innerHTML = "";
  projectGrid.className = "project-grid";
  projectGrid.classList.add(`count-${visibleProjects.length}`);

  visibleProjects.forEach((project) => {
    projectGrid.appendChild(createProjectCard(project));
  });
}

renderFilters();
renderProjects();

const biasforgeNavMenu = document.querySelector(".biasforge-nav-menu");

if (biasforgeNavMenu) {
  document.addEventListener("click", (event) => {
    if (!biasforgeNavMenu.contains(event.target)) {
      biasforgeNavMenu.removeAttribute("open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      biasforgeNavMenu.removeAttribute("open");
    }
  });
}
