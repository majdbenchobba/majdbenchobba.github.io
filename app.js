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
      "A dedicated GitHub Pages portfolio for design and communication work, featuring campaign systems, event posters, quote formats, and downloadable PDF pieces.",
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
      "A testnet-first Binance Futures SMA crossover bot with hardening work around dry runs, reporting, protection logic, and paper-run support.",
    tags: ["Python", "Trading", "Automation"],
    repoUrl: "https://github.com/majdbenchobba/binance-futures-bot",
  },
  {
    name: "AI Web Scraper",
    type: "code",
    typeLabel: "Code",
    status: "Published utility",
    summary:
      "A small Python scraper for product pages that exports CSV data and summary charts instead of pretending to scrape every site magically.",
    tags: ["Python", "Scraping", "CLI"],
    repoUrl: "https://github.com/majdbenchobba/ai-web-scraper",
  },
  {
    name: "Trade Export Normalizer",
    type: "code",
    typeLabel: "Code",
    status: "Published utility",
    summary:
      "A CLI tool for cleaning and normalizing broker or exchange trade export CSV files into a more consistent format for later analysis.",
    tags: ["Python", "CSV", "Tooling"],
    repoUrl: "https://github.com/majdbenchobba/trade-export-normalizer",
  },
  {
    name: "YT Music Downloader",
    type: "code",
    typeLabel: "Code",
    status: "Published utility",
    summary:
      "A small downloader for saving YouTube or YouTube Music audio as WAV files, with a lightweight workflow instead of a bloated interface.",
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
  card.className = `project-card${project.featured ? " is-featured" : ""}`;

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
  projectGrid.innerHTML = "";
  filteredProjects().forEach((project) => {
    projectGrid.appendChild(createProjectCard(project));
  });
}

renderFilters();
renderProjects();
