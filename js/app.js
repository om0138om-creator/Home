/**
 * =====================================================
 * 🚀 Font Studio Pro v2.0
 * =====================================================
 */

'use strict';

const CONFIG = {
    CANVAS: { DEFAULT_WIDTH: 1080, DEFAULT_HEIGHT: 1080, MIN_ZOOM: 0.1, MAX_ZOOM: 3, ZOOM_STEP: 0.1 },
    TEXT: { DEFAULT_SIZE: 48, MIN_SIZE: 12, MAX_SIZE: 300, DEFAULT_FONT: 'Cairo', DEFAULT_COLOR: '#000000' },
    STORAGE: { FONTS: 'fs_fonts', PROJECTS: 'fs_projects' }
};

class FontStudioApp {
    constructor() {
        this.state = {
            zoom: 1,
            selectedLayer: null,
            layers: [],
            history: [],
            historyIndex: -1,
            activeFeatures: new Set(),
            activeSS: new Set()
        };

        this.canvas = {
            width: CONFIG.CANVAS.DEFAULT_WIDTH,
            height: CONFIG.CANVAS.DEFAULT_HEIGHT,
            bgColor: '#ffffff',
            bgImage: null
        };

        this.textProps = {
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
            shadow: { enabled: false, x: 2, y: 2, blur: 4, color: '#000000' },
            stroke: { enabled: false, width: 1, color: '#000000' }
        };

        this.el = {};
        this.fonts = new Map();
        this.init();
    }

    init() {
        console.log('🎨 Font Studio Pro v2.0 - Starting...');
        this.cacheElements();
        this.setupEventListeners();
        this.setupCanvas();
        this.generateStylisticSets();
        this.updateFontList();
        this.loadSavedFonts();
        
        // الضربة القاضية: استدعاء قسم "أعمالي" فور فتح التطبيق
        this.loadProjectsList();

        setTimeout(() => {
            document.getElementById('splash-screen')?.classList.add('hidden');
        }, 800);
        console.log('✅ Ready!');
    }

    cacheElements() {
        this.el.splash = document.getElementById('splash-screen');
        this.el.home = document.getElementById('home-screen');
        this.el.app = document.getElementById('app');
        this.el.startEmpty = document.getElementById('start-empty-btn');
        this.el.startImage = document.getElementById('start-image-btn');
        this.el.presetCards = document.querySelectorAll('.preset-card');
        this.el.homeBgColor = document.getElementById('home-bg-color');
        this.el.homePresetColors = document.querySelectorAll('#home-preset-colors .preset-color');
        this.el.canvasContainer = document.getElementById('canvas-container');
        this.el.canvasWrapper = document.getElementById('canvas-wrapper');
        this.el.canvas = document.getElementById('main-canvas');
        this.el.ctx = this.el.canvas.getContext('2d');
        this.el.canvasTools = document.getElementById('canvas-tools');
        this.el.projectName = document.getElementById('project-name-input');
        this.el.undoBtn = document.getElementById('undo-btn');
        this.el.redoBtn = document.getElementById('redo-btn');
        this.el.exportBtn = document.getElementById('export-btn');
        this.el.selectTool = document.getElementById('select-tool');
        this.el.textTool = document.getElementById('text-tool');
        this.el.imageTool = document.getElementById('image-tool');
        this.el.addTextBtn = document.getElementById('add-text-btn');
        this.el.zoomIn = document.getElementById('zoom-in');
        this.el.zoomOut = document.getElementById('zoom-out');
        this.el.zoomValue = document.getElementById('zoom-value');
        this.el.sidebar = document.getElementById('sidebar');
        this.el.panelHandle = document.getElementById('panel-handle');
        this.el.panels = document.querySelectorAll('.sidebar-panel');
        this.el.bottomNav = document.getElementById('bottom-nav');
        this.el.navItems = document.querySelectorAll('.nav-item');
        this.el.boldBtn = document.getElementById('bold-btn');
        this.el.italicBtn = document.getElementById('italic-btn');
        this.el.underlineBtn = document.getElementById('underline-btn');
        this.el.alignRight = document.getElementById('align-right-btn');
        this.el.alignCenter = document.getElementById('align-center-btn');
        this.el.alignLeft = document.getElementById('align-left-btn');
        this.el.fontSizeSlider = document.getElementById('font-size-slider');
        this.el.fontSizeValue = document.getElementById('font-size-value');
        this.el.letterSpacingSlider = document.getElementById('letter-spacing-slider');
        this.el.letterSpacingValue = document.getElementById('letter-spacing-value');
        this.el.lineHeightSlider = document.getElementById('line-height-slider');
        this.el.lineHeightValue = document.getElementById('line-height-value');
        this.el.fontSearch = document.getElementById('font-search');
        this.el.fontList = document.getElementById('font-list');
        this.el.addFontsArea = document.getElementById('add-fonts-area');
        this.el.fontFileInput = document.getElementById('font-file-input');
        this.el.otFeatures = document.getElementById('ot-features');
        this.el.otCount = document.getElementById('ot-count');
        this.el.ssGrid = document.getElementById('ss-grid');
        this.el.textColorPicker = document.getElementById('text-color-picker');
        this.el.textColorHex = document.getElementById('text-color-hex');
        this.el.textColorPreview = document.getElementById('text-color-preview');
        this.el.bgColorPicker = document.getElementById('bg-color-picker');
        this.el.bgColorHex = document.getElementById('bg-color-hex');
        this.el.bgColorPreview = document.getElementById('bg-color-preview');
        this.el.opacitySlider = document.getElementById('opacity-slider');
        this.el.opacityValue = document.getElementById('opacity-value');
        this.el.shadowToggle = document.getElementById('shadow-toggle');
        this.el.shadowControls = document.getElementById('shadow-controls');
        this.el.shadowX = document.getElementById('shadow-x');
        this.el.shadowY = document.getElementById('shadow-y');
        this.el.shadowBlur = document.getElementById('shadow-blur');
        this.el.shadowColor = document.getElementById('shadow-color');
        this.el.layersList = document.getElementById('layers-list');
        this.el.addLayerBtn = document.getElementById('add-layer-btn');
        this.el.deleteLayerBtn = document.getElementById('delete-layer-btn');
        this.el.inshotToolbar = document.getElementById('inshot-toolbar');
        this.el.inshotOverlay = document.getElementById('inshot-overlay');
        this.el.inshotInput = document.getElementById('inshot-input');
        this.el.inshotDone = document.getElementById('inshot-done');
        this.el.inshotClose = document.getElementById('inshot-close');
        this.el.inshotClear = document.getElementById('inshot-clear');
        this.el.inshotTools = document.querySelectorAll('.inshot-tool-btn');
        this.el.exportModal = document.getElementById('export-modal');
        this.el.modalClose = document.getElementById('modal-close');
        this.el.exportCancel = document.getElementById('export-cancel');
        this.el.exportSaveGallery = document.getElementById('export-save-gallery');
        this.el.exportShare = document.getElementById('export-share');
        this.el.exportFormats = document.querySelectorAll('.export-format');
        this.el.qualityPresets = document.querySelectorAll('.quality-preset');
        this.el.qualitySlider = document.getElementById('quality-slider');
        this.el.expW = document.getElementById('exp-w');
        this.el.expH = document.getElementById('exp-h');
        this.el.toastContainer = document.getElementById('toast-container');
    }

