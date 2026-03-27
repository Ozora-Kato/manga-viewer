let allManga = [];
let activeTag = null;

async function loadManga() {
  const res = await fetch('data/manga.json');
  allManga = (await res.json()).reverse();
  renderTagFilters();
  renderGrid(allManga);
}

function renderTagFilters() {
  const tags = [...new Set(allManga.flatMap(m => m.tags || []))];
  const container = document.getElementById('tagFilters');
  container.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'tag-btn active';
  allBtn.textContent = 'すべて';
  allBtn.addEventListener('click', () => {
    activeTag = null;
    document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
    allBtn.classList.add('active');
    applyFilter();
  });
  container.appendChild(allBtn);

  tags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'tag-btn';
    btn.textContent = `# ${tag}`;
    btn.addEventListener('click', () => {
      if (activeTag === tag) {
        activeTag = null;
        btn.classList.remove('active');
        allBtn.classList.add('active');
      } else {
        document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
        activeTag = tag;
        btn.classList.add('active');
      }
      applyFilter();
    });
    container.appendChild(btn);
  });
}

function applyFilter() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  let result = allManga;
  if (activeTag) result = result.filter(m => (m.tags || []).includes(activeTag));
  if (query) result = result.filter(m => m.title.toLowerCase().includes(query));
  renderGrid(result);
}

function renderGrid(list) {
  const grid = document.getElementById('mangaGrid');
  const empty = document.getElementById('emptyMsg');
  grid.innerHTML = '';

  if (list.length === 0) {
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';

  list.forEach(manga => {
    const card = document.createElement('a');
    card.className = 'manga-card';
    card.href = `viewer.html?id=${encodeURIComponent(manga.id)}`;

    const coverHtml = manga.cover
      ? `<img class="manga-cover" src="${manga.cover}" alt="${manga.title}" loading="lazy" onerror="this.replaceWith(makePlaceholder())">`
      : `<div class="manga-cover-placeholder">📖</div>`;

    const tagsHtml = (manga.tags || []).map(t => `<span class="manga-tag">${t}</span>`).join('');

    card.innerHTML = `
      ${coverHtml}
      <div class="manga-info">
        <div class="manga-card-title">${manga.title}</div>
        <div class="manga-card-tags">${tagsHtml}</div>
        <div class="manga-card-date">${manga.updatedAt || ''}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function makePlaceholder() {
  const d = document.createElement('div');
  d.className = 'manga-cover-placeholder';
  d.textContent = '📖';
  return d;
}

document.getElementById('searchInput').addEventListener('input', applyFilter);

loadManga();
