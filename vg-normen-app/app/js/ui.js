// ═══════════════════════════════════════════════════════════════════════════════
// VG-NORMEN WISSENSSYSTEM - UI UTILITIES
// Hilfsfunktionen für Benutzeroberfläche
// ═══════════════════════════════════════════════════════════════════════════════

const UI = {
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TOAST NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MODALS
  // ═══════════════════════════════════════════════════════════════════════════
  
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      // Focus trap
      const firstFocusable = modal.querySelector('button, input, [tabindex]');
      if (firstFocusable) firstFocusable.focus();
    }
  },
  
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  },
  
  closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active');
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════════════════
  
  updateBreadcrumbs(path) {
    const container = document.getElementById('breadcrumbs');
    const ol = container.querySelector('ol');
    
    ol.innerHTML = '<li><a href="#" onclick="navigateTo(\'home\')">🏠 Start</a></li>';
    
    path.forEach((item, index) => {
      const li = document.createElement('li');
      if (index === path.length - 1) {
        // Letztes Element (aktuell)
        li.textContent = item.title;
        li.setAttribute('aria-current', 'page');
      } else {
        // Klickbares Element
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = item.title;
        a.onclick = (e) => {
          e.preventDefault();
          if (item.action) item.action();
        };
        li.appendChild(a);
      }
      ol.appendChild(li);
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  showPage(pageId) {
    // Alle Seiten ausblenden
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    // Gewünschte Seite anzeigen
    const page = document.getElementById(`page-${pageId}`);
    if (page) {
      page.classList.add('active');
    }
    
    // Back-Button anzeigen/verstecken
    const backBtn = document.getElementById('btnBack');
    if (backBtn) {
      backBtn.style.display = pageId === 'home' ? 'none' : 'flex';
    }
    
    // Scroll nach oben
    window.scrollTo(0, 0);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CARDS RENDERING
  // ═══════════════════════════════════════════════════════════════════════════
  
  renderCard(item, onClick) {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = onClick;
    
    const isFav = Storage.isFavorite(item.id);
    const icon = item.icon || '📄';
    
    card.innerHTML = `
      <div class="card-header">
        <div class="card-title">
          <span>${icon}</span>
          ${item.title}
          ${isFav ? '<span class="fav-badge">⭐</span>' : ''}
        </div>
        <span class="card-arrow">→</span>
      </div>
      ${item.description ? `<div class="card-description">${item.description}</div>` : ''}
      ${item.keywords?.length ? `
        <div class="card-tags">
          ${item.keywords.slice(0, 5).map(k => `<span class="tag">${k}</span>`).join('')}
        </div>
      ` : ''}
    `;
    
    return card;
  },
  
  renderCategoryCard(category, onClick) {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = onClick;
    card.style.borderLeftColor = category.color;
    card.style.borderLeftWidth = '4px';
    
    card.innerHTML = `
      <div class="card-header">
        <div class="card-title">
          <span>${category.icon}</span>
          ${category.title}
        </div>
        <span class="card-arrow">→</span>
      </div>
      <div class="card-description">${category.norm} - ${category.description}</div>
    `;
    
    return card;
  },
  
  renderEmptyState(message, icon = '📭') {
    return `
      <div class="empty-state">
        <span class="icon">${icon}</span>
        <p>${message}</p>
      </div>
    `;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // FAVORITES RENDERING
  // ═══════════════════════════════════════════════════════════════════════════
  
  renderFavorites() {
    const container = document.getElementById('favoritesContainer');
    const favorites = Storage.getFavorites();
    
    if (favorites.length === 0) {
      container.innerHTML = this.renderEmptyState(
        'Noch keine Favoriten. Markieren Sie wichtige Themen mit dem Stern-Symbol!',
        '⭐'
      );
      return;
    }
    
    container.innerHTML = '';
    favorites.forEach(fav => {
      const card = document.createElement('div');
      card.className = 'favorite-card';
      card.onclick = () => openItem(fav.id, fav.type);
      card.innerHTML = `
        <span class="icon">${fav.icon || '📄'}</span>
        <span class="title">${fav.title}</span>
      `;
      container.appendChild(card);
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // HISTORY RENDERING
  // ═══════════════════════════════════════════════════════════════════════════
  
  renderHistory() {
    const container = document.getElementById('historyContainer');
    const history = Storage.getHistory();
    
    if (history.length === 0) {
      container.innerHTML = this.renderEmptyState(
        'Noch keine Historie. Ihre zuletzt angesehenen Themen erscheinen hier.',
        '🕐'
      );
      return;
    }
    
    container.innerHTML = '';
    history.slice(0, 5).forEach(item => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.onclick = () => openItem(item.id, item.type);
      div.innerHTML = `
        <span class="icon">${item.icon || '📄'}</span>
        <span class="title">${item.title}</span>
        <span class="time">${this.formatTimeAgo(item.timestamp)}</span>
      `;
      container.appendChild(div);
    });
  },
  
  formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'gerade eben';
    if (seconds < 3600) return `vor ${Math.floor(seconds / 60)} Min.`;
    if (seconds < 86400) return `vor ${Math.floor(seconds / 3600)} Std.`;
    if (seconds < 172800) return 'gestern';
    return `vor ${Math.floor(seconds / 86400)} Tagen`;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SEARCH RESULTS
  // ═══════════════════════════════════════════════════════════════════════════
  
  renderSearchResults(results, query) {
    const container = document.getElementById('searchResults');
    const info = document.getElementById('searchResultsInfo');
    
    info.textContent = `${results.length} Ergebnisse für: "${query}"`;
    
    if (results.length === 0) {
      container.innerHTML = this.renderEmptyState(
        `Keine Ergebnisse für "${query}" gefunden. Versuchen Sie andere Suchbegriffe.`,
        '🔍'
      );
      return;
    }
    
    container.innerHTML = '';
    results.forEach(item => {
      const card = this.renderCard(item, () => {
        if (item.source === 'meine_dokumente' && item.fileName) {
          openUserDocument(item.fileName);
        } else if (item.type === 'imported' || item.id?.startsWith('imported_')) {
          openItem(item.id, 'imported');
        } else {
          openItem(item.id, item.type);
        }
      });
      
      // Source-Badge hinzufügen
      const badge = document.createElement('span');
      badge.className = 'tag';
      
      // Determine badge color and text based on source/type
      if (item.type === 'imported' || item.source === 'Importierte Dokumente') {
        badge.style.background = '#22c55e'; // Green
        badge.style.color = 'white';
        badge.textContent = '📄 Importiert';
      } else if (item.source === 'meine_dokumente') {
        badge.style.background = 'var(--color-cat-formular)';
        badge.style.color = 'white';
        badge.textContent = '📁 Mein Dokument';
      } else {
        badge.style.background = 'var(--color-primary)';
        badge.style.color = 'white';
        badge.textContent = item.source || '📚 Wissensbasis';
      }
      
      const header = card.querySelector('.card-header');
      if (header) {
        header.appendChild(badge);
      }
      
      container.appendChild(card);
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // USER DOCUMENTS
  // ═══════════════════════════════════════════════════════════════════════════
  
  renderUserDocuments(files) {
    const container = document.getElementById('userDocumentsContent');
    const countEl = document.getElementById('userDocsCount');
    
    if (countEl) {
      countEl.textContent = `📄 ${files.length} Dokumente`;
    }
    
    if (files.length === 0) {
      container.innerHTML = this.renderEmptyState(
        'Noch keine Dokumente. Klicken Sie auf "DATEIEN HINZUFÜGEN" oder kopieren Sie Dateien in den Dokumenten-Ordner.',
        '📁'
      );
      return;
    }
    
    container.innerHTML = '';
    files.forEach(file => {
      const docInfo = Storage.getUserDocs()[file.name] || {};
      const icon = CONFIG.fileIcons[file.type] || CONFIG.fileIcons.default;
      
      const div = document.createElement('div');
      div.className = 'document-item';
      div.innerHTML = `
        <span class="doc-icon">${icon}</span>
        <div class="doc-info">
          <div class="doc-name">${docInfo.displayName || file.name}</div>
          <div class="doc-meta">
            ${file.type.toUpperCase()} • ${this.formatFileSize(file.size)} • ${this.formatDate(file.modified)}
          </div>
          ${docInfo.keywords?.length ? `
            <div class="card-tags">
              ${docInfo.keywords.slice(0, 5).map(k => `<span class="tag">${k}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        <div class="doc-actions">
          <button class="btn-icon" onclick="event.stopPropagation(); renameDocument('${file.name}')" title="Umbenennen">✏️</button>
          <button class="btn-icon" onclick="event.stopPropagation(); deleteDocument('${file.name}', '${file.path}')" title="Löschen">🗑️</button>
        </div>
      `;
      div.onclick = () => openUserDocument(file.name, file.path);
      container.appendChild(div);
    });
  },
  
  formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  },
  
  formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('de-DE');
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SETTINGS UI
  // ═══════════════════════════════════════════════════════════════════════════
  
  updateSettingsUI() {
    const settings = Storage.getSettings();
    
    // Schriftgröße
    document.querySelectorAll('.setting-btn[data-size]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === settings.fontSize);
    });
    
    // Kontrast
    document.querySelectorAll('.setting-btn[data-contrast]').forEach(btn => {
      const isHigh = btn.dataset.contrast === 'high';
      btn.classList.toggle('active', isHigh === settings.highContrast);
    });
    
    // Letztes Backup
    const lastBackup = Storage.getLastBackup();
    const infoEl = document.getElementById('lastBackupInfo');
    if (infoEl) {
      infoEl.textContent = lastBackup 
        ? `Letzte Sicherung: ${new Date(lastBackup).toLocaleString('de-DE')}`
        : 'Letzte Sicherung: Noch nie';
    }
  }
};

// Globale Shortcut-Funktionen
function showToast(message, type, duration) {
  UI.showToast(message, type, duration);
}

function showModal(id) {
  UI.showModal(id);
}

function closeModal(id) {
  UI.closeModal(id);
}