    setupCanvas() {
        this.el.canvas.width = this.canvas.width;
        this.el.canvas.height = this.canvas.height;
        this.el.canvasWrapper.style.width = this.canvas.width + 'px';
        this.el.canvasWrapper.style.height = this.canvas.height + 'px';
        this.el.ctx.imageSmoothingEnabled = true;
        this.el.ctx.imageSmoothingQuality = 'high';
    }

    fitCanvasToViewport() {
        const container = this.el.canvasContainer;
        const wrapper = this.el.canvasWrapper;
        if (!container || !wrapper) return;

        // إعادة تعيين الأبعاد الحقيقية
        this.el.canvas.width = this.canvas.width;
        this.el.canvas.height = this.canvas.height;
        wrapper.style.width = this.canvas.width + 'px';
        wrapper.style.height = this.canvas.height + 'px';

        // حساب الزوم
        const rect = container.getBoundingClientRect();
        const padding = 30;
        const availW = rect.width - (padding * 2);
        const availH = rect.height - (padding * 2);
        const scaleX = availW / this.canvas.width;
        const scaleY = availH / this.canvas.height;
        this.state.zoom = Math.min(scaleX, scaleY, 1);

        wrapper.style.transform = `scale(${this.state.zoom})`;
        if (this.el.zoomValue) {
            this.el.zoomValue.textContent = Math.round(this.state.zoom * 100) + '%';
        }

        console.log('📐 Canvas:', this.canvas.width + 'x' + this.canvas.height, 'Zoom:', Math.round(this.state.zoom * 100) + '%');
        this.render();
    }

