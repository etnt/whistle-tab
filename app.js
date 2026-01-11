/**
 * ABC to Sheet Music with Flute Tablature - Main Application
 * 
 * This application uses the abcjs library to render ABC notation as sheet music,
 * then generates corresponding tin whistle/flute tablature below.
 */

// Example ABC tunes
const exampleTunes = {
    scale: `X:1
T:D Major Scale
M:4/4
L:1/4
K:D
D E F G | A B c d |
d c B A | G F E D |]`,

    jig: `X:1
T:The Irish Washerwoman
M:6/8
L:1/8
R:jig
K:G
|:D|"G"G2G GAB|"C"c2c cBA|"G"B2B Bcd|"D"e2d dBA|
"G"G2G GAB|"C"c2c cBA|"G"B2A "D"AGF|"G"G3 G2:|
|:d|"G"g2g gfe|"C"e2e edc|"G"d2d def|"D"g2f fed|
"G"g2g gfe|"C"e2e edc|"G"d2e "D"dcB|"G"c3 c2:|`,

    reel: `X:1
T:The Banshee
M:4/4
L:1/8
R:reel
K:G
|:GA|"G"B2AB GEDE|"G"GABd g2fg|"Em"edBd edBd|"D"egdB A2GA|
"G"B2AB GEDE|"G"GABd g2fg|"Em"edBd "D"egfa|"G"g2G2 G2:|`,

    air: `X:1
T:Danny Boy
M:4/4
L:1/8
K:G
D2|"G"G4 A2B2|"C"c4 B2A2|"G"G4 E2D2|"D7"D6 D2|
"G"G4 A2B2|"C"c4 d2e2|"G"d6 B2|"D7"A6 D2|
"G"G4 A2B2|"C"c4 B2A2|"G"G4 E2D2|"D7"D6 D2|
"G"G4 A2B2|"C"c4 d2e2|"G"d4 B2G2|"G"G6|]`
};

// App state
let currentTune = null;
let visualObj = null;

/**
 * Initialize the application
 */
function init() {
    // Set up event listeners
    document.getElementById('render-btn').addEventListener('click', renderMusic);
    document.getElementById('export-btn').addEventListener('click', exportAsPNG);
    document.getElementById('abc-input').addEventListener('input', debounce(renderMusic, 500));
    document.getElementById('whistle-key').addEventListener('change', renderMusic);
    
    // Set up example buttons
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const example = btn.dataset.example;
            if (exampleTunes[example]) {
                document.getElementById('abc-input').value = exampleTunes[example];
                renderMusic();
            }
        });
    });
    
    // Initial render
    renderMusic();
}

/**
 * Debounce function to limit how often a function is called
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Main render function - renders both sheet music and tablature
 */
function renderMusic() {
    const abcInput = document.getElementById('abc-input').value;
    const whistleKey = document.getElementById('whistle-key').value;
    const paperDiv = document.getElementById('paper');
    const tabDiv = document.getElementById('tablature');
    
    // Clear previous tablature
    tabDiv.innerHTML = '';
    
    if (!abcInput.trim()) {
        paperDiv.innerHTML = '<p style="color: #999; text-align: center;">Enter ABC notation above to see the music</p>';
        return;
    }
    
    try {
        // Track note elements for tablature positioning
        const noteElements = [];
        
        // Add spacing directive to the ABC string for tablature room
        let abcWithSpacing = abcInput;
        if (!abcInput.includes('%%staffsep') && !abcInput.includes('%%sysstaffsep')) {
            // Insert spacing directives after the X: line or at the beginning
            const lines = abcInput.split('\n');
            const insertIndex = lines.findIndex(l => l.trim().startsWith('X:'));
            if (insertIndex >= 0) {
                lines.splice(insertIndex + 1, 0, '%%staffsep 120', '%%sysstaffsep 120');
            } else {
                lines.unshift('%%staffsep 120', '%%sysstaffsep 120');
            }
            abcWithSpacing = lines.join('\n');
        }
        
        // Render sheet music using abcjs with note callback
        visualObj = ABCJS.renderAbc('paper', abcWithSpacing, {
            responsive: 'resize',
            staffwidth: 800,
            paddingright: 20,
            paddingleft: 20,
            paddingbottom: 120, // Extra space at bottom for tablature on last line
            add_classes: true,
            clickListener: null,
            afterParsing: function(tune) {
                // Store tune info if needed
            }
        })[0];
        
        // Wait a tick for SVG to be rendered, then add tablature
        setTimeout(() => {
            addTablatureToNotes(abcInput, whistleKey);
        }, 50);
        
        currentTune = abcInput;
        
    } catch (error) {
        console.error('Error rendering music:', error);
        paperDiv.innerHTML = `<p style="color: #c00;">Error: ${error.message}</p>`;
    }
}

