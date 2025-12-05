// ═══════════════════════════════════════════════════════════════════════════════
// VG-NORMEN WISSENSSYSTEM - PDF EXTRACTOR
// Text-Extraktion aus PDF-Dateien mit PDF.js
// ═══════════════════════════════════════════════════════════════════════════════

const PDFExtractor = {
  
  // PDF.js Worker laden (wird beim ersten Aufruf initialisiert)
  _initialized: false,
  
  async init() {
    if (this._initialized) return;
    
    // PDF.js aus CDN laden
    if (typeof pdfjsLib === 'undefined') {
      // Script dynamisch laden
      await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
      
      // Worker konfigurieren
      pdfjsLib.GlobalWorkerOptions.workerSrc = 
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
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
    
    let pdf;
    
    try {
      // Source kann sein: File, ArrayBuffer, URL, oder Pfad
      if (source instanceof File) {
        const arrayBuffer = await source.arrayBuffer();
        pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      } else if (source instanceof ArrayBuffer) {
        pdf = await pdfjsLib.getDocument({ data: source }).promise;
      } else if (typeof source === 'string') {
        // URL oder lokaler Pfad
        pdf = await pdfjsLib.getDocument(source).promise;
      } else {
        throw new Error('Ungültiger PDF-Source-Typ');
      }
      
      // Text aus allen Seiten extrahieren
      const textParts = [];
      const numPages = pdf.numPages;
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Text-Items zusammenfügen
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ');
        
        textParts.push(pageText);
      }
      
      return textParts.join('\n\n');
      
    } catch (error) {
      console.error('PDF-Extraktions-Fehler:', error);
      throw new Error(`PDF konnte nicht gelesen werden: ${error.message}`);
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
    
    if (file.type !== 'application/pdf') {
      throw new Error('Datei ist kein PDF');
    }
    
    return await this.extract(file);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // EXTRACT WITH PROGRESS CALLBACK
  // ═══════════════════════════════════════════════════════════════════════════
  
  async extractWithProgress(source, onProgress) {
    await this.init();
    
    let pdf;
    
    try {
      if (source instanceof File) {
        const arrayBuffer = await source.arrayBuffer();
        pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      } else {
        pdf = await pdfjsLib.getDocument(source).promise;
      }
      
      const textParts = [];
      const numPages = pdf.numPages;
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ');
        
        textParts.push(pageText);
        
        // Progress Callback
        if (onProgress) {
          onProgress({
            current: i,
            total: numPages,
            percent: Math.round((i / numPages) * 100)
          });
        }
      }
      
      return textParts.join('\n\n');
      
    } catch (error) {
      throw new Error(`PDF konnte nicht gelesen werden: ${error.message}`);
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // GET PDF INFO
  // ═══════════════════════════════════════════════════════════════════════════
  
  async getInfo(source) {
    await this.init();
    
    let pdf;
    
    try {
      if (source instanceof File) {
        const arrayBuffer = await source.arrayBuffer();
        pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      } else {
        pdf = await pdfjsLib.getDocument(source).promise;
      }
      
      const metadata = await pdf.getMetadata();
      
      return {
        numPages: pdf.numPages,
        title: metadata.info?.Title || '',
        author: metadata.info?.Author || '',
        subject: metadata.info?.Subject || '',
        keywords: metadata.info?.Keywords || '',
        creationDate: metadata.info?.CreationDate || '',
        modDate: metadata.info?.ModDate || ''
      };
      
    } catch (error) {
      throw new Error(`PDF-Info konnte nicht gelesen werden: ${error.message}`);
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // EXTRACT FIRST PAGE ONLY (für schnelle Vorschau)
  // ═══════════════════════════════════════════════════════════════════════════
  
  async extractFirstPage(source) {
    await this.init();
    
    try {
      let pdf;
      
      if (source instanceof File) {
        const arrayBuffer = await source.arrayBuffer();
        pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      } else {
        pdf = await pdfjsLib.getDocument(source).promise;
      }
      
      const page = await pdf.getPage(1);
      const textContent = await page.getTextContent();
      
      return textContent.items
        .map(item => item.str)
        .join(' ');
        
    } catch (error) {
      throw new Error(`Erste Seite konnte nicht gelesen werden: ${error.message}`);
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CHECK IF FILE IS PDF
  // ═══════════════════════════════════════════════════════════════════════════
  
  isPDF(file) {
    if (file instanceof File) {
      return file.type === 'application/pdf' || 
             file.name.toLowerCase().endsWith('.pdf');
    }
    if (typeof file === 'string') {
      return file.toLowerCase().endsWith('.pdf');
    }
    return false;
  }
};

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PDFExtractor;
}
