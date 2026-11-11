/**
 * WhistleTab UI shell
 *
 * Handles the top-bar menu/popover system, the ABC input dialog,
 * the edit-mode toggle and the theme toggle. Loaded before app.js.
 * All music/rendering logic lives in app.js.
 */
(function () {
    'use strict';

    /* ------------------------------------------------------------------ *
     * Topbar height -> --topbar-h
     *
     * The fixed mobile menu sheets (.menu-panel) anchor below the topbar
     * via --topbar-h. Measuring the real .topbar keeps the panels clear
     * even when .topbar-inner wraps to two rows on narrow viewports.
     * The CSS custom property stays as the fallback default.
     * ------------------------------------------------------------------ */

    function measureTopbar() {
        const topbar = document.querySelector('.topbar');
        if (!topbar) return;
        const h = topbar.getBoundingClientRect().height;
        if (h > 0) document.documentElement.style.setProperty('--topbar-h', h + 'px');
    }

    function initTopbarMeasurement() {
        measureTopbar();
        // Fonts / late layout can change the height after initial paint.
        window.addEventListener('load', measureTopbar);
        if (typeof ResizeObserver === 'function') {
            const topbar = document.querySelector('.topbar');
            if (topbar) new ResizeObserver(measureTopbar).observe(topbar);
        }
        // Fallback for browsers without ResizeObserver.
        window.addEventListener('resize', measureTopbar);
    }

    /* ------------------------------------------------------------------ *
     * Menu / popover system
     * ------------------------------------------------------------------ */

    let openMenu = null; // { btn, panel, suppressClose }

    function closeOpenMenu(restoreFocus) {
        if (!openMenu) return;
        const { btn, panel } = openMenu;
        panel.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
        openMenu = null;
        if (restoreFocus) btn.focus();
    }

    function openMenuFor(btn, panel, programmatic) {
        closeOpenMenu(false);
        panel.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        openMenu = { btn, panel, suppressClose: !!programmatic };
        // Focus the first focusable element (search input for Tunes).
        const first = panel.querySelector('input, button, a, select');
        if (first) first.focus({ preventScroll: true });
    }

    function toggleMenu(btn, panel) {
        if (openMenu && openMenu.panel === panel) {
            closeOpenMenu(true);
        } else {
            openMenuFor(btn, panel);
        }
    }

    function initMenus() {
        document.querySelectorAll('.menu > button[aria-haspopup]').forEach((btn) => {
            const panel = btn.nextElementSibling;
            if (!panel) return;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMenu(btn, panel);
            });
            // Choosing an action closes the menu again.
            panel.addEventListener('click', (e) => {
                if (e.target.closest('.menu-action')) closeOpenMenu(false);
            });
        });

        // Close on outside click.
        document.addEventListener('click', (e) => {
            if (!openMenu) return;
            // Programmatic opens happen inside a click that is still bubbling;
            // swallow that first click so the menu does not close instantly.
            if (openMenu.suppressClose) {
                openMenu.suppressClose = false;
                return;
            }
            if (!openMenu.panel.contains(e.target) && !openMenu.btn.contains(e.target)) {
                closeOpenMenu(false);
            }
        });

        // Close on Esc; return focus to the trigger.
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && openMenu) {
                closeOpenMenu(true);
            }
        });
    }

    /** Programmatic menu helpers used by app.js (empty state, tune list). */
    window.openMenuPanel = function (panelId) {
        const panel = document.getElementById(panelId);
        if (!panel) return;
        const btn = panel.parentElement.querySelector('button[aria-haspopup]');
        if (btn) openMenuFor(btn, panel, true);
    };
    window.closeAllMenus = function () {
        closeOpenMenu(false);
    };

    /* ------------------------------------------------------------------ *
     * Theme (dark / light)
     * ------------------------------------------------------------------ */

    const THEME_KEY = 'whistleTabTheme';

    function applyTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            document.documentElement.dataset.theme = theme;
        } else {
            delete document.documentElement.dataset.theme; // follow prefers-color-scheme
        }
    }

    function initTheme() {
        let stored = null;
        try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
        applyTheme(stored);
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const current = document.documentElement.dataset.theme ||
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                const next = current === 'dark' ? 'light' : 'dark';
                applyTheme(next);
                try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
            });
        }
    }

    /* ------------------------------------------------------------------ *
     * Edit mode
     * ------------------------------------------------------------------ */

    function setEditMode(editing) {
        document.body.classList.toggle('editing', editing);
        const pane = document.getElementById('editor-pane');
        if (pane) pane.hidden = !editing;
        const btn = document.getElementById('edit-btn');
        if (btn) {
            btn.classList.toggle('active', editing);
            btn.setAttribute('aria-pressed', String(editing));
        }
        document.dispatchEvent(new CustomEvent('whistle:editmode', { detail: { editing: editing } }));
    }

    function initEditMode() {
        const editBtn = document.getElementById('edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                setEditMode(!document.body.classList.contains('editing'));
            });
        }
        const closeBtn = document.getElementById('close-editor-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => setEditMode(false));
        }
    }

    /* ------------------------------------------------------------------ *
     * ABC input dialog
     * ------------------------------------------------------------------ */

    function showValidation(messages, ok) {
        const box = document.getElementById('dialog-warnings');
        if (!box) return;
        if (!messages || !messages.length) {
            box.hidden = true;
            box.innerHTML = '';
            return;
        }
        box.hidden = false;
        box.classList.toggle('dialog-warnings-ok', !!ok);
        box.innerHTML = messages.map((m) => '<div>' + escapeHtml(m) + '</div>').join('');
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, (c) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    /** Light validation using ABCJS.parseOnly — warnings never block loading. */
    function validateAbc(text) {
        if (!window.ABCJS || !ABCJS.parseOnly) return [];
        try {
            const parsed = ABCJS.parseOnly(text);
            const warnings = [];
            (parsed || []).forEach((tune) => {
                if (Array.isArray(tune.warnings)) warnings.push(...tune.warnings);
            });
            return warnings;
        } catch (e) {
            return ['Parse note: ' + e.message];
        }
    }

    function initDialog() {
        const dialog = document.getElementById('abc-dialog');
        if (!dialog) return;
        const input = document.getElementById('abc-dialog-input');
        const pasteBtn = document.getElementById('dialog-paste-btn');
        const sampleBtn = document.getElementById('dialog-sample-btn');
        const cancelBtn = document.getElementById('dialog-cancel-btn');
        const loadBtn = document.getElementById('dialog-load-btn');
        const loadEditBtn = document.getElementById('dialog-load-edit-btn');

        function open(prepopulate) {
            if (typeof prepopulate === 'string') input.value = prepopulate;
            showValidation(validateAbc(input.value), true);
            if (typeof dialog.showModal === 'function') {
                dialog.showModal();
            } else {
                dialog.setAttribute('open', ''); // very old browsers
            }
            input.focus();
        }
        function close() {
            if (typeof dialog.close === 'function') {
                dialog.close();
            } else {
                dialog.removeAttribute('open');
            }
            showValidation(null);
            const opener = document.getElementById('new-abc-btn');
            if (opener) opener.focus();
        }

        window.openAbcDialog = open;

        document.getElementById('new-abc-btn').addEventListener('click', () => open());
        const emptyPaste = document.getElementById('empty-paste-btn');
        if (emptyPaste) emptyPaste.addEventListener('click', () => open());

        cancelBtn.addEventListener('click', close);
        dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
        // Only close on a click that BOTH starts and ends OUTSIDE the dialog
        // rectangle (i.e. on the ::backdrop). e.target alone is unreliable here:
        // the dialog's own padding and flex gaps belong to the dialog element,
        // so a click there has e.target === dialog but must NOT discard the
        // pasted ABC. Compare pointer coordinates against getBoundingClientRect()
        // on both mousedown and click.
        function isOutsideDialog(e) {
            const rect = dialog.getBoundingClientRect();
            return e.clientX < rect.left || e.clientX > rect.right ||
                   e.clientY < rect.top || e.clientY > rect.bottom;
        }
        let mousedownOutside = false;
        dialog.addEventListener('mousedown', (e) => { mousedownOutside = isOutsideDialog(e); });
        dialog.addEventListener('click', (e) => {
            if (mousedownOutside && isOutsideDialog(e)) close();
            mousedownOutside = false;
        });

        input.addEventListener('input', () => showValidation(validateAbc(input.value), true));

        pasteBtn.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                if (text) {
                    input.value = text;
                    showValidation(validateAbc(text), true);
                }
            } catch (err) {
                showValidation(['Clipboard access was blocked — please paste manually with Ctrl/Cmd+V.'], false);
            }
        });

        sampleBtn.addEventListener('click', () => {
            if (typeof tuneLibrary !== 'undefined') {
                const names = Object.keys(tuneLibrary);
                if (names.length) {
                    input.value = tuneLibrary[names[0]];
                    showValidation(validateAbc(input.value), true);
                    return;
                }
            }
            input.value = 'X:1\nT:Sample\nM:4/4\nL:1/8\nK:D\nD2 FA dB AF | df ec "A"d2 |]\n';
            showValidation(null);
        });

        function doLoad(editAfter) {
            const text = input.value;
            if (!text.trim()) {
                showValidation(['Nothing to load — paste some ABC notation first.'], false);
                return;
            }
            close();
            if (typeof window.loadAbcText === 'function') {
                window.loadAbcText(text, { editAfter: editAfter });
            }
        }
        loadBtn.addEventListener('click', () => doLoad(false));
        loadEditBtn.addEventListener('click', () => doLoad(true));
    }

    /* ------------------------------------------------------------------ *
     * Legends toggle + empty-state "Browse tunes" button
     * ------------------------------------------------------------------ */

    function initMisc() {
        const legendToggle = document.getElementById('legend-toggle-btn');
        const details = document.getElementById('legend-details');
        if (legendToggle && details) {
            legendToggle.addEventListener('click', () => {
                details.open = !details.open;
                if (details.open) details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        }
        const emptyTunes = document.getElementById('empty-tunes-btn');
        if (emptyTunes) {
            emptyTunes.addEventListener('click', () => window.openMenuPanel('menu-tunes'));
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        initTopbarMeasurement();
        initMenus();
        initTheme();
        initEditMode();
        initDialog();
        initMisc();
    });

    // Expose for app.js
    window.setEditMode = setEditMode;
})();
