/**
 * ABC to Sheet Music with Flute Tablature - Main Application
 * 
 * This application uses the abcjs library to render ABC notation as sheet music,
 * then generates corresponding tin whistle/flute tablature below.
 */

// App state
let currentTune = null;
let visualObj = null;
let synthControl = null;

/**
 * Initialize the application
 */
function init() {
    // Set up event listeners
    document.getElementById('render-btn').addEventListener('click', renderMusic);
    document.getElementById('play-btn').addEventListener('click', startPlayback);
    document.getElementById('stop-btn').addEventListener('click', stopPlayback);
    document.getElementById('export-btn').addEventListener('click', exportAsMIDI);
    document.getElementById('abc-input').addEventListener('input', debounce(renderMusic, 500));
    document.getElementById('whistle-key').addEventListener('change', renderMusic);
    
    // Speed slider update
    document.getElementById('speed-slider').addEventListener('input', (e) => {
        document.getElementById('speed-value').textContent = e.target.value + '%';
    });
    
    // Initialize tune library
    initTuneLibrary();
    
    // Initial render
    renderMusic();
}

/**
 * Detect the best whistle key based on the tune's key signature
 * @param {string} abcText - The ABC notation text
 * @returns {string|null} - The recommended whistle key (D, C, G, etc.) or null
 */
