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
let originalAbc = null;  // Store the original ABC before any transposition

/**
 * Initialize the application
 */
function init() {
    // Set up event listeners
    document.getElementById('play-btn').addEventListener('click', startPlayback);
    document.getElementById('stop-btn').addEventListener('click', stopPlayback);
    document.getElementById('export-btn').addEventListener('click', exportAsMIDI);
    document.getElementById('export-pdf-btn').addEventListener('click', exportAsPDF);
    document.getElementById('abc-input').addEventListener('input', debounce(() => renderMusic(true), 500));
    document.getElementById('transpose-key').addEventListener('change', () => renderMusic(false));
    document.getElementById('fiddle-tab-checkbox').addEventListener('change', () => {
        updateTabTitle();
        renderMusic(false);
    });
    
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
 * Update the output section title based on tab type
 */
function updateTabTitle() {
    const useFiddleTab = document.getElementById('fiddle-tab-checkbox').checked;
    const titleEl = document.getElementById('output-title');
    if (titleEl) {
        titleEl.textContent = useFiddleTab ? 'Sheet Music with Fiddle Tablature' : 'Sheet Music with Flute Tablature';
    }
    
    // Toggle legend visibility
    const fluteLegend = document.getElementById('flute-legend');
    const fiddleLegend = document.getElementById('fiddle-legend');
    if (fluteLegend) fluteLegend.style.display = useFiddleTab ? 'none' : 'block';
    if (fiddleLegend) fiddleLegend.style.display = useFiddleTab ? 'block' : 'none';
    
    // Toggle transpose control visibility (not applicable for fiddle)
    const transposeControl = document.getElementById('transpose-control');
    if (transposeControl) transposeControl.style.display = useFiddleTab ? 'none' : 'inline-block';
}

/**
 * Chromatic note names for transposition
 */
const chromaticNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const chromaticNotesFlat = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

/**
 * Get the semitone index of a note (0-11)
 */
function getNoteIndex(note) {
    const noteMap = {
        'C': 0, 'C#': 1, 'Db': 1,
        'D': 2, 'D#': 3, 'Eb': 3,
        'E': 4, 'Fb': 4, 'E#': 5,
        'F': 5, 'F#': 6, 'Gb': 6,
        'G': 7, 'G#': 8, 'Ab': 8,
        'A': 9, 'A#': 10, 'Bb': 10,
        'B': 11, 'Cb': 11, 'B#': 0
    };
    return noteMap[note] !== undefined ? noteMap[note] : -1;
}

/**
 * Transpose a note name by semitones
 * @param {string} noteName - Note name like 'C', 'F#', 'Bb'
 * @param {number} semitones - Number of semitones to transpose (positive = up, negative = down)
 * @param {boolean} preferFlats - Whether to prefer flat notation
 * @returns {string} - Transposed note name
 */
function transposeNote(noteName, semitones, preferFlats = false) {
    const index = getNoteIndex(noteName);
    if (index === -1) return noteName;
    
    let newIndex = (index + semitones) % 12;
    if (newIndex < 0) newIndex += 12;
    
    // Prefer flats for flat keys, sharps for sharp keys
    return preferFlats ? chromaticNotesFlat[newIndex] : chromaticNotes[newIndex];
}

/**
 * Transpose ABC notation by semitones
 * This transposes both the melody notes and chord symbols
 * @param {string} abc - The ABC notation
 * @param {number} semitones - Number of semitones to transpose
 * @returns {string} - Transposed ABC notation
 */
function transposeABC(abc, semitones) {
    if (semitones === 0) return abc;
    
    // Use sharps for keys with sharps (A, E, B, etc.), flats for keys with flats
    // For transposing DOWN from D: -5 goes to A (sharps), -7 goes to G (sharps)
    const preferFlats = [-2, -4, -8, 1, 3].includes(semitones);
    
    const lines = abc.split('\n');
    const result = [];
    let inBody = false;
    
    // Track key signature accidentals (both original and new)
    let oldKeyAccidentals = {};
    let newKeyAccidentals = {};
    
    // Key signature accidentals mapping
    const keySignatureAccidentals = {
        'C': {}, 'Am': {},
        'G': {'F': '#'}, 'Em': {'F': '#'},
        'D': {'F': '#', 'C': '#'}, 'Bm': {'F': '#', 'C': '#'},
        'A': {'F': '#', 'C': '#', 'G': '#'}, 'F#m': {'F': '#', 'C': '#', 'G': '#'},
        'E': {'F': '#', 'C': '#', 'G': '#', 'D': '#'}, 'C#m': {'F': '#', 'C': '#', 'G': '#', 'D': '#'},
        'B': {'F': '#', 'C': '#', 'G': '#', 'D': '#', 'A': '#'}, 'G#m': {'F': '#', 'C': '#', 'G': '#', 'D': '#', 'A': '#'},
        'F#': {'F': '#', 'C': '#', 'G': '#', 'D': '#', 'A': '#', 'E': '#'},
        'F': {'B': 'b'}, 'Dm': {'B': 'b'},
        'Bb': {'B': 'b', 'E': 'b'}, 'Gm': {'B': 'b', 'E': 'b'},
        'Eb': {'B': 'b', 'E': 'b', 'A': 'b'}, 'Cm': {'B': 'b', 'E': 'b', 'A': 'b'},
        'Ab': {'B': 'b', 'E': 'b', 'A': 'b', 'D': 'b'},
    };
    
    // Dorian, Mixolydian modes use same accidentals as their relative major
    // B dorian = A major key signature, E dorian = D major, etc.
    const modeMapping = {
        'dor': -2,  // Dorian is 2 semitones above relative major
        'mix': 5,   // Mixolydian is 5 semitones above relative major
        'min': 0, 'm': 0,  // Minor
        'maj': 0, '': 0    // Major
    };
    
    for (let line of lines) {
        const trimmed = line.trim();
        
        // Transpose key signature
        if (trimmed.startsWith('K:')) {
            const keyMatch = trimmed.match(/^K:\s*([A-Ga-g])([#b]?)\s*(.*)/i);
            if (keyMatch) {
                const oldNote = keyMatch[1].toUpperCase();
                const accidental = keyMatch[2] === '#' ? '#' : (keyMatch[2] === 'b' ? 'b' : '');
                const mode = keyMatch[3] || '';
                const oldKey = oldNote + accidental;
                const newKey = transposeNote(oldKey, semitones, preferFlats);
                line = `K:${newKey}${mode ? ' ' + mode : ''}`;
                
                // Determine the accidentals for both old and new keys
                // For modes, find the relative major's accidentals
                const modeClean = mode.trim().toLowerCase().replace(/\s+/g, '');
                
                // Get OLD key accidentals
                let oldLookupKey = oldKey;
                if (modeClean === 'dor' || modeClean === 'dorian') {
                    oldLookupKey = transposeNote(oldKey, -2, false);
                } else if (modeClean === 'mix' || modeClean === 'mixolydian') {
                    oldLookupKey = transposeNote(oldKey, -7, false);
                } else if (modeClean === 'min' || modeClean === 'm' || modeClean === 'minor') {
                    oldLookupKey = oldKey + 'm';
                }
                oldKeyAccidentals = keySignatureAccidentals[oldLookupKey] || keySignatureAccidentals[oldKey] || {};
                
                // Get NEW key accidentals
                let newLookupKey = newKey;
                
                // Handle modes - find the relative major
                if (modeClean === 'dor' || modeClean === 'dorian') {
                    // Dorian: key is 2nd degree, so major is 2 semitones down
                    newLookupKey = transposeNote(newKey, -2, preferFlats);
                } else if (modeClean === 'mix' || modeClean === 'mixolydian') {
                    // Mixolydian: key is 5th degree, so major is 5 semitones down
                    newLookupKey = transposeNote(newKey, -7, preferFlats);
                } else if (modeClean === 'min' || modeClean === 'm' || modeClean === 'minor') {
                    newLookupKey = newKey + 'm';
                }
                
                newKeyAccidentals = keySignatureAccidentals[newLookupKey] || keySignatureAccidentals[newKey] || {};
            }
            inBody = true;
            result.push(line);
            continue;
        }
        
        // Skip other header lines
        if (/^[A-Z]:/.test(trimmed) && !inBody) {
            result.push(line);
            continue;
        }
        
        if (!inBody) {
            result.push(line);
            continue;
        }
        
        // Store chord symbols temporarily to prevent note transposition from affecting them
        // Use a placeholder without letters A-G to avoid the note regex matching it
        const chordPlaceholders = [];
        line = line.replace(/"[^"]*"/g, (match) => {
            const placeholder = `\uFFFF${chordPlaceholders.length}\uFFFF`;
            chordPlaceholders.push(match);
            return placeholder;
        });
        
        // Transpose chord symbols (in the stored placeholders)
        for (let i = 0; i < chordPlaceholders.length; i++) {
            chordPlaceholders[i] = chordPlaceholders[i].replace(/"([A-Ga-g])([#b]?)([^"]*)"/g, (match, note, acc, rest) => {
                const oldChord = note.toUpperCase() + (acc || '');
                const newChord = transposeNote(oldChord, semitones, preferFlats);
                return `"${newChord}${rest}"`;
            });
        }
        
        // Transpose notes in the body (chords are now protected by placeholders)
        let noteCount = 0;
        line = line.replace(/([\^_=]*)([A-Ga-g])([',]*)/g, (match, accidentals, noteLetter, octaveMarkers) => {
            // Determine the base note and any explicit accidental
            let baseNote = noteLetter.toUpperCase();
            let explicitAcc = '';
            let hadExplicitAccidental = false;
            
            if (accidentals.includes('^')) {
                explicitAcc = '#';
                hadExplicitAccidental = true;
            } else if (accidentals.includes('_')) {
                explicitAcc = 'b';
                hadExplicitAccidental = true;
            } else if (accidentals.includes('=')) {
                // Natural - explicitly natural, don't apply key signature
                explicitAcc = '';
                hadExplicitAccidental = true;
            } else {
                // No explicit accidental - apply OLD key signature
                const oldKeyAcc = oldKeyAccidentals[baseNote];
                if (oldKeyAcc) {
                    explicitAcc = oldKeyAcc;  // Apply key signature accidental
                }
            }
            
            const noteWithAcc = baseNote + explicitAcc;
            const transposedNote = transposeNote(noteWithAcc, semitones, preferFlats);
            
            // Rebuild the ABC note
            let newAccidentals = '';
            let newNoteLetter = transposedNote[0];
            
            // Check if the accidental is already in the NEW key signature
            const keyAcc = newKeyAccidentals[newNoteLetter];
            
            if (transposedNote.length > 1) {
                const noteAcc = transposedNote[1]; // '#' or 'b'
                if (keyAcc === noteAcc) {
                    // Accidental is already in key signature, don't add explicit accidental
                    newAccidentals = '';
                } else if (keyAcc && noteAcc !== keyAcc) {
                    // Key has different accidental, need natural + new accidental
                    // For simplicity, just use the explicit accidental
                    newAccidentals = noteAcc === '#' ? '^' : '_';
                } else {
                    // No accidental in key, add explicit
                    newAccidentals = noteAcc === '#' ? '^' : '_';
                }
            } else {
                // Transposed note is natural - check if NEW key signature has an accidental for it
                if (keyAcc) {
                    // Key has accidental but we have natural note, add = to override
                    newAccidentals = '=';
                }
            }
            
            // Preserve case (lowercase = higher octave in ABC)
            if (noteLetter === noteLetter.toLowerCase()) {
                newNoteLetter = newNoteLetter.toLowerCase();
            }
            
            // Handle octave shifts due to transposition
            // Calculate how many octaves we cross based on semitone distance
            const oldIndex = getNoteIndex(noteWithAcc);
            const newIndex = getNoteIndex(transposedNote);
            let newOctaveMarkers = octaveMarkers;
            
            // Determine if we crossed an octave boundary
            // Going up: if we wrapped around (new index < old index after adding semitones)
            // Going down: if we wrapped around (new index > old index after subtracting semitones)
            const wrappedUp = semitones > 0 && (oldIndex + semitones >= 12);
            const wrappedDown = semitones < 0 && (oldIndex + semitones < 0);
            
            if (wrappedUp) {
                // Crossed octave going up - move note up one octave
                if (noteLetter === noteLetter.toLowerCase()) {
                    // Already lowercase (octave 5), add apostrophe
                    newOctaveMarkers = "'" + octaveMarkers;
                } else {
                    // Uppercase (octave 4), convert to lowercase (octave 5)
                    newNoteLetter = newNoteLetter.toLowerCase();
                }
            } else if (wrappedDown) {
                // Crossed octave going down - move note down one octave
                if (noteLetter === noteLetter.toUpperCase()) {
                    // Already uppercase (octave 4), add comma
                    newOctaveMarkers = "," + octaveMarkers;
                } else {
                    // Lowercase (octave 5), convert to uppercase (octave 4)
                    newNoteLetter = newNoteLetter.toUpperCase();
                }
            } else {
                // No octave crossing, preserve original case
                if (noteLetter === noteLetter.toLowerCase()) {
                    newNoteLetter = newNoteLetter.toLowerCase();
                }
            }
            
            return newAccidentals + newNoteLetter + newOctaveMarkers;
        });
        
        // Restore chord symbols from placeholders
        line = line.replace(/\uFFFF(\d+)\uFFFF/g, (match, idx) => {
            return chordPlaceholders[parseInt(idx, 10)];
        });
        
        result.push(line);
    }
    
    const transposed = result.join('\n');
    return transposed;
}

