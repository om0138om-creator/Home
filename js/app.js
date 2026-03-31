/**
 * =====================================================
 * 🎨 Font Studio Pro - Professional Design Application
 * =====================================================
 * تطبيق احترافي لتصميم الصور مع دعم كامل لـ OpenType
 * 
 * @author Font Studio Team
 * @version 1.0.0
 * @license MIT
 */

'use strict';

// =====================================================
// 🔧 Configuration & Constants
// =====================================================

const CONFIG = {
    APP_NAME: 'فونت ستوديو',
    VERSION: '1.0.0',
    
    // Canvas defaults
    CANVAS: {
        DEFAULT_WIDTH: 1080,
        DEFAULT_HEIGHT: 1080,
        MIN_ZOOM: 0.1,
        MAX_ZOOM: 5,
        ZOOM_STEP: 0.1
    },
    
    // Text defaults
    TEXT: {
        DEFAULT_SIZE: 48,
        MIN_SIZE: 8,
        MAX_SIZE: 500,
        DEFAULT_COLOR: '#ffffff',
        DEFAULT_FONT: 'Cairo'
    },
    
    // Storage keys
    STORAGE: {
        FONTS: 'fontStudio_fonts',
        PROJECTS: 'fontStudio_projects',
        SETTINGS: 'fontStudio_settings',
        CURRENT_PROJECT: 'fontStudio_currentProject'
    },
    
    // OpenType feature tags
    OPENTYPE_FEATURES: {
        // Basic Ligatures
        'liga': { name: 'Standard Ligatures', description: 'الرباطات القياسية' },
        'dlig': { name: 'Discretionary Ligatures', description: 'الرباطات الاختيارية' },
        'hlig': { name: 'Historical Ligatures', description: 'الرباطات التاريخية' },
        'clig': { name: 'Contextual Ligatures', description: 'الرباطات السياقية' },
        
        // Alternates
        'calt': { name: 'Contextual Alternates', description: 'البدائل السياقية' },
        'salt': { name: 'Stylistic Alternates', description: 'البدائل الأسلوبية' },
        'swsh': { name: 'Swash', description: 'الزخرفات' },
        'hist': { name: 'Historical Forms', description: 'الأشكال التاريخية' },
        'ornm': { name: 'Ornaments', description: 'الزخارف' },
        
        // Caps
        'smcp': { name: 'Small Capitals', description: 'الأحرف الكبيرة الصغيرة' },
        'c2sc': { name: 'Capitals to Small Caps', description: 'تحويل لأحرف صغيرة' },
        'pcap': { name: 'Petite Capitals', description: 'الأحرف الصغيرة جداً' },
        'titl': { name: 'Titling', description: 'العناوين' },
        
        // Numeric
        'lnum': { name: 'Lining Figures', description: 'الأرقام المصفوفة' },
        'onum': { name: 'Oldstyle Figures', description: 'الأرقام القديمة' },
        'pnum': { name: 'Proportional Figures', description: 'الأرقام المتناسبة' },
        'tnum': { name: 'Tabular Figures', description: 'الأرقام الجدولية' },
        'frac': { name: 'Fractions', description: 'الكسور' },
        'afrc': { name: 'Alternative Fractions', description: 'الكسور البديلة' },
        'ordn': { name: 'Ordinals', description: 'الترتيبيات' },
        'zero': { name: 'Slashed Zero', description: 'صفر مشطوب' },
        
        // Position
        'sups': { name: 'Superscript', description: 'الأس العلوي' },
        'subs': { name: 'Subscript', description: 'الأس السفلي' },
        'sinf': { name: 'Scientific Inferiors', description: 'الرموز السفلية العلمية' },
        'numr': { name: 'Numerators', description: 'البسط' },
        'dnom': { name: 'Denominators', description: 'المقام' },
        
        // Spacing & Kerning
        'kern': { name: 'Kerning', description: 'المسافات بين الحروف' },
        'cpsp': { name: 'Capital Spacing', description: 'تباعد الأحرف الكبيرة' },
        'case': { name: 'Case-Sensitive Forms', description: 'الأشكال الحساسة' },
        
        // Arabic specific
        'init': { name: 'Initial Forms', description: 'الأشكال الأولية' },
        'medi': { name: 'Medial Forms', description: 'الأشكال الوسطى' },
        'fina': { name: 'Final Forms', description: 'الأشكال النهائية' },
        'isol': { name: 'Isolated Forms', description: 'الأشكال المنفصلة' },
        'rlig': { name: 'Required Ligatures', description: 'الرباطات المطلوبة' },
        'rclt': { name: 'Required Contextual', description: 'السياقية المطلوبة' },
        
        // Other
        'aalt': { name: 'Access All Alternates', description: 'جميع البدائل' },
        'rand': { name: 'Randomize', description: 'عشوائي' },
        'locl': { name: 'Localized Forms', description: 'الأشكال المحلية' },
        'rvrn': { name: 'Required Variation', description: 'التنويع المطلوب' },
        'mark': { name: 'Mark Positioning', description: 'موضع العلامات' },
        'mkmk': { name: 'Mark to Mark', description: 'علامة لعلامة' },
        'curs': { name: 'Cursive Positioning', description: 'الموضع المتصل' },
        'ccmp': { name: 'Glyph Composition', description: 'تركيب الرموز' }
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
            isDragging: false,
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
            fontFamily: 'Cairo',
            fontSize: 48,
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'right',
            color: '#ffffff',
            opacity: 1,
            letterSpacing: 0,
            lineHeight: 1.5,
            textDecoration: 'none',
            shadow: {
                enabled: false,
                x: 2,
                y: 2,
                blur: 4,
                color: '#000000'
            },
            stroke: {
                enabled: false,
                width: 1,
                color: '#000000'
            },
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
            
            // إخفاء شاشة التحميل فوراً لبدء الاستخدام بدون انتظار
            this.hideSplashScreen();
            this.render();
            
            // تحميل البيانات الثقيلة (مثل الخطوط المحفوظة) في الخلفية دون تعطيل التطبيق
            this.loadSavedData().catch(e => console.error("Error loading background data:", e));
            
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
        
        // Header buttons
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
        
        // Bottom Panels (بديل الشريط الجانبي)
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
        
        // Toast container
        this.elements.toastContainer = document.getElementById('toast-container');
        
        // Home Screen elements (عناصر الشاشة الرئيسية الجديدة)
        this.elements.homeScreen = document.getElementById('home-screen');
        this.elements.appContainer = document.getElementById('app');
        this.elements.startEmptyBtn = document.getElementById('start-empty-btn');
        this.elements.startImageBtn = document.getElementById('start-image-btn');
        this.elements.presetCards = document.querySelectorAll('.preset-card');
        this.elements.homeBgColor = document.getElementById('home-bg-color');
        this.elements.homePresetColors = document.querySelectorAll('#home-preset-colors .preset-color');
        
        // إخفاء مساحة العمل في البداية حتى يتم اختيار مقاس
        this.elements.appContainer.style.display = 'none';
        
        // Bottom nav (mobile)
        this.elements.bottomNavItems = document.querySelectorAll('.nav-item');

        // InShot Toolbar Elements
        this.elements.inshotToolbar = document.getElementById('inshot-text-toolbar');
        this.elements.inshotOverlay = document.getElementById('inshot-editor-overlay');
        this.elements.inshotInput = document.getElementById('inshot-main-input');
        this.elements.inshotDone = document.getElementById('inshot-done-btn');
        this.elements.inshotClose = document.getElementById('inshot-close-btn');
        this.elements.inshotClear = document.getElementById('inshot-clear-text');
        this.elements.inshotToolBtns = document.querySelectorAll('.inshot-tool-btn');
    }
    
    setupCanvas() {
        const canvas = this.elements.canvas;
        const ctx = this.elements.ctx;
        
        // Set canvas size
        canvas.width = this.canvasProperties.width;
        canvas.height = this.canvasProperties.height;
        
        // Enable high DPI
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.style.width = `${this.canvasProperties.width}px`;
        canvas.style.height = `${this.canvasProperties.height}px`;
        
        // Configure context
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Fit canvas to viewport
        this.fitCanvasToViewport();
    }
    
    fitCanvasToViewport() {
        const container = this.elements.canvasContainer;
        const wrapper = this.elements.canvasWrapper;
        
        wrapper.style.width = `${this.canvasProperties.width}px`;
        wrapper.style.height = `${this.canvasProperties.height}px`;
        
        const containerRect = container.getBoundingClientRect();
        const padding = 40; 
        
        const availableWidth = containerRect.width - padding * 2;
        const availableHeight = containerRect.height - padding * 2;
        
        const scaleX = availableWidth / this.canvasProperties.width;
        const scaleY = availableHeight / this.canvasProperties.height;
        
        this.state.zoom = Math.min(scaleX, scaleY, 1);
        
        this.state.panX = 0;
        this.state.panY = 0;
        this.updateCanvasTransform();
    }
    
    updateCanvasTransform() {
        const wrapper = this.elements.canvasWrapper;
        wrapper.style.transform = `scale(${this.state.zoom}) translate(${this.state.panX}px, ${this.state.panY}px)`;
        this.elements.zoomValue.textContent = `${Math.round(this.state.zoom * 100)}%`;
    }
    
    // =====================================================
    // 📱 Event Listeners
    // =====================================================
    
    setupEventListeners() {
        // إغلاق اللوحة السفلية (نظام InShot)
        if (this.elements.closePanelBtn) {
            this.elements.closePanelBtn.addEventListener('click', () => this.closeBottomPanel());
        }
        
        // InShot Editor Events
        if (this.elements.inshotInput) {
            this.elements.inshotInput.addEventListener('input', (e) => {
                this.textProperties.text = e.target.value;
                const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
                if (activeLayer && activeLayer.type === 'text') {
                    activeLayer.properties.text = e.target.value;
                }
                this.render();
            });

            this.elements.inshotClear.addEventListener('click', () => {
                this.elements.inshotInput.value = '';
                this.elements.inshotInput.dispatchEvent(new Event('input'));
                this.elements.inshotInput.focus();
            });

            this.elements.inshotDone.addEventListener('click', () => this.closeInShotEditor());
            this.elements.inshotClose.addEventListener('click', () => this.closeInShotEditor());

            this.elements.inshotToolBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.elements.inshotToolBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const target = btn.dataset.target;
                    if(target !== 'keyboard') {
                        this.switchTab(target);
                    } else {
                        this.closeBottomPanel();
                        this.elements.inshotInput.focus();
                    }
                });
            });
        }

        // إغلاق اللوحة عند لمس مساحة العمل
        this.elements.canvasContainer.addEventListener('mousedown', (e) => {
            if (e.target === this.elements.canvasContainer || e.target === this.elements.selectionLayer) {
                this.closeBottomPanel();
            }
        });
        this.elements.canvasContainer.addEventListener('touchstart', (e) => {
            if (e.target === this.elements.canvasContainer || e.target === this.elements.selectionLayer) {
                this.closeBottomPanel();
            }
        });
        
        // Bottom nav (mobile)
        this.elements.bottomNavItems.forEach(item => {
            item.addEventListener('click', () => {
                if (item.dataset.panel === 'text') {
                    // إذا ضغط على "النص" من الشريط السفلي، نفتح شريط إنشوت الجديد
                    const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
                    if (activeLayer && activeLayer.type === 'text') {
                        this.openInShotEditor(); // تعديل النص الحالي
                    } else {
                        this.addTextLayer(); // إضافة نص جديد
                    }
                } else {
                    // باقي الأزرار تفتح اللوحات السفلية العادية
                    this.switchTab(item.dataset.panel);
                }
            });
        });
        
        // Text input (الإصدار الاحترافي النهائي)
        this.elements.textInput.addEventListener('input', (e) => {
            if (this.state.layers.length === 0 || !this.state.selectedElement) {
                this.textProperties.color = '#000000'; 
                if (this.elements.textColorPicker) this.elements.textColorPicker.value = '#000000';
                this.updateColorPreview('text', '#000000');
                this.addTextLayer();
            }
            
            this.textProperties.text = e.target.value;
            this.elements.charCount.textContent = e.target.value.length;
            
            const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
            if (activeLayer && activeLayer.type === 'text') {
                activeLayer.properties.text = e.target.value;
                // السر هنا: يأخذ اللون الحالي الذي اخترته أنت، ولا يفرضه أسود دائماً
                activeLayer.properties.color = this.textProperties.color; 
            }
            
            this.render();
        });

        
        // Font size slider
        this.elements.fontSizeSlider.addEventListener('input', (e) => {
            this.textProperties.fontSize = parseInt(e.target.value);
            this.elements.fontSizeValue.textContent = `${e.target.value}px`;
            
            // نقل الحجم للطبقة المحددة
            const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
            if (activeLayer && activeLayer.type === 'text') {
                activeLayer.properties.fontSize = parseInt(e.target.value);
            }
            this.render();
        });

        // Color pickers (تحديث لون النص في الطبقة)
        this.elements.textColorPicker.addEventListener('input', (e) => {
            this.textProperties.color = e.target.value;
            this.updateColorPreview('text', e.target.value);
            
            const activeLayer = this.state.layers.find(l => l.id === this.state.selectedElement);
            if (activeLayer && activeLayer.type === 'text') {
                activeLayer.properties.color = e.target.value;
            }
            this.render();
        });
        
        // Letter spacing slider
        this.elements.letterSpacingSlider.addEventListener('input', (e) => {
            this.textProperties.letterSpacing = parseInt(e.target.value);
            this.elements.letterSpacingValue.textContent = `${e.target.value}px`;
            this.render();
        });
        
        // Line height slider
        this.elements.lineHeightSlider.addEventListener('input', (e) => {
            this.textProperties.lineHeight = parseInt(e.target.value) / 100;
            this.elements.lineHeightValue.textContent = (parseInt(e.target.value) / 100).toFixed(2);
            this.render();
        });
        
        // Format buttons
        this.elements.boldBtn.addEventListener('click', () => this.toggleBold());
        this.elements.italicBtn.addEventListener('click', () => this.toggleItalic());
        this.elements.underlineBtn.addEventListener('click', () => this.toggleUnderline());
        this.elements.strikethroughBtn.addEventListener('click', () => this.toggleStrikethrough());
        
        // Alignment buttons
        this.elements.alignRightBtn.addEventListener('click', () => this.setTextAlign('right'));
        this.elements.alignCenterBtn.addEventListener('click', () => this.setTextAlign('center'));
        this.elements.alignLeftBtn.addEventListener('click', () => this.setTextAlign('left'));
        this.elements.alignJustifyBtn.addEventListener('click', () => this.setTextAlign('justify'));
        
        // Color pickers
        this.elements.textColorPicker.addEventListener('input', (e) => {
            this.textProperties.color = e.target.value;
            this.updateColorPreview('text', e.target.value);
            this.render();
        });
        
        this.elements.textColorHex.addEventListener('change', (e) => {
            const color = this.validateHexColor(e.target.value);
            if (color) {
                this.textProperties.color = color;
                this.elements.textColorPicker.value = color;
                this.updateColorPreview('text', color);
                this.render();
            }
        });
        
        this.elements.bgColorPicker.addEventListener('input', (e) => {
            this.canvasProperties.backgroundColor = e.target.value;
            this.updateColorPreview('bg', e.target.value);
            this.render();
        });
        
        this.elements.bgColorHex.addEventListener('change', (e) => {
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
        
        // Opacity slider
        this.elements.textOpacitySlider.addEventListener('input', (e) => {
            this.textProperties.opacity = parseInt(e.target.value) / 100;
            this.elements.textOpacityValue.textContent = `${e.target.value}%`;
            this.render();
        });
        
        // Shadow toggle
        this.elements.textShadowToggle.addEventListener('change', (e) => {
            this.textProperties.shadow.enabled = e.target.checked;
            this.elements.textShadowControls.style.display = e.target.checked ? 'block' : 'none';
            this.render();
        });
        
        // Shadow controls
        this.elements.shadowXSlider.addEventListener('input', (e) => {
            this.textProperties.shadow.x = parseInt(e.target.value);
            document.getElementById('shadow-x-value').textContent = `${e.target.value}px`;
            this.render();
        });
        
        this.elements.shadowYSlider.addEventListener('input', (e) => {
            this.textProperties.shadow.y = parseInt(e.target.value);
            document.getElementById('shadow-y-value').textContent = `${e.target.value}px`;
            this.render();
        });
        
        this.elements.shadowBlurSlider.addEventListener('input', (e) => {
            this.textProperties.shadow.blur = parseInt(e.target.value);
            document.getElementById('shadow-blur-value').textContent = `${e.target.value}px`;
            this.render();
        });
        
        this.elements.shadowColorPicker.addEventListener('input', (e) => {
            this.textProperties.shadow.color = e.target.value;
            this.render();
        });
        
        // Stroke toggle
        this.elements.textStrokeToggle.addEventListener('change', (e) => {
            this.textProperties.stroke.enabled = e.target.checked;
            this.elements.textStrokeControls.style.display = e.target.checked ? 'block' : 'none';
            this.render();
        });
        
        // Stroke controls
        this.elements.strokeWidthSlider.addEventListener('input', (e) => {
            this.textProperties.stroke.width = parseInt(e.target.value);
            document.getElementById('stroke-width-value').textContent = `${e.target.value}px`;
            this.render();
        });
        
        this.elements.strokeColorPicker.addEventListener('input', (e) => {
            this.textProperties.stroke.color = e.target.value;
            this.render();
        });
        
        // Font search
        this.elements.fontSearch.addEventListener('input', (e) => {
            this.filterFonts(e.target.value);
        });
        
        // Font file input
        this.elements.addFontsArea.addEventListener('click', () => {
            this.elements.fontFileInput.click();
        });
        
        this.elements.fontFileInput.addEventListener('change', (e) => {
            this.handleFontFiles(e.target.files);
        });
        
        // Drag and drop for fonts
        this.elements.addFontsArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elements.addFontsArea.classList.add('dragging');
        });
        
        this.elements.addFontsArea.addEventListener('dragleave', () => {
            this.elements.addFontsArea.classList.remove('dragging');
        });
        
        this.elements.addFontsArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.addFontsArea.classList.remove('dragging');
            this.handleFontFiles(e.dataTransfer.files);
        });
        
        // OpenType features
        this.elements.openTypeFeaturesGrid.addEventListener('click', (e) => {
            const feature = e.target.closest('.opentype-feature');
            if (feature) {
                this.toggleOpenTypeFeature(feature.dataset.feature);
            }
        });
        
        // Zoom controls
        this.elements.zoomIn.addEventListener('click', () => this.zoomIn());
        this.elements.zoomOut.addEventListener('click', () => this.zoomOut());
        this.elements.zoomFit.addEventListener('click', () => this.fitCanvasToViewport());
        
        // Canvas tools
        this.elements.selectTool.addEventListener('click', () => this.setTool('select'));
        this.elements.textTool.addEventListener('click', () => this.setTool('text'));
        this.elements.imageTool.addEventListener('click', () => this.setTool('image'));
        this.elements.shapeTool.addEventListener('click', () => this.setTool('shape'));
        this.elements.addTextBtn.addEventListener('click', () => this.addTextLayer());
        
        // Header buttons
        this.elements.undoBtn.addEventListener('click', () => this.undo());
        this.elements.redoBtn.addEventListener('click', () => this.redo());
        this.elements.exportBtn.addEventListener('click', () => this.openExportModal());
        
        // Export modal
        this.elements.closeExportModal.addEventListener('click', () => this.closeExportModal());
        this.elements.cancelExport.addEventListener('click', () => this.closeExportModal());
        this.elements.confirmExport.addEventListener('click', () => this.exportImage());
        
        // Export format selection
        document.querySelectorAll('.export-format').forEach(format => {
            format.addEventListener('click', () => {
                document.querySelectorAll('.export-format').forEach(f => f.classList.remove('active'));
                format.classList.add('active');
            });
        });
        
        // Quality presets
        document.querySelectorAll('.quality-preset').forEach(preset => {
            preset.addEventListener('click', () => {
                document.querySelectorAll('.quality-preset').forEach(p => p.classList.remove('active'));
                preset.classList.add('active');
                this.elements.exportQualitySlider.value = parseFloat(preset.dataset.quality) * 100;
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Window resize (مطور ليتجاهل فتح لوحة المفاتيح)
        let lastWidth = window.innerWidth;
        window.addEventListener('resize', () => {
            if (window.innerWidth !== lastWidth) {
                lastWidth = window.innerWidth;
                this.fitCanvasToViewport();
            }
        });
        
        // -----------------------------------------
        // 🏠 برمجة الشاشة الرئيسية (Home Screen)
        // -----------------------------------------
        
        let selectedWidth = 1080;
        let selectedHeight = 1080;
        let selectedBgColor = '#ffffff';
        
        // 1. اختيار المقاس من الكروت الجاهزة
        this.elements.presetCards.forEach(card => {
            card.addEventListener('click', () => {
                this.elements.presetCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                selectedWidth = parseInt(card.dataset.width);
                selectedHeight = parseInt(card.dataset.height);
            });
        });

        // 2. اختيار لون الخلفية
        this.elements.homeBgColor.addEventListener('input', (e) => {
            selectedBgColor = e.target.value;
            this.elements.homePresetColors.forEach(c => c.classList.remove('active'));
        });

        this.elements.homePresetColors.forEach(preset => {
            preset.addEventListener('click', () => {
                this.elements.homePresetColors.forEach(c => c.classList.remove('active'));
                preset.classList.add('active');
                selectedBgColor = preset.dataset.color;
                this.elements.homeBgColor.value = selectedBgColor;
            });
        });

        // 3. زر "مساحة فارغة" - الدخول للوحة التصميم
        this.elements.startEmptyBtn.addEventListener('click', () => {
            // السحر هنا: مسح أي مشروع قديم معلق في الذاكرة عشان ما يرجعش يفرض مقاسه عليك!
            localforage.removeItem(CONFIG.STORAGE.CURRENT_PROJECT);
            
            this.state.layers = []; // تنظيف تام للطبقات القديمة
            this.state.selectedElement = null;
            
            this.canvasProperties.width = selectedWidth;
            this.canvasProperties.height = selectedHeight;
            this.canvasProperties.backgroundColor = selectedBgColor;
            
            this.elements.canvas.width = selectedWidth;
            this.elements.canvas.height = selectedHeight;
            
            // ضبط أبعاد الغلاف الخارجي بقوة ليتطابق مع الاختيار بدون أي تشويه
            this.elements.canvasWrapper.style.width = `${selectedWidth}px`;
            this.elements.canvasWrapper.style.height = `${selectedHeight}px`;
            this.elements.canvasWrapper.style.aspectRatio = `${selectedWidth} / ${selectedHeight}`;
            
            this.elements.appContainer.style.display = 'flex';
            this.elements.homeScreen.classList.add('hidden-slide');
            
            setTimeout(() => {
                this.updateLayersList();
                this.fitCanvasToViewport();
                this.render();
                this.saveHistory();
            }, 100);
        });

        // 4. زر "من صورة" - اختيار صورة كخلفية والبدء فوراً
        this.elements.startImageBtn.addEventListener('click', () => {
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
                                name: `خلفية الصورة`,
                                visible: true,
                                locked: true,
                                opacity: 1,
                                image: img,
                                x: 0, y: 0, width: img.width, height: img.height
                            };
                            this.state.layers = [layer]; // مسح أي طبقات قديمة ووضع الصورة

                            this.elements.appContainer.style.display = 'flex';
                            this.elements.homeScreen.classList.add('hidden-slide');
                            
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
        
        // Mouse wheel zoom
        this.elements.canvasContainer.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                if (e.deltaY < 0) {
                    this.zoomIn();
                } else {
                    this.zoomOut();
                }
            }
        }, { passive: false });
    }
    
    // =====================================================
    // 👆 Touch Gestures
    // =====================================================
    
    setupTouchGestures() {
        const container = this.elements.canvasContainer;
        const hammer = new Hammer.Manager(container);
        
        const pinch = new Hammer.Pinch();
        // تفعيل السحب في جميع الاتجاهات بدون تأخير
        const pan = new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }); 
        const tap = new Hammer.Tap({ taps: 2 });
        
        hammer.add([pinch, pan, tap]);
        
        let initialZoom = 1;
        let initialPanX = 0;
        let initialPanY = 0;
        
        // --- متغيرات تحريك الطبقات (السحر الجديد) ---
        let isDraggingLayer = false;
        let draggedLayer = null;
        let initialLayerX = 0;
        let initialLayerY = 0;

        // دالة مساعدة لمعرفة هل إصبعك لمس النص/الصورة أم لمس الفراغ
        const getHitLayer = (center) => {
            const rect = this.elements.canvas.getBoundingClientRect();
            // تحويل إحداثيات الشاشة إلى إحداثيات الكانفاس الداخلية (مثل 1080x1080)
            const x = (center.x - rect.left) * (this.elements.canvas.width / rect.width);
            const y = (center.y - rect.top) * (this.elements.canvas.height / rect.height);
            
            const ctx = this.elements.ctx;
            // فحص الطبقات العلوية أولاً
            const layers = [...this.state.layers].reverse(); 
            
            for (const layer of layers) {
                if (!layer.visible || layer.locked) continue;
                
                if (layer.type === 'text') {
                    ctx.save();
                    ctx.font = `${layer.properties.fontSize}px "${layer.properties.fontFamily}"`;
                    const metrics = ctx.measureText(layer.properties.text || " ");
                    const width = metrics.width;
                    const height = layer.properties.fontSize;
                    ctx.restore();
                    
                    // التوسيع قليلاً (+30) لتسهيل التقاط النص بالإصبع
                    if (x >= layer.x - width/2 - 30 && x <= layer.x + width/2 + 30 &&
                        y >= layer.y - height/2 - 30 && y <= layer.y + height/2 + 30) {
                        return layer;
                    }
                } else if (layer.type === 'image' || layer.type === 'shape') {
                    if (x >= layer.x && x <= layer.x + layer.width &&
                        y >= layer.y && y <= layer.y + layer.height) {
                        return layer;
                    }
                }
            }
            return null;
        };
        
        // التكبير والتصغير (Pinch to zoom)
        hammer.on('pinchstart', () => { initialZoom = this.state.zoom; });
        hammer.on('pinchmove', (e) => {
            let newZoom = initialZoom * e.scale;
            newZoom = Math.max(CONFIG.CANVAS.MIN_ZOOM, Math.min(CONFIG.CANVAS.MAX_ZOOM, newZoom));
            this.state.zoom = newZoom;
            this.updateCanvasTransform();
        });
        
        // السحب والتحريك (Pan)
        hammer.on('panstart', (e) => {
            // السحر: بمجرد أن تلمس الكانفاس بأصبعك، يتم إنزال أي لوحة مفتوحة فوراً!
            this.closeBottomPanel();
            
            isDraggingLayer = false;
            
            // إذا كانت أداة (السهم ↖) محددة، حاول التقاط وتحريك العنصر
            if (this.state.currentTool === 'select') {
                const hitLayer = getHitLayer(e.center);
                if (hitLayer) {
                    isDraggingLayer = true;
                    draggedLayer = hitLayer;
                    this.selectLayer(hitLayer.id); // تفعيل الطبقة لظهور خصائصها
                    initialLayerX = hitLayer.x;
                    initialLayerY = hitLayer.y;
                    return; // الخروج لكي لا يتم تحريك الشاشة بأكملها
                }
            }
            
            // إذا لم نلمس عنصراً أو الأداة ليست السهم، حرك الشاشة بأكملها
            initialPanX = this.state.panX;
            initialPanY = this.state.panY;
        });
        
        hammer.on('panmove', (e) => {
            if (isDraggingLayer && draggedLayer) {
                // تحريك النص المباشر فقط (مع مراعاة نسبة التكبير الحالية)
                draggedLayer.x = initialLayerX + (e.deltaX / this.state.zoom);
                draggedLayer.y = initialLayerY + (e.deltaY / this.state.zoom);
                this.render();
            }
            // السحر هنا: تم حذف كود تحريك الكانفاس بأكمله!
            // الآن المستطيل الأبيض سيكون ثابتاً كالطوب ولن يهرب منك يميناً أو يساراً
        });
        
        // حفظ الخطوة بعد الإفلات للتراجع (Undo)
        hammer.on('panend', (e) => {
            if (isDraggingLayer) {
                this.saveHistory(); 
                isDraggingLayer = false;
                draggedLayer = null;
            }
        });
        
        // نقر مزدوج لضبط حجم الشاشة (Reset zoom)
        hammer.on('tap', () => {
            this.state.zoom = 1;
            this.state.panX = 0;
            this.state.panY = 0;
            this.updateCanvasTransform();
        });
    }

    // =====================================================
    // 🎨 Rendering
    // =====================================================

    
    render() {
        const ctx = this.elements.ctx;
        const canvas = this.elements.canvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        this.drawBackground();
        
        // Draw layers
        this.drawLayers();
        
        // Draw text
        this.drawText();
    }
    
    drawBackground() {
        const ctx = this.elements.ctx;
        const canvas = this.elements.canvas;
        
        // Background color
        ctx.fillStyle = this.canvasProperties.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Background image
        if (this.canvasProperties.backgroundImage) {
            ctx.drawImage(
                this.canvasProperties.backgroundImage,
                0, 0,
                canvas.width, canvas.height
            );
        }
    }
    
    drawLayers() {
        // Draw each layer
        this.state.layers.forEach(layer => {
            if (!layer.visible) return;
            
            const ctx = this.elements.ctx;
            ctx.save();
            ctx.globalAlpha = layer.opacity;
            
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
        ctx.drawImage(layer.image, layer.x, layer.y, layer.width, layer.height);
    }
    
    drawShapeLayer(layer) {
        const ctx = this.elements.ctx;
        ctx.fillStyle = layer.fill;
        ctx.strokeStyle = layer.stroke;
        ctx.lineWidth = layer.strokeWidth;
        
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
        // Draw specific text layer
        this.drawTextWithProperties(layer.properties, layer.x, layer.y);
    }
    
    drawText() {
        if (!this.textProperties.text) return;
        
        const ctx = this.elements.ctx;
        const canvas = this.elements.canvas;
        const props = this.textProperties;
        
        // Calculate position (center of canvas for preview)
        const x = canvas.width / 2;
        const y = canvas.height / 2;
        
        this.drawTextWithProperties(props, x, y);
    }
    
    drawTextWithProperties(props, x, y) {
        const ctx = this.elements.ctx;
        
        if (!props.text) return;
        
        ctx.save();
        
        // ==========================================
        // 🪄 سحر الأوبن تايب (OpenType Magic)
        // تطبيق الخصائص على الكانفاس مباشرة لتدعم الزخارف والبدائل العربية
        // ==========================================
        this.elements.canvas.style.fontFeatureSettings = props.openTypeFeatures || 'normal';
        this.elements.canvas.style.fontVariantLigatures = 'normal';
        
        // Build font string
        let fontStyle = '';
        if (props.fontStyle === 'italic') fontStyle = 'italic ';
        let fontWeight = props.fontWeight === 'bold' ? 'bold ' : '';
        
        ctx.font = `${fontStyle}${fontWeight}${props.fontSize}px "${props.fontFamily}"`;
        ctx.textAlign = props.textAlign === 'justify' ? 'center' : props.textAlign;
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = props.opacity;
        
        // Apply letter spacing (using character by character for spacing)
        ctx.letterSpacing = `${props.letterSpacing}px`;
        
        // Split text into lines
        const lines = props.text.split('\n');
        const lineHeightPx = props.fontSize * props.lineHeight;
        const totalHeight = lines.length * lineHeightPx;
        const startY = y - totalHeight / 2 + lineHeightPx / 2;
        
        lines.forEach((line, index) => {
            const lineY = startY + index * lineHeightPx;
            
            // Apply shadow
            if (props.shadow && props.shadow.enabled) {
                ctx.shadowColor = props.shadow.color;
                ctx.shadowOffsetX = props.shadow.x;
                ctx.shadowOffsetY = props.shadow.y;
                ctx.shadowBlur = props.shadow.blur;
            }
            
            // Draw stroke
            if (props.stroke && props.stroke.enabled) {
                ctx.strokeStyle = props.stroke.color;
                ctx.lineWidth = props.stroke.width * 2;
                ctx.lineJoin = 'round';
                this.drawTextLine(ctx, line, x, lineY, props.letterSpacing, true);
            }
            
            // Reset shadow for fill
            if (props.shadow && props.shadow.enabled) {
                ctx.shadowColor = 'transparent';
            }
            
            // Draw fill
            ctx.fillStyle = props.color;
            this.drawTextLine(ctx, line, x, lineY, props.letterSpacing, false);
            
            // Draw underline
            if (props.textDecoration === 'underline') {
                const textWidth = ctx.measureText(line).width;
                const underlineY = lineY + props.fontSize * 0.15;
                ctx.beginPath();
                ctx.strokeStyle = props.color;
                ctx.lineWidth = props.fontSize * 0.05;
                ctx.moveTo(x - textWidth / 2, underlineY);
                ctx.lineTo(x + textWidth / 2, underlineY);
                ctx.stroke();
            }
            
            // Draw strikethrough
            if (props.textDecoration === 'line-through') {
                const textWidth = ctx.measureText(line).width;
                ctx.beginPath();
                ctx.strokeStyle = props.color;
                ctx.lineWidth = props.fontSize * 0.05;
                ctx.moveTo(x - textWidth / 2, lineY);
                ctx.lineTo(x + textWidth / 2, lineY);
                ctx.stroke();
            }
        });
        
        ctx.restore();
        
        // إرجاع الكانفاس لحالته الطبيعية بعد الرسم حتى لا تتأثر الطبقات الأخرى بزخارف هذا النص
        this.elements.canvas.style.fontFeatureSettings = 'normal';
    }
    
    drawTextLine(ctx, text, x, y, letterSpacing, isStroke) {
        if (letterSpacing === 0) {
            if (isStroke) {
                ctx.strokeText(text, x, y);
            } else {
                ctx.fillText(text, x, y);
            }
            return;
        }
        
        // Draw with letter spacing
        const chars = [...text];
        let totalWidth = 0;
        const charWidths = chars.map(char => {
            const width = ctx.measureText(char).width;
            totalWidth += width + letterSpacing;
            return width;
        });
        totalWidth -= letterSpacing; // Remove last spacing
        
        let currentX = x - totalWidth / 2;
        
        chars.forEach((char, i) => {
            if (isStroke) {
                ctx.strokeText(char, currentX + charWidths[i] / 2, y);
            } else {
                ctx.fillText(char, currentX + charWidths[i] / 2, y);
            }
            currentX += charWidths[i] + letterSpacing;
        });
    }
    
    // =====================================================
    // 🔤 OpenType Features
    // =====================================================
    
    buildOpenTypeFontFeatureSettings() {
        const features = [];
        
        // Active features
        this.state.activeOpenTypeFeatures.forEach(feature => {
            features.push(`"${feature}" 1`);
        });
        
        // Stylistic sets
        this.state.activeStylisticSets.forEach(ss => {
            features.push(`"${ss}" 1`);
        });
        
        // Character variants
        this.state.activeCharacterVariants.forEach(cv => {
            features.push(`"${cv}" 1`);
        });
        
        return features.join(', ') || 'normal';
    }
    
    toggleOpenTypeFeature(featureTag) {
        const featureElement = document.querySelector(`.opentype-feature[data-feature="${featureTag}"]`);
        
        if (this.state.activeOpenTypeFeatures.has(featureTag)) {
            this.state.activeOpenTypeFeatures.delete(featureTag);
            featureElement?.classList.remove('active');
        } else {
            this.state.activeOpenTypeFeatures.add(featureTag);
            featureElement?.classList.add('active');
        }
        
        this.updateOpenTypeFeaturesCount();
        this.applyOpenTypeFeatures();
        this.render();
    }
    
    toggleStylisticSet(ssTag) {
        const ssElement = document.querySelector(`.stylistic-set[data-ss="${ssTag}"]`);
        
        if (this.state.activeStylisticSets.has(ssTag)) {
            this.state.activeStylisticSets.delete(ssTag);
            ssElement?.classList.remove('active');
        } else {
            this.state.activeStylisticSets.add(ssTag);
            ssElement?.classList.add('active');
        }
        
        this.updateOpenTypeFeaturesCount();
        this.applyOpenTypeFeatures();
        this.render();
    }
    
    toggleCharacterVariant(cvTag) {
        const cvElement = document.querySelector(`.stylistic-set[data-cv="${cvTag}"]`);
        
        if (this.state.activeCharacterVariants.has(cvTag)) {
            this.state.activeCharacterVariants.delete(cvTag);
            cvElement?.classList.remove('active');
        } else {
            this.state.activeCharacterVariants.add(cvTag);
            cvElement?.classList.add('active');
        }
        
        this.updateOpenTypeFeaturesCount();
        this.applyOpenTypeFeatures();
        this.render();
    }
    
    applyOpenTypeFeatures() {
        const featureSettings = this.buildOpenTypeFontFeatureSettings();
        
        // Apply to text input for preview
        this.elements.textInput.style.fontFeatureSettings = featureSettings;
        
        // Store in text properties
        this.textProperties.openTypeFeatures = featureSettings;
    }
    
    updateOpenTypeFeaturesCount() {
        const total = this.state.activeOpenTypeFeatures.size + 
                      this.state.activeStylisticSets.size + 
                      this.state.activeCharacterVariants.size;
        this.elements.openTypeFeaturesCount.textContent = total;
    }
    
    generateStylisticSetsUI() {
        // Generate SS01-SS20
        const ssGrid = this.elements.stylisticSetsGrid;
        ssGrid.innerHTML = '';
        
        for (let i = 1; i <= 20; i++) {
            const ssTag = `ss${i.toString().padStart(2, '0')}`;
            const ssElement = document.createElement('div');
            ssElement.className = 'stylistic-set';
            ssElement.dataset.ss = ssTag;
            ssElement.textContent = `SS${i.toString().padStart(2, '0')}`;
            ssElement.addEventListener('click', () => this.toggleStylisticSet(ssTag));
            ssGrid.appendChild(ssElement);
        }
        
        // Generate CV01-CV20 (can be extended to CV99)
        const cvGrid = this.elements.characterVariantsGrid;
        cvGrid.innerHTML = '';
        
        for (let i = 1; i <= 20; i++) {
            const cvTag = `cv${i.toString().padStart(2, '0')}`;
            const cvElement = document.createElement('div');
            cvElement.className = 'stylistic-set';
            cvElement.dataset.cv = cvTag;
            cvElement.textContent = `CV${i.toString().padStart(2, '0')}`;
            cvElement.addEventListener('click', () => this.toggleCharacterVariant(cvTag));
            cvGrid.appendChild(cvElement);
        }
    }
    
    async detectFontOpenTypeFeatures(fontData) {
        try {
            // Use opentype.js to parse the font and detect features
            const font = await opentype.parse(fontData);
            const availableFeatures = new Set();
            
            // Check GSUB table (Glyph Substitution)
            if (font.tables.gsub) {
                const gsub = font.tables.gsub;
                if (gsub.features) {
                    gsub.features.forEach(feature => {
                        if (feature.tag) {
                            availableFeatures.add(feature.tag);
                        }
                    });
                }
            }
            
            // Check GPOS table (Glyph Positioning)
            if (font.tables.gpos) {
                const gpos = font.tables.gpos;
                if (gpos.features) {
                    gpos.features.forEach(feature => {
                        if (feature.tag) {
                            availableFeatures.add(feature.tag);
                        }
                    });
                }
            }
            
            return availableFeatures;
        } catch (error) {
            console.warn('Could not detect OpenType features:', error);
            return new Set();
        }
    }
    
    updateFeatureAvailability(availableFeatures) {
        // Update feature buttons
        document.querySelectorAll('.opentype-feature').forEach(element => {
            const feature = element.dataset.feature;
            if (availableFeatures.has(feature)) {
                element.classList.remove('unavailable');
                element.style.opacity = '1';
                element.style.pointerEvents = 'auto';
            } else {
                element.classList.add('unavailable');
                element.style.opacity = '0.4';
                // Still allow clicking but show it's not available
            }
        });
        
        // Update stylistic sets
        document.querySelectorAll('.stylistic-set[data-ss]').forEach(element => {
            const ss = element.dataset.ss;
            if (availableFeatures.has(ss)) {
                element.classList.remove('unavailable');
            } else {
                element.classList.add('unavailable');
            }
        });
        
        // Update character variants
        document.querySelectorAll('.stylistic-set[data-cv]').forEach(element => {
            const cv = element.dataset.cv;
            if (availableFeatures.has(cv)) {
                element.classList.remove('unavailable');
            } else {
                element.classList.add('unavailable');
            }
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
                
                // Create a unique font family name
                const fontFamily = `CustomFont_${Date.now()}_${fontName}`;
                
                // Load font using FontFace API
                const fontFace = new FontFace(fontFamily, fontData);
                await fontFace.load();
                document.fonts.add(fontFace);
                
                // Detect OpenType features
                const features = await this.detectFontOpenTypeFeatures(fontData);
                
                // Store font info
                this.state.loadedFonts.set(fontFamily, {
                    name: fontName,
                    family: fontFamily,
                    file: file.name,
                    features: features,
                    data: fontData
                });
                
                addedCount++;
                
                // If this is the first font, select it
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
        fontList.innerHTML = '';
        
        // Add system fonts
        const systemFonts = ['Cairo', 'Tajawal', 'Arial', 'Tahoma', 'Times New Roman'];
        
        systemFonts.forEach(fontName => {
            const fontItem = this.createFontListItem(fontName, fontName, true);
            fontList.appendChild(fontItem);
        });
        
        // Add custom fonts
        this.state.loadedFonts.forEach((fontInfo, fontFamily) => {
            const fontItem = this.createFontListItem(fontInfo.name, fontFamily, false);
            fontList.appendChild(fontItem);
        });
        
        // Update count
        this.elements.fontsCount.textContent = systemFonts.length + this.state.loadedFonts.size;
    }
    
    createFontListItem(displayName, fontFamily, isSystem) {
        const item = document.createElement('div');
        item.className = 'font-item';
        item.dataset.family = fontFamily;
        
        if (fontFamily === this.textProperties.fontFamily) {
            item.classList.add('active');
        }
        
        item.innerHTML = `
            <div class="font-item-content">
                <div class="font-item-preview" style="font-family: '${fontFamily}'">
                    أبجد هوز حطي
                </div>
                <div class="font-item-name">${displayName}</div>
            </div>
            <div class="font-item-actions">
                ${!isSystem ? `
                    <button class="font-action-btn edit-font" title="تعديل الاسم">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="font-action-btn delete delete-font" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        `;
        
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.font-action-btn')) {
                this.selectFont(fontFamily);
            }
        });
        
        // Edit font name
        const editBtn = item.querySelector('.edit-font');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editFontName(fontFamily);
            });
        }
        
        // Delete font
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
        
        // Update UI
        document.querySelectorAll('.font-item').forEach(item => {
            item.classList.toggle('active', item.dataset.family === fontFamily);
        });
        
        // Update text input preview
        this.elements.textInput.style.fontFamily = `"${fontFamily}"`;
        
        // Update OpenType features availability
        const fontInfo = this.state.loadedFonts.get(fontFamily);
        if (fontInfo && fontInfo.features) {
            this.updateFeatureAvailability(fontInfo.features);
        } else {
            // For system fonts, enable all features
            this.updateFeatureAvailability(new Set(Object.keys(CONFIG.OPENTYPE_FEATURES)));
        }
        
        this.state.currentFont = fontFamily;
        this.render();
    }
    
    filterFonts(query) {
        const items = document.querySelectorAll('.font-item');
        const lowerQuery = query.toLowerCase();
        
        items.forEach(item => {
            const name = item.querySelector('.font-item-name').textContent.toLowerCase();
            const matches = name.includes(lowerQuery);
            item.style.display = matches ? '' : 'none';
        });
    }
    
    editFontName(fontFamily) {
        const fontInfo = this.state.loadedFonts.get(fontFamily);
        if (!fontInfo) return;
        
        const newName = prompt('أدخل الاسم الجديد للخط:', fontInfo.name);
        if (newName && newName.trim()) {
            fontInfo.name = newName.trim();
            this.updateFontList();
            this.saveFontsToStorage();
            this.showToast('تم تعديل الاسم', 'success');
        }
    }
    
    deleteFont(fontFamily) {
        if (confirm('هل تريد حذف هذا الخط؟')) {
            this.state.loadedFonts.delete(fontFamily);
            this.updateFontList();
            this.saveFontsToStorage();
            
            // If deleted font was selected, select first available
            if (this.textProperties.fontFamily === fontFamily) {
                this.selectFont('Cairo');
            }
            
            this.showToast('تم حذف الخط', 'success');
        }
    }
    
    async saveFontsToStorage() {
        try {
            const fontsData = [];
            
            this.state.loadedFonts.forEach((fontInfo, fontFamily) => {
                // Convert ArrayBuffer to Base64 for storage
                const base64 = this.arrayBufferToBase64(fontInfo.data);
                fontsData.push({
                    name: fontInfo.name,
                    family: fontFamily,
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
                        // Convert Base64 back to ArrayBuffer
                        const arrayBuffer = this.base64ToArrayBuffer(fontData.dataBase64);
                        
                        // Load font
                        const fontFace = new FontFace(fontData.family, arrayBuffer);
                        await fontFace.load();
                        document.fonts.add(fontFace);
                        
                        // Store font info
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
        this.elements.boldBtn.classList.toggle('active', newWeight === 'bold');
        this.render();
    }
    
    toggleItalic() {
        const newStyle = this.textProperties.fontStyle === 'italic' ? 'normal' : 'italic';
        this.textProperties.fontStyle = newStyle;
        this.elements.italicBtn.classList.toggle('active', newStyle === 'italic');
        this.render();
    }
    
    toggleUnderline() {
        const newDecoration = this.textProperties.textDecoration === 'underline' ? 'none' : 'underline';
        this.textProperties.textDecoration = newDecoration;
        this.elements.underlineBtn.classList.toggle('active', newDecoration === 'underline');
        this.elements.strikethroughBtn.classList.remove('active');
        this.render();
    }
    
    toggleStrikethrough() {
        const newDecoration = this.textProperties.textDecoration === 'line-through' ? 'none' : 'line-through';
        this.textProperties.textDecoration = newDecoration;
        this.elements.strikethroughBtn.classList.toggle('active', newDecoration === 'line-through');
        this.elements.underlineBtn.classList.remove('active');
        this.render();
    }
    
    setTextAlign(align) {
        this.textProperties.textAlign = align;
        
        // Update buttons
        this.elements.alignRightBtn.classList.toggle('active', align === 'right');
        this.elements.alignCenterBtn.classList.toggle('active', align === 'center');
        this.elements.alignLeftBtn.classList.toggle('active', align === 'left');
        this.elements.alignJustifyBtn.classList.toggle('active', align === 'justify');
        
        this.render();
    }
    
    // =====================================================
    // 🎨 UI Helpers
    // =====================================================
    
    updateColorPreview(type, color) {
        const previewId = type === 'text' ? 'text-color-preview' : 'bg-color-preview';
        const preview = document.getElementById(previewId);
        const inner = preview.querySelector('.color-preview-inner');
        inner.style.background = color;
    }
    
    validateHexColor(value) {
        const hex = value.startsWith('#') ? value : `#${value}`;
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            return hex;
        }
        if (/^#[0-9A-Fa-f]{3}$/.test(hex)) {
            // Expand shorthand
            return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        }
        return null;
    }
    
    switchTab(tabName) {
        // إظهار اللوحة المناسبة
        this.elements.sidebarPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === `panel-${tabName}`);
        });
        
        // تلوين الأيقونة في الشريط السفلي
        this.elements.bottomNavItems.forEach(item => {
            item.classList.toggle('active', item.dataset.panel === tabName);
        });
        
        // رفع اللوحة من الأسفل (السحر الحقيقي!)
        this.elements.sidebar.classList.add('active');
    }

    closeBottomPanel() {
        // إنزال اللوحة للأسفل
        this.elements.sidebar.classList.remove('active');
        
        // إزالة التحديد من جميع أيقونات الشريط السفلي
        this.elements.bottomNavItems.forEach(item => {
            item.classList.remove('active');
        });
    }

    openInShotEditor() {
        if (!this.elements.inshotToolbar) return;
        this.elements.inshotToolbar.classList.remove('hidden');
        document.querySelector('.bottom-nav').style.display = 'none';
        
        // السحر هنا: إغلاق اللوحة الكبيرة (الجانبية/السفلية) بالقوة حتى لا تظهر خلف الكيبورد
        this.closeBottomPanel();
        
        this.elements.inshotInput.value = this.textProperties.text || '';
        setTimeout(() => this.elements.inshotInput.focus(), 100);
    }

    closeInShotEditor() {
        if (!this.elements.inshotToolbar) return;
        this.elements.inshotToolbar.classList.add('hidden');
        document.querySelector('.bottom-nav').style.display = 'flex';
        this.closeBottomPanel();
        
        // إزالة التحديد الأبيض عند الانتهاء لتنظيف الشاشة تماماً (مثل إنشوت)
        this.state.selectedElement = null;
        this.render();
    }
    
    setTool(tool) {
        this.state.currentTool = tool;
        
        // Update tool buttons
        this.elements.selectTool.classList.toggle('active', tool === 'select');
        this.elements.textTool.classList.toggle('active', tool === 'text');
        this.elements.imageTool.classList.toggle('active', tool === 'image');
        this.elements.shapeTool.classList.toggle('active', tool === 'shape');
        
        // Change cursor
        const cursors = {
            'select': 'default',
            'text': 'text',
            'image': 'crosshair',
            'shape': 'crosshair'
        };
        this.elements.canvasContainer.style.cursor = cursors[tool] || 'default';
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
        // إضافة "نص جديد" كقيمة افتراضية لكي يظهر فوراً للمستخدم
        const defaultText = 'نص جديد';
        const initialProps = { ...this.textProperties, text: defaultText, color: '#000000' };
        
        const layer = {
            id: `layer_${Date.now()}`,
            type: 'text',
            name: `طبقة نص ${this.state.layers.length + 1}`,
            visible: true,
            locked: false,
            opacity: 1,
            x: this.canvasProperties.width / 2,
            y: this.canvasProperties.height / 2,
            properties: initialProps
        };
        
        this.state.layers.push(layer);
        
        // تحديث الواجهة فوراً
        if (this.elements.textInput) {
            this.elements.textInput.value = defaultText;
            this.elements.charCount.textContent = defaultText.length;
        }
        
        this.updateLayersList();
        this.selectLayer(layer.id);
        this.saveHistory();
        this.render();
        
        // السحر: فتح شريط InShot المدمج
        setTimeout(() => {
            this.openInShotEditor();
        }, 50);
        
        this.showToast('تمت الإضافة', 'success', 'تم إضافة طبقة نص جديدة');
    }
    
    updateLayersList() {
        const list = this.elements.layersList;
        list.innerHTML = '';
        
        // Reverse to show top layers first
        [...this.state.layers].reverse().forEach(layer => {
            const item = document.createElement('div');
            item.className = `layer-item ${layer.id === this.state.selectedElement ? 'active' : ''}`;
            item.dataset.id = layer.id;
            
            const icon = layer.type === 'text' ? 'fa-font' : 
                         layer.type === 'image' ? 'fa-image' : 'fa-shapes';
            
            item.innerHTML = `
                <div class="layer-thumb">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="layer-info">
                    <div class="layer-name">${layer.name}</div>
                    <div class="layer-type">${layer.type === 'text' ? 'نص' : layer.type === 'image' ? 'صورة' : 'شكل'}</div>
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
        
        // التزامن الذكي: تحديث الواجهة لتطابق الطبقة المحددة!
        const activeLayer = this.state.layers.find(l => l.id === layerId);
        if (activeLayer && activeLayer.type === 'text') {
            this.textProperties = { ...activeLayer.properties };
            
            // تحديث مربع النص
            if (this.elements.textInput) {
                this.elements.textInput.value = this.textProperties.text || '';
                this.elements.charCount.textContent = (this.textProperties.text || '').length;
            }
            
            // تحديث الحجم
            if (this.elements.fontSizeSlider) {
                this.elements.fontSizeSlider.value = this.textProperties.fontSize;
                this.elements.fontSizeValue.textContent = `${this.textProperties.fontSize}px`;
            }
            
            // تحديث اللون
            if (this.elements.textColorPicker) {
                this.elements.textColorPicker.value = this.textProperties.color;
                this.updateColorPreview('text', this.textProperties.color);
            }
        }
        
        this.updateLayersList();
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
        // Remove any redo history
        this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
        
        // Save current state
        const snapshot = {
            layers: JSON.parse(JSON.stringify(this.state.layers)),
            textProperties: JSON.parse(JSON.stringify(this.textProperties)),
            canvasProperties: JSON.parse(JSON.stringify(this.canvasProperties))
        };
        
        this.state.history.push(snapshot);
        this.state.historyIndex = this.state.history.length - 1;
        
        // Limit history size
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
        this.elements.undoBtn.disabled = this.state.historyIndex <= 0;
        this.elements.redoBtn.disabled = this.state.historyIndex >= this.state.history.length - 1;
    }
    
    // =====================================================
    // 💾 Save & Export
    // =====================================================
    
    async saveProject() {
        try {
            const project = {
                name: this.elements.projectNameInput.value,
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
                this.elements.projectNameInput.value = project.name || 'تصميم جديد';
                this.canvasProperties = { ...this.canvasProperties, ...project.canvas };
                this.textProperties = { ...this.textProperties, ...project.text };
                this.state.layers = project.layers || [];
                
                // Restore OpenType features
                if (project.openTypeFeatures) {
                    this.state.activeOpenTypeFeatures = new Set(project.openTypeFeatures);
                    project.openTypeFeatures.forEach(f => {
                        const el = document.querySelector(`.opentype-feature[data-feature="${f}"]`);
                        el?.classList.add('active');
                    });
                }
                
                if (project.stylisticSets) {
                    this.state.activeStylisticSets = new Set(project.stylisticSets);
                    project.stylisticSets.forEach(ss => {
                        const el = document.querySelector(`.stylistic-set[data-ss="${ss}"]`);
                        el?.classList.add('active');
                    });
                }
                
                if (project.characterVariants) {
                    this.state.activeCharacterVariants = new Set(project.characterVariants);
                    project.characterVariants.forEach(cv => {
                        const el = document.querySelector(`.stylistic-set[data-cv="${cv}"]`);
                        el?.classList.add('active');
                    });
                }
                
                // Update UI
                this.elements.textInput.value = this.textProperties.text;
                this.elements.charCount.textContent = this.textProperties.text.length;
                
                // إخفاء نافذة البداية إذا تم تحميل مشروع محفوظ بنجاح
                if (this.elements.startupModal) {
                    this.elements.startupModal.classList.remove('active');
                }
                this.updateLayersList();
                this.updateOpenTypeFeaturesCount();
                this.render();
            }
        } catch (error) {
            console.error('Error loading project:', error);
        }
    }
    
    openExportModal() {
        this.elements.exportModal.classList.add('active');
        document.getElementById('export-width').textContent = this.canvasProperties.width;
        document.getElementById('export-height').textContent = this.canvasProperties.height;
    }
    
    closeExportModal() {
        this.elements.exportModal.classList.remove('active');
    }
    
    exportImage() {
        const format = document.querySelector('.export-format.active').dataset.format;
        const quality = parseInt(this.elements.exportQualitySlider.value) / 100;
        
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
            const fileName = `${this.elements.projectNameInput.value || 'design'}.${extension}`;
            saveAs(blob, fileName);
            this.closeExportModal();
            this.showToast('تم التصدير', 'success', `تم حفظ الصورة بصيغة ${format.toUpperCase()}`);
        }, mimeType, quality);
    }
    
    // =====================================================
    // ⌨️ Keyboard Shortcuts
    // =====================================================
    
    handleKeyboard(e) {
        // Ctrl/Cmd shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.redo();
                    } else {
                        this.undo();
                    }
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
        
        // Delete key
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (document.activeElement.tagName !== 'INPUT' && 
                document.activeElement.tagName !== 'TEXTAREA') {
                this.deleteSelectedLayer();
            }
        }
        
        // Escape
        if (e.key === 'Escape') {
            this.closeExportModal();
            this.state.selectedElement = null;
            this.updateLayersList();
        }
    }
    
    // =====================================================
    // 🌓 Theme Toggle
    // =====================================================
    
    toggleTheme() {
        const body = document.body;
        const currentTheme = body.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.dataset.theme = newTheme;
        
        // Update icon
        const icon = this.elements.themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        
        // Save preference
        localStorage.setItem('theme', newTheme);
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.dataset.theme = savedTheme;
        
        const icon = this.elements.themeToggle.querySelector('i');
        icon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // =====================================================
    // 🔔 Toast Notifications
    // =====================================================
    
    showToast(title, type = 'info', message = '') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${icons[type] || icons.info}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                ${message ? `<div class="toast-message">${message}</div>` : ''}
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        this.elements.toastContainer.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.removeToast(toast);
        });
        
        // Auto remove
        setTimeout(() => {
            this.removeToast(toast);
        }, 4000);
    }
    
    removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
    
    // =====================================================
    // 🚀 Splash Screen
    // =====================================================
    
    hideSplashScreen() {
        // تم تقليل الوقت من 1500 إلى 150 ملي ثانية فقط لفتح التطبيق كالصاروخ
        setTimeout(() => {
            this.elements.splashScreen.classList.add('hidden');
        }, 150);
    }
    
    // =====================================================
    // 💾 Load Saved Data
    // =====================================================
    
    async loadSavedData() {
        // تم حذف loadTheme() لأننا نعتمد الآن على التصميم الليلي الفخم دائماً
        
        // Load fonts
        await this.loadFontsFromStorage();
        
        // Load project
        await this.loadProject();
        
        // Initialize font list
        this.updateFontList();
        
        // Save initial history state
        this.saveHistory();
    }
}

// =====================================================
// 🎬 Initialize Application
// =====================================================

// Wait for DOM and fonts to load
document.addEventListener('DOMContentLoaded', () => {
    // Wait for web fonts
    document.fonts.ready.then(() => {
        // Initialize app
        window.fontStudio = new FontStudioApp();
    });
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}


// Handle app install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Can show install button here
});
