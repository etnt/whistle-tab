/**
 * Flute/Tin Whistle Tablature Generator
 * 
 * This module handles the conversion of musical notes to tin whistle fingering patterns.
 * The tin whistle has 6 holes, and fingering patterns vary by octave.
 * 
 * Hole numbering (top to bottom, away from mouthpiece):
 * Hole 1 (top) - Left hand index finger
 * Hole 2 - Left hand middle finger
 * Hole 3 - Left hand ring finger
 * Hole 4 - Right hand index finger
 * Hole 5 - Right hand middle finger
 * Hole 6 (bottom) - Right hand ring finger
 */

const FluteTab = {
    // Fingering charts for different whistle keys
    // Each array represents holes 1-6 from top to bottom
    // 'X' = closed, 'O' = open, 'H' = half-covered
    
    // D whistle fingerings (most common) - notes relative to D
    fingeringCharts: {
        'D': {
            // First octave (low)
            'D4':  { holes: ['X', 'X', 'X', 'X', 'X', 'X'], octave: 1 },
            'E4':  { holes: ['X', 'X', 'X', 'X', 'X', 'O'], octave: 1 },
            'F#4': { holes: ['X', 'X', 'X', 'X', 'O', 'O'], octave: 1 },
            'G4':  { holes: ['X', 'X', 'X', 'O', 'O', 'O'], octave: 1 },
            'A4':  { holes: ['X', 'X', 'O', 'O', 'O', 'O'], octave: 1 },
            'B4':  { holes: ['X', 'O', 'O', 'O', 'O', 'O'], octave: 1 },
            'C#5': { holes: ['O', 'O', 'O', 'O', 'O', 'O'], octave: 1 },
            'C5':  { holes: ['O', 'X', 'X', 'O', 'O', 'O'], octave: 1 }, // Natural C (cross-fingering)
            
            // Second octave (high) - overblow with slightly different fingerings
            'D5':  { holes: ['O', 'X', 'X', 'X', 'X', 'X'], octave: 2 },
            'E5':  { holes: ['X', 'X', 'X', 'X', 'X', 'O'], octave: 2 },
            'F#5': { holes: ['X', 'X', 'X', 'X', 'O', 'O'], octave: 2 },
            'G5':  { holes: ['X', 'X', 'X', 'O', 'O', 'O'], octave: 2 },
            'A5':  { holes: ['X', 'X', 'O', 'O', 'O', 'O'], octave: 2 },
            'B5':  { holes: ['X', 'O', 'O', 'O', 'O', 'O'], octave: 2 },
            'C#6': { holes: ['O', 'O', 'O', 'O', 'O', 'O'], octave: 2 },
            'C6':  { holes: ['O', 'X', 'X', 'O', 'O', 'O'], octave: 2 }, // Natural C (cross-fingering)
            'D6':  { holes: ['O', 'X', 'X', 'X', 'X', 'X'], octave: 2 },
            
            // Accidentals (common cross-fingerings)
            'Eb4': { holes: ['X', 'X', 'X', 'X', 'X', 'H'], octave: 1 },
            'Eb5': { holes: ['X', 'X', 'X', 'X', 'X', 'H'], octave: 2 },
            'F4':  { holes: ['X', 'X', 'X', 'X', 'H', 'O'], octave: 1 },
            'F5':  { holes: ['X', 'X', 'X', 'X', 'H', 'O'], octave: 2 },
            'G#4': { holes: ['X', 'X', 'H', 'O', 'O', 'O'], octave: 1 },
            'Ab4': { holes: ['X', 'X', 'H', 'O', 'O', 'O'], octave: 1 },
            'G#5': { holes: ['X', 'X', 'H', 'O', 'O', 'O'], octave: 2 },
            'Ab5': { holes: ['X', 'X', 'H', 'O', 'O', 'O'], octave: 2 },
            'Bb4': { holes: ['X', 'H', 'O', 'O', 'O', 'O'], octave: 1 },
            'Bb5': { holes: ['X', 'H', 'O', 'O', 'O', 'O'], octave: 2 },
        },
        
        'C': {
            // C whistle - one whole step lower than D whistle
            'C4':  { holes: ['X', 'X', 'X', 'X', 'X', 'X'], octave: 1 },
            'D4':  { holes: ['X', 'X', 'X', 'X', 'X', 'O'], octave: 1 },
            'E4':  { holes: ['X', 'X', 'X', 'X', 'O', 'O'], octave: 1 },
            'F4':  { holes: ['X', 'X', 'X', 'O', 'O', 'O'], octave: 1 },
            'G4':  { holes: ['X', 'X', 'O', 'O', 'O', 'O'], octave: 1 },
            'A4':  { holes: ['X', 'O', 'O', 'O', 'O', 'O'], octave: 1 },
            'B4':  { holes: ['O', 'X', 'X', 'O', 'O', 'O'], octave: 1 },
            'Bb4': { holes: ['O', 'X', 'X', 'X', 'O', 'O'], octave: 1 },
            
            'C5':  { holes: ['X', 'X', 'X', 'X', 'X', 'X'], octave: 2 },
            'D5':  { holes: ['X', 'X', 'X', 'X', 'X', 'O'], octave: 2 },
            'E5':  { holes: ['X', 'X', 'X', 'X', 'O', 'O'], octave: 2 },
            'F5':  { holes: ['X', 'X', 'X', 'O', 'O', 'O'], octave: 2 },
            'G5':  { holes: ['X', 'X', 'O', 'O', 'O', 'O'], octave: 2 },
            'A5':  { holes: ['X', 'O', 'O', 'O', 'O', 'O'], octave: 2 },
            'B5':  { holes: ['O', 'X', 'X', 'O', 'O', 'O'], octave: 2 },
            'C6':  { holes: ['O', 'X', 'X', 'X', 'X', 'X'], octave: 2 },
        },
        
        'G': {
            'G4':  { holes: ['X', 'X', 'X', 'X', 'X', 'X'], octave: 1 },
            'A4':  { holes: ['X', 'X', 'X', 'X', 'X', 'O'], octave: 1 },
            'B4':  { holes: ['X', 'X', 'X', 'X', 'O', 'O'], octave: 1 },
            'C5':  { holes: ['X', 'X', 'X', 'O', 'O', 'O'], octave: 1 },
            'D5':  { holes: ['X', 'X', 'O', 'O', 'O', 'O'], octave: 1 },
            'E5':  { holes: ['X', 'O', 'O', 'O', 'O', 'O'], octave: 1 },
            'F#5': { holes: ['O', 'X', 'X', 'O', 'O', 'O'], octave: 1 },
            
            'G5':  { holes: ['X', 'X', 'X', 'X', 'X', 'X'], octave: 2 },
            'A5':  { holes: ['X', 'X', 'X', 'X', 'X', 'O'], octave: 2 },
            'B5':  { holes: ['X', 'X', 'X', 'X', 'O', 'O'], octave: 2 },
            'C6':  { holes: ['X', 'X', 'X', 'O', 'O', 'O'], octave: 2 },
            'D6':  { holes: ['X', 'X', 'O', 'O', 'O', 'O'], octave: 2 },
            'E6':  { holes: ['X', 'O', 'O', 'O', 'O', 'O'], octave: 2 },
            'F#6': { holes: ['O', 'X', 'X', 'O', 'O', 'O'], octave: 2 },
            'G6':  { holes: ['O', 'X', 'X', 'X', 'X', 'X'], octave: 2 },
        },
        
        'A': {
            // A whistle - lowest note is A
            'A4':  { holes: ['X', 'X', 'X', 'X', 'X', 'X'], octave: 1 },
            'B4':  { holes: ['X', 'X', 'X', 'X', 'X', 'O'], octave: 1 },
            'C#5': { holes: ['X', 'X', 'X', 'X', 'O', 'O'], octave: 1 },
            'D5':  { holes: ['X', 'X', 'X', 'O', 'O', 'O'], octave: 1 },
            'E5':  { holes: ['X', 'X', 'O', 'O', 'O', 'O'], octave: 1 },
            'F#5': { holes: ['X', 'O', 'O', 'O', 'O', 'O'], octave: 1 },
            'G#5': { holes: ['O', 'O', 'O', 'O', 'O', 'O'], octave: 1 },
            'G5':  { holes: ['O', 'X', 'X', 'O', 'O', 'O'], octave: 1 }, // Natural G (cross-fingering)
            'C5':  { holes: ['X', 'X', 'X', 'X', 'H', 'O'], octave: 1 }, // Natural C (cross-fingering)
            
            'A5':  { holes: ['O', 'X', 'X', 'X', 'X', 'X'], octave: 2 },
            'B5':  { holes: ['X', 'X', 'X', 'X', 'X', 'O'], octave: 2 },
            'C#6': { holes: ['X', 'X', 'X', 'X', 'O', 'O'], octave: 2 },
            'D6':  { holes: ['X', 'X', 'X', 'O', 'O', 'O'], octave: 2 },
            'E6':  { holes: ['X', 'X', 'O', 'O', 'O', 'O'], octave: 2 },
            'F#6': { holes: ['X', 'O', 'O', 'O', 'O', 'O'], octave: 2 },
            'G#6': { holes: ['O', 'O', 'O', 'O', 'O', 'O'], octave: 2 },
            'A6':  { holes: ['O', 'X', 'X', 'X', 'X', 'X'], octave: 2 },
        },
        
        'Bb': {
            // Bb whistle - lowest note is Bb
            'Bb4': { holes: ['X', 'X', 'X', 'X', 'X', 'X'], octave: 1 },
            'C5':  { holes: ['X', 'X', 'X', 'X', 'X', 'O'], octave: 1 },
            'D5':  { holes: ['X', 'X', 'X', 'X', 'O', 'O'], octave: 1 },
            'Eb5': { holes: ['X', 'X', 'X', 'O', 'O', 'O'], octave: 1 },
            'F5':  { holes: ['X', 'X', 'O', 'O', 'O', 'O'], octave: 1 },
            'G5':  { holes: ['X', 'O', 'O', 'O', 'O', 'O'], octave: 1 },
            'A5':  { holes: ['O', 'O', 'O', 'O', 'O', 'O'], octave: 1 },
            
            'Bb5': { holes: ['O', 'X', 'X', 'X', 'X', 'X'], octave: 2 },
            'C6':  { holes: ['X', 'X', 'X', 'X', 'X', 'O'], octave: 2 },
            'D6':  { holes: ['X', 'X', 'X', 'X', 'O', 'O'], octave: 2 },
            'Eb6': { holes: ['X', 'X', 'X', 'O', 'O', 'O'], octave: 2 },
            'F6':  { holes: ['X', 'X', 'O', 'O', 'O', 'O'], octave: 2 },
            'G6':  { holes: ['X', 'O', 'O', 'O', 'O', 'O'], octave: 2 },
            'A6':  { holes: ['O', 'O', 'O', 'O', 'O', 'O'], octave: 2 },
            'Bb6': { holes: ['O', 'X', 'X', 'X', 'X', 'X'], octave: 2 },
        },
        
        'F': {
            // F whistle - lowest note is F
            'F4':  { holes: ['X', 'X', 'X', 'X', 'X', 'X'], octave: 1 },
            'G4':  { holes: ['X', 'X', 'X', 'X', 'X', 'O'], octave: 1 },
            'A4':  { holes: ['X', 'X', 'X', 'X', 'O', 'O'], octave: 1 },
            'Bb4': { holes: ['X', 'X', 'X', 'O', 'O', 'O'], octave: 1 },
            'C5':  { holes: ['X', 'X', 'O', 'O', 'O', 'O'], octave: 1 },
            'D5':  { holes: ['X', 'O', 'O', 'O', 'O', 'O'], octave: 1 },
            'E5':  { holes: ['O', 'O', 'O', 'O', 'O', 'O'], octave: 1 },
            
            'F5':  { holes: ['O', 'X', 'X', 'X', 'X', 'X'], octave: 2 },
            'G5':  { holes: ['X', 'X', 'X', 'X', 'X', 'O'], octave: 2 },
            'A5':  { holes: ['X', 'X', 'X', 'X', 'O', 'O'], octave: 2 },
            'Bb5': { holes: ['X', 'X', 'X', 'O', 'O', 'O'], octave: 2 },
            'C6':  { holes: ['X', 'X', 'O', 'O', 'O', 'O'], octave: 2 },
            'D6':  { holes: ['X', 'O', 'O', 'O', 'O', 'O'], octave: 2 },
            'E6':  { holes: ['O', 'O', 'O', 'O', 'O', 'O'], octave: 2 },
            'F6':  { holes: ['O', 'X', 'X', 'X', 'X', 'X'], octave: 2 },
        },
        
        'Eb': {
            // Eb whistle - lowest note is Eb
            'Eb4': { holes: ['X', 'X', 'X', 'X', 'X', 'X'], octave: 1 },
            'F4':  { holes: ['X', 'X', 'X', 'X', 'X', 'O'], octave: 1 },
            'G4':  { holes: ['X', 'X', 'X', 'X', 'O', 'O'], octave: 1 },
            'Ab4': { holes: ['X', 'X', 'X', 'O', 'O', 'O'], octave: 1 },
            'Bb4': { holes: ['X', 'X', 'O', 'O', 'O', 'O'], octave: 1 },
            'C5':  { holes: ['X', 'O', 'O', 'O', 'O', 'O'], octave: 1 },
            'D5':  { holes: ['O', 'O', 'O', 'O', 'O', 'O'], octave: 1 },
            
            'Eb5': { holes: ['O', 'X', 'X', 'X', 'X', 'X'], octave: 2 },
            'F5':  { holes: ['X', 'X', 'X', 'X', 'X', 'O'], octave: 2 },
            'G5':  { holes: ['X', 'X', 'X', 'X', 'O', 'O'], octave: 2 },
            'Ab5': { holes: ['X', 'X', 'X', 'O', 'O', 'O'], octave: 2 },
            'Bb5': { holes: ['X', 'X', 'O', 'O', 'O', 'O'], octave: 2 },
            'C6':  { holes: ['X', 'O', 'O', 'O', 'O', 'O'], octave: 2 },
            'D6':  { holes: ['O', 'O', 'O', 'O', 'O', 'O'], octave: 2 },
            'Eb6': { holes: ['O', 'X', 'X', 'X', 'X', 'X'], octave: 2 },
        }
    },
    
    // ABC note to MIDI-like representation
    noteValues: {
        'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
    },
    
    /**
     * Parse ABC note to get note name and octave
     * ABC notation: C,, C, C c c' c''
     * Lowercase = octave 5, uppercase = octave 4
     * , = down one octave, ' = up one octave
     */
    parseAbcNote: function(abcNote) {
        if (!abcNote || abcNote === 'z' || abcNote === 'Z' || abcNote === 'x') {
            return { rest: true };
        }
        
        let note = '';
        let accidental = '';
        let octave = 4;
        
        // Extract accidentals (can be at start: ^, ^^, _, __, =)
        let i = 0;
        while (i < abcNote.length) {
            if (abcNote[i] === '^') {
                accidental = accidental === '#' ? '##' : '#';
                i++;
            } else if (abcNote[i] === '_') {
                accidental = accidental === 'b' ? 'bb' : 'b';
                i++;
            } else if (abcNote[i] === '=') {
                accidental = 'natural';
                i++;
            } else {
                break;
            }
        }
        
        // Get the note letter
        if (i < abcNote.length) {
            const noteLetter = abcNote[i];
            if (noteLetter >= 'a' && noteLetter <= 'g') {
                note = noteLetter.toUpperCase();
                octave = 5;
            } else if (noteLetter >= 'A' && noteLetter <= 'G') {
                note = noteLetter;
                octave = 4;
            }
            i++;
        }
        
        // Handle octave modifiers
        while (i < abcNote.length) {
            if (abcNote[i] === ',') {
                octave--;
                i++;
            } else if (abcNote[i] === "'") {
                octave++;
                i++;
            } else {
                break;
            }
        }
        
        // Build the note name with accidental
        let noteName = note;
        if (accidental === '#') {
            noteName += '#';
        } else if (accidental === 'b') {
            noteName += 'b';
        } else if (accidental === '##') {
            // Double sharp - move to next note
            const noteIndex = 'CDEFGAB'.indexOf(note);
            note = 'CDEFGAB'[(noteIndex + 1) % 7];
            if (noteIndex === 6) octave++; // B## goes to next octave
            noteName = note + '#';
        }
        
        return {
            note: note,
            noteName: noteName,
            accidental: accidental,
            octave: octave,
            fullName: noteName + octave,
            rest: false
        };
    },
    
    /**
     * Get fingering for a specific note on a given whistle
     */
    getFingering: function(noteInfo, whistleKey) {
        if (noteInfo.rest) {
            return { rest: true };
        }
        
        const chart = this.fingeringCharts[whistleKey] || this.fingeringCharts['D'];
        let fingering = chart[noteInfo.fullName];
        
        // Try enharmonic equivalents
        if (!fingering) {
            const enharmonics = this.getEnharmonicEquivalents(noteInfo.noteName, noteInfo.octave);
            for (const eq of enharmonics) {
                if (chart[eq]) {
                    fingering = chart[eq];
                    break;
                }
            }
        }
        
        // If still not found, try to find closest note
        if (!fingering) {
            fingering = this.findClosestFingering(noteInfo, chart);
        }
        
        return {
            ...fingering,
            noteName: noteInfo.noteName + noteInfo.octave,
            displayName: noteInfo.noteName,
            rest: false,
            outOfRange: !fingering
        };
    },
    
    /**
     * Get enharmonic equivalents of a note
     */
    getEnharmonicEquivalents: function(noteName, octave) {
        const equivalents = {
            'C#': ['Db'], 'Db': ['C#'],
            'D#': ['Eb'], 'Eb': ['D#'],
            'F#': ['Gb'], 'Gb': ['F#'],
            'G#': ['Ab'], 'Ab': ['G#'],
            'A#': ['Bb'], 'Bb': ['A#'],
            'E#': ['F'], 'Fb': ['E'],
            'B#': ['C'], 'Cb': ['B']
        };
        
        const eqs = equivalents[noteName] || [];
        return eqs.map(eq => eq + octave);
    },
    
    /**
     * Find the closest playable fingering
     */
    findClosestFingering: function(noteInfo, chart) {
        // Default to showing a question mark or all holes open
        return {
            holes: ['?', '?', '?', '?', '?', '?'],
            octave: noteInfo.octave >= 5 ? 2 : 1,
            outOfRange: true
        };
    },
    
    /**
     * Generate tablature HTML for a sequence of notes
     */
    generateTablatureHTML: function(notes, whistleKey) {
        let html = '<div class="tab-container">';
        let currentMeasure = '<div class="tab-measure">';
        let noteCount = 0;
        
        for (const note of notes) {
            const noteInfo = this.parseAbcNote(note.note);
            
            if (note.isBarline) {
                currentMeasure += '</div>';
                html += currentMeasure;
                currentMeasure = '<div class="tab-measure">';
                noteCount = 0;
                continue;
            }
            
            if (noteInfo.rest) {
                currentMeasure += `
                    <div class="tab-rest">
                        <div class="tab-rest-symbol">𝄽</div>
                    </div>
                `;
            } else {
                const fingering = this.getFingering(noteInfo, whistleKey);
                currentMeasure += this.renderFingeringHTML(fingering, noteInfo);
            }
            noteCount++;
        }
        
        currentMeasure += '</div>';
        html += currentMeasure;
        html += '</div>';
        
        return html;
    },
    
    /**
     * Render a single fingering as HTML
     */
    renderFingeringHTML: function(fingering, noteInfo) {
        if (fingering.outOfRange) {
            return `
                <div class="tab-note out-of-range">
                    <div class="tab-note-name">${noteInfo.noteName || '?'}</div>
                    <div class="tab-holes">
                        ${fingering.holes.map(h => `<div class="tab-hole unknown">?</div>`).join('')}
                    </div>
                    <div class="tab-octave"></div>
                </div>
            `;
        }
        
        const holesHTML = fingering.holes.map(hole => {
            let className = 'tab-hole ';
            if (hole === 'X') className += 'closed';
            else if (hole === 'O') className += 'open';
            else if (hole === 'H') className += 'half';
            return `<div class="${className}"></div>`;
        }).join('');
        
        const octaveSymbol = fingering.octave === 2 ? '+' : '';
        
        return `
            <div class="tab-note">
                <div class="tab-note-name">${fingering.displayName || ''}</div>
                <div class="tab-holes">
                    ${holesHTML}
                </div>
                <div class="tab-octave">${octaveSymbol}</div>
            </div>
        `;
    },
    
    /**
     * Create an SVG representation of the tablature
     */
    generateTablatureSVG: function(notes, whistleKey, options = {}) {
        const noteWidth = options.noteWidth || 30;
        const holeRadius = options.holeRadius || 7;
        const holeSpacing = options.holeSpacing || 18;
        const startY = options.startY || 30;
        const padding = options.padding || 20;
        
        let width = padding * 2;
        let currentX = padding;
        let svgContent = '';
        
        for (const note of notes) {
            const noteInfo = this.parseAbcNote(note.note);
            
            if (note.isBarline) {
                // Draw barline
                svgContent += `<line x1="${currentX}" y1="${startY - 10}" x2="${currentX}" y2="${startY + 6 * holeSpacing + 20}" stroke="#333" stroke-width="2"/>`;
                currentX += 15;
                width += 15;
                continue;
            }
            
            if (noteInfo.rest) {
                // Draw rest symbol
                svgContent += `<text x="${currentX + noteWidth/2}" y="${startY + 50}" text-anchor="middle" font-size="24">𝄽</text>`;
                currentX += noteWidth;
                width += noteWidth;
                continue;
            }
            
            const fingering = this.getFingering(noteInfo, whistleKey);
            
            // Note name
            svgContent += `<text x="${currentX + noteWidth/2}" y="${startY - 5}" text-anchor="middle" font-size="11" font-weight="bold">${noteInfo.noteName}</text>`;
            
            // Holes
            for (let i = 0; i < 6; i++) {
                const cx = currentX + noteWidth/2;
                const cy = startY + i * holeSpacing + holeRadius;
                const hole = fingering.holes ? fingering.holes[i] : '?';
                
                if (hole === 'X') {
                    svgContent += `<circle cx="${cx}" cy="${cy}" r="${holeRadius}" fill="#333" stroke="#333" stroke-width="2"/>`;
                } else if (hole === 'O') {
                    svgContent += `<circle cx="${cx}" cy="${cy}" r="${holeRadius}" fill="white" stroke="#333" stroke-width="2"/>`;
                } else if (hole === 'H') {
                    svgContent += `
                        <circle cx="${cx}" cy="${cy}" r="${holeRadius}" fill="white" stroke="#333" stroke-width="2"/>
                        <path d="M ${cx} ${cy - holeRadius} A ${holeRadius} ${holeRadius} 0 0 0 ${cx} ${cy + holeRadius}" fill="#333"/>
                    `;
                } else {
                    svgContent += `<circle cx="${cx}" cy="${cy}" r="${holeRadius}" fill="#ddd" stroke="#999" stroke-width="2"/>
                                   <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="10">?</text>`;
                }
            }
            
            // Octave indicator
            if (fingering.octave === 2) {
                svgContent += `<text x="${currentX + noteWidth/2}" y="${startY + 6 * holeSpacing + 15}" text-anchor="middle" font-size="14" font-weight="bold" fill="#667eea">+</text>`;
            }
            
            currentX += noteWidth;
            width += noteWidth;
        }
        
        const height = startY + 6 * holeSpacing + 30;
        
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <rect width="${width}" height="${height}" fill="white"/>
            ${svgContent}
        </svg>`;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FluteTab;
}