/**
 * Add tablature diagrams directly under notes in the SVG
 */
function addTablatureToNotes(abcInput, whistleKey) {
    const svg = document.querySelector('#paper svg');
    if (!svg) return;
    
    // Find all note elements in the SVG
    const noteGroups = svg.querySelectorAll('.abcjs-note');
    if (noteGroups.length === 0) return;
    
    // Extract notes from ABC to get fingerings
    const notes = extractNotesFromABC(abcInput);
    const playableNotes = notes.filter(n => !n.isBarline);
    
    // Get the SVG namespace
    const svgNS = 'http://www.w3.org/2000/svg';
    
    // Find staff lines from abcjs - these are the horizontal lines of the staff
    // abcjs uses .abcjs-staff-extra or .abcjs-top-line for staff positioning
    // We'll use the transform attribute of parent groups to determine staff line Y positions
    
    // Collect note positions using the notehead position (not stem)
    const notePositions = [];
    noteGroups.forEach((noteGroup, idx) => {
        try {
            // Find the notehead specifically to get accurate Y position
            const notehead = noteGroup.querySelector('.abcjs-notehead');
            let noteY;
            let noteX;
            let bbox = noteGroup.getBBox();
            
            if (notehead) {
                const headBbox = notehead.getBBox();
                noteY = headBbox.y + headBbox.height / 2;
                noteX = headBbox.x + headBbox.width / 2;
            } else {
                noteY = bbox.y + 10; // Approximate notehead position
                noteX = bbox.x + bbox.width / 2;
            }
            
            notePositions.push({
                group: noteGroup,
                idx: idx,
                noteY: noteY,
                noteX: noteX,
                bbox: bbox
            });
        } catch (e) {}
    });
    
    if (notePositions.length === 0) return;
    
    // Group notes into staff lines based on noteY position
    // Staff lines are typically ~80-120 pixels apart
    const lineThreshold = 50; // Notes within this Y range are on the same staff
    
    // Find distinct Y ranges (staff lines)
    const staffLineYs = [];
    const sortedByY = [...notePositions].sort((a, b) => a.noteY - b.noteY);
    
    sortedByY.forEach(notePos => {
        // Find if this note belongs to an existing staff line
        let foundLine = staffLineYs.find(line => 
            Math.abs(notePos.noteY - line.centerY) < lineThreshold
        );
        
        if (foundLine) {
            foundLine.notes.push(notePos);
            // Update center and bounds
            foundLine.minY = Math.min(foundLine.minY, notePos.noteY);
            foundLine.maxY = Math.max(foundLine.maxY, notePos.noteY);
            foundLine.centerY = (foundLine.minY + foundLine.maxY) / 2;
        } else {
            staffLineYs.push({
                centerY: notePos.noteY,
                minY: notePos.noteY,
                maxY: notePos.noteY,
                notes: [notePos]
            });
        }
    });
    
    // Sort staff lines by Y position
    staffLineYs.sort((a, b) => a.centerY - b.centerY);
    
    // Assign tabY position to each staff line (below the staff)
    // Staff height is approximately 40px, add space below for tab
    staffLineYs.forEach((line, lineIdx) => {
        line.tabY = line.maxY + 55; // Position tablature below the staff
    });
    
    // Create a map from note group to its staff line info
    const noteToStaffLine = new Map();
    staffLineYs.forEach(line => {
        line.notes.forEach(notePos => {
            noteToStaffLine.set(notePos.group, line);
        });
    });
    
    // Track previous fingering per staff line to skip repeats
    const prevFingeringByLine = new Map();
    let noteIndex = 0;
    
    noteGroups.forEach((noteGroup, i) => {
        // Get the staff line for this note
        const staffLine = noteToStaffLine.get(noteGroup);
        if (!staffLine) return;
        
        const notePos = notePositions.find(np => np.group === noteGroup);
        if (!notePos) return;
        
        // Get the corresponding parsed note
        if (noteIndex >= playableNotes.length) return;
        const noteData = playableNotes[noteIndex];
        noteIndex++;
        
        if (!noteData || noteData.note === 'z' || noteData.note === 'Z' || noteData.note === 'x') {
            prevFingeringByLine.set(staffLine, null);
            return;
        }
        
        // Get fingering for this note
        const noteInfo = FluteTab.parseAbcNote(noteData.note);
        if (noteInfo.rest) {
            prevFingeringByLine.set(staffLine, null);
            return;
        }
        
        const fingering = FluteTab.getFingering(noteInfo, whistleKey);
        
        // Create a key to identify this fingering
        const fingeringKey = fingering.holes ? fingering.holes.join('') + fingering.octave : null;
        
        // Skip if same as previous fingering on this staff line
        const prevFingering = prevFingeringByLine.get(staffLine);
        if (fingeringKey && fingeringKey === prevFingering) {
            return;
        }
        prevFingeringByLine.set(staffLine, fingeringKey);
        
        // Create tablature group
        const tabGroup = document.createElementNS(svgNS, 'g');
        tabGroup.setAttribute('class', 'flute-tab');
        
        // Position: X from note, Y from staff line's tabY
        const tabX = notePos.noteX;
        const tabY = staffLine.tabY;
        
        // Draw the 6 holes (small size)
        const holeRadius = 3;
        const holeSpacing = 7;
        
        if (fingering.holes) {
            fingering.holes.forEach((hole, holeIndex) => {
                const cy = tabY + holeIndex * holeSpacing;
                
                const circle = document.createElementNS(svgNS, 'circle');
                circle.setAttribute('cx', tabX);
                circle.setAttribute('cy', cy);
                circle.setAttribute('r', holeRadius);
                circle.setAttribute('stroke', '#333');
                circle.setAttribute('stroke-width', '1');
                
                if (hole === 'X') {
                    circle.setAttribute('fill', '#333');
                } else if (hole === 'O') {
                    circle.setAttribute('fill', 'white');
                } else if (hole === 'H') {
                    circle.setAttribute('fill', 'white');
                    // Add half-fill
                    const halfCircle = document.createElementNS(svgNS, 'path');
                    const startX = tabX;
                    const startY = cy - holeRadius;
                    halfCircle.setAttribute('d', `M ${startX} ${startY} A ${holeRadius} ${holeRadius} 0 0 0 ${startX} ${cy + holeRadius}`);
                    halfCircle.setAttribute('fill', '#333');
                    tabGroup.appendChild(halfCircle);
                } else {
                    circle.setAttribute('fill', '#ddd');
                }
                
                tabGroup.appendChild(circle);
            });
            
            // Add octave indicator if second octave
            if (fingering.octave === 2) {
                const plusSign = document.createElementNS(svgNS, 'text');
                plusSign.setAttribute('x', tabX);
                plusSign.setAttribute('y', tabY + 6 * holeSpacing + 8);
                plusSign.setAttribute('text-anchor', 'middle');
                plusSign.setAttribute('font-size', '8');
                plusSign.setAttribute('font-weight', 'bold');
                plusSign.setAttribute('fill', '#667eea');
                plusSign.textContent = '+';
                tabGroup.appendChild(plusSign);
            }
        }
        
        svg.appendChild(tabGroup);
    });
}

