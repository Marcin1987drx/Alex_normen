/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MEDIA MANAGER - Komplettes Medienverwaltungssystem
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Funkcje:
 * - Upload i zarządzanie obrazami (JPEG, PNG, GIF, WebP)
 * - Galeria z kategoriami (Crimp, Kabel, Schrumpf, Qualität)
 * - Lightbox do podglądu
 * - Adnotacje i opisy
 * - Tagowanie i wyszukiwanie
 * - Przechowywanie w IndexedDB
 * - Export/Import galerii
 */

class MediaManager {
  constructor() {
    this.categories = [
      { id: 'crimp', name: 'Crimpverbindungen', icon: '🔧', color: '#1565C0' },
      { id: 'kabel', name: 'Kabel & Drähte', icon: '🔌', color: '#6A1B9A' },
      { id: 'schrumpf', name: 'Schrumpfschläuche', icon: '🔥', color: '#E65100' },
      { id: 'stecker', name: 'Steckverbinder', icon: '🔗', color: '#00695C' },
      { id: 'qualitaet', name: 'Qualitätsmuster', icon: '✅', color: '#2E7D32' },
      { id: 'fehler', name: 'Fehlermuster', icon: '❌', color: '#C62828' },
      { id: 'werkzeug', name: 'Werkzeuge', icon: '🛠️', color: '#37474F' },
      { id: 'sonstige', name: 'Sonstige', icon: '📷', color: '#757575' }
    ];
    
    this.qualityStatus = [
      { id: 'gut', name: 'GUT / Akzeptabel', icon: '✅', color: '#2E7D32' },
      { id: 'grenzfall', name: 'Grenzfall', icon: '⚠️', color: '#F57C00' },
      { id: 'schlecht', name: 'SCHLECHT / Defekt', icon: '❌', color: '#C62828' },
      { id: 'info', name: 'Information', icon: 'ℹ️', color: '#0288D1' }
    ];
    
    this.mediaItems = [];
    this.currentLightboxIndex = 0;
    this.isLoaded = false;
    
    // Initialisiere beim Start
    this.init();
  }
  
  /**
   * Initialisierung
   */
  async init() {
    await this.loadMediaFromDB();
    this.setupKeyboardNavigation();
    console.log(`📷 MediaManager initialisiert: ${this.mediaItems.length} Medien`);
  }
  
  /**
   * Lädt Medien aus IndexedDB
   */
  async loadMediaFromDB() {
    try {
      if (typeof IndexedDBStorage !== 'undefined') {
        const stored = await IndexedDBStorage.getSetting('mediaItems');
        if (stored) {
          this.mediaItems = stored;
        }
      }
      
      // Füge Standard-Beispielbilder hinzu wenn leer
      if (this.mediaItems.length === 0) {
        this.addDefaultExamples();
      }
      
      this.isLoaded = true;
    } catch (e) {
      console.error('MediaManager Load Error:', e);
      this.addDefaultExamples();
    }
  }
  
  /**
   * Speichert Medien in IndexedDB
   */
  async saveMediaToDB() {
    try {
      if (typeof IndexedDBStorage !== 'undefined') {
        await IndexedDBStorage.saveSetting('mediaItems', this.mediaItems);
      }
    } catch (e) {
      console.error('MediaManager Save Error:', e);
    }
  }
  
