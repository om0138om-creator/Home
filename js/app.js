/**
 * =====================================================
 * 🎨 Font Studio Pro - Professional Design Application
 * =====================================================
 * تطبيق احترافي لتصميم الصور مع دعم كامل لـ OpenType
 * 
 * @version 2.0.0 (Refactored)
 */

'use strict';

// =====================================================
// 🔧 Configuration & Constants
// =====================================================

const CONFIG = {
    APP_NAME: 'فونت ستوديو',
    VERSION: '2.0.0',
    
    CANVAS: {
        DEFAULT_WIDTH: 1080,
        DEFAULT_HEIGHT: 1080,
        MIN_ZOOM: 0.1,
        MAX_ZOOM: 5,
        ZOOM_STEP: 0.1,
        PADDING: 30
    },
    
    TEXT: {
        DEFAULT_SIZE: 48,
        MIN_SIZE: 8,
        MAX_SIZE: 500,
        DEFAULT_COLOR: '#000000',
        DEFAULT_FONT: 'Cairo'
    },
    
    STORAGE: {
        FONTS: 'fontStudio_fonts',
        PROJECTS: 'fontStudio_projects',
        SETTINGS: 'fontStudio_settings',
        CURRENT_PROJECT: 'fontStudio_currentProject'
    },
    
    OPENTYPE_FEATURES: {
        'liga': { name: 'Standard Ligatures', description: 'الرباطات القياسية' },
        'dlig': { name: 'Discretionary Ligatures', description: 'الرباطات الاختيارية' },
        'calt': { name: 'Contextual Alternates', description: 'البدائل السياقية' },
        'salt': { name: 'Stylistic Alternates', description: 'البدائل الأسلوبية' },
        'swsh': { name: 'Swash', description: 'الزخرفات' },
        'smcp': { name: 'Small Capitals', description: 'الأحرف الكبيرة الصغيرة' },
        'lnum': { name: 'Lining Figures', description: 'الأرقام المصفوفة' },
        'onum': { name: 'Oldstyle Figures', description: 'الأرقام القديمة' },
        'pnum': { name: 'Proportional Figures', description: 'الأرقام المتناسبة' },
        'tnum': { name: 'Tabular Figures', description: 'الأرقام الجدولية' },
        'frac': { name: 'Fractions', description: 'الكسور' },
        'kern': { name: 'Kerning', description: 'المسافات بين الحروف' },
        'case': { name: 'Case-Sensitive Forms', description: 'الأشكال الحساسة' }
    }
};

// =====================================================
// 🎯 Main Application Class
// =====================================================

class FontStudioApp {
    constructor() {
        // State
        this.state = {
            currentTool: 'select',
            zoom: 1,
            panX: 0,
            panY: 0,
            selectedElement: null,
            currentFont: null,
            loadedFonts: new Map(),
            layers: [],
            history: [],
            historyIndex: -1,
            activeOpenTypeFeatures: new Set(),
            activeStylisticSets: new Set(),
            activeCharacterVariants: new Set()
        };
        
        // Text properties
        this.textProperties = {
            text: '',
            fontFamily: CONFIG.TEXT.DEFAULT_FONT,
            fontSize: CONFIG.TEXT.DEFAULT_SIZE,
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'center',
            color: CONFIG.TEXT.DEFAULT_COLOR,
            opacity: 1,
            letterSpacing: 0,
            lineHeight: 1.5,
            textDecoration: 'none',
            shadow: { enabled: false, x: 2, y: 2, blur: 4, color: '#000000' },
            stroke: { enabled: false, width: 1, color: '#000000' },
            openTypeFeatures: {}
        };
        
        // Canvas properties
        this.canvasProperties = {
            width: CONFIG.CANVAS.DEFAULT_WIDTH,
            height: CONFIG.CANVAS.DEFAULT_HEIGHT,
            backgroundColor: '#ffffff',
            backgroundImage: null
        };
        
        // Elements cache
        this.elements = {};
        
        // Initialize
        this.init();
    }
    
    // =====================================================
    // 🚀 Initialization
    // =====================================================
    
    async init() {
        console.log(`🎨 ${CONFIG.APP_NAME} v${CONFIG.VERSION} - Initializing...`);
        
        try {
            this.cacheElements();
            this.setupCanvas();
            this.setupEventListeners();
            this.setupTouchGestures();
            this.generateStylisticSetsUI();
            this.updateFontList();
            
            // إخفاء شاشة التحميل
            this.hideSplashScreen();
            
            // تحميل البيانات المحفوظة في الخلفية
            await this.loadSavedData();
            
            console.log('✅ App initialized successfully');
        } catch (error) {
            console.error('❌ Initialization error:', error);
            this.hideSplashScreen();
        }
    }
    
    cacheElements() {
        // Main containers
        this.elements.app = document.getElementById('app');
        this.elements.splashScreen = document.getElementById('splash-screen');
        this.elements.canvasContainer = document.getElementById('canvas-container');
        this.elements.canvasWrapper = document.getElementById('canvas-wrapper');
        this.elements.canvas = document.getElementById('main-canvas');
        this.elements.ctx = this.elements.canvas.getContext('2d');
        this.elements.selectionLayer = document.getElementById('selection-layer');
        this.elements.sidebar = document.getElementById('sidebar');
        this.elements.canvasTools = document.getElementById('canvas-tools');
        
        // Header
        this.elements.undoBtn = document.getElementById('undo-btn');
        this.elements.redoBtn = document.getElementById('redo-btn');
        this.elements.exportBtn = document.getElementById('export-btn');
        this.elements.projectNameInput = document.getElementById('project-name-input');
        
        // Canvas tools
        this.elements.selectTool = document.getElementById('select-tool');
        this.elements.textTool = document.getElementById('text-tool');
        this.elements.imageTool = document.getElementById('image-tool');
        this.elements.shapeTool = document.getElementById('shape-tool');
        this.elements.zoomIn = document.getElementById('zoom-in');
        this.elements.zoomOut = document.getElementById('zoom-out');
        this.elements.zoomFit = document.getElementById('zoom-fit');
        this.elements.zoomValue = document.getElementById('zoom-value');
        this.elements.addTextBtn = document.getElementById('add-text-btn');
        
        // Panels
        this.elements.sidebarPanels = document.querySelectorAll('.sidebar-panel');
        this.elements.closePanelBtn = document.getElementById('close-panel-btn');
        
        // Text panel
        this.elements.textInput = document.getElementById('text-input');
        this.elements.charCount = document.getElementById('char-count');
        this.elements.fontSizeSlider = document.getElementById('font-size-slider');
        this.elements.fontSizeValue = document.getElementById('font-size-value');
        this.elements.letterSpacingSlider = document.getElementById('letter-spacing-slider');
        this.elements.letterSpacingValue = document.getElementById('letter-spacing-value');
        this.elements.lineHeightSlider = document.getElementById('line-height-slider');
        this.elements.lineHeightValue = document.getElementById('line-height-value');
        
        // Format buttons
        this.elements.boldBtn = document.getElementById('bold-btn');
        this.elements.italicBtn = document.getElementById('italic-btn');
        this.elements.underlineBtn = document.getElementById('underline-btn');
        this.elements.strikethroughBtn = document.getElementById('strikethrough-btn');
        this.elements.alignRightBtn = document.getElementById('align-right-btn');
        this.elements.alignCenterBtn = document.getElementById('align-center-btn');
        this.elements.alignLeftBtn = document.getElementById('align-left-btn');
        this.elements.alignJustifyBtn = document.getElementById('align-justify-btn');
        
        // Fonts panel
        this.elements.fontSearch = document.getElementById('font-search');
        this.elements.fontList = document.getElementById('font-list');
        this.elements.fontsCount = document.getElementById('fonts-count');
        this.elements.addFontsArea = document.getElementById('add-fonts-area');
        this.elements.fontFileInput = document.getElementById('font-file-input');
        
        // OpenType panel
        this.elements.openTypeFeaturesGrid = document.getElementById('opentype-features-grid');
        this.elements.openTypeFeaturesCount = document.getElementById('opentype-features-count');
        this.elements.stylisticSetsGrid = document.getElementById('stylistic-sets-grid');
        this.elements.characterVariantsGrid = document.getElementById('character-variants-grid');
        
        // Colors panel
        this.elements.textColorPicker = document.getElementById('text-color-picker');
        this.elements.textColorHex = document.getElementById('text-color-hex');
        this.elements.textColorPreview = document.getElementById('text-color-preview');
        this.elements.bgColorPicker = document.getElementById('bg-color-picker');
        this.elements.bgColorHex = document.getElementById('bg-color-hex');
        this.elements.bgColorPreview = document.getElementById('bg-color-preview');
        this.elements.textOpacitySlider = document.getElementById('text-opacity-slider');
        this.elements.textOpacityValue = document.getElementById('text-opacity-value');
        
        // Shadow controls
        this.elements.textShadowToggle = document.getElementById('text-shadow-toggle');
        this.elements.textShadowControls = document.getElementById('text-shadow-controls');
        this.elements.shadowXSlider = document.getElementById('shadow-x-slider');
        this.elements.shadowYSlider = document.getElementById('shadow-y-slider');
        this.elements.shadowBlurSlider = document.getElementById('shadow-blur-slider');
        this.elements.shadowColorPicker = document.getElementById('shadow-color-picker');
        
        // Stroke controls
        this.elements.textStrokeToggle = document.getElementById('text-stroke-toggle');
        this.elements.textStrokeControls = document.getElementById('text-stroke-controls');
        this.elements.strokeWidthSlider = document.getElementById('stroke-width-slider');
        this.elements.strokeColorPicker = document.getElementById('stroke-color-picker');
        
        // Layers panel
        this.elements.layersList = document.getElementById('layers-list');
        this.elements.addLayerBtn = document.getElementById('add-layer-btn');
        this.elements.deleteLayerBtn = document.getElementById('delete-layer-btn');
        
        // Export modal
        this.elements.exportModal = document.getElementById('export-modal');
        this.elements.closeExportModal = document.getElementById('close-export-modal');
        this.elements.cancelExport = document.getElementById('cancel-export');
        this.elements.confirmExport = document.getElementById('confirm-export');
        this.elements.exportQualitySlider = document.getElementById('export-quality-slider');
        
        // Toast
        this.elements.toastContainer = document.getElementById('toast-container');
        
        // Home Screen
        this.elements.homeScreen = document.getElementById('home-screen');
        this.elements.startEmptyBtn = document.getElementById('start-empty-btn');
        this.elements.startImageBtn = document.getElementById('start-image-btn');
        this.elements.presetCards = document.querySelectorAll('.preset-card');
        this.elements.homeBgColor = document.getElementById('home-bg-color');
        this.elements.homePresetColors = document.querySelectorAll('#home-preset-colors .preset-color');
        
        // إخفاء التطبيق في البداية
        this.elements.app.style.display = 'none';
        
        // Bottom nav
        this.elements.bottomNavItems = document.querySelectorAll('.nav-item');
        this.elements.bottomNav = document.querySelector('.bottom-nav');

        // InShot Toolbar
        this.elements.inshotToolbar = document.getElementById('inshot-text-toolbar');
        this.elements.inshotOverlay = document.getElementById('inshot-editor-overlay');
        this.elements.inshotInput = document.getElementById('inshot-main-input');
        this.elements.inshotDone = document.getElementById('inshot-done-btn');
        this.elements.inshotClose = document.getElementById('inshot-close-btn');
        this.elements.inshotClear = document.getElementById('inshot-clear-text');
        this.elements.inshotToolBtns = document.querySelectorAll('.inshot-tool-btn');
    }
    