/**
 * Key signature accidentals lookup
 * Maps key names to the notes that are sharp or flat in that key
 */
const keySignatures = {
    // Major keys with sharps
    'C': {},
    'G': { 'F': '#' },
    'D': { 'F': '#', 'C': '#' },
    'A': { 'F': '#', 'C': '#', 'G': '#' },
    'E': { 'F': '#', 'C': '#', 'G': '#', 'D': '#' },
    'B': { 'F': '#', 'C': '#', 'G': '#', 'D': '#', 'A': '#' },
    'F#': { 'F': '#', 'C': '#', 'G': '#', 'D': '#', 'A': '#', 'E': '#' },
    'C#': { 'F': '#', 'C': '#', 'G': '#', 'D': '#', 'A': '#', 'E': '#', 'B': '#' },
    
    // Major keys with flats
    'F': { 'B': 'b' },
    'Bb': { 'B': 'b', 'E': 'b' },
    'Eb': { 'B': 'b', 'E': 'b', 'A': 'b' },
    'Ab': { 'B': 'b', 'E': 'b', 'A': 'b', 'D': 'b' },
    'Db': { 'B': 'b', 'E': 'b', 'A': 'b', 'D': 'b', 'G': 'b' },
    'Gb': { 'B': 'b', 'E': 'b', 'A': 'b', 'D': 'b', 'G': 'b', 'C': 'b' },
    
    // Minor keys (relative minors)
    'Am': {},
    'Em': { 'F': '#' },
    'Bm': { 'F': '#', 'C': '#' },
    'F#m': { 'F': '#', 'C': '#', 'G': '#' },
    'C#m': { 'F': '#', 'C': '#', 'G': '#', 'D': '#' },
    'G#m': { 'F': '#', 'C': '#', 'G': '#', 'D': '#', 'A': '#' },
    'Dm': { 'B': 'b' },
    'Gm': { 'B': 'b', 'E': 'b' },
    'Cm': { 'B': 'b', 'E': 'b', 'A': 'b' },
    'Fm': { 'B': 'b', 'E': 'b', 'A': 'b', 'D': 'b' },
    
    // Dorian mode (common in Irish music)
    'DDor': { 'F': '#' },
    'GDor': { 'B': 'b', 'F': '#' },
    'ADor': { 'F': '#', 'C': '#', 'G': '#' },
    'EDor': { 'F': '#', 'C': '#' },
    
    // Mixolydian mode (also common in Irish music)
    'DMix': { 'F': '#' },
    'GMix': {},
    'AMix': { 'F': '#', 'C': '#' },
};