/**
 * Get the display name for a transposition value
 */
function getTranspositionName(semitones) {
    const names = {
        '0': 'D whistle',
        '-2': 'C whistle',
        '1': 'Eb whistle',
        '3': 'F whistle',
        '-7': 'G whistle',
        '-5': 'A whistle',
        '-4': 'Bb whistle'
    };
    return names[String(semitones)] || 'D whistle';
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
        
        // Choose instrument based on fiddle tab checkbox
        const fiddleTabEnabled = document.getElementById('fiddle-tab-checkbox').checked;
        const midiProgram = fiddleTabEnabled ? 40 : 73;  // 40 = Violin, 73 = Flute
        
        // Initialize with the visual object
        await synth.init({
            visualObj: visualObj,
            options: {
                soundFontUrl: 'https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/',
                program: midiProgram,
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
function renderMusic(fromUserInput = false) {
    const abcInputElement = document.getElementById('abc-input');
    const abcInput = abcInputElement.value;
    const transposeSemitones = parseInt(document.getElementById('transpose-key').value, 10) || 0;
    const paperDiv = document.getElementById('paper');
    const tabDiv = document.getElementById('tablature');
    
    // If this is from user input (typing in the text area), store as the new original
    if (fromUserInput || originalAbc === null) {
        originalAbc = abcInput;
    }
    
    // Always transpose from the original ABC
    const transposedAbc = transposeABC(originalAbc, transposeSemitones);
    
    // Update the ABC text area to show transposed notation
    abcInputElement.value = transposedAbc;
    
    // Always use D whistle fingerings
    const whistleKey = 'D';
    
    // Clear previous tablature
    tabDiv.innerHTML = '';
    
    if (!transposedAbc.trim()) {
        paperDiv.innerHTML = '<p style="color: #999; text-align: center;">Enter ABC notation above to see the music</p>';
        return;
    }
    
    try {
        // Track note elements for tablature positioning
        const noteElements = [];
        
        // Add spacing directive to the transposed ABC string for tablature room
        let abcWithSpacing = transposedAbc;
        if (!transposedAbc.includes('%%staffsep') && !transposedAbc.includes('%%sysstaffsep')) {
            // Insert spacing directives after the X: line or at the beginning
            const lines = transposedAbc.split('\n');
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
        // Use ORIGINAL ABC for tablature so fingerings match D whistle patterns
        setTimeout(() => {
            const useFiddleTab = document.getElementById('fiddle-tab-checkbox').checked;
            if (useFiddleTab) {
                addFiddleTablatureToNotes(originalAbc);
            } else {
                addTablatureToNotes(originalAbc, whistleKey);
            }
        }, 50);
        
        currentTune = transposedAbc;
        
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
    // Filter out barlines and rests - rests don't have corresponding SVG note elements
    const playableNotes = notes.filter(n => !n.isBarline && 
        n.note !== 'z' && n.note !== 'Z' && n.note !== 'x');
    
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
        
        if (!noteData) {
            return;
        }
        
        // Get fingering for this note
        const noteInfo = FluteTab.parseAbcNote(noteData.note);
        if (noteInfo.rest) {
            return;
        }
        
        const fingering = FluteTab.getFingering(noteInfo, whistleKey);
        
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
 * Add fiddle tablature notation directly under notes in the SVG
 * Uses a three-level vertical stagger to prevent overlap in busy passages
 */
function addFiddleTablatureToNotes(abcInput) {
    const svg = document.querySelector('#paper svg');
    if (!svg) return;
    
    // Find all note elements in the SVG
    const noteGroups = svg.querySelectorAll('.abcjs-note');
    if (noteGroups.length === 0) return;
    
    // Extract notes from ABC to get fingerings
    const notes = extractNotesFromABC(abcInput);
    // Filter out barlines and rests
    const playableNotes = notes.filter(n => !n.isBarline && 
        n.note !== 'z' && n.note !== 'Z' && n.note !== 'x');
    
    // Get the SVG namespace
    const svgNS = 'http://www.w3.org/2000/svg';
    
    // Collect note positions using the notehead position
    const notePositions = [];
    noteGroups.forEach((noteGroup, idx) => {
        try {
            const notehead = noteGroup.querySelector('.abcjs-notehead');
            let noteY;
            let noteX;
            let bbox = noteGroup.getBBox();
            
            if (notehead) {
                const headBbox = notehead.getBBox();
                noteY = headBbox.y + headBbox.height / 2;
                noteX = headBbox.x + headBbox.width / 2;
            } else {
                noteY = bbox.y + 10;
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
    
    // Group notes into staff lines
    const lineThreshold = 50;
    const staffLineYs = [];
    const sortedByY = [...notePositions].sort((a, b) => a.noteY - b.noteY);
    
    sortedByY.forEach(notePos => {
        let foundLine = staffLineYs.find(line => 
            Math.abs(notePos.noteY - line.centerY) < lineThreshold
        );
        
        if (foundLine) {
            foundLine.notes.push(notePos);
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
    
    staffLineYs.sort((a, b) => a.centerY - b.centerY);
    
    // Assign tabY position for each staff line
    staffLineYs.forEach((line, lineIdx) => {
        line.tabY = line.maxY + 50; // Base position below staff
    });
    
    // Create a map from note group to staff line
    const noteToStaffLine = new Map();
    staffLineYs.forEach(line => {
        line.notes.forEach(notePos => {
            noteToStaffLine.set(notePos.group, line);
        });
    });
    
    let noteIndex = 0;
    let staggerLevel = 0; // 0, 1, 2 for three vertical levels
    let lastNoteX = -100;
    
    noteGroups.forEach((noteGroup, i) => {
        const staffLine = noteToStaffLine.get(noteGroup);
        if (!staffLine) return;
        
        const notePos = notePositions.find(np => np.group === noteGroup);
        if (!notePos) return;
        
        if (noteIndex >= playableNotes.length) return;
        const noteData = playableNotes[noteIndex];
        noteIndex++;
        
        if (!noteData) return;
        
        // Get fiddle tab for this note
        const noteInfo = FiddleTab.parseAbcNote(noteData.note);
        if (noteInfo.rest) return;
        
        const fiddleTab = FiddleTab.getFiddleTab(noteInfo);
        if (!fiddleTab) return;
        
        // Create tablature text
        const tabGroup = document.createElementNS(svgNS, 'g');
        tabGroup.setAttribute('class', `fiddle-tab string-${fiddleTab.string}`);
        
        const tabX = notePos.noteX;
        
        // Three-level vertical stagger to prevent overlap
        // Reset stagger if notes are far apart horizontally
        if (notePos.noteX - lastNoteX > 15) {
            staggerLevel = 0;
        } else {
            staggerLevel = (staggerLevel + 1) % 3;
        }
        lastNoteX = notePos.noteX;
        
        // Calculate Y position with stagger
        const staggerOffset = staggerLevel * 12; // 12 pixels between levels
        const tabY = staffLine.tabY + staggerOffset;
        
        // Create the text element
        const tabText = document.createElementNS(svgNS, 'text');
        tabText.setAttribute('x', tabX);
        tabText.setAttribute('y', tabY);
        tabText.setAttribute('text-anchor', 'middle');
        tabText.setAttribute('font-size', '9');
        tabText.setAttribute('font-family', 'Arial, sans-serif');
        tabText.setAttribute('font-weight', 'normal');
        
        // Color coding by string (colorblind-friendly palette)
        const stringColors = {
            'G': '#0072B2', // Blue for G string (lowest)
            'D': '#E69F00', // Orange for D string
            'A': '#CC79A7', // Pink/Magenta for A string
            'E': '#009E73'  // Teal for E string (highest)
        };
        
        const fillColor = stringColors[fiddleTab.string] || '#333';
        tabText.setAttribute('fill', fillColor);
        tabText.setAttribute('style', `fill: ${fillColor} !important;`);  // Force with !important
        
        // Display format: string + finger (e.g., "D1", "AL2", "G0")
        tabText.textContent = fiddleTab.display;
        
        // Note: We no longer style low positions differently - it was causing
        // visual inconsistency where some notes appeared bolder than others
        
        tabGroup.appendChild(tabText);
        
        // Add out-of-range indicator
        if (fiddleTab.outOfRange) {
            tabText.setAttribute('fill', '#999');
        }
        
        svg.appendChild(tabGroup);
    });
    
    // Reposition meta text below fiddle tablature
    repositionMetaBottom(svg, staffLineYs, 40); // Extra offset for fiddle tab
}

/**
 * Reposition the N: notes text (abcjs-meta-bottom) below the last tablature line
 * @param {SVGElement} svg - The SVG element containing the music
 * @param {Array} staffLineYs - Array of staff line info with tabY positions
 * @param {number} extraOffset - Optional extra vertical offset for different tab types
 */
function repositionMetaBottom(svg, staffLineYs, extraOffset = 0) {
    const metaBottom = svg.querySelector('.abcjs-meta-bottom');
    if (!metaBottom) return;
    
    // Find the lowest tabY position (last tablature line)
    let maxTabY = 0;
    staffLineYs.forEach(line => {
        // Add space for the 6 holes plus some padding (or fiddle tab stagger levels)
        const tabBottomY = line.tabY + 6 * 7 + 20 + extraOffset; // 6 holes * 7px spacing + padding + extra
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
/**
 * Parse a key signature text (e.g., "A", "Dmaj", "Edor", "Gmix") and return
 * the corresponding accidentals object from keySignatures.
 */
function parseKeyText(keyText) {
    const keyMatch = keyText.match(/^([A-Ga-g][#b]?)\s*(maj|min|mix|mixolydian|m|dor|dorian)?/i);
    if (!keyMatch) return {};

    const keyNote = keyMatch[1].charAt(0).toUpperCase() + (keyMatch[1].length > 1 ? keyMatch[1].charAt(1) : '');
    const mode = (keyMatch[2] || '').toLowerCase();
    let lookupKey = keyNote;

    if (mode === 'dor' || mode === 'dorian') {
        lookupKey = keyNote + 'Dor';
        if (!keySignatures[lookupKey]) {
            const cn = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            const flatEquiv = {'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'};
            let idx = cn.indexOf(keyNote);
            if (idx === -1) {
                for (const [sharp, flat] of Object.entries(flatEquiv)) {
                    if (flat === keyNote) idx = cn.indexOf(sharp);
                }
            }
            if (idx !== -1) {
                lookupKey = cn[(idx - 2 + 12) % 12];
            }
        }
    } else if (mode === 'mix' || mode === 'mixolydian') {
        lookupKey = keyNote + 'Mix';
        if (!keySignatures[lookupKey]) {
            const cn = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            let idx = cn.indexOf(keyNote);
            if (idx !== -1) {
                lookupKey = cn[(idx - 7 + 12) % 12];
            }
        }
    } else if (mode === 'min' || mode === 'm') {
        lookupKey = keyNote + 'm';
    }

    return keySignatures[lookupKey] || keySignatures[keyNote] || {};
}

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
    // Dorian is built on the 2nd degree of a major scale
    'DDor': {},                           // D Dorian = C Major key sig (no sharps)
    'GDor': { 'B': 'b' },                 // G Dorian = F Major key sig (1 flat)
    'ADor': { 'F': '#' },                 // A Dorian = G Major key sig (1 sharp)
    'EDor': { 'F': '#', 'C': '#' },       // E Dorian = D Major key sig (2 sharps)
    
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
            const keyText = trimmed.substring(2).trim();
            keyAccidentals = parseKeyText(keyText);
            inBody = true;
            continue;
        }
        
        // Skip header lines
        if (/^[A-Z]:/.test(trimmed) && !inBody) {
            continue;
        }
        
        if (!inBody) continue;
        
        // Skip inline field lines (P:, N:, W:, etc.) that appear in the tune body
        // These are ABC information fields, not music
        if (/^[A-Za-z]:/.test(trimmed)) {
            continue;
        }
        
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
                
                // Check for inline fields [K:A], [M:3/4], etc.
                if (i + 2 < lineContent.length &&
                    /[A-Za-z]/.test(lineContent[i + 1]) &&
                    lineContent[i + 2] === ':') {
                    const fieldStart = i + 1;
                    i++;
                    while (i < lineContent.length && lineContent[i] !== ']') i++;
                    const fieldContent = lineContent.substring(fieldStart, i);
                    // Handle inline key change [K:...]
                    if (fieldContent.charAt(0).toUpperCase() === 'K') {
                        const keyText = fieldContent.substring(2).trim();
                        keyAccidentals = parseKeyText(keyText);
                        barAccidentals = {};
                    }
                    i++; // skip ]
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
        
        // Choose instrument based on fiddle tab checkbox
        const fiddleTabEnabled = document.getElementById('fiddle-tab-checkbox').checked;
        const midiProgram = fiddleTabEnabled ? 40 : 73;  // 40 = Violin, 73 = Flute
        
        // Generate MIDI file using abcjs
        const midiBuffer = ABCJS.synth.getMidiFile(visualObj, {
            midiOutputType: 'binary',
            program: midiProgram,
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
 * Export the rendered music with tablature as PDF
 */
async function exportAsPDF() {
    const paper = document.getElementById('paper');
    
    if (!paper || !paper.querySelector('svg')) {
        alert('Please render some music first!');
        return;
    }
    
    try {
        // Show loading state
        const exportBtn = document.getElementById('export-pdf-btn');
        const originalText = exportBtn.textContent;
        exportBtn.textContent = 'Generating PDF...';
        exportBtn.disabled = true;
        
        // Create filename from tune title or default
        let filename = 'tune-tablature.pdf';
        if (visualObj && visualObj.metaText && visualObj.metaText.title) {
            filename = visualObj.metaText.title.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '-tablature.pdf';
        }
        
        // Use html2canvas to capture the paper element with tablature
        const canvas = await html2canvas(paper, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher resolution
            useCORS: true,
            logging: false
        });
        
        // Get image dimensions
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Create PDF using jsPDF
        const { jsPDF } = window.jspdf;
        
        // Calculate PDF dimensions (A4 is 210 x 297 mm)
        // Use landscape if the image is wider than tall
        const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';
        const pdf = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: 'a4'
        });
        
        // Get page dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Add margins
        const margin = 10;
        const maxWidth = pageWidth - (2 * margin);
        const maxHeight = pageHeight - (2 * margin);
        
        // Calculate scaling to fit on page while maintaining aspect ratio
        const ratio = Math.min(maxWidth / (imgWidth / 3.78), maxHeight / (imgHeight / 3.78)); // 3.78 px/mm at 96 DPI
        const scaledWidth = (imgWidth / 3.78) * ratio;
        const scaledHeight = (imgHeight / 3.78) * ratio;
        
        // Center on page
        const x = (pageWidth - scaledWidth) / 2;
        const y = margin;
        
        // Add title if available
        if (visualObj && visualObj.metaText && visualObj.metaText.title) {
            pdf.setFontSize(16);
            pdf.text(visualObj.metaText.title, pageWidth / 2, margin, { align: 'center' });
        }
        
        // Add the image
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', x, y + 5, scaledWidth, scaledHeight);
        
        // Add footer with transposition info
        const transposeSemitones = parseInt(document.getElementById('transpose-key').value, 10) || 0;
        const transposeKeyName = getTranspositionName(transposeSemitones);
        pdf.setFontSize(10);
        pdf.text(`Transposed to: ${transposeKeyName}`, margin, pageHeight - margin);
        
        // Save the PDF
        pdf.save(filename);
        
        // Restore button state
        exportBtn.textContent = originalText;
        exportBtn.disabled = false;
        
    } catch (error) {
        console.error('PDF export error:', error);
        alert('Error exporting PDF: ' + error.message);
        
        // Restore button state on error
        const exportBtn = document.getElementById('export-pdf-btn');
        exportBtn.textContent = 'Export as PDF';
        exportBtn.disabled = false;
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
    
    // Store as the new original ABC
    originalAbc = abcText;
    
    // Set the ABC text in the input area
    document.getElementById('abc-input').value = abcText;
    
    // Default to D (no transposition) - the most common whistle
    // Users can experiment with transposition to find a suitable key
    document.getElementById('transpose-key').value = '0';
    
    // Render the music (not from user input, we already set originalAbc)
    renderMusic(false);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
