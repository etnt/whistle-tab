/**
 * Tune Library Index
 * Add new tunes to this object. The key is the display name, the value is the ABC content.
 */
const tuneLibrary = {
    "The Humours Of Glynn": `X: 1
T: The Humours Of Glynn
R: jig
M: 6/8
L: 1/8
K: Dmaj
|:A|"D"def A2A|DFA AFA|"G"def A2A|"A"DFA B2A|
"D"def A2A|DFA AFA|"G"GBG "A"FAF|"D"EFA B2:|
|:A|"D"dfd fdB|"A"cec ecA|"D"dfd fdB|"A"AFA B2A|
[1 "D"dfd fdB|"A"cec ecA|"G"dcB "A"cAF|"D"EFA B2:|
[2 "D"dfd "A"cec|"Bm"BdB "G"AGF|GBG "A"FAF|"D"EFA B2||`,

    "D Major Scale": `X:1
T:D Major Scale
M:4/4
L:1/4
K:D
D E F G | A B c d |
d c B A | G F E D |]`,

    "The Irish Washerwoman": `X:1
T:The Irish Washerwoman
M:6/8
L:1/8
R:jig
K:G
|:D|"G"G2G GAB|"C"c2c cBA|"G"B2B Bcd|"D"e2d dBA|
"G"G2G GAB|"C"c2c cBA|"G"B2A "D"AGF|"G"G3 G2:|
|:d|"G"g2g gfe|"C"e2e edc|"G"d2d def|"D"g2f fed|
"G"g2g gfe|"C"e2e edc|"G"d2e "D"dcB|"G"c3 c2:|`,

    "The Banshee": `X:1
T:The Banshee
M:4/4
L:1/8
R:reel
K:G
|:GA|"G"B2AB GEDE|"G"GABd g2fg|"Em"edBd edBd|"D"egdB A2GA|
"G"B2AB GEDE|"G"GABd g2fg|"Em"edBd "D"egfa|"G"g2G2 G2:|`,

    "Danny Boy": `X:1
T:Danny Boy
M:4/4
L:1/8
K:G
D2|"G"G4 A2B2|"C"c4 B2A2|"G"G4 E2D2|"D7"D6 D2|
"G"G4 A2B2|"C"c4 d2e2|"G"d6 B2|"D7"A6 D2|
"G"G4 A2B2|"C"c4 B2A2|"G"G4 E2D2|"D7"D6 D2|
"G"G4 A2B2|"C"c4 d2e2|"G"d4 B2G2|"G"G6|]`,

    "John Brosnan's Polka": `X: 1
T: John Brosnan's Polka
R: polka
M: 2/4
L: 1/8
K: Dmaj
|:"D"D>E FA|Bc d2|"G"BA "D"FA|"G"BA "D"FA|"D"D>E FA|Bc d2|"G"BA "A"FE|"D"D2 D2:|
|:"D"d>c BA|Bc d2|"G"BA "D"FA|"G"BA "D"FA|"D"d>c BA|Bc d2|"G"BA "A"FE|"D"D2 D2:|`,

    "The Maid Behind The Bar": `X: 1
T: The Maid Behind The Bar
R: reel
M: 4/4
L: 1/8
K: Dmaj
|:"D"FAAB AFED|FAAF A2de|"Bm"fBBA B2de|f2af efdB|
"D"A3B AFED|FAAF A2de|"Bm"fBBA B2dB|"A"AFEF "D"D4:|
|:"D"a3g fdde|fdd2 efga|"Em"efga beef|gebe geg2|
"D"faaf def/2e/2d|defd "A"e2de|"Bm"fBBA B2dB|"A"AFEF "D"D4:|`,

    "Fáinne Geal An Lae": `X: 1
T: Fáinne Geal An Lae
R: march
M: 4/4
L: 1/8
K: Dmaj
"D"D2E2| "D"F4 F4 "Bm"F4 E2F2| "D"A4 A4 "G"B4 A2F2| "D"D4 "A"E4 "D"D4 D4| "D"D12 "A"A4|
"G"B6 A2 "G"B4 d4| "D"F6 E2 "Bm"D4 "D"F4| "D"A4 F4 "Bm"d4 "D"F4| "A"E12 A4|
"G"B6 A2 "G"B4 d4| "D"F6 E2 "Bm"D4 "D"F4| "D"A4 F4 "Bm"d4 "D"F4| "A"E12 "D"D2E2|
"D"F4 F4 "Bm"F4 E2F2| "D"A4 A4 "G"B4 A2F2| "D"D4 "Bm"F4 "A"E4 "D"D4 D4| "D"D12 z4||`,

    "The Kitchen Girl": `X: 1
T: The Kitchen Girl
N:The Kitchen Girl" is a classic old-time fiddle tune. It is unique because
N:it is "modal"—the first part (the A-part) is in A Dorian (which feels like
N:A minor but with a sharp F), and the second part (the B-part) traditionally
N:shifts to A Mixolydian (which feels like A Major but with a flat G).
R: reel
M: 4/4
L: 1/8
K: Ador
|: "Am"a4 "G"g4 | "Am"efed c2 cd | "Am"e2 f2 "G"gaba | "Em"g2 e2 e4 |
"Am"e2 a2 "G"g2 ag | "Am"efed "C"cdef | "G"g2 d2 "Em"efed | "Am"c2A2 A4 :|
|: "A"ABcA "G"BA G2 | "A"ABAG "E"E2 EG | "A"ABcd e>=f e2 |
"A"ABcA "G"BA G2 | "A"ABAG "E"E2 AB | "A"cBAc "G"BA G2 | "A"A4 A4 :|`,

    "Elsie Marley": `X: 1
T: Elsie Marley
N: "Elsie Marley" is a classic Northumbrian/Border jig. It has a bit of a "modal" feel,
N: swinging between G Major and F Major (specifically G Mixolydian), which gives it that
N: distinctive folk drive.
R: jig
M: 6/8
L: 1/8
K: Gmaj
|: "G"BAB G2G | "G"G2g gdc | "G"BAB G2G | "F"=F2=f fcA |
"G"BAB G2G | "G"g>ag gdB | "C"cac "G"BgB | "D"A2=f "F"fcA :|
|: "G"B2c d2d | "G"def gdc | "G"B2c d2d | "D"ABA "F"=fcA |
"G"B2c d2d | "G"def gdB | "C"cac "G"BgB | "D"A2=f "F"fcA :|
|: "G"G2g gdB | "G"gdB gdB | "G"G2g gdB | "F"=fgf fcA |
"G"G2g gdB | "G"gdB gdB | "C"cac "G"BgB | "D"A2=f "F"fcA :|`,

    "Miss Monaghan": `X: 1
T: Miss Monaghan
N: The Tilde (~): In ~B3A and ~d3B, the tilde represents a Roll (an Irish ornament).
N: If you are playing this on tin whistle, this is where you would do a flick of the
N: fingers to add that "crackle" to the note.
N: The Curly Braces ({E}): This is a Grace Note. It should be played very quickly
N: just before the main D note.
N: The Triplet ((3AGF): This indicates that the three notes A, G, and F should be
N: squeezed into the time of two 8th notes.
R: reel
M: 4/4
L: 1/8
K: Dmaj
|: "D"D2ED FAAd | "G"B2BA "D"FABc | "D"d2dB ABde | "D"fede "A"fee2 |
"D"{E}D2ED FAAd | "G"~B3A "D"FABc | "G"d2dB "D"ABdB | "A"(3AGF EG "D"FDD2 :|
|: "D"faab afdf | "G"gefd "A"edBc | "D"~d3B ABde | "D"fede "A"fee2 |
"D"faab afdf | "G"g2fd "A"edBc | "G"d2dB "D"ABdB | "A"(3AFE (3GFE "D"FDD2 :|`,

    "The Duke of Fife's Welcome to Deeside": `X: 1
T: The Duke of Fife's Welcome to Deeside
C: J. Scott Skinner
N: This is a fantastic Scottish bagpipe-style march!
N: It was written by the legendary fiddler J. Scott Skinner.
N: Because it is a "March," the rhythm is very crisp, and it often uses
N: those "snappy" dotted notes (often called the Scottish Snap).
R: March
M: 4/4
L: 1/8
K: G
% --- A-PART ---
|: "G"D2 | "G"G2 G2 G2 AB | "D"A/B/A/G/ "G"G2 G2 AB | "C"c2 de "G"dB Gg | "G"dB GB "D"A2 D2 |
"G"G2 G2 G2 AB | "D"A/B/A/G/ "G"G2 G2 AB | "C"c/B/c/d/ "D"ef "G"gd "D"BA | "G"G4 G2 :|
% --- B-PART ---
|: "G"Bc | "G"d2 d2 d2 ef | "G"gf ed "C"c2 Bc | "G"d2 de "Em"dB Gg | "G"dB GB "D"A2 Bc |
"G"d2 d2 d2 ef | "G"gf ed "C"c2 Bc | "G"dB "C"ec "D"dB "D"cA | "G"G4 G2 :|`
};