/**
 * Extract notes from ABC notation
 * This parses the ABC and returns an array of note objects
 */
function extractNotesFromABC(abc) {
    const notes = [];
    
    // Find the tune body (after K: line)
    const lines = abc.split('\n');
    let inBody = false;
    let currentKey = 'C';
    let keyAccidentals = {};
    // Track accidentals that apply within the current bar
    let barAccidentals = {};
    
    for (const line of lines) {
        const trimmed = line.trim();
        
        // Check for key signature
        if (trimmed.startsWith('K:')) {
            currentKey = trimmed.substring(2).trim().split(/\s/)[0];
            // Handle key variations (e.g., "Dmaj", "Dmin", "Ddor", "Dmix")
            let keyBase = currentKey.replace(/maj|min|m$/i, '');
            if (/min|m$/i.test(currentKey)) {
                keyBase = keyBase + 'm';
            }
            keyAccidentals = keySignatures[keyBase] || keySignatures[currentKey] || {};
            inBody = true;
            continue;
        }
        
        // Skip header lines
        if (/^[A-Z]:/.test(trimmed) && !inBody) {
            continue;
        }
        
        if (!inBody) continue;
        
        // Parse the music line
        let i = 0;
        while (i < trimmed.length) {
            const char = trimmed[i];
            
            // Skip whitespace
            if (char === ' ' || char === '\t') {
                i++;
                continue;
            }
            
            // Handle barlines - reset bar accidentals
            if (char === '|' || char === ':') {
                // Check for different barline types
                let barline = char;
                while (i + 1 < trimmed.length && (trimmed[i + 1] === '|' || trimmed[i + 1] === ':' || trimmed[i + 1] === ']' || trimmed[i + 1] === '[')) {
                    i++;
                    barline += trimmed[i];
                }
                notes.push({ isBarline: true, type: barline });
                barAccidentals = {}; // Reset accidentals at bar line
                i++;
                continue;
            }
            
            // Skip chords in quotes
            if (char === '"') {
                i++;
                while (i < trimmed.length && trimmed[i] !== '"') i++;
                i++;
                continue;
            }
            
            // Skip annotations in other brackets
            if (char === '!' || char === '+') {
                i++;
                while (i < trimmed.length && trimmed[i] !== char) i++;
                i++;
                continue;
            }
            
            // Handle grace notes
            if (char === '{') {
                while (i < trimmed.length && trimmed[i] !== '}') i++;
                i++;
                continue;
            }
            
            // Handle volta brackets [1 and [2 - skip them (they're not chords)
            if (char === '[') {
                // Check if this is a volta bracket [1, [2, etc.
                if (i + 1 < trimmed.length && /[0-9]/.test(trimmed[i + 1])) {
                    // Skip the volta marker [1 or [2 etc.
                    i++;
                    while (i < trimmed.length && /[0-9,\-]/.test(trimmed[i])) {
                        i++;
                    }
                    // Skip any trailing space
                    while (i < trimmed.length && trimmed[i] === ' ') {
                        i++;
                    }
                    continue;
                }
                
                // Handle chords (notes in brackets)
                i++;
                // Just take the first note of the chord
                const chordStart = i;
                while (i < trimmed.length && trimmed[i] !== ']') i++;
                const chordContent = trimmed.substring(chordStart, i);
                const chordNote = parseNoteToken(chordContent, keyAccidentals, barAccidentals);
                if (chordNote) {
                    notes.push(chordNote);
                }
                i++;
                continue;
            }
            
            // Handle ties and slurs
            if (char === '(' || char === ')' || char === '-' || char === '~') {
                i++;
                continue;
            }
            
            // Handle accidentals and notes
            if (char === '^' || char === '_' || char === '=' || 
                (char >= 'A' && char <= 'G') || (char >= 'a' && char <= 'g') ||
                char === 'z' || char === 'Z' || char === 'x') {
                
                let noteToken = '';
                let hasExplicitAccidental = false;
                let explicitAccidental = '';
                
                // Collect accidentals
                while (i < trimmed.length && (trimmed[i] === '^' || trimmed[i] === '_' || trimmed[i] === '=')) {
                    noteToken += trimmed[i];
                    hasExplicitAccidental = true;
                    if (trimmed[i] === '^') explicitAccidental = '#';
                    else if (trimmed[i] === '_') explicitAccidental = 'b';
                    else if (trimmed[i] === '=') explicitAccidental = 'natural';
                    i++;
                }
                
                // Collect note letter
                let noteLetter = '';
                if (i < trimmed.length && 
                    ((trimmed[i] >= 'A' && trimmed[i] <= 'G') || 
                     (trimmed[i] >= 'a' && trimmed[i] <= 'g') ||
                     trimmed[i] === 'z' || trimmed[i] === 'Z' || trimmed[i] === 'x')) {
                    noteLetter = trimmed[i].toUpperCase();
                    noteToken += trimmed[i];
                    i++;
                }
                
                // Collect octave modifiers
                while (i < trimmed.length && (trimmed[i] === "'" || trimmed[i] === ',')) {
                    noteToken += trimmed[i];
                    i++;
                }
                
                // Skip duration numbers and broken rhythm markers
                while (i < trimmed.length && (/\d/.test(trimmed[i]) || trimmed[i] === '/' || trimmed[i] === '>' || trimmed[i] === '<')) {
                    i++;
                }
                
                if (noteToken && noteLetter && noteLetter !== 'Z' && noteLetter !== 'X') {
                    // Apply accidentals: explicit > bar > key signature
                    if (hasExplicitAccidental) {
                        // Store this accidental for the rest of the bar
                        barAccidentals[noteLetter] = explicitAccidental;
                        notes.push({ note: noteToken, isBarline: false });
                    } else if (barAccidentals[noteLetter]) {
                        // Apply bar accidental
                        const barAcc = barAccidentals[noteLetter];
                        if (barAcc === '#') {
                            noteToken = '^' + noteToken;
                        } else if (barAcc === 'b') {
                            noteToken = '_' + noteToken;
                        }
                        // natural means no modification
                        notes.push({ note: noteToken, isBarline: false });
                    } else if (keyAccidentals[noteLetter]) {
                        // Apply key signature accidental
                        const keyAcc = keyAccidentals[noteLetter];
                        if (keyAcc === '#') {
                            noteToken = '^' + noteToken;
                        } else if (keyAcc === 'b') {
                            noteToken = '_' + noteToken;
                        }
                        notes.push({ note: noteToken, isBarline: false });
                    } else {
                        notes.push({ note: noteToken, isBarline: false });
                    }
                } else if (noteToken) {
                    // Rest
                    notes.push({ note: noteToken, isBarline: false });
                }
                continue;
            }
            
            // Skip any other characters
            i++;
        }
    }
    
    return notes;
}

