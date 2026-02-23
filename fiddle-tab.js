/**
 * Fiddle/Violin Tablature Generator
 * 
 * This module handles the conversion of musical notes to fiddle tablature notation.
 * Fiddle tab uses a string-finger notation system:
 * - Strings: G (4th), D (3rd), A (2nd), E (1st) - from lowest to highest
 * - Fingers: 0 (open), 1, 2, 3, 4 (and L prefix for "low" half-step back)
 * 
 * Example: D1 = D string, 1st finger = E note
 *          AL2 = A string, low 2nd finger = C natural (instead of C#)
 */

const FiddleTab = {
    // Violin strings from lowest to highest
    strings: ['G', 'D', 'A', 'E'],
    
    // Open string pitches (MIDI note numbers)
    // G3=55, D4=62, A4=69, E5=76
    openStrings: {
        'G': { midi: 55, octave: 3 },  // G3
        'D': { midi: 62, octave: 4 },  // D4
        'A': { midi: 69, octave: 4 },  // A4
        'E': { midi: 76, octave: 5 }   // E5
    },
    
    // Note name to semitone offset from C
    noteToSemitone: {
        'C': 0, 'C#': 1, 'Db': 1,
        'D': 2, 'D#': 3, 'Eb': 3,
        'E': 4, 'Fb': 4, 'E#': 5,
        'F': 5, 'F#': 6, 'Gb': 6,
        'G': 7, 'G#': 8, 'Ab': 8,
        'A': 9, 'A#': 10, 'Bb': 10,
        'B': 11, 'Cb': 11, 'B#': 0
    },
    
    /**
     * Convert note name and octave to MIDI note number
     */
    noteToMidi: function(noteName, octave) {
        const semitone = this.noteToSemitone[noteName];
        if (semitone === undefined) return -1;
        // MIDI note 60 = C4
        return (octave + 1) * 12 + semitone;
    },
    
    /**
     * Get fiddle tab for a given note
     * Returns the most practical fingering in first position
     * 
     * @param {Object} noteInfo - Object with note, noteName, octave from parseAbcNote
     * @returns {Object} - { string: 'G'|'D'|'A'|'E', finger: '0'|'1'|'L2'|'2'|'3'|'4', display: 'D1' }
     */
    getFiddleTab: function(noteInfo) {
        if (!noteInfo || noteInfo.rest) {
            return null;
        }
        
        const midi = this.noteToMidi(noteInfo.noteName, noteInfo.octave);
        if (midi < 0) return null;
        
        // First position range: G3 (55) to B5 (83) approximately
        // Below range
        if (midi < 55) {
            return { string: '?', finger: '?', display: '?', outOfRange: true };
        }
        // Above practical first position range
        if (midi > 84) {
            return { string: '?', finger: '?', display: '?', outOfRange: true };
        }
        
        // Find the best string and finger combination
        // Strategy: prefer lower positions on higher strings for easier fingering
        
        // Check each string from highest (E) to lowest (G)
        // to find one where the note is playable in first position
        const stringOrder = ['E', 'A', 'D', 'G'];
        
        for (const str of stringOrder) {
            const openMidi = this.openStrings[str].midi;
            const semitoneOffset = midi - openMidi;
            
            // First position covers 0 to 4 (or 5 for some extensions)
            // 0 = open
            // 1-2 semitones = 1st finger (1 = low 1, 2 = high 1 in some keys)
            // 3-4 semitones = 2nd finger (3 = low 2, 4 = high 2)
            // 5 semitones = 3rd finger
            // 6-7 semitones = 4th finger (rarely used, usually shift or next string)
            
            if (semitoneOffset >= 0 && semitoneOffset <= 7) {
                const fingerInfo = this.semitoneToFinger(semitoneOffset);
                return {
                    string: str,
                    finger: fingerInfo.finger,
                    display: str + fingerInfo.display,
                    isLow: fingerInfo.isLow
                };
            }
        }
        
        return { string: '?', finger: '?', display: '?', outOfRange: true };
    },
    
    /**
     * Convert semitone offset from open string to finger notation
     * Standard first position fingering:
     * 0 = open
     * 1 = low 1st finger (half step)
     * 2 = high 1st finger (whole step) - standard 1st finger
     * 3 = low 2nd finger (1.5 steps)
     * 4 = high 2nd finger (2 steps) - standard 2nd finger
     * 5 = 3rd finger (2.5 steps)
     * 6 = low 4th finger (3 steps)
     * 7 = high 4th finger (3.5 steps) - usually next string open
     */
    semitoneToFinger: function(semitones) {
        switch(semitones) {
            case 0: return { finger: '0', display: '0', isLow: false };
            case 1: return { finger: 'L1', display: 'L1', isLow: true };   // Low 1
            case 2: return { finger: '1', display: '1', isLow: false };    // High 1 (standard)
            case 3: return { finger: 'L2', display: 'L2', isLow: true };   // Low 2
            case 4: return { finger: '2', display: '2', isLow: false };    // High 2 (standard)
            case 5: return { finger: '3', display: '3', isLow: false };    // 3rd finger
            case 6: return { finger: 'L4', display: 'L4', isLow: true };   // Low 4 (rare)
            case 7: return { finger: '4', display: '4', isLow: false };    // 4th finger
            default: return { finger: '?', display: '?', isLow: false };
        }
    },
    
    /**
     * Parse an ABC note (same as FluteTab.parseAbcNote for compatibility)
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
    }
};

// Export for use in browser
if (typeof window !== 'undefined') {
    window.FiddleTab = FiddleTab;
}
