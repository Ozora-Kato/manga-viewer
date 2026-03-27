async function loadViewer() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) { location.href = 'index.html'; return; }

  const res = await fetch('data/manga.json');
  const allManga = await res.json();
  const manga = allManga.find(m => m.id === id);
  if (!manga) { location.href = 'index.html'; return; }

  document.title = `${manga.title} — マンガ倉庫`;
  document.getElementById('viewerTitle').textContent = manga.title;

  const container = document.getElementById('viewerPages');
  (manga.pages || []).forEach((src, i) => {
    const img = document.createElement('img');
    img.className = 'viewer-page-img';
    img.src = src;
    img.alt = `${manga.title} p.${i + 1}`;
    img.loading = 'lazy';
    container.appendChild(img);
  });
}

loadViewer();