  /**
   * Fügt Standard-Beispielbilder hinzu
   */
  addDefaultExamples() {
    const examples = [
      // Crimp - GUT
      {
        id: 'example-crimp-gut-1',
        title: 'Crimpverbindung GUT',
        description: 'Korrekte Crimpverbindung nach VG 95218. Leitercrimp und Isolationscrimp sind korrekt ausgeführt.',
        category: 'crimp',
        status: 'gut',
        tags: ['crimp', 'leitercrimp', 'vg95218', 'korrekt'],
        isExample: true,
        icon: '✅',
        createdAt: new Date().toISOString()
      },
      // Crimp - SCHLECHT
      {
        id: 'example-crimp-schlecht-1',
        title: 'Übercrimpung - SCHLECHT',
        description: 'Zu stark verpresst. Die Crimphülse ist deformiert und die Litzen können beschädigt sein.',
        category: 'crimp',
        status: 'schlecht',
        tags: ['crimp', 'übercrimpung', 'defekt', 'fehler'],
        isExample: true,
        icon: '❌',
        createdAt: new Date().toISOString()
      },
      {
        id: 'example-crimp-schlecht-2',
        title: 'Untercrimpung - SCHLECHT',
        description: 'Zu wenig verpresst. Die Verbindung hat nicht genug Festigkeit und kann sich lösen.',
        category: 'crimp',
        status: 'schlecht',
        tags: ['crimp', 'untercrimpung', 'defekt', 'fehler'],
        isExample: true,
        icon: '❌',
        createdAt: new Date().toISOString()
      },
      // Isolation
      {
        id: 'example-isolation-gut',
        title: 'Isolationscrimp GUT',
        description: 'Korrekte Isolationsanpressung. Die Isolation ist nicht beschädigt und sitzt fest.',
        category: 'crimp',
        status: 'gut',
        tags: ['isolation', 'isolationscrimp', 'korrekt'],
        isExample: true,
        icon: '✅',
        createdAt: new Date().toISOString()
      },
      {
        id: 'example-isolation-schlecht',
        title: 'Isolationscrimp SCHLECHT',
        description: 'Die Isolation ist beschädigt oder sitzt nicht korrekt. Kann zu Kurzschlüssen führen.',
        category: 'crimp',
        status: 'schlecht',
        tags: ['isolation', 'beschädigt', 'defekt'],
        isExample: true,
        icon: '❌',
        createdAt: new Date().toISOString()
      },
      // Litzenenden
      {
        id: 'example-litze-gut',
        title: 'Litzenenden GUT',
        description: 'Korrekt abgelängte Litzenenden. Keine vorstehenden Einzeldrähte.',
        category: 'crimp',
        status: 'gut',
        tags: ['litze', 'litzenenden', 'korrekt'],
        isExample: true,
        icon: '✅',
        createdAt: new Date().toISOString()
      },
      {
        id: 'example-litze-schlecht',
        title: 'Vorstehende Litzen - SCHLECHT',
        description: 'Vorstehende Einzeldrähte können Kurzschlüsse verursachen.',
        category: 'crimp',
        status: 'schlecht',
        tags: ['litze', 'vorstehend', 'fehler'],
        isExample: true,
        icon: '❌',
        createdAt: new Date().toISOString()
      },
      // Kontaktsitz
      {
        id: 'example-kontakt-info',
        title: 'Kontaktsitz im Stecker',
        description: 'Zeigt die korrekte Rastposition des Kontakts im Steckergehäuse.',
        category: 'stecker',
        status: 'info',
        tags: ['kontakt', 'stecker', 'rastung', 'position'],
        isExample: true,
        icon: 'ℹ️',
        createdAt: new Date().toISOString()
      },
      // Schrumpfschlauch
      {
        id: 'example-schrumpf-gut',
        title: 'Schrumpfschlauch GUT',
        description: 'Korrekter Schrumpfvorgang. Schlauch sitzt eng an und ist nicht beschädigt.',
        category: 'schrumpf',
        status: 'gut',
        tags: ['schrumpf', 'schrumpfschlauch', 'korrekt'],
        isExample: true,
        icon: '✅',
        createdAt: new Date().toISOString()
      },
      {
        id: 'example-schrumpf-schlecht',
        title: 'Schrumpfschlauch verbrannt',
        description: 'Überhitzt - Der Schrumpfschlauch zeigt Verbrennungsmerkmale.',
        category: 'schrumpf',
        status: 'schlecht',
        tags: ['schrumpf', 'verbrannt', 'überhitzt', 'fehler'],
        isExample: true,
        icon: '❌',
        createdAt: new Date().toISOString()
      }
    ];
    
    this.mediaItems = examples;
  }
  
