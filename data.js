const NEWS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQn9T4BOnST2LO_iTcWSSsUHvJMJ_jiER9z9PXhcjqR6NQJjZIG6cye-Z2HYuKKeUUMmhKfF6muv9Xz/pub?output=csv';
const GALLERY_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBJiJ1BDeRnjSGCsWVlULcAPDfAxcWl4EElzjrFZN_bGQIlUI-kaWTrVapDBK_H0KBmFpcMb0E1zSA/pub?output=csv';

// Convert Google Drive view links to direct image links (handles multiple links)
function getGoogleDriveImageSrcs(urlStr) {
  if (!urlStr) return [];
  const urls = urlStr.split(',').map(s => s.trim());
  const srcs = [];
  urls.forEach(url => {
    const match = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      srcs.push(`https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`);
    } else if (url) {
      srcs.push(url);
    }
  });
  return srcs;
}

document.addEventListener('DOMContentLoaded', () => {
  // --- NEWS PAGE LOGIC ---
  const newsContainer = document.getElementById('news-container');
  if (newsContainer && typeof Papa !== 'undefined') {
    fetch(NEWS_CSV_URL)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: function(results) {
            const data = results.data;
            if (data.length === 0) {
              newsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No news updates yet. Check back soon!</p>';
              return;
            }
            // Reverse so newest is first
            data.reverse().forEach(row => {
              if (!row.Headline) return; // Skip empty rows
              const dateStr = row.Timestamp ? row.Timestamp.split(' ')[0] : '';
              
              const imgSrcs = getGoogleDriveImageSrcs(row['Photo Upload']);
              const imgSrc = imgSrcs.length > 0 ? imgSrcs[0] : ''; // News uses the first image
              
              const imgHtml = imgSrc ? `<img src="${imgSrc}" class="news-image" alt="${row.Headline}">` : `<div class="news-image"></div>`;
              
              const card = document.createElement('div');
              card.className = 'news-card fade-in-up is-visible';
              card.innerHTML = `
                ${imgHtml}
                <div class="news-content">
                  <span class="news-date">${dateStr}</span>
                  <h3 class="news-title">${row.Headline}</h3>
                  <p class="news-excerpt">${row.Story ? row.Story.replace(/\n/g, '<br>') : ''}</p>
                </div>
              `;
              newsContainer.appendChild(card);
            });
          }
        });
      })
      .catch(err => console.error('Error fetching news:', err));
  }

  // --- GALLERY PAGE LOGIC ---
  const galleryContainer = document.querySelector('.gallery-grid');
  if (galleryContainer && window.location.pathname.includes('gallery.html') && typeof Papa !== 'undefined') {
    fetch(GALLERY_CSV_URL)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: function(results) {
            const data = results.data;
            if (data.length > 0) {
              // Clear the placeholder loading text
              galleryContainer.innerHTML = '';
              
              let globalItemCount = 0;
              
              data.reverse().forEach((row) => {
                const imgSrcs = getGoogleDriveImageSrcs(row['Photo Upload']);
                if (imgSrcs.length === 0) return;
                
                imgSrcs.forEach((imgSrc, imgIndex) => {
                  const delayClass = (globalItemCount % 3 === 1) ? 'delay-1' : (globalItemCount % 3 === 2) ? 'delay-2' : '';
                  globalItemCount++;
                  
                  const item = document.createElement('div');
                  item.className = `gallery-item fade-in-up is-visible ${delayClass}`;
                  item.innerHTML = `
                    <img src="${imgSrc}" alt="${row.Caption || 'Gallery Image'}">
                  `;
                  
                  // Add caption overlay if it exists
                  if (row.Caption) {
                    const captionText = imgSrcs.length > 1 ? `${row.Caption} (${imgIndex + 1}/${imgSrcs.length})` : row.Caption;
                    const captionHtml = document.createElement('div');
                    captionHtml.style.padding = '0.5rem';
                    captionHtml.style.textAlign = 'center';
                    captionHtml.style.backgroundColor = '#fff';
                    captionHtml.style.fontWeight = 'bold';
                    captionHtml.textContent = captionText;
                    item.appendChild(captionHtml);
                  }
                  
                  galleryContainer.appendChild(item);
                });
              });
            } else {
              galleryContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No pictures uploaded yet.</p>';
            }
          }
        });
      })
      .catch(err => console.error('Error fetching gallery:', err));
  }
});
