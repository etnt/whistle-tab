# ABC to Sheet Music with Flute/Tin Whistle & Fiddle Tablature

[![GitHub Release](https://img.shields.io/github/v/release/etnt/whistle-tab?style=flat-square)](https://github.com/etnt/whistle-tab/releases/latest)
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

A web-based application that converts ABC musical notation into standard
sheet music with either tin whistle (Irish flute) or fiddle (violin) tablature display.

## Features

- **ABC Notation Parser**: Enter ABC notation and see it rendered as standard sheet music
- **Tin Whistle Tablature**: Automatically generates fingering diagrams below the staff
- **Fiddle Tablature**: Toggle to show violin first-position fingerings with color-coded strings
- **Transpose for Different Whistles**: Transpose tunes to play on A, G, C, Eb, F, or Bb whistles while keeping the same fingerings
- **Audio Playback**: Play your tunes with flute or violin sound (based on tab type)
- **Adjustable Speed**: Control playback tempo from 50% to 150%
- **Example Tunes**: Built-in examples including scales, jigs, reels, and airs
- **Live Preview**: Music updates as you type
- **Export to PNG**: Save your sheet music with tablature as an image

## Quick Start

### Option 1: Use Online (Easiest)

Visit the live version at: **https://whistletab.kruskakli.se/**

No download or installation required!

### Option 2: Download and Run Locally

1. **[⬇️ Download Latest Release](https://github.com/etnt/whistle-tab/releases/latest/download/whistle-tab.zip)**
2. Extract the zip file to a folder
3. Open `index.html` in a web browser
4. Enter ABC notation in the text area
5. Select your whistle key from the "Transpose for:" dropdown
6. The sheet music and tablature will render automatically

## Transpose Feature

The **Transpose for:** dropdown allows you to play tunes on different whistle keys while using the same fingerings you learned on a D whistle.

### How It Works

Most tin whistle tunes are written for a D whistle. When you select a different whistle key (e.g., A whistle), the application:

1. **Transposes the sheet music** - The notes and chords are transposed so that the written music shows the actual sounding pitches
2. **Keeps the same fingerings** - The tablature shows the original D whistle fingerings, which produce the correct transposed notes on your chosen whistle

### Example

If you have a tune in D major and select "A whistle":
- The sheet music transposes down a fifth (D → A, E → B, F# → C#, etc.)
- The fingering for what was written as "D" (all holes covered) now produces an "A" on your A whistle
- You play the same fingerings, but the tune sounds in A instead of D

### Supported Whistles

| Whistle | Transposition |
|---------|---------------|
| D whistle | No transposition (original) |
| C whistle | Down 2 semitones |
| Eb whistle | Up 1 semitone |
| F whistle | Up 3 semitones |
| G whistle | Down 7 semitones |
| A whistle | Down 5 semitones |
| Bb whistle | Down 4 semitones |

## Fiddle Tab Feature

The **Fiddle Tab** checkbox toggles between flute tablature and violin (fiddle) tablature. This implements the [Fiddle Tab notation system](https://brentrobitaille.com/2020/11/29/learning-the-violin-is-easy-with-fiddle-tab/) - a simple shorthand for first-position violin fingerings.

When enabled:

- **Tablature format**: Shows string and finger position (e.g., `D1` = D string, 1st finger)
- **Open strings**: Shown as `G0`, `D0`, `A0`, `E0`
- **Low positions**: Marked with `L` (e.g., `DL2` = low 2nd finger on D string, placed a half-step lower than the normal 2nd finger position)
- **Audio**: Playback and MIDI export use violin sound instead of flute
- **Note**: The transpose dropdown is hidden when Fiddle Tab is enabled, as transposition is specific to whistle fingerings

### Color-Coded Strings

Each string is displayed in a distinct color (using a colorblind-friendly palette):

- **G** (Blue) - 4th string (lowest)
- **D** (Orange) - 3rd string
- **A** (Pink) - 2nd string
- **E** (Teal) - 1st string (highest)

### First Position Range

The fiddle tablature covers first position (G3 to B5), suitable for most traditional Irish and folk tunes.

## ABC Notation Basics

ABC notation is a text-based music notation system. Here's a quick reference:

### Headers
```
X:1          - Tune number
T:Tune Name  - Title
C:Composer.  - The Composer
R:Rythm      - The Rythm
M:4/4        - Time signature
L:1/8        - Default note length
K:D          - Key signature
```

### Notes
- **Octaves**: `C D E F G A B` (lower octave), `c d e f g a b` (higher octave)
- **Octave modifiers**: `C,` (octave down), `c'` (octave up)
- **Sharps**: `^F` = F#
- **Flats**: `_B` = Bb
- **Natural**: `=F` = F natural

### Rhythm
- `A2` = note twice as long
- `A/2` = note half as long
- `A3/2` = dotted note
- `|` = bar line
- `|]` = final bar line
- `|:` and `:|` = repeat signs

### Broken Rhythm
If you place a `>` between two notes, it automatically dots the first one and halves the second one:

```abc
A>B CD
```
- `A>B`: The A becomes a dotted 8th, and the B becomes a 16th (half 8th)
- `CD`: These remain ordinary 8th notes

### How to use a Tie in ABC
To connect an 8th note from the end of one measure to a note in the next,
place the hyphen immediately after the first note: `A-A`

### Expressing Rests

1. Basic Rests (z)

The lowercase z represents a standard visible rest. Its duration is determined exactly like a note:

- z: One rest of the default length (e.g., an 8th rest if L:1/8).
- z2: A rest twice the default length (e.g., a quarter rest if L:1/8).
- z/2 or z/: A rest half the default length (e.g., a 16th rest if L:1/8).

2. Multi-measure Rests (Z)

If you need to indicate that a player should be silent for several entire
measures, use an uppercase Z followed by the number of bars.

- Z4: Four full measures of rest.
- Z: One full measure of rest (equivalent to Z1).

3. Invisible Rests (x and X)

Sometimes you want a "pause" in the music's timing without showing a rest
symbol on the printed staff (often used for alignment in multi-voice music).

- x: An invisible rest (same duration rules as z).
- X: An invisible multi-measure rest.

### Common Standard Rhythms

Some frequent values you will see in traditional music collections:

| Rhythm (R:) | Common Meter (M:) | Description |
|-------------|-------------------|-------------|
| Reel | 4/4 or 2/2 | Fast, even notes (mostly 8th notes). |
| Jig | 6/8 | Bouncy, triple-feel rhythm (DUM-da-da DUM-da-da). |
| Hornpipe | 4/4 | Played with a "swing" or dotted feel (long-short). |
| Polka | 2/4 | Fast, sharp, and driving. |
| Waltz | 3/4 | Smooth, triple-time dance rhythm. |
| Slip Jig | 9/8 | A "hopping" jig with three beats per measure. |
| Strathspey | 4/4 | Features the "Scottish Snap" (short-long rhythms). |
| Slide | 12/8 | Very fast Irish dance rhythm, similar to a jig but felt in four. |
| March | 2/4 or 4/4 | Strong, steady beat for walking/marching. |

### Tempo notation

The ABC Q: (tempo) field has several formats:

Basic formats:

    Q:1/4=60 — 60 quarter notes per minute (60 BPM)
    Q:1/8=120 — 120 eighth notes per minute
    Q:60 — shorthand for 60 default beats per minute

Examples for different feels:

    Q:1/4=60    % Slow ballad/air (60 BPM)
    Q:1/4=90    % Moderate waltz
    Q:1/4=120   % Standard reel tempo
    Q:1/8=200   % Fast reel (100 BPM in quarter notes)
    Q:3/8=80    % Jig tempo (80 dotted quarters per minute)

### Slur notation

In ABC notation, the parentheses surrounding a sequence of notes—like:
`(f>age)` , indicate a Slur.

**What is a Slur?**

A slur tells the musician to play those notes in one continuous, smooth breath
or movement without re-articulating each one. For a Tin Whistle, that means:

Do not "tongue" the notes inside the parentheses. Only the first note (f) is
articulated with the tongue; the following notes (a, g, and e) are played by 
simply moving your fingers while maintaining a steady stream of air.

### Misc. notation

The Tilde (~): In ~B3A and ~d3B, the tilde represents a Roll (an Irish ornament).
If you are playing this on tin whistle, this is where you would do a flick of the
fingers to add that "crackle" to the note.

The Curly Braces ({E}D): This is a Grace Note. It should be played very quickly
just before the main D note.

The Triplet ((3AGF): This indicates that the three notes A, G, and F should be
squeezed into the time of two 8th notes.

### Adding text
Intersperse each line with: `w: the text comes here`

### Adding comments

1. Hidden Comments (The % symbol)

Anything following a percent sign (%) is ignored by the computer.
This is perfect for personal reminders, version history, or explaining a
tricky bit of fingering.

2. Printed Header Notes (N:)

If you want to include historical information, performance instructions,
or general notes that should appear when the tune is cataloged or printed,
use the N: field in the header.

### Example
```abc
X:1
T:Simple Scale
M:4/4
L:1/4
K:D
D E F G | A B c d |]
```

## Tablature Legend

The tablature shows a vertical representation of the tin whistle's 6 holes:

```
●  = Covered hole (finger down)
○  = Open hole (finger up)
◐  = Half-covered hole
+  = Second octave (blow harder)
```

Holes are numbered from top to bottom:
1. Left hand index finger
2. Left hand middle finger
3. Left hand ring finger
4. Right hand index finger
5. Right hand middle finger
6. Right hand ring finger

## Whistle Key Selection

The tablature adjusts based on your whistle's key:
- **D whistle** (most common): Good for keys of D, G, A, Em, Bm
- **C whistle**: Good for keys of C, F, G, Am, Dm
- **G whistle**: Good for low G music, often used for slow airs

## File Structure

```
whistle-tab/
├── index.html      - Main HTML page
├── styles.css      - Styling
├── app.js          - Main application logic
├── flute-tab.js    - Tablature generation module
└── README.md       - This file
```

## Dependencies

- [abcjs](https://www.abcjs.net/) - ABC notation rendering library (loaded from CDN)

## Browser Compatibility

Works in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

To modify the application:

1. Edit `flute-tab.js` to add/modify fingerings
2. Edit `app.js` for application logic changes
3. Edit `styles.css` for visual changes

### Adding New Whistle Keys

In `flute-tab.js`, add a new entry to `fingeringCharts`:

```javascript
'Eb': {
    'Eb4': { holes: ['X', 'X', 'X', 'X', 'X', 'X'], octave: 1 },
    // ... more fingerings
}
```

## License

MPL-2.0 (Mozilla Public License 2.0) - See LICENSE file for details.

## Credits

- ABC notation rendering by [abcjs](https://www.abcjs.net/)
- Tin whistle fingering charts based on standard Irish whistle technique