  /**
   * Keyboard Navigation für Lightbox
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      const lightbox = document.getElementById('mediaLightbox');
      if (!lightbox || lightbox.style.display === 'none') return;
      
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.navigateLightbox(-1);
      if (e.key === 'ArrowRight') this.navigateLightbox(1);
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // UPLOAD & MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Verarbeitet hochgeladene Bilder
   */
  async processUpload(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Nur Bilddateien erlaubt'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const id = `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const mediaItem = {
          id: id,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          description: '',
          category: 'sonstige',
          status: 'info',
          tags: [],
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          dataUrl: e.target.result, // Base64 für Vorschau
          isExample: false,
          createdAt: new Date().toISOString()
        };
        
        // Speichere auch in IndexedDB Files Store
        if (typeof IndexedDBStorage !== 'undefined') {
          try {
            await IndexedDBStorage.saveFile(id, file, {
              filename: file.name,
              mimeType: file.type
            });
          } catch (err) {
            console.warn('Konnte Originaldatei nicht speichern:', err);
          }
        }
        
        this.mediaItems.unshift(mediaItem);
        await this.saveMediaToDB();
        
        resolve(mediaItem);
      };
      
      reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'));
      reader.readAsDataURL(file);
    });
  }
  
  /**
   * Aktualisiert ein Medienelement
   */
  async updateMedia(id, updates) {
    const index = this.mediaItems.findIndex(m => m.id === id);
    if (index === -1) return false;
    
    this.mediaItems[index] = { ...this.mediaItems[index], ...updates };
    await this.saveMediaToDB();
    return true;
  }
  
  /**
   * Löscht ein Medienelement
   */
  async deleteMedia(id) {
    const index = this.mediaItems.findIndex(m => m.id === id);
    if (index === -1) return false;
    
    // Lösche auch aus IndexedDB Files
    if (typeof IndexedDBStorage !== 'undefined') {
      try {
        await IndexedDBStorage.deleteFile(id);
      } catch (e) {}
    }
    
    this.mediaItems.splice(index, 1);
    await this.saveMediaToDB();
    return true;
  }
  
  /**
   * Filtert Medien nach Kategorie und/oder Status
   */
  getFilteredMedia(category = null, status = null, searchQuery = '') {
    let filtered = [...this.mediaItems];
    
    if (category) {
      filtered = filtered.filter(m => m.category === category);
    }
    
    if (status) {
      filtered = filtered.filter(m => m.status === status);
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    
    return filtered;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RENDERING
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Rendert die komplette Bilder-Seite
   */
  renderGalleryPage() {
    return `
      <div class="media-manager">
        <!-- Header mit Upload -->
        <div class="media-header">
          <div class="media-title">
            <h2>📷 Bildergalerie</h2>
            <p>Qualitätsmuster und Referenzbilder für die Kabelkonfektion</p>
          </div>
          <div class="media-actions">
            <button class="btn btn-primary" onclick="mediaManager.showUploadModal()">
              <span class="icon">📤</span> Bild hochladen
            </button>
          </div>
        </div>
        
        <!-- Filter -->
        <div class="media-filters">
          <div class="filter-group">
            <label>Kategorie:</label>
            <select id="mediaFilterCategory" onchange="mediaManager.applyFilters()">
              <option value="">Alle Kategorien</option>
              ${this.categories.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <label>Status:</label>
            <select id="mediaFilterStatus" onchange="mediaManager.applyFilters()">
              <option value="">Alle Status</option>
              ${this.qualityStatus.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group filter-search">
            <input type="text" id="mediaSearch" placeholder="🔍 Suchen..." oninput="mediaManager.applyFilters()">
          </div>
        </div>
        
        <!-- Statistiken -->
        <div class="media-stats">
          <span class="stat">📷 <strong id="mediaCount">${this.mediaItems.length}</strong> Bilder</span>
          <span class="stat">✅ <strong id="mediaGutCount">${this.mediaItems.filter(m => m.status === 'gut').length}</strong> GUT</span>
          <span class="stat">❌ <strong id="mediaSchlechtCount">${this.mediaItems.filter(m => m.status === 'schlecht').length}</strong> SCHLECHT</span>
        </div>
        
        <!-- Galerie Grid -->
        <div class="media-grid" id="mediaGrid">
          ${this.renderMediaGrid(this.mediaItems)}
        </div>
      </div>
      
      <!-- Lightbox Modal -->
      <div id="mediaLightbox" class="lightbox" style="display: none;">
        <div class="lightbox-overlay" onclick="mediaManager.closeLightbox()"></div>
        <div class="lightbox-content">
          <button class="lightbox-close" onclick="mediaManager.closeLightbox()">✕</button>
          <button class="lightbox-nav lightbox-prev" onclick="mediaManager.navigateLightbox(-1)">❮</button>
          <button class="lightbox-nav lightbox-next" onclick="mediaManager.navigateLightbox(1)">❯</button>
          
          <div class="lightbox-main">
            <div class="lightbox-image-container">
              <div id="lightboxImage" class="lightbox-image"></div>
            </div>
            <div class="lightbox-info" id="lightboxInfo">
              <!-- Wird dynamisch gefüllt -->
            </div>
          </div>
        </div>
      </div>
      
      <!-- Upload Modal -->
      <div id="uploadModal" class="modal" style="display: none;">
        <div class="modal-overlay" onclick="mediaManager.closeUploadModal()"></div>
        <div class="modal-content modal-large">
          <div class="modal-header">
            <h3>📤 Bild hochladen</h3>
            <button class="modal-close" onclick="mediaManager.closeUploadModal()">✕</button>
          </div>
          <div class="modal-body">
            ${this.renderUploadForm()}
          </div>
        </div>
      </div>
      
      <!-- Edit Modal -->
      <div id="editMediaModal" class="modal" style="display: none;">
        <div class="modal-overlay" onclick="mediaManager.closeEditModal()"></div>
        <div class="modal-content modal-medium">
          <div class="modal-header">
            <h3>✏️ Bild bearbeiten</h3>
            <button class="modal-close" onclick="mediaManager.closeEditModal()">✕</button>
          </div>
          <div class="modal-body" id="editModalBody">
            <!-- Wird dynamisch gefüllt -->
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Rendert das Media Grid
   */
  renderMediaGrid(items) {
    if (items.length === 0) {
      return `
        <div class="empty-state">
          <span class="icon">📷</span>
          <p>Keine Bilder gefunden</p>
          <p>Laden Sie Bilder hoch oder ändern Sie die Filter</p>
        </div>
      `;
    }
    
    return items.map((item, index) => {
      const statusInfo = this.qualityStatus.find(s => s.id === item.status) || this.qualityStatus[3];
      const categoryInfo = this.categories.find(c => c.id === item.category) || this.categories[7];
      
      return `
        <div class="media-card status-${item.status}" onclick="mediaManager.openLightbox('${item.id}')">
          <div class="media-thumbnail">
            ${item.dataUrl 
              ? `<img src="${item.dataUrl}" alt="${item.title}" loading="lazy">`
              : `<div class="placeholder-icon">${item.icon || categoryInfo.icon}</div>`
            }
            <div class="media-status-badge" style="background: ${statusInfo.color}">
              ${statusInfo.icon}
            </div>
          </div>
          <div class="media-info">
            <h4 class="media-title">${item.title}</h4>
            <p class="media-desc">${item.description.substring(0, 60)}${item.description.length > 60 ? '...' : ''}</p>
            <div class="media-meta">
              <span class="media-category" style="background: ${categoryInfo.color}20; color: ${categoryInfo.color}">
                ${categoryInfo.icon} ${categoryInfo.name}
              </span>
            </div>
          </div>
          <div class="media-actions-overlay">
            <button class="btn-icon" onclick="event.stopPropagation(); mediaManager.showEditModal('${item.id}')" title="Bearbeiten">✏️</button>
            ${!item.isExample ? `<button class="btn-icon btn-danger" onclick="event.stopPropagation(); mediaManager.confirmDelete('${item.id}')" title="Löschen">🗑️</button>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }
  
  /**
   * Rendert das Upload-Formular
   */
  renderUploadForm() {
    return `
      <div class="upload-zone" id="uploadDropZone">
        <div class="drop-content">
          <span class="drop-icon">📁</span>
          <h3>Bild hier ablegen</h3>
          <p>oder klicken zum Auswählen</p>
          <p class="formats">JPG, PNG, GIF, WebP (max. 10MB)</p>
        </div>
        <input type="file" id="mediaFileInput" accept="image/*" hidden>
      </div>
      
      <div id="uploadPreview" style="display: none;">
        <div class="preview-image">
          <img id="previewImg" src="" alt="Vorschau">
        </div>
        <div class="upload-form">
          <div class="form-group">
            <label>Titel:</label>
            <input type="text" id="uploadTitle" class="form-input" placeholder="z.B. Crimpverbindung GUT">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Kategorie:</label>
              <select id="uploadCategory" class="form-select">
                ${this.categories.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Status:</label>
              <select id="uploadStatus" class="form-select">
                ${this.qualityStatus.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Beschreibung:</label>
            <textarea id="uploadDescription" class="form-textarea" rows="3" placeholder="Beschreiben Sie das Bild..."></textarea>
          </div>
          <div class="form-group">
            <label>Tags (kommagetrennt):</label>
            <input type="text" id="uploadTags" class="form-input" placeholder="z.B. crimp, qualität, vg95218">
          </div>
          <div class="form-actions">
            <button class="btn btn-secondary" onclick="mediaManager.cancelUpload()">Abbrechen</button>
            <button class="btn btn-primary" onclick="mediaManager.saveUpload()">💾 Speichern</button>
          </div>
        </div>
      </div>
    `;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // LIGHTBOX
  // ═══════════════════════════════════════════════════════════════════════════
  
  openLightbox(mediaId) {
    const index = this.mediaItems.findIndex(m => m.id === mediaId);
    if (index === -1) return;
    
    this.currentLightboxIndex = index;
    this.renderLightboxContent();
    
    const lightbox = document.getElementById('mediaLightbox');
    if (lightbox) {
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }
  
  closeLightbox() {
    const lightbox = document.getElementById('mediaLightbox');
    if (lightbox) {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
  
  navigateLightbox(direction) {
    const newIndex = this.currentLightboxIndex + direction;
    if (newIndex >= 0 && newIndex < this.mediaItems.length) {
      this.currentLightboxIndex = newIndex;
      this.renderLightboxContent();
    }
  }
  
  renderLightboxContent() {
    const item = this.mediaItems[this.currentLightboxIndex];
    if (!item) return;
    
    const statusInfo = this.qualityStatus.find(s => s.id === item.status) || this.qualityStatus[3];
    const categoryInfo = this.categories.find(c => c.id === item.category) || this.categories[7];
    
    const imageContainer = document.getElementById('lightboxImage');
    const infoContainer = document.getElementById('lightboxInfo');
    
    if (imageContainer) {
      if (item.dataUrl) {
        imageContainer.innerHTML = `<img src="${item.dataUrl}" alt="${item.title}">`;
      } else {
        imageContainer.innerHTML = `
          <div class="lightbox-placeholder">
            <span class="placeholder-icon">${item.icon || categoryInfo.icon}</span>
            <p>Beispielbild</p>
            <p class="placeholder-hint">Laden Sie ein eigenes Bild hoch</p>
          </div>
        `;
      }
    }
    
    if (infoContainer) {
      infoContainer.innerHTML = `
        <div class="lightbox-header">
          <span class="status-badge" style="background: ${statusInfo.color}">${statusInfo.icon} ${statusInfo.name}</span>
          <span class="category-badge" style="background: ${categoryInfo.color}">${categoryInfo.icon} ${categoryInfo.name}</span>
        </div>
        <h2>${item.title}</h2>
        <p class="lightbox-description">${item.description}</p>
        ${item.tags?.length ? `
          <div class="lightbox-tags">
            ${item.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        ` : ''}
        <div class="lightbox-meta">
          <span>📅 ${new Date(item.createdAt).toLocaleDateString('de-DE')}</span>
          <span>📷 ${this.currentLightboxIndex + 1} / ${this.mediaItems.length}</span>
        </div>
        <div class="lightbox-actions">
          <button class="btn btn-secondary" onclick="mediaManager.showEditModal('${item.id}'); mediaManager.closeLightbox();">
            ✏️ Bearbeiten
          </button>
          ${!item.isExample ? `
            <button class="btn btn-secondary" onclick="mediaManager.confirmDelete('${item.id}'); mediaManager.closeLightbox();">
              🗑️ Löschen
            </button>
          ` : ''}
        </div>
      `;
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // UPLOAD MODAL
  // ═══════════════════════════════════════════════════════════════════════════
  
  showUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
      modal.style.display = 'flex';
      this.initUploadDropZone();
    }
  }
  
  closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
      modal.style.display = 'none';
      this.currentUploadFile = null;
      
      // Reset form
      const preview = document.getElementById('uploadPreview');
      const dropZone = document.getElementById('uploadDropZone');
      if (preview) preview.style.display = 'none';
      if (dropZone) dropZone.style.display = 'block';
    }
  }
  
  initUploadDropZone() {
    const dropZone = document.getElementById('uploadDropZone');
    const fileInput = document.getElementById('mediaFileInput');
    
    if (!dropZone || !fileInput) return;
    
    // Event Listeners entfernen und neu hinzufügen
    const newDropZone = dropZone.cloneNode(true);
    dropZone.parentNode.replaceChild(newDropZone, dropZone);
    
    const newFileInput = document.getElementById('mediaFileInput');
    
    newDropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      newDropZone.classList.add('drag-over');
    });
    
    newDropZone.addEventListener('dragleave', () => {
      newDropZone.classList.remove('drag-over');
    });
    
    newDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      newDropZone.classList.remove('drag-over');
      if (e.dataTransfer.files.length > 0) {
        this.handleFileSelect(e.dataTransfer.files[0]);
      }
    });
    
    newDropZone.addEventListener('click', () => {
      newFileInput.click();
    });
    
    newFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFileSelect(e.target.files[0]);
      }
    });
  }
  
  handleFileSelect(file) {
    if (!file.type.startsWith('image/')) {
      alert('Nur Bilddateien erlaubt!');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('Datei ist zu groß (max. 10MB)');
      return;
    }
    
    this.currentUploadFile = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('previewImg').src = e.target.result;
      document.getElementById('uploadTitle').value = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      document.getElementById('uploadDropZone').style.display = 'none';
      document.getElementById('uploadPreview').style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }
  
  cancelUpload() {
    this.currentUploadFile = null;
    document.getElementById('uploadPreview').style.display = 'none';
    document.getElementById('uploadDropZone').style.display = 'block';
  }
  
  async saveUpload() {
    if (!this.currentUploadFile) return;
    
    try {
      const mediaItem = await this.processUpload(this.currentUploadFile);
      
      // Aktualisiere mit Formulardaten
      mediaItem.title = document.getElementById('uploadTitle').value || mediaItem.title;
      mediaItem.category = document.getElementById('uploadCategory').value;
      mediaItem.status = document.getElementById('uploadStatus').value;
      mediaItem.description = document.getElementById('uploadDescription').value;
      mediaItem.tags = document.getElementById('uploadTags').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t);
      
      await this.saveMediaToDB();
      
      this.closeUploadModal();
      this.applyFilters();
      
      if (typeof UI !== 'undefined') {
        UI.showToast(`✅ "${mediaItem.title}" hochgeladen!`, 'success');
      }
    } catch (error) {
      alert('Fehler beim Hochladen: ' + error.message);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // EDIT MODAL
  // ═══════════════════════════════════════════════════════════════════════════
  
  showEditModal(mediaId) {
    const item = this.mediaItems.find(m => m.id === mediaId);
    if (!item) return;
    
    this.currentEditId = mediaId;
    
    const modal = document.getElementById('editMediaModal');
    const body = document.getElementById('editModalBody');
    
    if (modal && body) {
      body.innerHTML = `
        <div class="edit-preview">
          ${item.dataUrl 
            ? `<img src="${item.dataUrl}" alt="${item.title}">`
            : `<div class="placeholder-icon">${item.icon || '📷'}</div>`
          }
        </div>
        <div class="edit-form">
          <div class="form-group">
            <label>Titel:</label>
            <input type="text" id="editTitle" class="form-input" value="${item.title}">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Kategorie:</label>
              <select id="editCategory" class="form-select">
                ${this.categories.map(c => 
                  `<option value="${c.id}" ${c.id === item.category ? 'selected' : ''}>${c.icon} ${c.name}</option>`
                ).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Status:</label>
              <select id="editStatus" class="form-select">
                ${this.qualityStatus.map(s => 
                  `<option value="${s.id}" ${s.id === item.status ? 'selected' : ''}>${s.icon} ${s.name}</option>`
                ).join('')}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Beschreibung:</label>
            <textarea id="editDescription" class="form-textarea" rows="3">${item.description}</textarea>
          </div>
          <div class="form-group">
            <label>Tags (kommagetrennt):</label>
            <input type="text" id="editTags" class="form-input" value="${(item.tags || []).join(', ')}">
          </div>
          <div class="form-actions">
            <button class="btn btn-secondary" onclick="mediaManager.closeEditModal()">Abbrechen</button>
            <button class="btn btn-primary" onclick="mediaManager.saveEdit()">💾 Speichern</button>
          </div>
        </div>
      `;
      
      modal.style.display = 'flex';
    }
  }
  
  closeEditModal() {
    const modal = document.getElementById('editMediaModal');
    if (modal) {
      modal.style.display = 'none';
      this.currentEditId = null;
    }
  }
  
  async saveEdit() {
    if (!this.currentEditId) return;
    
    const updates = {
      title: document.getElementById('editTitle').value,
      category: document.getElementById('editCategory').value,
      status: document.getElementById('editStatus').value,
      description: document.getElementById('editDescription').value,
      tags: document.getElementById('editTags').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t)
    };
    
    await this.updateMedia(this.currentEditId, updates);
    this.closeEditModal();
    this.applyFilters();
    
    if (typeof UI !== 'undefined') {
      UI.showToast('✅ Änderungen gespeichert!', 'success');
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DELETE
  // ═══════════════════════════════════════════════════════════════════════════
  
  confirmDelete(mediaId) {
    const item = this.mediaItems.find(m => m.id === mediaId);
    if (!item || item.isExample) return;
    
    if (confirm(`Möchten Sie "${item.title}" wirklich löschen?`)) {
      this.deleteMedia(mediaId);
      this.applyFilters();
      
      if (typeof UI !== 'undefined') {
        UI.showToast('🗑️ Bild gelöscht', 'info');
      }
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // FILTERS
  // ═══════════════════════════════════════════════════════════════════════════
  
  applyFilters() {
    const category = document.getElementById('mediaFilterCategory')?.value || '';
    const status = document.getElementById('mediaFilterStatus')?.value || '';
    const search = document.getElementById('mediaSearch')?.value || '';
    
    const filtered = this.getFilteredMedia(category || null, status || null, search);
    
    const grid = document.getElementById('mediaGrid');
    if (grid) {
      grid.innerHTML = this.renderMediaGrid(filtered);
    }
    
    // Statistiken aktualisieren
    const countEl = document.getElementById('mediaCount');
    if (countEl) countEl.textContent = filtered.length;
  }
}

// Globale Instanz
const mediaManager = new MediaManager();

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MediaManager;
}