    // =====================================================
    // 🖼️ Canvas Setup (مُصلح بالكامل)
    // =====================================================
    
    setupCanvas() {
        const canvas = this.elements.canvas;
        
        canvas.width = this.canvasProperties.width;
        canvas.height = this.canvasProperties.height;
        
        // Configure context
        this.elements.ctx.imageSmoothingEnabled = true;
        this.elements.ctx.imageSmoothingQuality = 'high';
        
        this.fitCanvasToViewport();
    }
    
    fitCanvasToViewport() {
        const container = this.elements.canvasContainer;
        const wrapper = this.elements.canvasWrapper;
        
        if (!container || !wrapper) return;
        
        const containerRect = container.getBoundingClientRect();
        const padding = CONFIG.CANVAS.PADDING;
        
        const availableWidth = containerRect.width - (padding * 2);
        const availableHeight = containerRect.height - (padding * 2);
        
        const scaleX = availableWidth / this.canvasProperties.width;
        const scaleY = availableHeight / this.canvasProperties.height;
        
        // اختيار أصغر نسبة لضمان ظهور الكانفاس كاملاً
        this.state.zoom = Math.min(scaleX, scaleY, 1);
        
        // تطبيق الأبعاد الأصلية على الـ wrapper
        wrapper.style.width = `${this.canvasProperties.width}px`;
        wrapper.style.height = `${this.canvasProperties.height}px`;
        
        this.updateCanvasTransform();
        this.render();
    }
    
    updateCanvasTransform() {
        const wrapper = this.elements.canvasWrapper;
        if (!wrapper) return;
        
        wrapper.style.transform = `scale(${this.state.zoom})`;
        
        if (this.elements.zoomValue) {
            this.elements.zoomValue.textContent = `${Math.round(this.state.zoom * 100)}%`;
        }
    }
    
    // =====================================================
    // 📱 Event Listeners
    // =====================================================
    