function detectBestWhistleKey(abcText) {
    // Extract the key from ABC notation
    const keyMatch = abcText.match(/^K:\s*([A-Ga-g][#b]?)\s*(m|min|maj|mix|dor)?/m);
    if (!keyMatch) return null;
    
    const tuneKey = keyMatch[1].toUpperCase();
    
    // Available whistle keys in the dropdown
    const availableWhistles = ['D', 'C', 'G', 'Bb', 'F', 'Eb', 'A'];
    
    // Direct mapping: if we have a whistle in that key, use it
    // Handle flat notation (lowercase 'b' in ABC becomes 'b' in key)
    let normalizedKey = tuneKey.replace('#', '');
    if (tuneKey.endsWith('B') && tuneKey.length === 2) {
        // Convert e.g., "BB" or "Bb" to "Bb"
        normalizedKey = tuneKey.charAt(0) + 'b';
    }
    
    // Check if we have a whistle matching this key
    if (availableWhistles.includes(normalizedKey)) {
        return normalizedKey;
    }
    
    // Fallback mappings for keys where we don't have a matching whistle
    const fallbackMap = {
        'E': 'D',   // E major -> D whistle
        'B': 'A',   // B major -> A whistle
        'F#': 'D',  // F# major -> D whistle
        'C#': 'D',  // C# major -> D whistle
        'Ab': 'Eb', // Ab major -> Eb whistle
        'Db': 'C',  // Db major -> C whistle
        'Gb': 'F',  // Gb major -> F whistle
    };
    
    return fallbackMap[normalizedKey] || 'D'; // Default to D whistle
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
 * Initialize audio synthesis for playback
 */
async function initAudio() {
    if (!visualObj) {
        console.error('No visual object to play');
        return false;
    }
    
    try {
        // Check if audio context is supported
        if (!ABCJS.synth.supportsAudio()) {
            console.error('Audio not supported in this browser');
            alert('Audio is not supported in this browser.');
            return false;
        }
        
        // Get speed from slider (100 = normal speed)
        const speedPercent = parseInt(document.getElementById('speed-slider').value) || 100;
        
        // Create a new synth
        const synth = new ABCJS.synth.CreateSynth();
        
        // Get the base tempo from the tune, default to 120 qpm
        const baseTempo = visualObj.metaText && visualObj.metaText.tempo ? 
            visualObj.metaText.tempo.bpm : 120;
        
        // Calculate adjusted tempo based on speed percentage
        const adjustedTempo = Math.round(baseTempo * (speedPercent / 100));
        
        // Initialize with the visual object
        await synth.init({
            visualObj: visualObj,
            options: {
                soundFontUrl: 'https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/',
                program: 73,  // Flute sound
                qpm: adjustedTempo
            }
        });
        
        // Prime the audio (required for some browsers)
        await synth.prime();
        
        // Store for later use
        window.currentSynth = synth;
        
        return true;
    } catch (error) {
        console.error('Audio init error:', error);
        return false;
    }
}

/**
 * Start audio playback
 */
async function startPlayback() {
    const playBtn = document.getElementById('play-btn');
    const stopBtn = document.getElementById('stop-btn');
    
    playBtn.disabled = true;
    playBtn.textContent = '⏳ Loading...';
    
    try {
        const success = await initAudio();
        
        if (success && window.currentSynth) {
            window.currentSynth.start();
            stopBtn.disabled = false;
            playBtn.textContent = '▶️ Playing...';
            
            // Re-enable play button when done (estimate based on duration)
            const duration = window.currentSynth.synthControl ? 
                window.currentSynth.synthControl.getDuration() * 1000 : 30000;
            setTimeout(() => {
                playBtn.textContent = '▶️ Play';
                playBtn.disabled = false;
                stopBtn.disabled = true;
            }, duration);
        } else {
            throw new Error('Init failed');
        }
    } catch (error) {
        console.error('Playback error:', error);
        playBtn.textContent = '▶️ Play';
        playBtn.disabled = false;
        alert('Could not initialize audio. Check console for details.');
    }
}

/**
 * Stop audio playback
 */
function stopPlayback() {
    if (window.currentSynth) {
        window.currentSynth.stop();
    }
    document.getElementById('stop-btn').disabled = true;
    document.getElementById('play-btn').textContent = '▶️ Play';
    document.getElementById('play-btn').disabled = false;
}

/**
 * Main render function - renders both sheet music and tablature
 */
function renderMusic() {
    const abcInput = document.getElementById('abc-input').value;
    const whistleKeySelect = document.getElementById('whistle-key');
    const paperDiv = document.getElementById('paper');
    const tabDiv = document.getElementById('tablature');
    
    // Clear previous tablature
    tabDiv.innerHTML = '';
    
    if (!abcInput.trim()) {
        paperDiv.innerHTML = '<p style="color: #999; text-align: center;">Enter ABC notation above to see the music</p>';
        return;
    }
    
    // Auto-detect the best whistle key based on the tune's key signature
    const detectedKey = detectBestWhistleKey(abcInput);
    if (detectedKey && whistleKeySelect.value !== detectedKey) {
        whistleKeySelect.value = detectedKey;
    }
    const whistleKey = whistleKeySelect.value;
    
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
    
    // Reposition the N: notes text (abcjs-meta-bottom) below the tablature
    repositionMetaBottom(svg, staffLineYs);
}

/**
 * Reposition the N: notes text (abcjs-meta-bottom) below the last tablature line
 * @param {SVGElement} svg - The SVG element containing the music
 * @param {Array} staffLineYs - Array of staff line info with tabY positions
 */
function repositionMetaBottom(svg, staffLineYs) {
    const metaBottom = svg.querySelector('.abcjs-meta-bottom');
    if (!metaBottom) return;
    
    // Find the lowest tabY position (last tablature line)
    let maxTabY = 0;
    staffLineYs.forEach(line => {
        // Add space for the 6 holes plus some padding
        const tabBottomY = line.tabY + 6 * 7 + 20; // 6 holes * 7px spacing + padding
        if (tabBottomY > maxTabY) {
            maxTabY = tabBottomY;
        }
    });
    
    if (maxTabY === 0) return;
    
    // Get the current position of meta-bottom
    const metaBottomBBox = metaBottom.getBBox();
    
    // Calculate how much we need to move it down
    const currentY = metaBottomBBox.y;
    const newY = maxTabY + 15; // Add some padding below tablature
    
    if (newY > currentY) {
        // Move the meta-bottom group down
        const deltaY = newY - currentY;
        const currentTransform = metaBottom.getAttribute('transform') || '';
        
        // Check if there's already a translate
        const translateMatch = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        if (translateMatch) {
            const currentX = parseFloat(translateMatch[1]);
            const currentYTransform = parseFloat(translateMatch[2]);
            metaBottom.setAttribute('transform', `translate(${currentX}, ${currentYTransform + deltaY})`);
        } else {
            metaBottom.setAttribute('transform', `translate(0, ${deltaY})`);
        }
    }
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
        
        // Skip comment lines (start with %)
        if (trimmed.startsWith('%')) {
            continue;
        }
        
        // Remove inline comments (anything after %)
        const commentIndex = trimmed.indexOf('%');
        const lineContent = commentIndex >= 0 ? trimmed.substring(0, commentIndex) : trimmed;
        
        // Parse the music line
        let i = 0;
        while (i < lineContent.length) {
            const char = lineContent[i];
            
            // Skip whitespace
            if (char === ' ' || char === '\t') {
                i++;
                continue;
            }
            
            // Handle barlines - reset bar accidentals
            if (char === '|' || char === ':') {
                // Check for different barline types
                let barline = char;
                while (i + 1 < lineContent.length && (lineContent[i + 1] === '|' || lineContent[i + 1] === ':' || lineContent[i + 1] === ']' || lineContent[i + 1] === '[')) {
                    i++;
                    barline += lineContent[i];
                }
                notes.push({ isBarline: true, type: barline });
                barAccidentals = {}; // Reset accidentals at bar line
                i++;
                continue;
            }
            
            // Skip chords in quotes
            if (char === '"') {
                i++;
                while (i < lineContent.length && lineContent[i] !== '"') i++;
                i++;
                continue;
            }
            
            // Skip annotations in other brackets
            if (char === '!' || char === '+') {
                i++;
                while (i < lineContent.length && lineContent[i] !== char) i++;
                i++;
                continue;
            }
            
            // Handle grace notes
            if (char === '{') {
                while (i < lineContent.length && lineContent[i] !== '}') i++;
                i++;
                continue;
            }
            
            // Handle volta brackets [1 and [2 - skip them (they're not chords)
            if (char === '[') {
                // Check if this is a volta bracket [1, [2, etc.
                if (i + 1 < lineContent.length && /[0-9]/.test(lineContent[i + 1])) {
                    // Skip the volta marker [1 or [2 etc.
                    i++;
                    while (i < lineContent.length && /[0-9,\-]/.test(lineContent[i])) {
                        i++;
                    }
                    // Skip any trailing space
                    while (i < lineContent.length && lineContent[i] === ' ') {
                        i++;
                    }
                    continue;
                }
                
                // Handle chords (notes in brackets)
                i++;
                // Just take the first note of the chord
                const chordStart = i;
                while (i < lineContent.length && lineContent[i] !== ']') i++;
                const chordContent = lineContent.substring(chordStart, i);
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
                while (i < lineContent.length && (lineContent[i] === '^' || lineContent[i] === '_' || lineContent[i] === '=')) {
                    noteToken += lineContent[i];
                    hasExplicitAccidental = true;
                    if (lineContent[i] === '^') explicitAccidental = '#';
                    else if (lineContent[i] === '_') explicitAccidental = 'b';
                    else if (lineContent[i] === '=') explicitAccidental = 'natural';
                    i++;
                }
                
                // Collect note letter
                let noteLetter = '';
                if (i < lineContent.length && 
                    ((lineContent[i] >= 'A' && lineContent[i] <= 'G') || 
                     (lineContent[i] >= 'a' && lineContent[i] <= 'g') ||
                     lineContent[i] === 'z' || lineContent[i] === 'Z' || lineContent[i] === 'x')) {
                    noteLetter = lineContent[i].toUpperCase();
                    noteToken += lineContent[i];
                    i++;
                }
                
                // Collect octave modifiers
                while (i < lineContent.length && (lineContent[i] === "'" || lineContent[i] === ',')) {
                    noteToken += lineContent[i];
                    i++;
                }
                
                // Skip duration numbers and broken rhythm markers
                while (i < lineContent.length && (/\d/.test(lineContent[i]) || lineContent[i] === '/' || lineContent[i] === '>' || lineContent[i] === '<')) {
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
 * Export the rendered music as MIDI file
 */
async function exportAsMIDI() {
    if (!visualObj) {
        alert('Please render some music first!');
        return;
    }
    
    try {
        // Get speed from slider (100 = normal speed)
        const speedPercent = parseInt(document.getElementById('speed-slider').value) || 100;
        
        // Get the base tempo from the tune, default to 120 qpm
        const baseTempo = visualObj.metaText && visualObj.metaText.tempo ? 
            visualObj.metaText.tempo.bpm : 120;
        
        // Calculate adjusted tempo based on speed percentage
        const adjustedTempo = Math.round(baseTempo * (speedPercent / 100));
        
        // Generate MIDI file using abcjs
        const midiBuffer = ABCJS.synth.getMidiFile(visualObj, {
            midiOutputType: 'binary',
            program: 73,  // Flute sound for melody
            qpm: adjustedTempo,
            chordsOff: false,  // Include chord accompaniment
            chordProgram: 24,  // Acoustic Guitar (nylon) for chords
            bassProgram: 32    // Acoustic Bass for bass notes
        });
        
        if (!midiBuffer) {
            alert('Could not generate MIDI. Please try again.');
            return;
        }
        
        // Convert the MIDI data to a Blob and download
        const midiBlob = new Blob([midiBuffer], { type: 'audio/midi' });
        const url = URL.createObjectURL(midiBlob);
        
        // Create filename from tune title or default
        let filename = 'tune.mid';
        if (visualObj.metaText && visualObj.metaText.title) {
            // Sanitize the title for use as filename
            filename = visualObj.metaText.title.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.mid';
        }
        
        // Trigger download
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
        
        // Clean up
        URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error('MIDI export error:', error);
        alert('Error exporting MIDI: ' + error.message);
    }
}

/**
 * Initialize the tune library - populate the dropdown from tuneLibrary object
 */
function initTuneLibrary() {
    const tuneSelect = document.getElementById('tune-select');
    const loadTuneBtn = document.getElementById('load-tune-btn');
    
    // Check if tuneLibrary is defined (from tunes-index.js)
    if (typeof tuneLibrary === 'undefined' || Object.keys(tuneLibrary).length === 0) {
        console.warn('Tune library not available');
        const tuneLibrarySection = document.querySelector('.tune-library-section');
        if (tuneLibrarySection) {
            tuneLibrarySection.style.display = 'none';
        }
        return;
    }
    
    // Populate the dropdown with tune names
    Object.keys(tuneLibrary).forEach(tuneName => {
        const option = document.createElement('option');
        option.value = tuneName;
        option.textContent = tuneName;
        tuneSelect.appendChild(option);
    });
    
    // Enable/disable load button based on selection
    tuneSelect.addEventListener('change', () => {
        loadTuneBtn.disabled = !tuneSelect.value;
    });
    
    // Load tune when button is clicked
    loadTuneBtn.addEventListener('click', () => loadTune(tuneSelect.value));
    
    // Also load on double-click of dropdown selection
    tuneSelect.addEventListener('dblclick', () => {
        if (tuneSelect.value) {
            loadTune(tuneSelect.value);
        }
    });
    
    // Load the first tune by default
    const firstTune = Object.keys(tuneLibrary)[0];
    if (firstTune) {
        tuneSelect.value = firstTune;
        loadTuneBtn.disabled = false;
        loadTune(firstTune);
    }
}

/**
 * Load a tune from the tuneLibrary and display it
 * @param {string} tuneName - The name of the tune to load
 */
function loadTune(tuneName) {
    const abcText = tuneLibrary[tuneName];
    
    if (!abcText) {
        console.error('Tune not found:', tuneName);
        alert(`Tune not found: ${tuneName}`);
        return;
    }
    
    // Set the ABC text in the input area
    document.getElementById('abc-input').value = abcText;
    
    // Auto-detect and set the appropriate whistle key
    const detectedKey = detectBestWhistleKey(abcText);
    if (detectedKey) {
        document.getElementById('whistle-key').value = detectedKey;
    }
    
    // Render the music
    renderMusic();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
