/**
 * session.js - Search thesession.org (https://thesession.org/api) and load
 * the ABC of a chosen tune setting into the viewer.
 *
 * Uses the public JSON API (CORS enabled):
 *   GET /tunes/search?q=<text>&format=json&perpage=<n>&page=<n>
 *   GET /tunes/<id>?format=json
 * Hands the chosen setting to window.loadAbcText() (defined in app.js).
 */
(function () {
    'use strict';

    const API = 'https://thesession.org';
    const PER_PAGE = 20;

    // The Session tune type -> default meter
    const METERS = {
        reel: '4/4', jig: '6/8', 'slip jig': '9/8', hornpipe: '4/4', polka: '2/4',
        slide: '12/8', waltz: '3/4', barndance: '4/4', strathspey: '4/4',
        'three-two': '3/2', mazurka: '3/4', march: '4/4'
    };
    const MODES = { major: '', minor: 'm', dorian: 'dor', mixolydian: 'mix', lydian: 'lyd', phrygian: 'phr', locrian: 'loc' };

    /** "Edorian" -> "Edor", "Gmajor" -> "G", "Aminor" -> "Am" */
    function toAbcKey(key) {
        const m = /^([A-G][b#]?)([a-z]*)$/.exec(key || '');
        if (!m) return 'D';
        const mode = m[2] in MODES ? MODES[m[2]] : '';
        return m[1] + mode;
    }

    /** Build a complete ABC tune from a Session tune + one of its settings. */
    function buildAbc(tune, setting) {
        const type = (tune.type || '').toLowerCase();
        const body = String(setting.abc || '')
            .replace(/\r/g, '')
            .replace(/\s*!\s*/g, '\n'); // The Session uses "!" as a line break
        return [
            'X:1',
            'T:' + tune.name,
            'R:' + type,
            'M:' + (METERS[type] || '4/4'),
            'L:1/8',
            'S:' + (setting.url || tune.url),
            'K:' + toAbcKey(setting.key),
            body
        ].join('\n') + '\n';
    }

    function el(tag, className, text) {
        const e = document.createElement(tag);
        if (className) e.className = className;
        if (text != null) e.textContent = text;
        return e;
    }

    async function getJson(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error('The Session returned HTTP ' + res.status);
        return res.json();
    }

    function init() {
        const dialog = document.getElementById('session-dialog');
        const openBtn = document.getElementById('session-btn');
        if (!dialog || !openBtn) return;

        const form = document.getElementById('session-form');
        const input = document.getElementById('session-query');
        const results = document.getElementById('session-results');
        const status = document.getElementById('session-status');
        const moreBtn = document.getElementById('session-more-btn');
        const backBtn = document.getElementById('session-back-btn');
        const closeBtn = document.getElementById('session-close-btn');
        const title = document.getElementById('session-title');

        let query = '';
        let page = 0;
        let pages = 0;
        let token = 0; // ignore stale responses

        function setStatus(text, isError) {
            status.textContent = text || '';
            status.classList.toggle('session-error', !!isError);
            status.hidden = !text;
        }

        function open() {
            if (typeof dialog.showModal === 'function') dialog.showModal();
            else dialog.setAttribute('open', '');
            input.focus();
            input.select();
        }
        function close() {
            if (typeof dialog.close === 'function') dialog.close();
            else dialog.removeAttribute('open');
            openBtn.focus();
        }
        window.openSessionDialog = open;
        openBtn.addEventListener('click', open);
        closeBtn.addEventListener('click', close);
        dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(); });

        // Close only when a click starts and ends on the backdrop (see ui.js).
        function outside(e) {
            const r = dialog.getBoundingClientRect();
            return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
        }
        let downOutside = false;
        dialog.addEventListener('mousedown', (e) => { downOutside = outside(e); });
        dialog.addEventListener('click', (e) => {
            if (downOutside && outside(e)) close();
            downOutside = false;
        });

        function showResultsView() {
            title.textContent = '🔎 Search The Session';
            backBtn.hidden = true;
            form.hidden = false;
            moreBtn.hidden = !(page < pages);
        }

        function renderTunes(tunes, append) {
            if (!append) results.innerHTML = '';
            tunes.forEach((t) => {
                const li = el('li');
                const btn = el('button', 'session-item');
                btn.type = 'button';
                btn.appendChild(el('span', 'session-item-name', t.name));
                if (t.alias && t.alias !== t.name) {
                    btn.appendChild(el('span', 'session-item-alias', 'aka ' + t.alias));
                }
                btn.appendChild(el('span', 'session-item-type', t.type || ''));
                btn.addEventListener('click', () => showSettings(t.id));
                li.appendChild(btn);
                results.appendChild(li);
            });
        }

        async function search(nextPage) {
            const my = ++token;
            setStatus(nextPage > 1 ? 'Loading more…' : 'Searching…');
            moreBtn.hidden = true;
            try {
                const data = await getJson(API + '/tunes/search?format=json&perpage=' + PER_PAGE +
                    '&page=' + nextPage + '&q=' + encodeURIComponent(query));
                if (my !== token) return;
                page = Number(data.page) || nextPage;
                pages = Number(data.pages) || 0;
                const tunes = data.tunes || [];
                renderTunes(tunes, nextPage > 1);
                setStatus(tunes.length || nextPage > 1
                    ? (data.total + ' tune' + (data.total == 1 ? '' : 's') + ' found')
                    : 'No tunes found for "' + query + '".');
                moreBtn.hidden = !(page < pages);
            } catch (err) {
                if (my !== token) return;
                setStatus('Could not reach The Session: ' + err.message, true);
            }
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            query = input.value.trim();
            if (!query) return;
            page = 0;
            pages = 0;
            search(1);
        });
        moreBtn.addEventListener('click', () => search(page + 1));
        backBtn.addEventListener('click', () => {
            token++;
            setStatus('');
            results.innerHTML = '';
            // Re-run the last search to restore the list
            if (query) search(1);
            showResultsView();
        });

        async function showSettings(id) {
            const my = ++token;
            setStatus('Loading tune…');
            moreBtn.hidden = true;
            try {
                const tune = await getJson(API + '/tunes/' + id + '?format=json');
                if (my !== token) return;
                setStatus('');
                title.textContent = tune.name;
                form.hidden = true;
                backBtn.hidden = false;
                results.innerHTML = '';

                const meta = el('li', 'session-meta');
                meta.appendChild(el('span', null, (tune.type || '') + ' · ' + (tune.settings || []).length + ' setting(s) · '));
                const link = el('a', null, 'view on thesession.org');
                link.href = tune.url;
                link.target = '_blank';
                link.rel = 'noopener';
                meta.appendChild(link);
                results.appendChild(meta);

                (tune.settings || []).forEach((s, i) => {
                    const li = el('li', 'session-setting');
                    const info = el('div', 'session-setting-info');
                    info.appendChild(el('strong', null, 'Setting ' + (i + 1) + ' · ' + (s.key || '')));
                    const preview = String(s.abc || '').replace(/\s*!\s*/g, ' ').slice(0, 90);
                    info.appendChild(el('code', null, preview + '…'));
                    li.appendChild(info);

                    const actions = el('div', 'session-setting-actions');
                    [['Load', false, 'btn btn-primary'], ['Load & Edit', true, 'btn']].forEach(([label, edit, cls]) => {
                        const b = el('button', cls, label);
                        b.type = 'button';
                        b.addEventListener('click', () => {
                            window.loadAbcText(buildAbc(tune, s), { editAfter: edit });
                            close();
                        });
                        actions.appendChild(b);
                    });
                    li.appendChild(actions);
                    results.appendChild(li);
                });
            } catch (err) {
                if (my !== token) return;
                setStatus('Could not load tune: ' + err.message, true);
                backBtn.hidden = false;
            }
        }
    }

    window.SessionSearch = { buildAbc: buildAbc, toAbcKey: toAbcKey };
    document.addEventListener('DOMContentLoaded', init);
})();