/**
 * Parse a note token from within a chord
 */
function parseNoteToken(token, keyAccidentals = {}, barAccidentals = {}) {
    // Find the first note-like character
    for (let i = 0; i < token.length; i++) {
        if ((token[i] >= 'A' && token[i] <= 'G') || (token[i] >= 'a' && token[i] <= 'g')) {
            let noteToken = '';
            let hasExplicitAccidental = false;
            let noteLetter = token[i].toUpperCase();
            
            // Look for accidentals before
            let j = i - 1;
            while (j >= 0 && (token[j] === '^' || token[j] === '_' || token[j] === '=')) {
                noteToken = token[j] + noteToken;
                hasExplicitAccidental = true;
                j--;
            }
            noteToken += token[i];
            // Look for octave modifiers after
            j = i + 1;
            while (j < token.length && (token[j] === "'" || token[j] === ',')) {
                noteToken += token[j];
                j++;
            }
            
            // Apply key signature if no explicit accidental
            if (!hasExplicitAccidental) {
                if (barAccidentals[noteLetter]) {
                    const barAcc = barAccidentals[noteLetter];
                    if (barAcc === '#') noteToken = '^' + noteToken;
                    else if (barAcc === 'b') noteToken = '_' + noteToken;
                } else if (keyAccidentals[noteLetter]) {
                    const keyAcc = keyAccidentals[noteLetter];
                    if (keyAcc === '#') noteToken = '^' + noteToken;
                    else if (keyAcc === 'b') noteToken = '_' + noteToken;
                }
            }
            
            return { note: noteToken, isBarline: false };
        }
    }
    return null;
}