    setupEventListeners() {
        this.setupHomeScreen();
        
        this.el.canvasContainer?.addEventListener('click', (e) => {
            if (e.target === this.el.canvasContainer) {
                this.closePanel();
                this.state.selectedLayer = null;
                this.render();
            }
        });

        this.el.panelHandle?.addEventListener('click', () => this.closePanel());

        this.el.navItems?.forEach(item => {
            item.addEventListener('click', () => {
                const panel = item.dataset.panel;
                if (panel === 'text') {
                    const layer = this.getSelectedTextLayer();
                    layer ? this.openInShotEditor() : this.addTextLayer();
                } else {
                    this.openPanel(panel);
                }
            });
        });

        this.el.addTextBtn?.addEventListener('click', () => this.addTextLayer());
        this.el.zoomIn?.addEventListener('click', () => this.zoom(1));
        this.el.zoomOut?.addEventListener('click', () => this.zoom(-1));

        this.setupFormatButtons();
        this.setupSliders();
        this.setupColors();
        this.setupFonts();
        this.setupOpenType();

        this.el.addLayerBtn?.addEventListener('click', () => this.addTextLayer());
        this.el.deleteLayerBtn?.addEventListener('click', () => this.deleteSelectedLayer());

        this.setupInShotEditor();
        this.setupExport();

        this.el.undoBtn?.addEventListener('click', () => this.undo());
        this.el.redoBtn?.addEventListener('click', () => this.redo());
        this.el.exportBtn?.addEventListener('click', () => this.openExportModal());

        this.setupTouch();
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (this.el.app?.classList.contains('active')) {
                    this.fitCanvasToViewport();
                }
            }, 150);
        });

        // 💡 تفعيل زر معلومات التطبيق
        document.getElementById('app-info-btn')?.addEventListener('click', () => {
            this.toast('معلومات التطبيق', 'info', 'تم صنع وتطوير هذا التطبيق بالكامل من قبل: عمر سنجق و محمود سنجق');
        });

        // 💡 تفعيل زر الخروج (يظهر نافذة التأكيد)
        document.getElementById('exit-btn')?.addEventListener('click', () => {
            document.getElementById('exit-modal')?.classList.add('active');
        });

        // 💡 أزرار نافذة التأكيد
        document.getElementById('exit-cancel')?.addEventListener('click', () => {
            document.getElementById('exit-modal')?.classList.remove('active');
        });

        document.getElementById('exit-discard')?.addEventListener('click', () => {
            document.getElementById('exit-modal')?.classList.remove('active');
            this.el.app.classList.remove('active');
            this.el.home.classList.remove('hidden');
            this.toast('تم حذف التصميم والخروج', 'info');
        });

        document.getElementById('exit-save')?.addEventListener('click', () => {
            document.getElementById('exit-modal')?.classList.remove('active');
            this.saveCurrentProjectAsDraft(); // يحفظ في أعمالي
            this.el.app.classList.remove('active');
            this.el.home.classList.remove('hidden');
        });
    }

    setupHomeScreen() {
        let selectedWidth = 1080;
        let selectedHeight = 1080;
        let selectedBgColor = '#ffffff';

        this.el.presetCards?.forEach(card => {
            card.addEventListener('click', () => {
                this.el.presetCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                selectedWidth = parseInt(card.dataset.width);
                selectedHeight = parseInt(card.dataset.height);
                console.log('📐 Selected:', selectedWidth + 'x' + selectedHeight);
            });
        });

        this.el.homeBgColor?.addEventListener('input', (e) => {
            selectedBgColor = e.target.value;
            this.el.homePresetColors?.forEach(c => c.classList.remove('active'));
        });

        this.el.homePresetColors?.forEach(c => {
            c.addEventListener('click', () => {
                this.el.homePresetColors.forEach(x => x.classList.remove('active'));
                c.classList.add('active');
                selectedBgColor = c.dataset.color;
                if (this.el.homeBgColor) this.el.homeBgColor.value = selectedBgColor;
            });
        });

        // زر مساحة فارغة
        this.el.startEmpty?.addEventListener('click', () => {
            console.log('🎬 Starting with:', selectedWidth + 'x' + selectedHeight, selectedBgColor);
            
            this.canvas.width = selectedWidth;
            this.canvas.height = selectedHeight;
            this.canvas.bgColor = selectedBgColor;
            this.canvas.bgImage = null;

            this.el.canvas.width = selectedWidth;
            this.el.canvas.height = selectedHeight;
            this.el.canvasWrapper.style.width = selectedWidth + 'px';
            this.el.canvasWrapper.style.height = selectedHeight + 'px';

            this.state.layers = [];
            this.state.selectedLayer = null;

            this.showApp();
        });

        // زر من صورة
        this.el.startImage?.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        console.log('🖼️ Image:', img.width + 'x' + img.height);
                        
                        this.canvas.width = img.width;
                        this.canvas.height = img.height;
                        this.canvas.bgColor = '#ffffff';
                        this.canvas.bgImage = img;

                        this.el.canvas.width = img.width;
                        this.el.canvas.height = img.height;
                        this.el.canvasWrapper.style.width = img.width + 'px';
                        this.el.canvasWrapper.style.height = img.height + 'px';

                        this.state.layers = [];
                        this.state.selectedLayer = null;

                        this.showApp();
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            };
            input.click();
        });
    }

    showApp() {
        this.el.home?.classList.add('hidden');
        this.el.app?.classList.add('active');
        this.closePanel();

        setTimeout(() => {
            this.el.canvas.width = this.canvas.width;
            this.el.canvas.height = this.canvas.height;
            this.el.canvasWrapper.style.width = this.canvas.width + 'px';
            this.el.canvasWrapper.style.height = this.canvas.height + 'px';
            
            this.fitCanvasToViewport();
            this.updateLayersList();
            this.saveHistory();
        }, 100);
    }

    render() {
        const ctx = this.el.ctx;
        const canvas = this.el.canvas;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = this.canvas.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (this.canvas.bgImage) {
            ctx.drawImage(this.canvas.bgImage, 0, 0, canvas.width, canvas.height);
        }

        // Layers
        this.state.layers.forEach(layer => {
            if (!layer.visible) return;
            ctx.save();
            ctx.globalAlpha = layer.opacity || 1;
            if (layer.type === 'text') {
                this.renderTextLayer(ctx, layer);
            } else if (layer.type === 'image') {
                this.renderImageLayer(ctx, layer);
            }
            ctx.restore();
        });
    }

    renderTextLayer(ctx, layer) {
        const p = layer.props;
        if (!p.text) return;

        // --- 🪄 سحر الأوبن تايب: تطبيق الخصائص على الكانفاس ---
        let otFeatures = [];
        this.state.activeFeatures.forEach(f => otFeatures.push(`"${f}" 1`));
        this.state.activeSS.forEach(f => otFeatures.push(`"${f}" 1`));
        const featureString = otFeatures.length > 0 ? otFeatures.join(', ') : 'normal';
        this.el.canvas.style.fontFeatureSettings = featureString;
        this.el.canvas.style.fontVariantLigatures = 'normal';
        // ----------------------------------------------------

        const fontStyle = p.fontStyle === 'italic' ? 'italic ' : '';
        const fontWeight = p.fontWeight === 'bold' ? 'bold ' : '';
        ctx.font = `${fontStyle}${fontWeight}${p.fontSize}px "${p.fontFamily}"`;
        ctx.textAlign = p.textAlign;
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = p.opacity || 1;

        const lines = p.text.split('\n');
        const lineHeight = p.fontSize * (p.lineHeight || 1.5);
        const totalHeight = lines.length * lineHeight;
        const startY = layer.y - totalHeight / 2 + lineHeight / 2;

        lines.forEach((line, i) => {
            const y = startY + i * lineHeight;

            if (p.shadow?.enabled) {
                ctx.shadowColor = p.shadow.color;
                ctx.shadowOffsetX = p.shadow.x;
                ctx.shadowOffsetY = p.shadow.y;
                ctx.shadowBlur = p.shadow.blur;
            }

            if (p.stroke?.enabled) {
                ctx.strokeStyle = p.stroke.color;
                ctx.lineWidth = p.stroke.width * 2;
                ctx.lineJoin = 'round';
                this.drawTextLine(ctx, line, layer.x, y, p.letterSpacing, true);
            }

            ctx.shadowColor = 'transparent';
            ctx.fillStyle = p.color;
            this.drawTextLine(ctx, line, layer.x, y, p.letterSpacing, false);
        });

        if (layer.id === this.state.selectedLayer) {
            this.drawSelectionBox(ctx, layer, lines, lineHeight, totalHeight);
        }
        
        // إغلاق التأثير بعد رسم الطبقة لكي لا يؤثر على باقي الطبقات
        this.el.canvas.style.fontFeatureSettings = 'normal';
    }

    drawTextLine(ctx, text, x, y, spacing, isStroke) {
        if (!spacing || spacing === 0) {
            isStroke ? ctx.strokeText(text, x, y) : ctx.fillText(text, x, y);
            return;
        }

        const chars = [...text];
        let totalW = 0;
        const widths = chars.map(c => {
            const w = ctx.measureText(c).width;
            totalW += w + spacing;
            return w;
        });
        totalW -= spacing;

        let cx = x - totalW / 2;
        chars.forEach((c, i) => {
            const drawX = cx + widths[i] / 2;
            isStroke ? ctx.strokeText(c, drawX, y) : ctx.fillText(c, drawX, y);
            cx += widths[i] + spacing;
        });
    }

    drawSelectionBox(ctx, layer, lines, lineHeight, totalHeight) {
        let maxW = 0;
        lines.forEach(line => {
            const w = ctx.measureText(line).width;
            if (w > maxW) maxW = w;
        });

        const pad = 20;
        const boxW = maxW + pad * 2;
        const boxH = totalHeight + pad * 2;
        const boxX = layer.x - boxW / 2;
        const boxY = layer.y - boxH / 2;

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.setLineDash([]);
        ctx.strokeRect(boxX, boxY, boxW, boxH);
        ctx.shadowColor = 'transparent';

        const btnR = 12;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(boxX, boxY, btnR, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('×', boxX, boxY);

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(boxX + boxW, boxY + boxH, btnR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px Arial';
        ctx.fillText('⤢', boxX + boxW, boxY + boxH);
    }

    renderImageLayer(ctx, layer) {
        if (layer.image) {
            ctx.drawImage(layer.image, layer.x, layer.y, layer.width, layer.height);
        }
    }

    addTextLayer() {
        const layer = {
            id: 'layer_' + Date.now(),
            type: 'text',
            name: 'نص ' + (this.state.layers.filter(l => l.type === 'text').length + 1),
            visible: true,
            locked: false,
            opacity: 1,
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            props: {
                text: 'نص جديد',
                fontFamily: this.textProps.fontFamily,
                fontSize: this.textProps.fontSize,
                fontWeight: 'normal',
                fontStyle: 'normal',
                textAlign: 'center',
                color: '#000000',
                opacity: 1,
                letterSpacing: 0,
                lineHeight: 1.5,
                shadow: { enabled: false, x: 2, y: 2, blur: 4, color: '#000000' },
                stroke: { enabled: false, width: 1, color: '#000000' }
            }
        };

        this.state.layers.push(layer);
        this.state.selectedLayer = layer.id;
        this.textProps = { ...layer.props };
        this.updateLayersList();
        this.render();
        this.saveHistory();
        setTimeout(() => this.openInShotEditor(), 50);
        this.toast('تمت الإضافة', 'success');
    }

    getSelectedTextLayer() {
        return this.state.layers.find(l => l.id === this.state.selectedLayer && l.type === 'text');
    }

    selectLayer(id) {
        this.state.selectedLayer = id;
        const layer = this.state.layers.find(l => l.id === id);
        if (layer?.type === 'text') {
            this.textProps = { ...layer.props };
            this.updateUIFromProps();
        }
        this.updateLayersList();
        this.render();
    }

    updateUIFromProps() {
        const p = this.textProps;
        if (this.el.fontSizeSlider) {
            this.el.fontSizeSlider.value = p.fontSize;
            this.el.fontSizeValue.textContent = p.fontSize + 'px';
        }
        if (this.el.letterSpacingSlider) {
            this.el.letterSpacingSlider.value = p.letterSpacing || 0;
            this.el.letterSpacingValue.textContent = (p.letterSpacing || 0) + 'px';
        }
        if (this.el.lineHeightSlider) {
            this.el.lineHeightSlider.value = (p.lineHeight || 1.5) * 100;
            this.el.lineHeightValue.textContent = (p.lineHeight || 1.5).toFixed(2);
        }
        if (this.el.textColorPicker) {
            this.el.textColorPicker.value = p.color;
            this.el.textColorHex.value = p.color.toUpperCase();
            this.updateColorPreview('text', p.color);
        }
        this.el.boldBtn?.classList.toggle('active', p.fontWeight === 'bold');
        this.el.italicBtn?.classList.toggle('active', p.fontStyle === 'italic');
        this.el.alignRight?.classList.toggle('active', p.textAlign === 'right');
        this.el.alignCenter?.classList.toggle('active', p.textAlign === 'center');
        this.el.alignLeft?.classList.toggle('active', p.textAlign === 'left');
    }

    updateSelectedLayer() {
        const layer = this.getSelectedTextLayer();
        if (layer) {
            layer.props = { ...this.textProps };
            this.render();
        }
    }

    deleteSelectedLayer() {
        if (!this.state.selectedLayer) return;
        const idx = this.state.layers.findIndex(l => l.id === this.state.selectedLayer);
        if (idx > -1) {
            this.state.layers.splice(idx, 1);
            this.state.selectedLayer = null;
            this.updateLayersList();
            this.saveHistory();
            this.render();
            this.toast('تم الحذف', 'success');
        }
    }

    updateLayersList() {
        const list = this.el.layersList;
        if (!list) return;
        list.innerHTML = '';

        [...this.state.layers].reverse().forEach(layer => {
            const el = document.createElement('div');
            el.className = 'layer-item' + (layer.id === this.state.selectedLayer ? ' active' : '');
            const icon = layer.type === 'text' ? 'fa-font' : 'fa-image';
            const typeName = layer.type === 'text' ? 'نص' : 'صورة';

            el.innerHTML = `
                <div class="layer-thumb"><i class="fas ${icon}"></i></div>
                <div class="layer-info"><div class="layer-name">${layer.name}</div><div class="layer-type">${typeName}</div></div>
                <div class="layer-actions">
                    <button class="layer-action-btn ${layer.visible ? 'active' : ''}" data-action="visible"><i class="fas ${layer.visible ? 'fa-eye' : 'fa-eye-slash'}"></i></button>
                    <button class="layer-action-btn ${layer.locked ? 'active' : ''}" data-action="lock"><i class="fas ${layer.locked ? 'fa-lock' : 'fa-unlock'}"></i></button>
                </div>
            `;

            el.addEventListener('click', (e) => {
                if (!e.target.closest('.layer-action-btn')) this.selectLayer(layer.id);
            });

            el.querySelectorAll('.layer-action-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (btn.dataset.action === 'visible') layer.visible = !layer.visible;
                    if (btn.dataset.action === 'lock') layer.locked = !layer.locked;
                    this.updateLayersList();
                    this.render();
                });
            });

            list.appendChild(el);
        });
    }

    setupInShotEditor() {
        this.el.inshotInput?.addEventListener('input', (e) => {
            this.textProps.text = e.target.value;
            this.updateSelectedLayer();
        });

        this.el.inshotClear?.addEventListener('click', () => {
            if (this.el.inshotInput) {
                this.el.inshotInput.value = '';
                this.el.inshotInput.focus();
                this.textProps.text = '';
                this.updateSelectedLayer();
            }
        });

        this.el.inshotDone?.addEventListener('click', () => this.closeInShotEditor());
        this.el.inshotClose?.addEventListener('click', () => this.closeInShotEditor());
        this.el.inshotOverlay?.addEventListener('click', () => this.closeInShotEditor());

        this.el.inshotTools?.forEach(btn => {
            btn.addEventListener('click', () => {
                this.el.inshotTools.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const panel = btn.dataset.panel;
                if (panel === 'keyboard') {
                    this.closePanel();
                    this.el.inshotInput?.focus();
                } else {
                    this.openPanel(panel);
                }
            });
        });
    }

    openInShotEditor() {
        const layer = this.getSelectedTextLayer();
        if (!layer) return;
        if (this.el.inshotInput) this.el.inshotInput.value = layer.props.text || '';
        this.el.inshotToolbar?.classList.add('active');
        this.el.inshotOverlay?.classList.add('active');
        if (this.el.bottomNav) this.el.bottomNav.style.display = 'none';
        if (this.el.canvasTools) this.el.canvasTools.style.display = 'none';
        setTimeout(() => this.el.inshotInput?.focus(), 100);
    }

    closeInShotEditor() {
        this.el.inshotToolbar?.classList.remove('active');
        this.el.inshotOverlay?.classList.remove('active');
        if (this.el.bottomNav) this.el.bottomNav.style.display = 'flex';
        if (this.el.canvasTools) this.el.canvasTools.style.display = 'flex';
        this.closePanel();
        this.saveHistory();
    }

    openPanel(panelName) {
        this.el.panels?.forEach(p => p.classList.toggle('active', p.id === 'panel-' + panelName));
        this.el.navItems?.forEach(n => n.classList.toggle('active', n.dataset.panel === panelName));
        this.el.sidebar?.classList.add('active');
    }

    closePanel() {
        this.el.sidebar?.classList.remove('active');
        this.el.navItems?.forEach(n => n.classList.remove('active'));
    }

    setupFormatButtons() {
        this.el.boldBtn?.addEventListener('click', () => {
            this.textProps.fontWeight = this.textProps.fontWeight === 'bold' ? 'normal' : 'bold';
            this.el.boldBtn.classList.toggle('active');
            this.updateSelectedLayer();
        });

        this.el.italicBtn?.addEventListener('click', () => {
            this.textProps.fontStyle = this.textProps.fontStyle === 'italic' ? 'normal' : 'italic';
            this.el.italicBtn.classList.toggle('active');
            this.updateSelectedLayer();
        });

        this.el.underlineBtn?.addEventListener('click', () => {
            this.el.underlineBtn.classList.toggle('active');
        });

        const setAlign = (align) => {
            this.textProps.textAlign = align;
            this.el.alignRight?.classList.toggle('active', align === 'right');
            this.el.alignCenter?.classList.toggle('active', align === 'center');
            this.el.alignLeft?.classList.toggle('active', align === 'left');
            this.updateSelectedLayer();
        };

        this.el.alignRight?.addEventListener('click', () => setAlign('right'));
        this.el.alignCenter?.addEventListener('click', () => setAlign('center'));
        this.el.alignLeft?.addEventListener('click', () => setAlign('left'));
    }

    setupSliders() {
        this.el.fontSizeSlider?.addEventListener('input', (e) => {
            const v = parseInt(e.target.value);
            this.textProps.fontSize = v;
            this.el.fontSizeValue.textContent = v + 'px';
            this.updateSelectedLayer();
        });

        this.el.letterSpacingSlider?.addEventListener('input', (e) => {
            const v = parseInt(e.target.value);
            this.textProps.letterSpacing = v;
            this.el.letterSpacingValue.textContent = v + 'px';
            this.updateSelectedLayer();
        });

        this.el.lineHeightSlider?.addEventListener('input', (e) => {
            const v = parseInt(e.target.value) / 100;
            this.textProps.lineHeight = v;
            this.el.lineHeightValue.textContent = v.toFixed(2);
            this.updateSelectedLayer();
        });

        this.el.opacitySlider?.addEventListener('input', (e) => {
            const v = parseInt(e.target.value);
            this.textProps.opacity = v / 100;
            this.el.opacityValue.textContent = v + '%';
            this.updateSelectedLayer();
        });

        this.el.shadowToggle?.addEventListener('change', (e) => {
            this.textProps.shadow.enabled = e.target.checked;
            this.el.shadowControls?.classList.toggle('hidden', !e.target.checked);
            this.updateSelectedLayer();
        });

        this.el.shadowX?.addEventListener('input', (e) => {
            this.textProps.shadow.x = parseInt(e.target.value);
            document.getElementById('shadow-x-val').textContent = e.target.value + 'px';
            this.updateSelectedLayer();
        });

        this.el.shadowY?.addEventListener('input', (e) => {
            this.textProps.shadow.y = parseInt(e.target.value);
            document.getElementById('shadow-y-val').textContent = e.target.value + 'px';
            this.updateSelectedLayer();
        });

        this.el.shadowBlur?.addEventListener('input', (e) => {
            this.textProps.shadow.blur = parseInt(e.target.value);
            document.getElementById('shadow-blur-val').textContent = e.target.value + 'px';
            this.updateSelectedLayer();
        });

        this.el.shadowColor?.addEventListener('input', (e) => {
            this.textProps.shadow.color = e.target.value;
            this.updateSelectedLayer();
        });
    }

    setupColors() {
        this.el.textColorPicker?.addEventListener('input', (e) => {
            this.textProps.color = e.target.value;
            this.el.textColorHex.value = e.target.value.toUpperCase();
            this.updateColorPreview('text', e.target.value);
            this.updateSelectedLayer();
        });

        this.el.textColorHex?.addEventListener('change', (e) => {
            let v = e.target.value;
            if (!v.startsWith('#')) v = '#' + v;
            if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
                this.textProps.color = v;
                this.el.textColorPicker.value = v;
                this.updateColorPreview('text', v);
                this.updateSelectedLayer();
            }
        });

        document.querySelectorAll('#text-preset-colors .preset-color').forEach(c => {
            c.addEventListener('click', () => {
                const color = c.dataset.color;
                this.textProps.color = color;
                this.el.textColorPicker.value = color;
                this.el.textColorHex.value = color.toUpperCase();
                this.updateColorPreview('text', color);
                this.updateSelectedLayer();
            });
        });

        this.el.bgColorPicker?.addEventListener('input', (e) => {
            this.canvas.bgColor = e.target.value;
            this.el.bgColorHex.value = e.target.value.toUpperCase();
            this.updateColorPreview('bg', e.target.value);
            this.render();
        });

        this.el.bgColorHex?.addEventListener('change', (e) => {
            let v = e.target.value;
            if (!v.startsWith('#')) v = '#' + v;
            if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
                this.canvas.bgColor = v;
                this.el.bgColorPicker.value = v;
                this.updateColorPreview('bg', v);
                this.render();
            }
        });
    }

    updateColorPreview(type, color) {
        const preview = type === 'text' ? this.el.textColorPreview : this.el.bgColorPreview;
        const inner = preview?.querySelector('.color-preview-inner');
        if (inner) inner.style.background = color;
    }

    setupFonts() {
        this.el.fontSearch?.addEventListener('input', (e) => this.filterFonts(e.target.value));

        this.el.addFontsArea?.addEventListener('click', () => this.el.fontFileInput?.click());

        this.el.fontFileInput?.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            const validExts = ['ttf', 'otf', 'woff', 'woff2'];
            const fontFiles = files.filter(file => {
                const ext = file.name.split('.').pop().toLowerCase();
                return validExts.includes(ext);
            });

            if (fontFiles.length > 0) {
                console.log('📁 Loading', fontFiles.length, 'fonts...');
                this.handleFontFiles(fontFiles);
            } else {
                this.toast('صيغة غير مدعومة', 'warning', 'TTF, OTF, WOFF, WOFF2');
            }
            e.target.value = '';
        });

        this.el.addFontsArea?.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.el.addFontsArea.classList.add('dragging');
        });

        this.el.addFontsArea?.addEventListener('dragleave', () => {
            this.el.addFontsArea.classList.remove('dragging');
        });

        this.el.addFontsArea?.addEventListener('drop', (e) => {
            e.preventDefault();
            this.el.addFontsArea.classList.remove('dragging');
            const files = Array.from(e.dataTransfer.files);
            const validExts = ['ttf', 'otf', 'woff', 'woff2'];
            const fontFiles = files.filter(f => validExts.includes(f.name.split('.').pop().toLowerCase()));
            if (fontFiles.length > 0) this.handleFontFiles(fontFiles);
        });
    }

    async handleFontFiles(files) {
        let count = 0;
        for (const file of files) {
            try {
                const buffer = await this.readAsArrayBuffer(file);
                const name = file.name.replace(/\.[^.]+$/, '');
                const family = 'CustomFont_' + Date.now() + '_' + name;
                
                // 1. تحميل الخط
                const fontFace = new FontFace(family, buffer);
                await fontFace.load();
                document.fonts.add(fontFace);
                
                // 2. فحص الخط بذكاء لمعرفة الخصائص المتاحة فيه (Dimming logic)
                let availableFeatures = new Set();
                try {
                    const parsedFont = opentype.parse(buffer);
                    if (parsedFont.tables.gsub && parsedFont.tables.gsub.features) {
                        parsedFont.tables.gsub.features.forEach(f => availableFeatures.add(f.tag));
                    }
                } catch(e) { console.warn("لم نتمكن من قراءة خصائص الأوبن تايب للخط:", name); }

                this.fonts.set(family, { name, family, file: file.name, data: buffer, features: availableFeatures });
                count++;
                if (count === 1) this.selectFont(family);
            } catch (err) {
                console.error('Font error:', err);
                this.toast('خطأ في الخط', 'error', file.name);
            }
        }
        if (count > 0) {
            this.updateFontList();
            this.saveFonts();
            this.toast('تمت الإضافة', 'success', `${count} خط`);
        }
    }

    readAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }

    updateFontList() {
        const list = this.el.fontList;
        if (!list) return;
        list.innerHTML = '';

        const systemFonts = ['Cairo', 'Tajawal', 'Arial', 'Tahoma'];
        systemFonts.forEach(name => list.appendChild(this.createFontItem(name, name, true)));
        this.fonts.forEach((info, family) => list.appendChild(this.createFontItem(info.name, family, false)));
    }

    createFontItem(displayName, family, isSystem) {
        const el = document.createElement('div');
        el.className = 'font-item' + (family === this.textProps.fontFamily ? ' active' : '');
        el.dataset.family = family;

        el.innerHTML = `
            <div style="flex:1">
                <div class="font-item-preview" style="font-family:'${family}'">أبجد هوز</div>
                <div class="font-item-name">${displayName}</div>
            </div>
            ${!isSystem ? '<button class="section-btn" style="color:var(--danger)"><i class="fas fa-trash"></i></button>' : ''}
        `;

        el.addEventListener('click', (e) => {
            if (!e.target.closest('.section-btn')) this.selectFont(family);
        });

        const delBtn = el.querySelector('.section-btn');
        if (delBtn) {
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.fonts.delete(family);
                this.updateFontList();
                this.saveFonts();
                if (this.textProps.fontFamily === family) this.selectFont('Cairo');
            });
        }

        return el;
    }

    selectFont(family) {
        this.textProps.fontFamily = family;
        document.querySelectorAll('.font-item').forEach(el => {
            el.classList.toggle('active', el.dataset.family === family);
        });
        
        // تحديث إضاءة أزرار الأوبن تايب بناءً على الخط المحدد
        this.updateOpenTypeUI(family);
        this.updateSelectedLayer();
    }

    updateOpenTypeUI(family) {
        const fontInfo = this.fonts.get(family);
        const available = fontInfo && fontInfo.features ? fontInfo.features : new Set();
        
        // تظليم/إضاءة الخصائص الأساسية (Swash, Ligatures...)
        document.querySelectorAll('.opentype-feature').forEach(el => {
            const tag = el.dataset.feature;
            if (available.has(tag)) {
                el.classList.remove('unavailable');
            } else {
                el.classList.add('unavailable');
                el.classList.remove('active');
                this.state.activeFeatures.delete(tag);
            }
        });
        
        // تظليم/إضاءة المجموعات الأسلوبية (SS01-SS20)
        document.querySelectorAll('.stylistic-set').forEach(el => {
            const tag = el.dataset.ss;
            if (available.has(tag)) {
                el.classList.remove('unavailable');
            } else {
                el.classList.add('unavailable');
                el.classList.remove('active');
                this.state.activeSS.delete(tag);
            }
        });
        
        this.updateOTCount();
    }

    filterFonts(query) {
        const q = query.toLowerCase();
        document.querySelectorAll('.font-item').forEach(el => {
            const name = el.querySelector('.font-item-name')?.textContent.toLowerCase() || '';
            el.style.display = name.includes(q) ? '' : 'none';
        });
    }

    async saveFonts() {
        try {
            const data = [];
            this.fonts.forEach(info => {
                data.push({ name: info.name, family: info.family, file: info.file, base64: this.bufferToBase64(info.data) });
            });
            await localforage.setItem(CONFIG.STORAGE.FONTS, data);
        } catch (e) { console.error('Save fonts error:', e); }
    }

    async loadSavedFonts() {
        try {
            const data = await localforage.getItem(CONFIG.STORAGE.FONTS);
            if (!data) return;
            for (const item of data) {
                try {
                    const buffer = this.base64ToBuffer(item.base64);
                    const fontFace = new FontFace(item.family, buffer);
                    await fontFace.load();
                    document.fonts.add(fontFace);
                    
                    // استخراج الخصائص عند التحميل من الذاكرة
                    let availableFeatures = new Set();
                    try {
                        const parsedFont = opentype.parse(buffer);
                        if (parsedFont.tables.gsub && parsedFont.tables.gsub.features) {
                            parsedFont.tables.gsub.features.forEach(f => availableFeatures.add(f.tag));
                        }
                    } catch(e) {}

                    this.fonts.set(item.family, { name: item.name, family: item.family, file: item.file, data: buffer, features: availableFeatures });
                } catch (e) { console.warn('Load font error:', item.name); }
            }
            this.updateFontList();
        } catch (e) { console.error('Load fonts error:', e); }
    }

    bufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
    }

    base64ToBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return bytes.buffer;
    }

    setupOpenType() {
        this.el.otFeatures?.addEventListener('click', (e) => {
            const f = e.target.closest('.opentype-feature');
            if (f && !f.classList.contains('unavailable')) {
                f.classList.toggle('active');
                const tag = f.dataset.feature;
                if (this.state.activeFeatures.has(tag)) {
                    this.state.activeFeatures.delete(tag);
                } else {
                    this.state.activeFeatures.add(tag);
                }
                this.updateOTCount();
                // تحديث لحظي فائق السرعة وبدون تهنيج
                requestAnimationFrame(() => this.render());
            }
        });
    }

    generateStylisticSets() {
        const grid = this.el.ssGrid;
        if (!grid) return;
        grid.innerHTML = '';
        for (let i = 1; i <= 20; i++) {
            const tag = 'ss' + String(i).padStart(2, '0');
            const el = document.createElement('div');
            el.className = 'stylistic-set';
            el.dataset.ss = tag;
            el.textContent = 'SS' + String(i).padStart(2, '0');
            el.addEventListener('click', () => {
                el.classList.toggle('active');
                if (this.state.activeSS.has(tag)) {
                    this.state.activeSS.delete(tag);
                } else {
                    this.state.activeSS.add(tag);
                }
                this.updateOTCount();
                // تحديث لحظي فائق السرعة
                requestAnimationFrame(() => this.render());
            });
            grid.appendChild(el);
        }
    }

    updateOTCount() {
        const count = this.state.activeFeatures.size + this.state.activeSS.size;
        if (this.el.otCount) this.el.otCount.textContent = count;
    }

    setupTouch() {
        if (typeof Hammer === 'undefined') return;
        const hammer = new Hammer.Manager(this.el.canvasContainer);
        const tap = new Hammer.Tap({ taps: 1 });
        const pan = new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 10 });
        const pinch = new Hammer.Pinch();
        hammer.add([pinch, pan, tap]);
        pinch.recognizeWith(pan);

        let dragging = false, dragLayer = null, startX = 0, startY = 0, startFontSize = 48;

        const hitTest = (center) => {
            const rect = this.el.canvas.getBoundingClientRect();
            const x = (center.x - rect.left) * (this.el.canvas.width / rect.width);
            const y = (center.y - rect.top) * (this.el.canvas.height / rect.height);
            const ctx = this.el.ctx;

            for (let i = this.state.layers.length - 1; i >= 0; i--) {
                const layer = this.state.layers[i];
                if (!layer.visible || layer.locked) continue;
                if (layer.type === 'text') {
                    ctx.font = `${layer.props.fontSize}px "${layer.props.fontFamily}"`;
                    const w = ctx.measureText(layer.props.text || ' ').width;
                    const h = layer.props.fontSize;
                    const pad = 30;
                    if (x >= layer.x - w/2 - pad && x <= layer.x + w/2 + pad && y >= layer.y - h/2 - pad && y <= layer.y + h/2 + pad) return layer;
                }
            }
            return null;
        };

        hammer.on('tap', (e) => {
            const layer = hitTest(e.center);
            if (layer) {
                this.selectLayer(layer.id);
                this.openInShotEditor();
            } else {
                this.state.selectedLayer = null;
                this.closeInShotEditor();
                this.closePanel();
                this.render();
            }
        });

        hammer.on('panstart', (e) => {
            this.closePanel();
            const layer = hitTest(e.center);
            if (layer && !layer.locked) {
                dragging = true;
                dragLayer = layer;
                this.selectLayer(layer.id);
                startX = layer.x;
                startY = layer.y;
            }
        });

        hammer.on('panmove', (e) => {
            if (dragging && dragLayer) {
                dragLayer.x = startX + e.deltaX / this.state.zoom;
                dragLayer.y = startY + e.deltaY / this.state.zoom;
                this.render();
            }
        });

        hammer.on('panend', () => {
            if (dragging) { this.saveHistory(); dragging = false; dragLayer = null; }
        });

        hammer.on('pinchstart', (e) => {
            const layer = hitTest(e.center);
            if (layer?.type === 'text') {
                dragging = true;
                dragLayer = layer;
                this.selectLayer(layer.id);
                startFontSize = layer.props.fontSize;
            }
        });

        hammer.on('pinchmove', (e) => {
            if (dragging && dragLayer?.type === 'text') {
                let newSize = startFontSize * e.scale;
                newSize = Math.max(CONFIG.TEXT.MIN_SIZE, Math.min(CONFIG.TEXT.MAX_SIZE, newSize));
                dragLayer.props.fontSize = Math.round(newSize);
                this.textProps.fontSize = Math.round(newSize);
                if (this.el.fontSizeSlider) {
                    this.el.fontSizeSlider.value = newSize;
                    this.el.fontSizeValue.textContent = Math.round(newSize) + 'px';
                }
                this.render();
            }
        });

        hammer.on('pinchend', () => {
            if (dragging) { this.saveHistory(); dragging = false; dragLayer = null; }
        });
    }

    zoom(dir) {
        const step = CONFIG.CANVAS.ZOOM_STEP;
        this.state.zoom = dir > 0 
            ? Math.min(this.state.zoom + step, CONFIG.CANVAS.MAX_ZOOM) 
            : Math.max(this.state.zoom - step, CONFIG.CANVAS.MIN_ZOOM);
        this.el.canvasWrapper.style.transform = `scale(${this.state.zoom})`;
        this.el.zoomValue.textContent = Math.round(this.state.zoom * 100) + '%';
    }

    saveHistory() {
        this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
        this.state.history.push({ layers: JSON.parse(JSON.stringify(this.state.layers)), canvas: { ...this.canvas } });
        this.state.historyIndex = this.state.history.length - 1;
        if (this.state.history.length > 30) { this.state.history.shift(); this.state.historyIndex--; }
        this.updateHistoryBtns();
    }

    undo() {
        if (this.state.historyIndex > 0) { this.state.historyIndex--; this.restoreHistory(); }
    }

    redo() {
        if (this.state.historyIndex < this.state.history.length - 1) { this.state.historyIndex++; this.restoreHistory(); }
    }

    restoreHistory() {
        const snap = this.state.history[this.state.historyIndex];
        this.state.layers = JSON.parse(JSON.stringify(snap.layers));
        this.canvas = { ...snap.canvas };
        this.updateLayersList();
        this.updateHistoryBtns();
        this.render();
    }

    updateHistoryBtns() {
        if (this.el.undoBtn) this.el.undoBtn.disabled = this.state.historyIndex <= 0;
        if (this.el.redoBtn) this.el.redoBtn.disabled = this.state.historyIndex >= this.state.history.length - 1;
    }

    setupExport() {
        this.el.modalClose?.addEventListener('click', () => this.closeExportModal());
        this.el.exportCancel?.addEventListener('click', () => this.closeExportModal());
        // الزرين الجداد كل واحد بيبعت أمر مختلف
        this.el.exportSaveGallery?.addEventListener('click', () => this.doExport('save'));
        this.el.exportShare?.addEventListener('click', () => this.doExport('share'));

        this.el.exportFormats?.forEach(f => {
            f.addEventListener('click', () => {
                this.el.exportFormats.forEach(x => x.classList.remove('active'));
                f.classList.add('active');
            });
        });

        this.el.qualityPresets?.forEach(p => {
            p.addEventListener('click', () => {
                this.el.qualityPresets.forEach(x => x.classList.remove('active'));
                p.classList.add('active');
                if (this.el.qualitySlider) this.el.qualitySlider.value = p.dataset.q;
            });
        });
    }

    openExportModal() {
        if (this.el.expW) this.el.expW.textContent = this.canvas.width;
        if (this.el.expH) this.el.expH.textContent = this.canvas.height;
        this.el.exportModal?.classList.add('active');
    }

    closeExportModal() {
        this.el.exportModal?.classList.remove('active');
    }

    async doExport(action = 'save') {
        const prevSel = this.state.selectedLayer;
        this.state.selectedLayer = null;
        this.render();

        const format = document.querySelector('.export-format.active')?.dataset.format || 'png';
        const quality = parseInt(this.el.qualitySlider?.value || 90) / 100;
        let mime = 'image/png', ext = 'png';
        if (format === 'jpg') { mime = 'image/jpeg'; ext = 'jpg'; }
        if (format === 'webp') { mime = 'image/webp'; ext = 'webp'; }

        try {
            const dataUrl = this.el.canvas.toDataURL(mime, quality);
            const name = (this.el.projectName?.value || 'design') + '_' + Date.now();
            const fullName = name + '.' + ext;

            // هل نحن داخل الـ APK؟ (Cordova)
            if (typeof window !== 'undefined' && window.cordova) {
                
                // خيار المشاركة
                if (action === 'share' && window.plugins && window.plugins.socialsharing) {
                    window.plugins.socialsharing.share(
                        null, fullName, dataUrl, null,
                        () => { this.closeExportModal(); },
                        (err) => { this.toast('تم الإلغاء', 'info'); }
                    );
                } 
                // خيار الحفظ الصامت في المعرض
                else if (action === 'save' && cordova.base64ToGallery) {
                    cordova.base64ToGallery(
                        dataUrl, 
                        { prefix: 'FontStudio_', mediaScanner: true },
                        (path) => {
                            this.toast('تم الحفظ في المعرض بنجاح', 'success');
                            this.closeExportModal();
                        },
                        (err) => {
                            console.error(err);
                            this.toast('فشل الحفظ، تأكد من الصلاحيات', 'error');
                        }
                    );
                } else {
                    throw new Error('Cordova plugins not available');
                }
            } 
            // الخطة البديلة: إذا تم فتح التطبيق من متصفح الويب (PWA)
            else {
                if (action === 'share' && navigator.canShare) {
                    const res = await fetch(dataUrl);
                    const blob = await res.blob();
                    const file = new File([blob], fullName, { type: mime });
                    if (navigator.canShare({ files: [file] })) {
                        await navigator.share({ files: [file], title: fullName });
                        this.closeExportModal();
                        this.toast('تم الإجراء بنجاح', 'success');
                        this.state.selectedLayer = prevSel;
                        this.render();
                        return;
                    }
                }
                
                // تحميل عادي كملف إذا اختار "حفظ" من المتصفح أو إذا فشلت المشاركة
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = fullName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                this.closeExportModal();
                this.toast('تم التنزيل لملفاتك', 'success');
            }
        } catch (error) {
            console.error("Export Error:", error);
            
            // خطة الإنقاذ الأخيرة: تحميل إجباري
            const dataUrl = this.el.canvas.toDataURL(mime, quality);
            const fullName = (this.el.projectName?.value || 'design') + '_' + Date.now() + '.' + ext;
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = fullName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.closeExportModal();
            this.toast('تم التنزيل لملفاتك', 'success');
        }

        this.state.selectedLayer = prevSel;
        this.render();
    }

    handleKeyboard(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'z': e.preventDefault(); e.shiftKey ? this.redo() : this.undo(); break;
                case 'y': e.preventDefault(); this.redo(); break;
                case 's': e.preventDefault(); this.toast('تم الحفظ', 'success'); break;
                case 'e': e.preventDefault(); this.openExportModal(); break;
            }
        }
        if ((e.key === 'Delete' || e.key === 'Backspace') && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
            this.deleteSelectedLayer();
        }
        if (e.key === 'Escape') {
            this.closeExportModal();
            this.closeInShotEditor();
            this.closePanel();
            this.state.selectedLayer = null;
            this.render();
        }
    }

    // =====================================================
    // 📁 نظام إدارة المشروعات (أعمالي)
    // =====================================================
    async loadProjectsList() {
        try {
            const projects = await localforage.getItem(CONFIG.STORAGE.PROJECTS) || [];
            const container = document.getElementById('my-projects-section');
            const list = document.getElementById('projects-list');
            const homeContent = document.querySelector('.home-content');
            
            if (!container || !list || !homeContent) return;
            
            // نقل قسم أعمالي ليكون آخر شيء في الرئيسية
            if(container.parentElement !== homeContent) {
                homeContent.appendChild(container);
            }
            
            if (projects.length === 0) {
                container.style.display = 'none';
                return;
            }
            
            container.style.display = 'block';
            list.innerHTML = '';
            
            // عرض أحدث المشاريع أولاً
            projects.slice().reverse().forEach((proj, index) => {
                const realIndex = projects.length - 1 - index;
                const el = document.createElement('div');
                el.className = 'preset-card';
                el.style.flex = '0 0 110px';
                el.innerHTML = `
                    <div class="preset-ratio ratio-1-1" style="background:#1e293b; border-color:var(--primary); display:flex; align-items:center; justify-content:center; color:white; font-size:1.2rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3);"><i class="fas fa-paint-brush"></i></div>
                    <span class="preset-name" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:block; padding:0 5px;">${proj.name}</span>
                    <button class="layer-action-btn" style="width:100%; margin-top:5px; background:rgba(239, 68, 68, 0.1); color:var(--danger);" onclick="event.stopPropagation(); window.app.deleteProject(${realIndex})"><i class="fas fa-trash"></i> حذف</button>
                `;
                el.addEventListener('click', () => this.openProject(realIndex));
                list.appendChild(el);
            });
        } catch (e) { console.error('خطأ في تحميل المشاريع:', e); }
    }

    async saveCurrentProjectAsDraft() {
        try {
            const projects = await localforage.getItem(CONFIG.STORAGE.PROJECTS) || [];
            const projName = this.el.projectName?.value || 'تصميم جديد';
            
            projects.push({
                id: Date.now(),
                name: projName,
                layers: this.state.layers,
                canvas: this.canvas
            });
            
            await localforage.setItem(CONFIG.STORAGE.PROJECTS, projects);
            this.toast('تم حفظ العمل في أعمالي بنجاح', 'success');
            this.loadProjectsList();
        } catch (e) { console.error('خطأ في الحفظ:', e); }
    }

    async deleteProject(index) {
        try {
            const projects = await localforage.getItem(CONFIG.STORAGE.PROJECTS) || [];
            projects.splice(index, 1);
            await localforage.setItem(CONFIG.STORAGE.PROJECTS, projects);
            this.toast('تم حذف العمل', 'success');
            this.loadProjectsList();
        } catch (e) { console.error('خطأ في الحذف:', e); }
    }

    async openProject(index) {
        try {
            const projects = await localforage.getItem(CONFIG.STORAGE.PROJECTS) || [];
            const proj = projects[index];
            if (!proj) return;
            
            // استرجاع أبعاد الكانفاس والطبقات
            this.canvas = { ...proj.canvas };
            this.state.layers = JSON.parse(JSON.stringify(proj.layers));
            this.state.selectedLayer = null;
            if (this.el.projectName) this.el.projectName.value = proj.name;
            
            this.el.canvas.width = this.canvas.width;
            this.el.canvas.height = this.canvas.height;
            this.el.canvasWrapper.style.width = this.canvas.width + 'px';
            this.el.canvasWrapper.style.height = this.canvas.height + 'px';
            
            this.showApp();
            this.toast('تم استرجاع العمل بنجاح', 'success');
        } catch (e) { console.error('خطأ في الفتح:', e); }
    }

    toast(title, type = 'info', msg = '') {
        const container = this.el.toastContainer;
        if (!container) return;
        const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        el.innerHTML = `
            <div class="toast-icon"><i class="fas ${icons[type] || icons.info}"></i></div>
            <div class="toast-content"><div class="toast-title">${title}</div>${msg ? `<div class="toast-message">${msg}</div>` : ''}</div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        container.appendChild(el);
        requestAnimationFrame(() => el.classList.add('show'));
        el.querySelector('.toast-close').addEventListener('click', () => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); });
        setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.fonts.ready.then(() => { window.app = new FontStudioApp(); });
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    });
}
