# ABC to Sheet Music with Flute/Tin Whistle Tablature

[![GitHub Release](https://img.shields.io/github/v/release/etnt/whistle-tab?style=flat-square)](https://github.com/etnt/whistle-tab/releases/latest)
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

A web-based application that converts ABC musical notation into standard
sheet music with an additional tin whistle (Irish flute) tablature display.

## Features

- **ABC Notation Parser**: Enter ABC notation and see it rendered as standard sheet music
- **Tin Whistle Tablature**: Automatically generates fingering diagrams below the staff
- **Audio Playback**: Play your tunes with a flute sound
- **Adjustable Speed**: Control playback tempo from 50% to 150%
- **Multiple Whistle Keys**: Support for D, C, G, Bb, F, Eb, and A whistles
- **Example Tunes**: Built-in examples including scales, jigs, reels, and airs
- **Live Preview**: Music updates as you type
- **Export to PNG**: Save your sheet music with tablature as an image

## Quick Start

### Option 1: Use Online (Easiest)

Visit the live version at: **https://etnt.github.io/whistle-tab/**

No download or installation required!

### Option 2: Download and Run Locally

1. **[⬇️ Download Latest Release](https://github.com/etnt/whistle-tab/releases/latest/download/whistle-tab.zip)**
2. Extract the zip file to a folder
3. Open `index.html` in a web browser
4. Enter ABC notation in the text area
5. Select your whistle key
6. The sheet music and tablature will render automatically

## ABC Notation Basics

ABC notation is a text-based music notation system. Here's a quick reference:

### Headers
```
X:1          - Tune number
T:Tune Name  - Title
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
