// ═══════════════════════════════════════════════════════════════════════════════
// VG-NORMEN WISSENSSYSTEM - DOCX EXTRACTOR
// Text-Extraktion aus Word-Dokumenten mit Mammoth.js
// ═══════════════════════════════════════════════════════════════════════════════

const DOCXExtractor = {
  
  // Mammoth.js laden (wird beim ersten Aufruf initialisiert)
  _initialized: false,
  
  async init() {
    if (this._initialized) return;
    
    // Mammoth.js aus CDN laden
    if (typeof mammoth === 'undefined') {
      await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
    }
    
    this._initialized = true;
  },
  
  // Hilfsfunktion: Script laden
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN EXTRACTION FUNCTION
  // ═══════════════════════════════════════════════════════════════════════════
  
  async extract(source) {
    await this.init();
    
    try {
      let arrayBuffer;
      
      // Source kann sein: File, ArrayBuffer, oder Pfad
      if (source instanceof File) {
        arrayBuffer = await source.arrayBuffer();
      } else if (source instanceof ArrayBuffer) {
        arrayBuffer = source;
      } else if (typeof source === 'string') {
        // URL oder Pfad - via Fetch laden
        const response = await fetch(source);
        arrayBuffer = await response.arrayBuffer();
      } else {
        throw new Error('Ungültiger DOCX-Source-Typ');
      }
      
      // Mit Mammoth extrahieren
      const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
      
      return result.value;
      
    } catch (error) {
      console.error('DOCX-Extraktions-Fehler:', error);
      throw new Error(`DOCX konnte nicht gelesen werden: ${error.message}`);
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // EXTRACT FROM FILE INPUT
  // ═══════════════════════════════════════════════════════════════════════════
  
  async extractFromFileInput(fileInput) {
    const file = fileInput.files[0];
    if (!file) {
      throw new Error('Keine Datei ausgewählt');
    }
    
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    const validExt = file.name.toLowerCase().endsWith('.docx') || 
                     file.name.toLowerCase().endsWith('.doc');
    
    if (!validTypes.includes(file.type) && !validExt) {
      throw new Error('Datei ist kein Word-Dokument');
    }
    
    return await this.extract(file);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // EXTRACT WITH HTML (für formatierte Anzeige)
  // ═══════════════════════════════════════════════════════════════════════════
  
  async extractAsHTML(source) {
    await this.init();
    
    try {
      let arrayBuffer;
      
      if (source instanceof File) {
        arrayBuffer = await source.arrayBuffer();
      } else if (source instanceof ArrayBuffer) {
        arrayBuffer = source;
      } else if (typeof source === 'string') {
        const response = await fetch(source);
        arrayBuffer = await response.arrayBuffer();
      } else {
        throw new Error('Ungültiger DOCX-Source-Typ');
      }
      
      // HTML-Konvertierung
      const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      
      return {
        html: result.value,
        messages: result.messages
      };
      
    } catch (error) {
      throw new Error(`DOCX konnte nicht als HTML konvertiert werden: ${error.message}`);
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // EXTRACT WITH STYLE MAPPING (benutzerdefinierte Formatierung)
  // ═══════════════════════════════════════════════════════════════════════════
  
  async extractWithStyles(source) {
    await this.init();
    
    try {
      let arrayBuffer;
      
      if (source instanceof File) {
        arrayBuffer = await source.arrayBuffer();
      } else {
        const response = await fetch(source);
        arrayBuffer = await response.arrayBuffer();
      }
      
      // Custom Style Mapping für technische Dokumente
      const options = {
        styleMap: [
          "p[style-name='Überschrift 1'] => h1:fresh",
          "p[style-name='Überschrift 2'] => h2:fresh",
          "p[style-name='Überschrift 3'] => h3:fresh",
          "p[style-name='Hinweis'] => p.hinweis:fresh",
          "p[style-name='Warnung'] => p.warnung:fresh",
          "b => strong",
          "i => em"
        ]
      };
      
      const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer }, options);
      
      return {
        html: result.value,
        messages: result.messages
      };
      
    } catch (error) {
      throw new Error(`DOCX konnte nicht konvertiert werden: ${error.message}`);
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // EXTRACT PREVIEW (erste 1000 Zeichen)
  // ═══════════════════════════════════════════════════════════════════════════
  
  async extractPreview(source, maxLength = 1000) {
    const fullText = await this.extract(source);
    
    if (fullText.length <= maxLength) {
      return fullText;
    }
    
    // Bei Wortgrenze abschneiden
    const truncated = fullText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return truncated.substring(0, lastSpace) + '...';
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CHECK IF FILE IS DOCX
  // ═══════════════════════════════════════════════════════════════════════════
  
  isDOCX(file) {
    if (file instanceof File) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];
      return validTypes.includes(file.type) || 
             file.name.toLowerCase().endsWith('.docx') ||
             file.name.toLowerCase().endsWith('.doc');
    }
    if (typeof file === 'string') {
      return file.toLowerCase().endsWith('.docx') ||
             file.toLowerCase().endsWith('.doc');
    }
    return false;
  }
};

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DOCXExtractor;
}
