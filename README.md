# ABC to Sheet Music with Flute/Tin Whistle Tablature

A web-based application that converts ABC musical notation into standard
sheet music with an additional tin whistle (Irish flute) tablature display.

## Features

- **ABC Notation Parser**: Enter ABC notation and see it rendered as standard sheet music
- **Tin Whistle Tablature**: Automatically generates fingering diagrams below the staff
- **Multiple Whistle Keys**: Support for D, C, G, Bb, F, Eb, and A whistles
- **Example Tunes**: Built-in examples including scales, jigs, reels, and airs
- **Live Preview**: Music updates as you type
- **Export to PNG**: Save your sheet music with tablature as an image

## Quick Start

### Option 1: Use Online (Easiest)

Visit the live version at: **https://etnt.github.io/whistle-tab/**

No download or installation required!

### Option 2: Download and Run Locally

1. Download the latest release zip from the [Releases page](../../releases)
2. Extract the zip file to a folder
3. Open `index.html` in a web browser
4. Enter ABC notation in the text area
5. Select your whistle key
6. The sheet music and tablature will render automatically

## Examples

This is how the [index.html](D-maj-scale.png) page looks like.

It is possible to export the result to a PNG file, like [this](humorous-of-glynn.png).

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
