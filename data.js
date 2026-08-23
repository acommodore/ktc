const NEWS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQn9T4BOnST2LO_iTcWSSsUHvJMJ_jiER9z9PXhcjqR6NQJjZIG6cye-Z2HYuKKeUUMmhKfF6muv9Xz/pub?output=csv';
const GALLERY_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBJiJ1BDeRnjSGCsWVlULcAPDfAxcWl4EElzjrFZN_bGQIlUI-kaWTrVapDBK_H0KBmFpcMb0E1zSA/pub?output=csv';

// Convert Google Drive view link to direct image link
function getGoogleDriveImageSrc(url) {
  if (!url) return '';
  const match = url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }
  return url;
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
              const imgSrc = getGoogleDriveImageSrc(row['Photo Upload']);
              
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
              // Clear the placeholder images if we have dynamic ones
              galleryContainer.innerHTML = '';
              
              data.reverse().forEach((row, index) => {
                const imgSrc = getGoogleDriveImageSrc(row['Photo Upload']);
                if (!imgSrc) return;
                
                const delayClass = (index % 3 === 1) ? 'delay-1' : (index % 3 === 2) ? 'delay-2' : '';
                
                const item = document.createElement('div');
                item.className = `gallery-item fade-in-up is-visible ${delayClass}`;
                item.innerHTML = `
                  <img src="${imgSrc}" alt="${row.Caption || 'Gallery Image'}">
                `;
                
                // Add caption overlay if it exists
                if (row.Caption) {
                  const captionHtml = document.createElement('div');
                  captionHtml.style.padding = '0.5rem';
                  captionHtml.style.textAlign = 'center';
                  captionHtml.style.backgroundColor = '#fff';
                  captionHtml.style.fontWeight = 'bold';
                  captionHtml.textContent = row.Caption;
                  item.appendChild(captionHtml);
                }
                
                galleryContainer.appendChild(item);
              });
            }
          }
        });
      })
      .catch(err => console.error('Error fetching gallery:', err));
  }
});