/**
 * Apply key signature accidentals to a note
 */
function applyKeySignature(noteName, key) {
    // Key signatures and their accidentals
    const keyAccidentals = {
        'C': {},
        'G': { 'F': '#' },
        'D': { 'F': '#', 'C': '#' },
        'A': { 'F': '#', 'C': '#', 'G': '#' },
        'E': { 'F': '#', 'C': '#', 'G': '#', 'D': '#' },
        'B': { 'F': '#', 'C': '#', 'G': '#', 'D': '#', 'A': '#' },
        'F#': { 'F': '#', 'C': '#', 'G': '#', 'D': '#', 'A': '#', 'E': '#' },
        'F': { 'B': 'b' },
        'Bb': { 'B': 'b', 'E': 'b' },
        'Eb': { 'B': 'b', 'E': 'b', 'A': 'b' },
        'Ab': { 'B': 'b', 'E': 'b', 'A': 'b', 'D': 'b' },
        // Minor keys
        'Am': {},
        'Em': { 'F': '#' },
        'Bm': { 'F': '#', 'C': '#' },
        'F#m': { 'F': '#', 'C': '#', 'G': '#' },
        'Dm': { 'B': 'b' },
        'Gm': { 'B': 'b', 'E': 'b' },
        'Cm': { 'B': 'b', 'E': 'b', 'A': 'b' }
    };
    
    const accidentals = keyAccidentals[key] || {};
    const baseNote = noteName[0].toUpperCase();
    
    if (accidentals[baseNote]) {
        return baseNote + accidentals[baseNote];
    }
    return noteName;
}

/**
 * Export the rendered music and tablature as PNG
 */
function exportAsPNG() {
    const paperDiv = document.getElementById('paper');
    
    // Get the SVG element
    const svg = paperDiv.querySelector('svg');
    if (!svg) {
        alert('Please render some music first!');
        return;
    }
    
    // Scale factor for high-resolution export
    const scale = 3;
    
    // Clone the SVG to avoid modifying the original
    const svgClone = svg.cloneNode(true);
    
    // Get the original dimensions
    const bbox = svg.getBBox();
    const svgWidth = svg.width.baseVal.value || bbox.width + bbox.x + 20;
    const svgHeight = (svg.height.baseVal.value || bbox.height + bbox.y) + 40; // Extra padding at bottom for + symbols
    
    // Set explicit dimensions on the clone
    svgClone.setAttribute('width', svgWidth);
    svgClone.setAttribute('height', svgHeight);
    
    // Add white background to the SVG
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('x', '0');
    bgRect.setAttribute('y', '0');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('fill', 'white');
    svgClone.insertBefore(bgRect, svgClone.firstChild);
    
    // Serialize the SVG
    const svgData = new XMLSerializer().serializeToString(svgClone);
    
    // Create canvas with scaled dimensions
    const canvas = document.createElement('canvas');
    canvas.width = svgWidth * scale;
    canvas.height = svgHeight * scale;
    const ctx = canvas.getContext('2d');
    
    // Fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Scale the context for high-resolution output
    ctx.scale(scale, scale);
    
    // Create an image from the SVG
    const img = new Image();
    
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        
        // Download the canvas as PNG
        const link = document.createElement('a');
        link.download = 'flute-tab.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
    
    img.onerror = function() {
        console.error('Error loading SVG image');
        alert('Error exporting image. Try using a modern browser.');
    };
    
    // Convert SVG to data URL
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
