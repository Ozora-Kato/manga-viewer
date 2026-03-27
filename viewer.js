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
  document.getElementById('viewerInfoTitle').textContent = manga.title;
  document.getElementById('viewerInfoAuthor').textContent = manga.author || '';
  document.getElementById('viewerInfoDesc').textContent = manga.description || '';
  const tagsEl = document.getElementById('viewerInfoTags');
  (manga.tags || []).forEach(tag => {
    const span = document.createElement('span');
    span.className = 'manga-tag';
    span.textContent = `# ${tag}`;
    tagsEl.appendChild(span);
  });
  const keywordsEl = document.getElementById('viewerInfoKeywords');
  if ((manga.keywords || []).length > 0) {
    keywordsEl.textContent = manga.keywords.map(k => `#${k}`).join('　');
  }

  const container = document.getElementById('viewerPages');
  const thumbsContainer = document.getElementById('viewerThumbs');
  const pageImgs = [];
  const thumbImgs = [];

  (manga.pages || []).forEach((src, i) => {
    const img = document.createElement('img');
    img.className = 'viewer-page-img';
    img.src = src;
    img.alt = `${manga.title} p.${i + 1}`;
    img.loading = 'lazy';
    container.appendChild(img);
    pageImgs.push(img);

    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'viewer-thumb-wrap';

    const thumb = document.createElement('img');
    thumb.className = 'viewer-thumb-img';
    thumb.src = src;
    thumb.alt = `p.${i + 1}`;
    thumb.loading = 'lazy';

    const num = document.createElement('span');
    num.className = 'viewer-thumb-num';
    num.textContent = i + 1;

    thumbWrap.appendChild(thumb);
    thumbWrap.appendChild(num);
    thumbWrap.addEventListener('click', () => img.scrollIntoView({ behavior: 'smooth' }));
    thumbsContainer.appendChild(thumbWrap);
    thumbImgs.push(thumb);
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const i = pageImgs.indexOf(entry.target);
      if (i === -1) return;
      if (entry.isIntersecting) {
        thumbImgs[i].classList.add('active');
      } else {
        thumbImgs[i].classList.remove('active');
      }
    });
  }, { threshold: 0.5 });

  pageImgs.forEach(img => observer.observe(img));
}

loadViewer();