    setupEventListeners() {
        // إغلاق اللوحة السفلية
        if (this.elements.closePanelBtn) {
            this.elements.closePanelBtn.addEventListener('click', () => this.closeBottomPanel());
        }
        
        // InShot Editor
        this.setupInShotEditor();
        
        // إغلاق اللوحة عند لمس الكانفاس
        this.elements.canvasContainer.addEventListener('click', (e) => {
            if (e.target === this.elements.canvasContainer) {
                this.closeBottomPanel();
            }
        });
        
        // Bottom nav
        this.elements.bottomNavItems.forEach(item => {
            item.addEventListener('click', () => {
                const panel = item.dataset.panel;
                
                if (panel === 'text') {
                    const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
                    if (activeLayer && activeLayer.type === 'text') {
                        this.openInShotEditor();
                    } else {
                        this.addTextLayer();
                    }
                } else {
                    this.switchTab(panel);
                }
            });
        });
        
        // Text sliders
        this.setupSliders();
        
        // Format buttons
        this.setupFormatButtons();
        
        // Color pickers
        this.setupColorPickers();
        
        // Font management
        this.setupFontManagement();
        
        // OpenType features
        this.setupOpenTypeFeatures();
        
        // Zoom controls
        this.elements.zoomIn?.addEventListener('click', () => this.zoomIn());
        this.elements.zoomOut?.addEventListener('click', () => this.zoomOut());
        this.elements.zoomFit?.addEventListener('click', () => this.fitCanvasToViewport());
        
        // Canvas tools
        this.elements.selectTool?.addEventListener('click', () => this.setTool('select'));
        this.elements.textTool?.addEventListener('click', () => this.setTool('text'));
        this.elements.imageTool?.addEventListener('click', () => this.setTool('image'));
        this.elements.shapeTool?.addEventListener('click', () => this.setTool('shape'));
        this.elements.addTextBtn?.addEventListener('click', () => this.addTextLayer());
        
        // Header buttons
        this.elements.undoBtn?.addEventListener('click', () => this.undo());
        this.elements.redoBtn?.addEventListener('click', () => this.redo());
        this.elements.exportBtn?.addEventListener('click', () => this.openExportModal());
        
        // Export modal
        this.setupExportModal();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.fitCanvasToViewport(), 100);
        });
        
        // Home Screen
        this.setupHomeScreen();
        
        // Mouse wheel zoom
        this.elements.canvasContainer?.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                e.deltaY < 0 ? this.zoomIn() : this.zoomOut();
            }
        }, { passive: false });
    }
    
    setupInShotEditor() {
        if (!this.elements.inshotInput) return;
        
        this.elements.inshotInput.addEventListener('input', (e) => {
            const text = e.target.value;
            this.textProperties.text = text;
            
            const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
            if (activeLayer && activeLayer.type === 'text') {
                activeLayer.properties.text = text;
            }
            this.render();
        });

        this.elements.inshotClear?.addEventListener('click', () => {
            this.elements.inshotInput.value = '';
            this.elements.inshotInput.dispatchEvent(new Event('input'));
            this.elements.inshotInput.focus();
        });

        this.elements.inshotDone?.addEventListener('click', () => this.closeInShotEditor());
        this.elements.inshotClose?.addEventListener('click', () => this.closeInShotEditor());
        this.elements.inshotOverlay?.addEventListener('click', () => this.closeInShotEditor());

        this.elements.inshotToolBtns?.forEach(btn => {
            btn.addEventListener('click', () => {
                this.elements.inshotToolBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const target = btn.dataset.target;
                if (target === 'keyboard') {
                    this.closeBottomPanel();
                    this.elements.inshotInput.focus();
                } else if (target === 'format') {
                    this.switchTab('text');
                } else {
                    this.switchTab(target);
                }
            });
        });
    }
    
    setupSliders() {
        // Font size
        this.elements.fontSizeSlider?.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            this.textProperties.fontSize = size;
            this.elements.fontSizeValue.textContent = `${size}px`;
            
            const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
            if (activeLayer && activeLayer.type === 'text') {
                activeLayer.properties.fontSize = size;
            }
            this.render();
        });
        
        // Letter spacing
        this.elements.letterSpacingSlider?.addEventListener('input', (e) => {
            const spacing = parseInt(e.target.value);
            this.textProperties.letterSpacing = spacing;
            this.elements.letterSpacingValue.textContent = `${spacing}px`;
            
            const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
            if (activeLayer && activeLayer.type === 'text') {
                activeLayer.properties.letterSpacing = spacing;
            }
            this.render();
        });
        
        // Line height
        this.elements.lineHeightSlider?.addEventListener('input', (e) => {
            const height = parseInt(e.target.value) / 100;
            this.textProperties.lineHeight = height;
            this.elements.lineHeightValue.textContent = height.toFixed(2);
            
            const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
            if (activeLayer && activeLayer.type === 'text') {
                activeLayer.properties.lineHeight = height;
            }
            this.render();
        });
        
        // Opacity
        this.elements.textOpacitySlider?.addEventListener('input', (e) => {
            const opacity = parseInt(e.target.value) / 100;
            this.textProperties.opacity = opacity;
            this.elements.textOpacityValue.textContent = `${e.target.value}%`;
            
            const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
            if (activeLayer && activeLayer.type === 'text') {
                activeLayer.properties.opacity = opacity;
            }
            this.render();
        });
        
        // Shadow controls
        this.elements.textShadowToggle?.addEventListener('change', (e) => {
            this.textProperties.shadow.enabled = e.target.checked;
            this.elements.textShadowControls.style.display = e.target.checked ? 'block' : 'none';
            this.render();
        });
        
        this.elements.shadowXSlider?.addEventListener('input', (e) => {
            this.textProperties.shadow.x = parseInt(e.target.value);
            document.getElementById('shadow-x-value').textContent = `${e.target.value}px`;
            this.render();
        });
        
        this.elements.shadowYSlider?.addEventListener('input', (e) => {
            this.textProperties.shadow.y = parseInt(e.target.value);
            document.getElementById('shadow-y-value').textContent = `${e.target.value}px`;
            this.render();
        });
        
        this.elements.shadowBlurSlider?.addEventListener('input', (e) => {
            this.textProperties.shadow.blur = parseInt(e.target.value);
            document.getElementById('shadow-blur-value').textContent = `${e.target.value}px`;
            this.render();
        });
        
        this.elements.shadowColorPicker?.addEventListener('input', (e) => {
            this.textProperties.shadow.color = e.target.value;
            this.render();
        });
        
        // Stroke controls
        this.elements.textStrokeToggle?.addEventListener('change', (e) => {
            this.textProperties.stroke.enabled = e.target.checked;
            this.elements.textStrokeControls.style.display = e.target.checked ? 'block' : 'none';
            this.render();
        });
        
        this.elements.strokeWidthSlider?.addEventListener('input', (e) => {
            this.textProperties.stroke.width = parseInt(e.target.value);
            document.getElementById('stroke-width-value').textContent = `${e.target.value}px`;
            this.render();
        });
        
        this.elements.strokeColorPicker?.addEventListener('input', (e) => {
            this.textProperties.stroke.color = e.target.value;
            this.render();
        });
    }
    
    setupFormatButtons() {
        this.elements.boldBtn?.addEventListener('click', () => this.toggleBold());
        this.elements.italicBtn?.addEventListener('click', () => this.toggleItalic());
        this.elements.underlineBtn?.addEventListener('click', () => this.toggleUnderline());
        this.elements.strikethroughBtn?.addEventListener('click', () => this.toggleStrikethrough());
        
        this.elements.alignRightBtn?.addEventListener('click', () => this.setTextAlign('right'));
        this.elements.alignCenterBtn?.addEventListener('click', () => this.setTextAlign('center'));
        this.elements.alignLeftBtn?.addEventListener('click', () => this.setTextAlign('left'));
        this.elements.alignJustifyBtn?.addEventListener('click', () => this.setTextAlign('justify'));
    }
    
    setupColorPickers() {
        // Text color
        this.elements.textColorPicker?.addEventListener('input', (e) => {
            const color = e.target.value;
            this.textProperties.color = color;
            this.elements.textColorHex.value = color.toUpperCase();
            this.updateColorPreview('text', color);
            
            const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
            if (activeLayer && activeLayer.type === 'text') {
                activeLayer.properties.color = color;
            }
            this.render();
        });
        
        this.elements.textColorHex?.addEventListener('change', (e) => {
            const color = this.validateHexColor(e.target.value);
            if (color) {
                this.textProperties.color = color;
                this.elements.textColorPicker.value = color;
                this.updateColorPreview('text', color);
                this.render();
            }
        });
        
        // Background color
        this.elements.bgColorPicker?.addEventListener('input', (e) => {
            const color = e.target.value;
            this.canvasProperties.backgroundColor = color;
            this.elements.bgColorHex.value = color.toUpperCase();
            this.updateColorPreview('bg', color);
            this.render();
        });
        
        this.elements.bgColorHex?.addEventListener('change', (e) => {
            const color = this.validateHexColor(e.target.value);
            if (color) {
                this.canvasProperties.backgroundColor = color;
                this.elements.bgColorPicker.value = color;
                this.updateColorPreview('bg', color);
                this.render();
            }
        });
        
        // Preset colors
        document.querySelectorAll('#text-preset-colors .preset-color').forEach(preset => {
            preset.addEventListener('click', () => {
                const color = preset.dataset.color;
                this.textProperties.color = color;
                this.elements.textColorPicker.value = color;
                this.elements.textColorHex.value = color.toUpperCase();
                this.updateColorPreview('text', color);
                
                const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
                if (activeLayer && activeLayer.type === 'text') {
                    activeLayer.properties.color = color;
                }
                this.render();
            });
        });
        
        document.querySelectorAll('#bg-preset-colors .preset-color').forEach(preset => {
            preset.addEventListener('click', () => {
                const color = preset.dataset.color;
                this.canvasProperties.backgroundColor = color;
                this.elements.bgColorPicker.value = color;
                this.elements.bgColorHex.value = color.toUpperCase();
                this.updateColorPreview('bg', color);
                this.render();
            });
        });
    }
    
    setupFontManagement() {
        this.elements.fontSearch?.addEventListener('input', (e) => {
            this.filterFonts(e.target.value);
        });
        
        this.elements.addFontsArea?.addEventListener('click', () => {
            this.elements.fontFileInput.click();
        });
        
        this.elements.fontFileInput?.addEventListener('change', (e) => {
            this.handleFontFiles(e.target.files);
        });
        
        // Drag and drop
        this.elements.addFontsArea?.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elements.addFontsArea.classList.add('dragging');
        });
        
        this.elements.addFontsArea?.addEventListener('dragleave', () => {
            this.elements.addFontsArea.classList.remove('dragging');
        });
        
        this.elements.addFontsArea?.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.addFontsArea.classList.remove('dragging');
            this.handleFontFiles(e.dataTransfer.files);
        });
    }
    
    setupOpenTypeFeatures() {
        this.elements.openTypeFeaturesGrid?.addEventListener('click', (e) => {
            const feature = e.target.closest('.opentype-feature');
            if (feature && !feature.classList.contains('unavailable')) {
                this.toggleOpenTypeFeature(feature.dataset.feature);
            }
        });
    }
    
    setupExportModal() {
        this.elements.closeExportModal?.addEventListener('click', () => this.closeExportModal());
        this.elements.cancelExport?.addEventListener('click', () => this.closeExportModal());
        this.elements.confirmExport?.addEventListener('click', () => this.exportImage());
        
        document.querySelectorAll('.export-format').forEach(format => {
            format.addEventListener('click', () => {
                document.querySelectorAll('.export-format').forEach(f => f.classList.remove('active'));
                format.classList.add('active');
            });
        });
        
        document.querySelectorAll('.quality-preset').forEach(preset => {
            preset.addEventListener('click', () => {
                document.querySelectorAll('.quality-preset').forEach(p => p.classList.remove('active'));
                preset.classList.add('active');
                this.elements.exportQualitySlider.value = parseFloat(preset.dataset.quality) * 100;
            });
        });
    }
    
    setupHomeScreen() {
        let selectedWidth = 1080;
        let selectedHeight = 1080;
        let selectedBgColor = '#ffffff';
        
        // اختيار المقاس
        this.elements.presetCards?.forEach(card => {
            card.addEventListener('click', () => {
                this.elements.presetCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                selectedWidth = parseInt(card.dataset.width);
                selectedHeight = parseInt(card.dataset.height);
            });
        });

        // لون الخلفية
        this.elements.homeBgColor?.addEventListener('input', (e) => {
            selectedBgColor = e.target.value;
            this.elements.homePresetColors.forEach(c => c.classList.remove('active'));
        });

        this.elements.homePresetColors?.forEach(preset => {
            preset.addEventListener('click', () => {
                this.elements.homePresetColors.forEach(c => c.classList.remove('active'));
                preset.classList.add('active');
                selectedBgColor = preset.dataset.color;
                this.elements.homeBgColor.value = selectedBgColor;
            });
        });

        // زر مساحة فارغة
        this.elements.startEmptyBtn?.addEventListener('click', () => {
            // مسح البيانات القديمة
            localforage.removeItem(CONFIG.STORAGE.CURRENT_PROJECT);
            
            this.state.layers = [];
            this.state.selectedElement = null;
            
            this.canvasProperties.width = selectedWidth;
            this.canvasProperties.height = selectedHeight;
            this.canvasProperties.backgroundColor = selectedBgColor;
            
            this.elements.canvas.width = selectedWidth;
            this.elements.canvas.height = selectedHeight;
            
            this.elements.canvasWrapper.style.width = `${selectedWidth}px`;
            this.elements.canvasWrapper.style.height = `${selectedHeight}px`;
            
            // إظهار التطبيق وإخفاء الشاشة الرئيسية
            this.elements.app.style.display = 'flex';
            this.elements.homeScreen.classList.add('hidden-slide');
            
            // إغلاق أي لوحة شبح
            this.closeBottomPanel();
            
            setTimeout(() => {
                this.updateLayersList();
                this.fitCanvasToViewport();
                this.render();
                this.saveHistory();
            }, 100);
        });

        // زر من صورة
        this.elements.startImageBtn?.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                            this.canvasProperties.width = img.width;
                            this.canvasProperties.height = img.height;
                            this.elements.canvas.width = img.width;
                            this.elements.canvas.height = img.height;

                            const layer = {
                                id: `layer_bg_${Date.now()}`,
                                type: 'image',
                                name: 'خلفية الصورة',
                                visible: true,
                                locked: true,
                                opacity: 1,
                                image: img,
                                x: 0, y: 0,
                                width: img.width,
                                height: img.height
                            };
                            this.state.layers = [layer];

                            this.elements.app.style.display = 'flex';
                            this.elements.homeScreen.classList.add('hidden-slide');
                            
                            this.closeBottomPanel();
                            
                            setTimeout(() => {
                                this.updateLayersList();
                                this.fitCanvasToViewport();
                                this.render();
                                this.saveHistory();
                            }, 100);
                        };
                        img.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }
    
    // =====================================================
    // 👆 Touch Gestures (Hammer.js - مُحسّن)
    // =====================================================
    
    setupTouchGestures() {
        const container = this.elements.canvasContainer;
        if (!container || typeof Hammer === 'undefined') return;
        
        const hammer = new Hammer.Manager(container);
        
        // إعداد الإيماءات مع حساسية مناسبة
        const pinch = new Hammer.Pinch();
        const pan = new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 10 });
        const tap = new Hammer.Tap({ taps: 1 });
        
        hammer.add([pinch, pan, tap]);
        pinch.recognizeWith(pan);
        
        let isDragging = false;
        let draggedLayer = null;
        let initialX = 0;
        let initialY = 0;
        let initialFontSize = 48;

        // دالة لإيجاد الطبقة تحت إصبع المستخدم
        const getHitLayer = (center) => {
            const rect = this.elements.canvas.getBoundingClientRect();
            const x = (center.x - rect.left) * (this.elements.canvas.width / rect.width);
            const y = (center.y - rect.top) * (this.elements.canvas.height / rect.height);
            
            const ctx = this.elements.ctx;
            const layers = [...this.state.layers].reverse();
            
            for (const layer of layers) {
                if (!layer.visible || layer.locked) continue;
                
                if (layer.type === 'text') {
                    ctx.save();
                    ctx.font = `${layer.properties.fontSize}px "${layer.properties.fontFamily}"`;
                    const metrics = ctx.measureText(layer.properties.text || ' ');
                    const width = metrics.width;
                    const height = layer.properties.fontSize;
                    ctx.restore();
                    
                    const hitPadding = 30;
                    if (x >= layer.x - width/2 - hitPadding && x <= layer.x + width/2 + hitPadding &&
                        y >= layer.y - height/2 - hitPadding && y <= layer.y + height/2 + hitPadding) {
                        return layer;
                    }
                } else if (layer.type === 'image') {
                    if (x >= layer.x && x <= layer.x + layer.width &&
                        y >= layer.y && y <= layer.y + layer.height) {
                        return layer;
                    }
                }
            }
            return null;
        };
        
        // Tap: تحديد النص وفتح المحرر
        hammer.on('tap', (e) => {
            const hitLayer = getHitLayer(e.center);
            
            if (hitLayer && hitLayer.type === 'text') {
                this.selectLayer(hitLayer.id);
                this.openInShotEditor();
            } else {
                this.state.selectedElement = null;
                this.closeInShotEditor();
                this.closeBottomPanel();
                this.render();
            }
        });

        // Pinch: تكبير/تصغير النص
        hammer.on('pinchstart', (e) => {
            const hitLayer = getHitLayer(e.center);
            if (hitLayer && hitLayer.type === 'text') {
                isDragging = true;
                draggedLayer = hitLayer;
                this.selectLayer(hitLayer.id);
                initialFontSize = hitLayer.properties.fontSize;
            }
        });

        hammer.on('pinchmove', (e) => {
            if (isDragging && draggedLayer && draggedLayer.type === 'text') {
                let newSize = initialFontSize * e.scale;
                newSize = Math.max(CONFIG.TEXT.MIN_SIZE, Math.min(CONFIG.TEXT.MAX_SIZE, newSize));
                
                draggedLayer.properties.fontSize = Math.round(newSize);
                this.textProperties.fontSize = Math.round(newSize);
                
                if (this.elements.fontSizeSlider) {
                    this.elements.fontSizeSlider.value = newSize;
                    this.elements.fontSizeValue.textContent = `${Math.round(newSize)}px`;
                }
                this.render();
            }
        });

        hammer.on('pinchend', () => {
            if (isDragging) {
                this.saveHistory();
                isDragging = false;
                draggedLayer = null;
            }
        });
        
        // Pan: تحريك النص
        hammer.on('panstart', (e) => {
            this.closeBottomPanel();
            
            const hitLayer = getHitLayer(e.center);
            if (hitLayer && !hitLayer.locked) {
                isDragging = true;
                draggedLayer = hitLayer;
                this.selectLayer(hitLayer.id);
                initialX = hitLayer.x;
                initialY = hitLayer.y;
            }
        });
        
        hammer.on('panmove', (e) => {
            if (isDragging && draggedLayer) {
                draggedLayer.x = initialX + (e.deltaX / this.state.zoom);
                draggedLayer.y = initialY + (e.deltaY / this.state.zoom);
                this.render();
            }
        });
        
        hammer.on('panend', () => {
            if (isDragging) {
                this.saveHistory();
                isDragging = false;
                draggedLayer = null;
            }
        });
    }

    // =====================================================
    // 🎨 Rendering
    // =====================================================
    
    render() {
        const ctx = this.elements.ctx;
        const canvas = this.elements.canvas;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // رسم الخلفية
        this.drawBackground();
        
        // رسم الطبقات
        this.drawLayers();
    }
    
    drawBackground() {
        const ctx = this.elements.ctx;
        const canvas = this.elements.canvas;
        
        ctx.fillStyle = this.canvasProperties.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (this.canvasProperties.backgroundImage) {
            ctx.drawImage(
                this.canvasProperties.backgroundImage,
                0, 0, canvas.width, canvas.height
            );
        }
    }
    
    drawLayers() {
        this.state.layers.forEach(layer => {
            if (!layer.visible) return;
            
            const ctx = this.elements.ctx;
            ctx.save();
            ctx.globalAlpha = layer.opacity || 1;
            
            switch (layer.type) {
                case 'image':
                    this.drawImageLayer(layer);
                    break;
                case 'shape':
                    this.drawShapeLayer(layer);
                    break;
                case 'text':
                    this.drawTextLayer(layer);
                    break;
            }
            
            ctx.restore();
        });
    }
    
    drawImageLayer(layer) {
        const ctx = this.elements.ctx;
        if (layer.image) {
            ctx.drawImage(layer.image, layer.x, layer.y, layer.width, layer.height);
        }
    }
    
    drawShapeLayer(layer) {
        const ctx = this.elements.ctx;
        ctx.fillStyle = layer.fill || '#ffffff';
        ctx.strokeStyle = layer.stroke || '#000000';
        ctx.lineWidth = layer.strokeWidth || 1;
        
        switch (layer.shape) {
            case 'rectangle':
                ctx.fillRect(layer.x, layer.y, layer.width, layer.height);
                if (layer.strokeWidth > 0) {
                    ctx.strokeRect(layer.x, layer.y, layer.width, layer.height);
                }
                break;
            case 'circle':
                ctx.beginPath();
                ctx.arc(
                    layer.x + layer.width / 2,
                    layer.y + layer.height / 2,
                    Math.min(layer.width, layer.height) / 2,
                    0, Math.PI * 2
                );
                ctx.fill();
                if (layer.strokeWidth > 0) ctx.stroke();
                break;
        }
    }
    
    drawTextLayer(layer) {
        this.drawTextWithProperties(layer.properties, layer.x, layer.y, layer.id);
    }
    
    drawTextWithProperties(props, x, y, layerId) {
        const ctx = this.elements.ctx;
        if (!props.text) return;
        
        ctx.save();
        
        // Font
        const fontStyle = props.fontStyle === 'italic' ? 'italic ' : '';
        const fontWeight = props.fontWeight === 'bold' ? 'bold ' : '';
        ctx.font = `${fontStyle}${fontWeight}${props.fontSize}px "${props.fontFamily}"`;
        ctx.textAlign = props.textAlign === 'justify' ? 'center' : props.textAlign;
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = props.opacity || 1;
        
        const lines = props.text.split('\n');
        const lineHeightPx = props.fontSize * (props.lineHeight || 1.5);
        const totalHeight = lines.length * lineHeightPx;
        const startY = y - totalHeight / 2 + lineHeightPx / 2;
        
        lines.forEach((line, index) => {
            const lineY = startY + index * lineHeightPx;
            
            // Shadow
            if (props.shadow && props.shadow.enabled) {
                ctx.shadowColor = props.shadow.color;
                ctx.shadowOffsetX = props.shadow.x;
                ctx.shadowOffsetY = props.shadow.y;
                ctx.shadowBlur = props.shadow.blur;
            }
            
            // Stroke
            if (props.stroke && props.stroke.enabled) {
                ctx.strokeStyle = props.stroke.color;
                ctx.lineWidth = props.stroke.width * 2;
                ctx.lineJoin = 'round';
                this.drawTextLine(ctx, line, x, lineY, props.letterSpacing || 0, true);
            }
            
            // Clear shadow for fill
            if (props.shadow && props.shadow.enabled) {
                ctx.shadowColor = 'transparent';
            }
            
            // Fill
            ctx.fillStyle = props.color;
            this.drawTextLine(ctx, line, x, lineY, props.letterSpacing || 0, false);
            
            // Text decoration
            this.drawTextDecoration(ctx, line, x, lineY, props);
        });
        
        // رسم مربع التحديد (InShot Style)
        if (layerId && this.state.selectedElement === layerId) {
            this.drawSelectionBox(ctx, props, x, y, lines, lineHeightPx, totalHeight);
        }

        ctx.restore();
    }
    
    drawTextLine(ctx, text, x, y, letterSpacing, isStroke) {
        if (letterSpacing === 0) {
            isStroke ? ctx.strokeText(text, x, y) : ctx.fillText(text, x, y);
            return;
        }
        
        const chars = [...text];
        let totalWidth = 0;
        const charWidths = chars.map(char => {
            const width = ctx.measureText(char).width;
            totalWidth += width + letterSpacing;
            return width;
        });
        totalWidth -= letterSpacing;
        
        let currentX = x - totalWidth / 2;
        
        chars.forEach((char, i) => {
            const drawX = currentX + charWidths[i] / 2;
            isStroke ? ctx.strokeText(char, drawX, y) : ctx.fillText(char, drawX, y);
            currentX += charWidths[i] + letterSpacing;
        });
    }
    
    drawTextDecoration(ctx, line, x, lineY, props) {
        if (!props.textDecoration || props.textDecoration === 'none') return;
        
        const textWidth = ctx.measureText(line).width;
        ctx.strokeStyle = props.color;
        ctx.lineWidth = props.fontSize * 0.05;
        
        if (props.textDecoration === 'underline') {
            const underlineY = lineY + props.fontSize * 0.2;
            ctx.beginPath();
            ctx.moveTo(x - textWidth / 2, underlineY);
            ctx.lineTo(x + textWidth / 2, underlineY);
            ctx.stroke();
        }
        
        if (props.textDecoration === 'line-through') {
            ctx.beginPath();
            ctx.moveTo(x - textWidth / 2, lineY);
            ctx.lineTo(x + textWidth / 2, lineY);
            ctx.stroke();
        }
    }
    
    drawSelectionBox(ctx, props, x, y, lines, lineHeightPx, totalHeight) {
        // حساب عرض أطول سطر
        let maxLineWidth = 0;
        lines.forEach(line => {
            const w = ctx.measureText(line).width;
            if (w > maxLineWidth) maxLineWidth = w;
        });
        
        const padding = 25;
        const boxWidth = maxLineWidth + padding * 2;
        const boxHeight = totalHeight + padding * 2;
        const boxX = x - boxWidth / 2;
        const boxY = y - boxHeight / 2;

        // إطار أبيض
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        ctx.setLineDash([]);
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        ctx.shadowColor = 'transparent';

        // زر الحذف (أحمر - أعلى اليسار)
        const btnRadius = 14;
        ctx.fillStyle = '#ff4d4f';
        ctx.beginPath();
        ctx.arc(boxX, boxY, btnRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('×', boxX, boxY);

        // زر التكبير (أبيض - أسفل اليمين)
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(boxX + boxWidth, boxY + boxHeight, btnRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('⤢', boxX + boxWidth, boxY + boxHeight);
    }
    
    // =====================================================
    // 🔤 OpenType Features
    // =====================================================
    
    buildOpenTypeFontFeatureSettings() {
        const features = [];
        
        this.state.activeOpenTypeFeatures.forEach(f => features.push(`"${f}" 1`));
        this.state.activeStylisticSets.forEach(ss => features.push(`"${ss}" 1`));
        this.state.activeCharacterVariants.forEach(cv => features.push(`"${cv}" 1`));
        
        return features.join(', ') || 'normal';
    }
    
    toggleOpenTypeFeature(featureTag) {
        const el = document.querySelector(`.opentype-feature[data-feature="${featureTag}"]`);
        
        if (this.state.activeOpenTypeFeatures.has(featureTag)) {
            this.state.activeOpenTypeFeatures.delete(featureTag);
            el?.classList.remove('active');
        } else {
            this.state.activeOpenTypeFeatures.add(featureTag);
            el?.classList.add('active');
        }
        
        this.updateOpenTypeFeaturesCount();
        this.applyOpenTypeFeatures();
        this.render();
    }
    
    toggleStylisticSet(ssTag) {
        const el = document.querySelector(`.stylistic-set[data-ss="${ssTag}"]`);
        
        if (this.state.activeStylisticSets.has(ssTag)) {
            this.state.activeStylisticSets.delete(ssTag);
            el?.classList.remove('active');
        } else {
            this.state.activeStylisticSets.add(ssTag);
            el?.classList.add('active');
        }
        
        this.updateOpenTypeFeaturesCount();
        this.applyOpenTypeFeatures();
        this.render();
    }
    
    toggleCharacterVariant(cvTag) {
        const el = document.querySelector(`.stylistic-set[data-cv="${cvTag}"]`);
        
        if (this.state.activeCharacterVariants.has(cvTag)) {
            this.state.activeCharacterVariants.delete(cvTag);
            el?.classList.remove('active');
        } else {
            this.state.activeCharacterVariants.add(cvTag);
            el?.classList.add('active');
        }
        
        this.updateOpenTypeFeaturesCount();
        this.applyOpenTypeFeatures();
        this.render();
    }
    
    applyOpenTypeFeatures() {
        const featureSettings = this.buildOpenTypeFontFeatureSettings();
        this.textProperties.openTypeFeatures = featureSettings;
        
        const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
        if (activeLayer && activeLayer.type === 'text') {
            activeLayer.properties.openTypeFeatures = featureSettings;
        }
    }
    
    updateOpenTypeFeaturesCount() {
        const total = this.state.activeOpenTypeFeatures.size + 
                      this.state.activeStylisticSets.size + 
                      this.state.activeCharacterVariants.size;
        
        if (this.elements.openTypeFeaturesCount) {
            this.elements.openTypeFeaturesCount.textContent = total;
        }
    }
    
    generateStylisticSetsUI() {
        // SS01-SS20
        const ssGrid = this.elements.stylisticSetsGrid;
        if (ssGrid) {
            ssGrid.innerHTML = '';
            for (let i = 1; i <= 20; i++) {
                const ssTag = `ss${i.toString().padStart(2, '0')}`;
                const el = document.createElement('div');
                el.className = 'stylistic-set';
                el.dataset.ss = ssTag;
                el.textContent = `SS${i.toString().padStart(2, '0')}`;
                el.addEventListener('click', () => this.toggleStylisticSet(ssTag));
                ssGrid.appendChild(el);
            }
        }
        
        // CV01-CV20
        const cvGrid = this.elements.characterVariantsGrid;
        if (cvGrid) {
            cvGrid.innerHTML = '';
            for (let i = 1; i <= 20; i++) {
                const cvTag = `cv${i.toString().padStart(2, '0')}`;
                const el = document.createElement('div');
                el.className = 'stylistic-set';
                el.dataset.cv = cvTag;
                el.textContent = `CV${i.toString().padStart(2, '0')}`;
                el.addEventListener('click', () => this.toggleCharacterVariant(cvTag));
                cvGrid.appendChild(el);
            }
        }
    }
    
    async detectFontOpenTypeFeatures(fontData) {
        try {
            if (typeof opentype === 'undefined') return new Set();
            
            const font = await opentype.parse(fontData);
            const features = new Set();
            
            if (font.tables.gsub?.features) {
                font.tables.gsub.features.forEach(f => f.tag && features.add(f.tag));
            }
            
            if (font.tables.gpos?.features) {
                font.tables.gpos.features.forEach(f => f.tag && features.add(f.tag));
            }
            
            return features;
        } catch (error) {
            console.warn('Could not detect OpenType features:', error);
            return new Set();
        }
    }
    
    updateFeatureAvailability(availableFeatures) {
        document.querySelectorAll('.opentype-feature').forEach(el => {
            const feature = el.dataset.feature;
            el.classList.toggle('unavailable', !availableFeatures.has(feature));
        });
        
        document.querySelectorAll('.stylistic-set[data-ss]').forEach(el => {
            el.classList.toggle('unavailable', !availableFeatures.has(el.dataset.ss));
        });
        
        document.querySelectorAll('.stylistic-set[data-cv]').forEach(el => {
            el.classList.toggle('unavailable', !availableFeatures.has(el.dataset.cv));
        });
    }
    
    // =====================================================
    // 🔤 Font Management
    // =====================================================
    
    async handleFontFiles(files) {
        const validExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
        let addedCount = 0;
        
        for (const file of files) {
            const ext = '.' + file.name.split('.').pop().toLowerCase();
            
            if (!validExtensions.includes(ext)) {
                this.showToast('صيغة غير مدعومة', 'warning', `الملف ${file.name} غير مدعوم`);
                continue;
            }
            
            try {
                const fontData = await this.readFileAsArrayBuffer(file);
                const fontName = file.name.replace(/\.[^.]+$/, '');
                const fontFamily = `CustomFont_${Date.now()}_${fontName}`;
                
                const fontFace = new FontFace(fontFamily, fontData);
                await fontFace.load();
                document.fonts.add(fontFace);
                
                const features = await this.detectFontOpenTypeFeatures(fontData);
                
                this.state.loadedFonts.set(fontFamily, {
                    name: fontName,
                    family: fontFamily,
                    file: file.name,
                    features: features,
                    data: fontData
                });
                
                addedCount++;
                
                if (this.state.loadedFonts.size === 1) {
                    this.selectFont(fontFamily);
                }
            } catch (error) {
                console.error(`Error loading font ${file.name}:`, error);
                this.showToast('خطأ في تحميل الخط', 'error', error.message);
            }
        }
        
        if (addedCount > 0) {
            this.updateFontList();
            this.saveFontsToStorage();
            this.showToast('تم إضافة الخطوط', 'success', `تمت إضافة ${addedCount} خط بنجاح`);
        }
    }
    
    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }
    
    updateFontList() {
        const fontList = this.elements.fontList;
        if (!fontList) return;
        
        fontList.innerHTML = '';
        
        const systemFonts = ['Cairo', 'Tajawal', 'Arial', 'Tahoma', 'Times New Roman'];
        
        systemFonts.forEach(fontName => {
            const item = this.createFontListItem(fontName, fontName, true);
            fontList.appendChild(item);
        });
        
        this.state.loadedFonts.forEach((fontInfo, fontFamily) => {
            const item = this.createFontListItem(fontInfo.name, fontFamily, false);
            fontList.appendChild(item);
        });
        
        if (this.elements.fontsCount) {
            this.elements.fontsCount.textContent = systemFonts.length + this.state.loadedFonts.size;
        }
    }
    
    createFontListItem(displayName, fontFamily, isSystem) {
        const item = document.createElement('div');
        item.className = 'font-item';
        item.dataset.family = fontFamily;
        
        if (fontFamily === this.textProperties.fontFamily) {
            item.classList.add('active');
        }
        
        item.innerHTML = `
            <div style="flex: 1;">
                <div class="font-item-preview" style="font-family: '${fontFamily}'">أبجد هوز حطي</div>
                <div class="font-item-name">${displayName}</div>
            </div>
            ${!isSystem ? `
                <button class="section-btn delete-font" title="حذف" style="color: var(--danger-500);">
                    <i class="fas fa-trash"></i>
                </button>
            ` : ''}
        `;
        
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-font')) {
                this.selectFont(fontFamily);
            }
        });
        
        const deleteBtn = item.querySelector('.delete-font');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteFont(fontFamily);
            });
        }
        
        return item;
    }
    
    selectFont(fontFamily) {
        this.textProperties.fontFamily = fontFamily;
        
        document.querySelectorAll('.font-item').forEach(item => {
            item.classList.toggle('active', item.dataset.family === fontFamily);
        });
        
        const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
        if (activeLayer && activeLayer.type === 'text') {
            activeLayer.properties.fontFamily = fontFamily;
        }
        
        const fontInfo = this.state.loadedFonts.get(fontFamily);
        if (fontInfo && fontInfo.features) {
            this.updateFeatureAvailability(fontInfo.features);
        } else {
            this.updateFeatureAvailability(new Set(Object.keys(CONFIG.OPENTYPE_FEATURES)));
        }
        
        this.state.currentFont = fontFamily;
        this.render();
    }
    
    filterFonts(query) {
        const items = document.querySelectorAll('.font-item');
        const lowerQuery = query.toLowerCase();
        
        items.forEach(item => {
            const name = item.querySelector('.font-item-name')?.textContent.toLowerCase() || '';
            item.style.display = name.includes(lowerQuery) ? '' : 'none';
        });
    }
    
    deleteFont(fontFamily) {
        if (confirm('هل تريد حذف هذا الخط؟')) {
            this.state.loadedFonts.delete(fontFamily);
            this.updateFontList();
            this.saveFontsToStorage();
            
            if (this.textProperties.fontFamily === fontFamily) {
                this.selectFont('Cairo');
            }
            
            this.showToast('تم حذف الخط', 'success');
        }
    }
    
    async saveFontsToStorage() {
        try {
            const fontsData = [];
            
            this.state.loadedFonts.forEach((fontInfo) => {
                const base64 = this.arrayBufferToBase64(fontInfo.data);
                fontsData.push({
                    name: fontInfo.name,
                    family: fontInfo.family,
                    file: fontInfo.file,
                    features: Array.from(fontInfo.features),
                    dataBase64: base64
                });
            });
            
            await localforage.setItem(CONFIG.STORAGE.FONTS, fontsData);
        } catch (error) {
            console.error('Error saving fonts:', error);
        }
    }
    
    async loadFontsFromStorage() {
        try {
            const fontsData = await localforage.getItem(CONFIG.STORAGE.FONTS);
            
            if (fontsData && Array.isArray(fontsData)) {
                for (const fontData of fontsData) {
                    try {
                        const arrayBuffer = this.base64ToArrayBuffer(fontData.dataBase64);
                        const fontFace = new FontFace(fontData.family, arrayBuffer);
                        await fontFace.load();
                        document.fonts.add(fontFace);
                        
                        this.state.loadedFonts.set(fontData.family, {
                            name: fontData.name,
                            family: fontData.family,
                            file: fontData.file,
                            features: new Set(fontData.features),
                            data: arrayBuffer
                        });
                    } catch (error) {
                        console.warn(`Failed to load font ${fontData.name}:`, error);
                    }
                }
                
                this.updateFontList();
            }
        } catch (error) {
            console.error('Error loading fonts from storage:', error);
        }
    }
    
    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
    
    base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }
    
    // =====================================================
    // 🎨 Text Formatting
    // =====================================================
    
    toggleBold() {
        const newWeight = this.textProperties.fontWeight === 'bold' ? 'normal' : 'bold';
        this.textProperties.fontWeight = newWeight;
        this.elements.boldBtn?.classList.toggle('active', newWeight === 'bold');
        
        const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
        if (activeLayer && activeLayer.type === 'text') {
            activeLayer.properties.fontWeight = newWeight;
        }
        this.render();
    }
    
    toggleItalic() {
        const newStyle = this.textProperties.fontStyle === 'italic' ? 'normal' : 'italic';
        this.textProperties.fontStyle = newStyle;
        this.elements.italicBtn?.classList.toggle('active', newStyle === 'italic');
        
        const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
        if (activeLayer && activeLayer.type === 'text') {
            activeLayer.properties.fontStyle = newStyle;
        }
        this.render();
    }
    
    toggleUnderline() {
        const newDec = this.textProperties.textDecoration === 'underline' ? 'none' : 'underline';
        this.textProperties.textDecoration = newDec;
        this.elements.underlineBtn?.classList.toggle('active', newDec === 'underline');
        this.elements.strikethroughBtn?.classList.remove('active');
        
        const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
        if (activeLayer && activeLayer.type === 'text') {
            activeLayer.properties.textDecoration = newDec;
        }
        this.render();
    }
    
    toggleStrikethrough() {
        const newDec = this.textProperties.textDecoration === 'line-through' ? 'none' : 'line-through';
        this.textProperties.textDecoration = newDec;
        this.elements.strikethroughBtn?.classList.toggle('active', newDec === 'line-through');
        this.elements.underlineBtn?.classList.remove('active');
        
        const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
        if (activeLayer && activeLayer.type === 'text') {
            activeLayer.properties.textDecoration = newDec;
        }
        this.render();
    }
    
    setTextAlign(align) {
        this.textProperties.textAlign = align;
        
        this.elements.alignRightBtn?.classList.toggle('active', align === 'right');
        this.elements.alignCenterBtn?.classList.toggle('active', align === 'center');
        this.elements.alignLeftBtn?.classList.toggle('active', align === 'left');
        this.elements.alignJustifyBtn?.classList.toggle('active', align === 'justify');
        
        const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
        if (activeLayer && activeLayer.type === 'text') {
            activeLayer.properties.textAlign = align;
        }
        this.render();
    }
    
    // =====================================================
    // 🎨 UI Helpers
    // =====================================================
    
    updateColorPreview(type, color) {
        const previewId = type === 'text' ? 'text-color-preview' : 'bg-color-preview';
        const preview = document.getElementById(previewId);
        const inner = preview?.querySelector('.color-preview-inner');
        if (inner) inner.style.background = color;
    }
    
    validateHexColor(value) {
        const hex = value.startsWith('#') ? value : `#${value}`;
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return hex;
        if (/^#[0-9A-Fa-f]{3}$/.test(hex)) {
            return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        }
        return null;
    }
    
    switchTab(tabName) {
        // منع فتح لوحة النص القديمة
        if (tabName === 'text') {
            // بدلاً من ذلك، نفتح محرر InShot إذا كان هناك نص محدد
            const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
            if (activeLayer && activeLayer.type === 'text') {
                this.openInShotEditor();
            }
            return;
        }

        this.elements.sidebarPanels?.forEach(panel => {
            panel.classList.toggle('active', panel.id === `panel-${tabName}`);
        });
        
        this.elements.bottomNavItems?.forEach(item => {
            item.classList.toggle('active', item.dataset.panel === tabName);
        });
        
        this.elements.sidebar?.classList.add('active');
    }

    closeBottomPanel() {
        this.elements.sidebar?.classList.remove('active');
        
        this.elements.bottomNavItems?.forEach(item => {
            item.classList.remove('active');
        });
    }

    openInShotEditor() {
        if (!this.elements.inshotToolbar) return;
        
        this.elements.inshotToolbar.classList.remove('hidden');
        this.elements.inshotOverlay?.classList.remove('hidden');
        
        if (this.elements.bottomNav) this.elements.bottomNav.style.display = 'none';
        if (this.elements.canvasTools) this.elements.canvasTools.style.display = 'none';
        
        this.closeBottomPanel();
        
        const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
        if (activeLayer && activeLayer.type === 'text') {
            this.elements.inshotInput.value = activeLayer.properties.text || '';
        }
        
        setTimeout(() => this.elements.inshotInput.focus(), 100);
    }

    closeInShotEditor() {
        if (!this.elements.inshotToolbar) return;
        
        this.elements.inshotToolbar.classList.add('hidden');
        this.elements.inshotOverlay?.classList.add('hidden');
        
        if (this.elements.bottomNav) this.elements.bottomNav.style.display = 'flex';
        if (this.elements.canvasTools) this.elements.canvasTools.style.display = 'flex';
        
        this.closeBottomPanel();
        this.saveHistory();
        this.render();
    }
    
    setTool(tool) {
        this.state.currentTool = tool;
        
        this.elements.selectTool?.classList.toggle('active', tool === 'select');
        this.elements.textTool?.classList.toggle('active', tool === 'text');
        this.elements.imageTool?.classList.toggle('active', tool === 'image');
        this.elements.shapeTool?.classList.toggle('active', tool === 'shape');
        
        const cursors = { 'select': 'default', 'text': 'text', 'image': 'crosshair', 'shape': 'crosshair' };
        if (this.elements.canvasContainer) {
            this.elements.canvasContainer.style.cursor = cursors[tool] || 'default';
        }
    }
    
    // =====================================================
    // 🔍 Zoom Controls
    // =====================================================
    
    zoomIn() {
        this.state.zoom = Math.min(this.state.zoom + CONFIG.CANVAS.ZOOM_STEP, CONFIG.CANVAS.MAX_ZOOM);
        this.updateCanvasTransform();
    }
    
    zoomOut() {
        this.state.zoom = Math.max(this.state.zoom - CONFIG.CANVAS.ZOOM_STEP, CONFIG.CANVAS.MIN_ZOOM);
        this.updateCanvasTransform();
    }
    
    // =====================================================
    // 📚 Layer Management
    // =====================================================
    
    addTextLayer() {
        const defaultText = 'نص جديد';
        const initialProps = {
            ...this.textProperties,
            text: defaultText,
            color: '#000000'
        };
        
        const layer = {
            id: `layer_${Date.now()}`,
            type: 'text',
            name: `نص ${this.state.layers.filter(l => l.type === 'text').length + 1}`,
            visible: true,
            locked: false,
            opacity: 1,
            x: this.canvasProperties.width / 2,
            y: this.canvasProperties.height / 2,
            properties: initialProps
        };
        
        this.state.layers.push(layer);
        this.updateLayersList();
        this.selectLayer(layer.id);
        this.saveHistory();
        this.render();
        
        setTimeout(() => this.openInShotEditor(), 50);
        
        this.showToast('تمت الإضافة', 'success', 'تم إضافة طبقة نص جديدة');
    }
    
    updateLayersList() {
        const list = this.elements.layersList;
        if (!list) return;
        
        list.innerHTML = '';
        
        [...this.state.layers].reverse().forEach(layer => {
            const item = document.createElement('div');
            item.className = `layer-item ${layer.id === this.state.selectedElement ? 'active' : ''}`;
            item.dataset.id = layer.id;
            
            const icon = layer.type === 'text' ? 'fa-font' : 
                         layer.type === 'image' ? 'fa-image' : 'fa-shapes';
            
            const typeName = layer.type === 'text' ? 'نص' : 
                             layer.type === 'image' ? 'صورة' : 'شكل';
            
            item.innerHTML = `
                <div class="layer-thumb"><i class="fas ${icon}"></i></div>
                <div class="layer-info">
                    <div class="layer-name">${layer.name}</div>
                    <div class="layer-type">${typeName}</div>
                </div>
                <div class="layer-actions">
                    <button class="layer-action-btn ${layer.visible ? 'active' : ''}" data-action="visibility" title="الرؤية">
                        <i class="fas ${layer.visible ? 'fa-eye' : 'fa-eye-slash'}"></i>
                    </button>
                    <button class="layer-action-btn ${layer.locked ? 'active' : ''}" data-action="lock" title="القفل">
                        <i class="fas ${layer.locked ? 'fa-lock' : 'fa-unlock'}"></i>
                    </button>
                </div>
            `;
            
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.layer-action-btn')) {
                    this.selectLayer(layer.id);
                }
            });
            
            item.querySelectorAll('.layer-action-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    if (action === 'visibility') {
                        layer.visible = !layer.visible;
                    } else if (action === 'lock') {
                        layer.locked = !layer.locked;
                    }
                    this.updateLayersList();
                    this.render();
                });
            });
            
            list.appendChild(item);
        });
    }
    
    selectLayer(layerId) {
        this.state.selectedElement = layerId;
        
        const activeLayer = this.state.layers.find(l => l.id === layerId);
        if (activeLayer && activeLayer.type === 'text') {
            this.textProperties = { ...activeLayer.properties };
            
            // تحديث واجهة المستخدم
            if (this.elements.fontSizeSlider) {
                this.elements.fontSizeSlider.value = this.textProperties.fontSize;
                this.elements.fontSizeValue.textContent = `${this.textProperties.fontSize}px`;
            }
            
            if (this.elements.textColorPicker) {
                this.elements.textColorPicker.value = this.textProperties.color;
                this.updateColorPreview('text', this.textProperties.color);
            }
            
            if (this.elements.letterSpacingSlider) {
                this.elements.letterSpacingSlider.value = this.textProperties.letterSpacing || 0;
                this.elements.letterSpacingValue.textContent = `${this.textProperties.letterSpacing || 0}px`;
            }
        }
        
        this.updateLayersList();
        this.render();
    }
    
    deleteSelectedLayer() {
        if (!this.state.selectedElement) return;
        
        const index = this.state.layers.findIndex(l => l.id === this.state.selectedElement);
        if (index > -1) {
            this.state.layers.splice(index, 1);
            this.state.selectedElement = null;
            this.updateLayersList();
            this.saveHistory();
            this.render();
            this.showToast('تم الحذف', 'success', 'تم حذف الطبقة');
        }
    }
    
    // =====================================================
    // 📜 History (Undo/Redo)
    // =====================================================
    
    saveHistory() {
        this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
        
        const snapshot = {
            layers: JSON.parse(JSON.stringify(this.state.layers)),
            textProperties: JSON.parse(JSON.stringify(this.textProperties)),
            canvasProperties: JSON.parse(JSON.stringify(this.canvasProperties))
        };
        
        this.state.history.push(snapshot);
        this.state.historyIndex = this.state.history.length - 1;
        
        if (this.state.history.length > 50) {
            this.state.history.shift();
            this.state.historyIndex--;
        }
        
        this.updateHistoryButtons();
    }
    
    undo() {
        if (this.state.historyIndex > 0) {
            this.state.historyIndex--;
            this.restoreSnapshot(this.state.history[this.state.historyIndex]);
            this.updateHistoryButtons();
            this.render();
        }
    }
    
    redo() {
        if (this.state.historyIndex < this.state.history.length - 1) {
            this.state.historyIndex++;
            this.restoreSnapshot(this.state.history[this.state.historyIndex]);
            this.updateHistoryButtons();
            this.render();
        }
    }
    
    restoreSnapshot(snapshot) {
        this.state.layers = JSON.parse(JSON.stringify(snapshot.layers));
        this.textProperties = JSON.parse(JSON.stringify(snapshot.textProperties));
        this.canvasProperties = JSON.parse(JSON.stringify(snapshot.canvasProperties));
        this.updateLayersList();
    }
    
    updateHistoryButtons() {
        if (this.elements.undoBtn) {
            this.elements.undoBtn.disabled = this.state.historyIndex <= 0;
        }
        if (this.elements.redoBtn) {
            this.elements.redoBtn.disabled = this.state.historyIndex >= this.state.history.length - 1;
        }
    }
    
    // =====================================================
    // 💾 Save & Export
    // =====================================================
    
    async saveProject() {
        try {
            const project = {
                name: this.elements.projectNameInput?.value || 'تصميم جديد',
                version: CONFIG.VERSION,
                timestamp: Date.now(),
                canvas: this.canvasProperties,
                text: this.textProperties,
                layers: this.state.layers,
                openTypeFeatures: Array.from(this.state.activeOpenTypeFeatures),
                stylisticSets: Array.from(this.state.activeStylisticSets),
                characterVariants: Array.from(this.state.activeCharacterVariants)
            };
            
            await localforage.setItem(CONFIG.STORAGE.CURRENT_PROJECT, project);
            this.showToast('تم الحفظ', 'success', 'تم حفظ المشروع بنجاح');
        } catch (error) {
            console.error('Error saving project:', error);
            this.showToast('خطأ في الحفظ', 'error', error.message);
        }
    }
    
    async loadProject() {
        try {
            const project = await localforage.getItem(CONFIG.STORAGE.CURRENT_PROJECT);
            
            if (project) {
                if (this.elements.projectNameInput) {
                    this.elements.projectNameInput.value = project.name || 'تصميم جديد';
                }
                
                this.canvasProperties = { ...this.canvasProperties, ...project.canvas };
                this.textProperties = { ...this.textProperties, ...project.text };
                this.state.layers = project.layers || [];
                
                if (project.openTypeFeatures) {
                    this.state.activeOpenTypeFeatures = new Set(project.openTypeFeatures);
                }
                
                if (project.stylisticSets) {
                    this.state.activeStylisticSets = new Set(project.stylisticSets);
                }
                
                if (project.characterVariants) {
                    this.state.activeCharacterVariants = new Set(project.characterVariants);
                }
                
                this.updateLayersList();
                this.updateOpenTypeFeaturesCount();
            }
        } catch (error) {
            console.error('Error loading project:', error);
        }
    }
    
    openExportModal() {
        this.elements.exportModal?.classList.add('active');
        
        const exportWidth = document.getElementById('export-width');
        const exportHeight = document.getElementById('export-height');
        
        if (exportWidth) exportWidth.textContent = this.canvasProperties.width;
        if (exportHeight) exportHeight.textContent = this.canvasProperties.height;
    }
    
    closeExportModal() {
        this.elements.exportModal?.classList.remove('active');
    }
    
    exportImage() {
        const formatEl = document.querySelector('.export-format.active');
        const format = formatEl?.dataset.format || 'png';
        const quality = parseInt(this.elements.exportQualitySlider?.value || 90) / 100;
        
        // إلغاء تحديد أي عنصر قبل التصدير
        const previousSelection = this.state.selectedElement;
        this.state.selectedElement = null;
        this.render();
        
        const canvas = this.elements.canvas;
        let mimeType = 'image/png';
        let extension = 'png';
        
        switch (format) {
            case 'jpg':
                mimeType = 'image/jpeg';
                extension = 'jpg';
                break;
            case 'webp':
                mimeType = 'image/webp';
                extension = 'webp';
                break;
        }
        
        canvas.toBlob((blob) => {
            const fileName = `${this.elements.projectNameInput?.value || 'design'}.${extension}`;
            
            if (typeof saveAs !== 'undefined') {
                saveAs(blob, fileName);
            } else {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(link.href);
            }
            
            this.closeExportModal();
            this.showToast('تم التصدير', 'success', `تم حفظ الصورة بصيغة ${format.toUpperCase()}`);
            
            // استعادة التحديد
            this.state.selectedElement = previousSelection;
            this.render();
        }, mimeType, quality);
    }
    
    // =====================================================
    // ⌨️ Keyboard Shortcuts
    // =====================================================
    
    handleKeyboard(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'z':
                    e.preventDefault();
                    e.shiftKey ? this.redo() : this.undo();
                    break;
                case 'y':
                    e.preventDefault();
                    this.redo();
                    break;
                case 's':
                    e.preventDefault();
                    this.saveProject();
                    break;
                case 'e':
                    e.preventDefault();
                    this.openExportModal();
                    break;
                case 'b':
                    e.preventDefault();
                    this.toggleBold();
                    break;
                case 'i':
                    e.preventDefault();
                    this.toggleItalic();
                    break;
                case 'u':
                    e.preventDefault();
                    this.toggleUnderline();
                    break;
                case '=':
                case '+':
                    e.preventDefault();
                    this.zoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    this.zoomOut();
                    break;
                case '0':
                    e.preventDefault();
                    this.fitCanvasToViewport();
                    break;
            }
        }
        
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (document.activeElement.tagName !== 'INPUT' && 
                document.activeElement.tagName !== 'TEXTAREA') {
                this.deleteSelectedLayer();
            }
        }
        
        if (e.key === 'Escape') {
            this.closeExportModal();
            this.closeInShotEditor();
            this.closeBottomPanel();
            this.state.selectedElement = null;
            this.render();
        }
    }
    
    // =====================================================
    // 🔔 Toast Notifications
    // =====================================================
    
    showToast(title, type = 'info', message = '') {
        const container = this.elements.toastContainer;
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        
        toast.innerHTML = `
            <div class="toast-icon"><i class="fas ${icons[type] || icons.info}"></i></div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                ${message ? `<div class="toast-message">${message}</div>` : ''}
            </div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        
        container.appendChild(toast);
        
        requestAnimationFrame(() => toast.classList.add('show'));
        
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.removeToast(toast);
        });
        
        setTimeout(() => this.removeToast(toast), 4000);
    }
    
    removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }
    
    // =====================================================
    // 🚀 Splash Screen & Data Loading
    // =====================================================
    
    hideSplashScreen() {
        setTimeout(() => {
            this.elements.splashScreen?.classList.add('hidden');
        }, 300);
    }
    
    async loadSavedData() {
        await this.loadFontsFromStorage();
        await this.loadProject();
        
        // إغلاق اللوحات عند بدء التشغيل
        this.closeBottomPanel();
        
        this.saveHistory();
    }
}

// =====================================================
// 🎬 Initialize Application
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    document.fonts.ready.then(() => {
        window.fontStudio = new FontStudioApp();
    });
});

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('ServiceWorker registered:', reg.scope))
            .catch(err => console.log('ServiceWorker registration failed:', err));
    });
}

// Install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});
