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
| D E F G | A B c d | c B A G | F E D> |`,

    "G Major Scale": `X:1
T:G Major Scale
M:4/4
L:1/4
K:G
| G A B c | d e f g | f e d c | B A G> |`,

    "A Major Scale": `X:1
T:A Major Scale
M:4/4
L:1/4
K:A
| A B c d | e f g a | g f e d | c B A> |`,

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
"G"d2 d2 d2 ef | "G"gf ed "C"c2 Bc | "G"dB "C"ec "D"dB "D"cA | "G"G4 G2 :|`,

    "Temperance Reel": `X: 1
T: The Temperance Reel
T: The Teetotaller
N: Play it with a Speed of 120 percent!
R: reel
M: 4/4
L: 1/8
K: Dmaj
% --- PART A ---
P: A
|: "D" d2 AF DFAF | "G" G2 BG dGBG | "D" d2 AF DFAF | "A" GFEG "D" FDDA |
"D" d2 AF DFAF | "G" G2 BG dGBG | "D" F2 AF "G" G2 BG | "A" AFGE "D" FD D2 :|
% --- PART B1 (Standard) ---
P: B1
|: "D" f2 df afdf | "A" e2 ce gece | "D" f2 df afdf | "A" edce "D" d2 de |
"D" f2 df afdf | "A" e2 ce gece | "D" d2 dB "G" AF G2 | "A" AFGE "D" FD D2 :|
% --- PART Br (The Bridge) ---
P: Br
"^Bridge"
| "Bm" B2 Bc d2 de | "F#m" f2 fe d2 c2 | "G" B2 Bc d2 dB | "A" AFGE "D" F D3 |
| "Bm" B2 Bc d2 de | "F#m" f2 fg a2 f2 | "G" g2 ge "A" a2 af | "A7" gfed "D" cABc |
% --- PART B2 (Variation) ---
P: B2
"^Variation"
|: "D" fedf afdf | "A" edce gfed | "D" fedf afdf | "A" edce "D" d2 (3efg |
"D" afdf "G" gfeg | "A" fedf "Em" edBc | "G" d2 dB "D" AFGB | "A" AFGE "D" FD D2 :|`,

    "The Green Fields of America": `X: 1
T: The Green Fields of America
R: reel
M: 4/4
L: 1/8
K: G
% --- PART A ---
P: A
|: "G"c2 AB cBAG | "D"AGAB "G"G2 AB | "C"c2 AB cBAG | "D"EAAG "Am"A2 AB |
|  "C"c2 AB cBAG | "D"AGAB "G"G2 AB | "C"cE E2 "G"GEDE | "D"G2 GA "G"G4 :|
% --- PART B ---
P: B
|: "G"G2 GA Bdeg | "C"abag "G"e2 d2 | "G"g2 ga "Em"gedB | "D"dega "G"ba a2 |
|  "G"bage "D"d2 ef | "G"gage "Em"dBGB | "C"cE E2 "G"GEDE | "D"G2 GA "G"G4 :|`,

    "Old Mother Flanagan": `X: 1
T: Old Mother Flanagan
R: reel
M: 4/4
L: 1/8
K: D
% --- PART A ---
P: A
|: "D"defg a2 a2 | "G"bagf "A"e2 A2 | "D"defg a2 a2 | "G"ba"A"bc' "D"d'2 d'2 |
|  "D"defg a2 a2 | "G"bagf "A"e2 A2 | "D"d2 dB "G"AF G2 | "A"AFGE "D"FD D2 :|
% --- PART B ---
P: B
|: "D"A2 AB A2 FG | "A"AF E2 "D"D4 | "D"A2 AB A2 FA | "G"B2 d2 "A"e4 |
|  "D"A2 AB A2 FG | "A"AF E2 "D"D4 | "D"d2 dB "G"AF G2 | "A"AFGE "D"FD D2 :|`,

    "Red Haired Boy": `X: 1
T: Red Haired Boy
T: The Little Beggarman
R: reel
M: 4/4
L: 1/8
K: D
% --- PART A ---
P: A
|: "A"E2 AA ABAG | "G"EDEF G2 FG | "A"ABcd efge | "G"afge "D"d2 cd |
|  "A"e2 AA ABAG | "G"EDEF G2 FG | "A"ABcd efge | "G"afge "A"A4 :|
% --- PART B ---
P: B
|: "G"g2 gg gfed | "A"efge "D"a2 f2 | "A"efge "D"afge | "G"dBGB "D"d2 cd |
|  "A"e2 AA ABAG | "G"EDEF G2 FG | "A"ABcd efge | "G"afge "A"A4 :|`,

    "The Derry Air": `X: 1
T: The Derry Air
N: Play it slow by decreasing the speed to about 70 percent.
R: air
M: 4/4
L: 1/8
K: Gmaj
F GA|"G"B3A "G7"Be dB|"C"AGE2zG"Cm" Bc|"Bm"d3e "Em" dB GB|"A7"A4z "D7"F GA|
"G"B3A "G7"Be dB|"C"AGE2zF "Cm"GA|"Bm"B3"Em"c "A7"BA "D7"GA|"G"G4z d "D7"ef|
"G"g3f "C"fe de|"Bm"dB"Em"G2z"Am"d "B7"ef|"Em"g3f "C"fe "Bm"dB|"A7"A4z "D7"d dd|
"G7"b3a "C"ag eg|"Bm"dB"Em"G2z"Cm"F GA|"Bm"Be "Em"dB "A7"AG "D7"EF|"G Cm G"G4z||`,

    "The Fairy Lament": `X: 1
T: Port Na bPúcai
T: The Fairy Lament
N: Port Na bPúcai (The Song of the Fairies or Spirit of the Ghosts)
N: is a haunting slow air from the Blasket Islands off the coast of Kerry.
N: Legend says it was heard by a fisherman drifting at sea—either the wind
N: whistling through the hull of his boat or the singing of the fairies themselves.
R: Air
Q: 60
M: 3/4
L: 1/8
K: D
% --- SECTION A ---
|: "D"D3 E F2 | "G"G2 F2 E2 | "D"D4 F2 | "A"A6 |
|  "G"B3 c d2 | "D"A2 F2 D2 | "Em"E2 G2 F2 | "A"E6 |
|  "D"D3 E F2 | "G"G2 F2 E2 | "D"D4 F2 | "A"A4 Bc |
|  "G"d2 A2 F2 | "Em"G2 F2 E2 | "D"D6- | D6 :|
% --- SECTION B ---
|: "D"A3 B d2 | "G"B2 A2 F2 | "D"A4 B2 | "D"A6 |
|  "G"B3 c d2 | "D"A2 F2 D2 | "Em"E2 G2 F2 | "A"E6 |
|  "D"D3 E F2 | "G"G2 F2 E2 | "D"D4 F2 | "A"A4 Bc |
|  "G"d2 A2 F2 | "Em"G2 F2 E2 | "D"D6- | D6 :|`,

    "Fáinne Geal An Lae": `X: 1
T: Fáinne Geal An Lae
T: The Dawning of the Day
R: march
M: 4/4
L: 1/8
K: Dmaj
"D"D2E2 | "D"F4 F4 "G"F4 "D"E2F2 | "D"A4 A4 "G"B4 "D"A2F2 | "D"D4 "A"E4 "D"D4 D4 | "D"D12 "A"A4 |
"G"B6 A2 "G"B4 "Bm"d4 | "D"F6 E2 "G"D4 "D"F4 | "D"A4 "Bm"F4 "G"d4 "D"F4 | "A"E12 "A"A4 |
"G"B6 A2 "G"B4 "Bm"d4 | "D"F6 E2 "G"D4 "D"F4 | "D"A4 "Bm"F4 "G"d4 "D"F4 | "A"E12 "D"D2E2 |
"D"F4 F4 "G"F4 "D"E2F2 | "D"A4 A4 "G"B4 "D"A2F2 | "D"D4 "D"F4 "A"E4 "D"D4 | "D"D12 z4 |]`,


    "The Wearing Of The Green": `X: 1
T: The Wearing Of The Green
R: march
M: 4/4
L: 1/8
K: Dmaj
DE| "D"FFFE "D"FAAF | "A"FEEF E3 A | "G"BGdc "D"BAFD | "A"EDDE "D"D2 DE |
"D"FFFE "D"FAAF | "A"FEEF E3 A | "G"BGdc "D"BAFD | "A"EDDE "D"D2 dc ||
"D"BAAF "D"AFDE | "D"FFFE F2 dc | "D"BAAF "D"AFDE | "A"FEEF E2 DE |
"D"FFFE "D"FAAF | "A"FEEF E3 A | "G"BGdc "D"BAFD | "A"EDDE "D"D4 ||`,

    "Sliabh Geal gCua": `X: 1
T: Sliabh Geal gCua
T: The Bright Mountains of Cua
R: hornpipe
M: 4/4
L: 1/8
Q: 80
K: Dmaj
f>g | "D"a3 g ("A"f>age) | "D"f3 e ("Bm"dcA>B) | "C"=c2 "G"d4 (fe) | ("D"d>cAF) "G"G2 (FG) |
"D"(Add>e) f2 (fg) | "D"a3 g ("A"f>age) | "D"f3 e ("Bm"dcA>B) | "C"=c2 "G"d4 (fe) | ("D"d>cAF) "G"G2 (FG) |
"D"(Add>c) d3 A | "D"(d>ef>g) "D"a a2 a | "D"(a>bag/f/) "D"f a2 f | "G"(f>ge>c) "A"d e2 d |
"A"(cAA>A) A2 (fg) | "D"a3 g ("A"f>age) | "D"f3 e ("Bm"dcA>B) | "C"=c2 "G"d4 (fe) | ("D"d>cAF) "G"G2 (FG) | "D"(Add>c) d4 ||`,

    "The Butterfly": `X: 1
T: The Butterfly
R: slip jig
M: 9/8
L: 1/8
K: Em
% --- SECTION A ---
P: A
|: "Em" B2E G2E F3 | "Em" B2E G2E "D" FED | "Em" B2E G2E F2A | "G" B2d d2B "D" AFD :|
% --- SECTION B ---
P: B
|: "Em" B2d e2f g3 | "Em" B2d g2e "D" dBA | "Em" B2d e2f g2a | "G" b2a g2e "D" dBA :|
% --- SECTION C ---
P: C
|: "Em" B2B B2A G2A | "Em" B2B BAB "D" dBA | "Em" B2B B2A G2A | "G" B2d g2e "D" dBA :|`,

    "The Cool of the Day": `X: 1
T: The Cool of the Day
R: Air
M: 4/4
L: 1/8
K: Dmin
% --- SECTION A ---
|: "Dm" D2 f2 "C" e3 d | "Dm" f2 g2 "Am" a4 | "Gm" g2 f2 "C" e2 d2 | "Dm" f2 d2 "Am" A4 |
| "Dm" D2 f2 "C" e3 d | "Dm" f2 g2 "Am" a4 | "Gm" g2 f2 "Am" e3 d | "Dm" d8 :|
% --- SECTION B ---
|: "Dm" a2 d'2 "Am" c'3 a | "Gm" g2 a2 "C" c'4 | "Dm" d'2 c'2 "Am" a2 g2 | "Dm" f2 g2 "Am" a4 |
| "Dm" a2 d'2 "Am" c'3 a | "Gm" g2 a2 "C" c'4 | "Am" a2 g2 "Gm" f2 e2 | "Dm" d8 :|`,

    "The Kesh Jig - Amaj": `X: 6
T: The Kesh Jig
R: jig
M: 6/8
L: 1/8
K: Amaj
e|:"A"A3 ABc|"E"B3 Bce|"A"fee aee|"D"fec "E"ecB|
"A"A3 ABc|"E"B3 Bce|"A"fee aec|"E"BcB "A"A3:|
|:"A"c3 ece|"D"(3fgaf "A"ecA|"A"c3 ecA|"E"BcB BAB|
"A"c3 ece|"D"(3fgaf "A"ece|"D"a(3fga "E"bab|"E"c'ag "A"a3:|`,

    "The Kesh Jig - Gmaj": `X: 1
T: The Kesh Jig
C: (Arr. www.oaim.ie)
R: jig
M: 6/8
L: 1/8
K: Gmaj
|: "G"G3 GAB | "D"ABG ABD' | "C"edd "G"gdd | "C"edB "D"dBA |
| "G"G3 GAB | "D"ABG ABD' | "C"edd "D"gdB |[1 "D"AGF "G"G2 D :| [2 "D"AGF "G"G2 A |]
|: "G"B2 G d2 d | "C"ege "G"dBA | "G"BAB dBG | "D"ABA AGA |
| "G"B2 G d2 d | "C"ege "G"d2 a | "G"gfg "D"afa |[1 "D"bgf "G"g2 d :| [2 "D"bgf "G"g3 |]`,

    "Down By The Sally Gardens": `X: 6
T: Down By The Sally Gardens
R: reel
M: 4/4
L: 1/8
K: Gmaj
|:GA|"G"B2 AG "D" A2 Bd|"C"e4 "G"d2 gd|"C"e2 dB "D" A3 G|"G"G5:|
d2|"Em"g2 fd e2 g2|"Bm"f4 d2 Bd|"C"e2 dB "D"dega|"G"g5 GA|
"G"B2 AG "D"A2 Bd|"C"e4 "G"d2 gd|"C"e2 dB "D" A3 G|G5||`,

    "The South Wind": `X: 1
T: The South Wind
R: Air
M: 3/4
L: 1/8
K: Gmaj
dc| "G"B3A G2 | "G"B3c d2 | "D"A4 B2 | "D"A4 dc |
"G"B3A G2 | "C"E3D E2 | "G"G6-| "G"G2 z2 dc |
"G"B3A G2 | "G"B3c d2 | "D"A4 B2 | "D"A4 dc |
"G"B3A G2 | "C"E3D E2 | "G"G6-| "G"G2 z2 (3def |
"G"g3a f2 | "Em"g3f e2 | "G"d4 e2 | "D"d4 c2 |
"G"B3A G2 | "G"B3c d2 | "D"A4 B2 | "D"A2 z2 (3def |
"G"g3a f2 | "Em"g3f e2 | "G"d4 e2 | "D"d4 c2 |
"G"Bd3 G2 | "D"Ac3 F2 | "G"G6-| "G"G2 z2 ||`,

    "The Foggy Dew": `X: 2
T: The Foggy Dew
R: waltz
M: 3/4
L: 1/8
K: Emin
B2 d2|"Em"e2 d2 B2|"Em"e3 d B2|"G"A2 B2 G2|"D"D3 E F2|"G"G3 B AG|"Em"E4 "D"D2|"Em"E6-|"Em"E2 g2 f2|
"Em"e3 d B2|"Em"ed- d2 B2|"D"A4 G2|"D"D4 F2|"G"G2 B2 G2|"B7"E4 ^D2|"Em"E6-|"Em"E2||
"Em"E2 F2|"G"G4 BG|"G"d/e/d c2 B2|"D"A3 G A2|"G"B4 GA|"Em"B2 g3 f|"Em"e3 d B/c/d|"Em"e6-|"Em"e2 B2 g2|
"Em"e2 d2 B2|"G"g3 b ag|"Em"e3 d BG|"D"D4 D/E/F|"G"G3 B AG|"B7"E4 ^D2|"Em"E6-|"Em"E2||`,

    "Marion MacLean Of Eoligarry": `X: 1
T: Marion MacLean Of Eoligarry
R: waltz
M: 3/4
L: 1/8
K: Dmaj
|:FE| "D"D3EFA | "A"E4 FE | "D"D2 d2 c2 | "G"B3B dB | "D"AGFD AF |
"A"E4 DE | "D"F3G F2 | "A"E4 FE | "D"D3E FA | "A"E4 FE |
"Bm"D2 d2 c2 | "G"B3B AG | "D"FGA2 F2 | "A"E6 | "D"D6 :|
"D"fga3 d | "A"fe4 | "Bm"fed2 c2 | "G"A2 B3 B | "D"AGFA d2 |
"A"f2 e4 | "G"dcBd f2 | "G"b2 "A"a4 | "D"fga3 d | "A"fge4 |
"Bm"fed2 c2 | "G"A2 B4 | "D"AGFGA2 | "A"F2 E4 | "D"D6 |
"D"fga3 d | "A"fe4 | "Bm"fed2 c2 | "G"A2 B3 B |
"D"AGFA d2 | "A"f2 e4 | "G"dcBd f2 | "G"b2 "A"a4 |
"D"AGF3 E | "D"FGA4 | "G"Bcd2 c2 | "G"A2 B4 |
"D"AGFGA2 | "A"F2 E4 | "D"D6 |`,

    "The Blarney Pilgrim": `X: 1
T: The Blarney Pilgrim
R: jig
M: 6/8
L: 1/8
K: Dmix
|: "D"DED DEG | "D"A2A ABc | "G"BAG "D"AGE | "C"GEA "D"GED |
"D"DED DEG | "D"A2A ABc | "G"BAG "D"AGE | "C"GED "D"D3 :|
|: "G"ded dBG | "D"AGA "G"BGE | "G"ded dBG | "D"AGA "G"GAB |
"G"g2e dBG | "D"AGA "G"BGE | "G"B2G "D"AGE | "C"GED "D"D3 :|
|: "D"A2D "G"B2D | "D"A2D ABc | "G"BAG "D"AGE | "C"GEA "D"GED |
"D"ADD "G"BDD | "D"ADD ABc | "G"BAG "D"AGE | "C"GED "D"D3 :|`,

    "Caoineadh Na dTri Muire": `X: 2
T: Caoineadh Na dTri Muire
R: Air
M: 3/4
L: 1/8
K: Gmaj
|: "G"G>(E | "D"D4) EG | "D"A4 GA | "G"B4 ~AG | "C"E<(G G4) |
"Am"c4 A<(d | "G"d4) ~e2 | "G"d2 B>G ("D"A2 | "D"A4) GA |
"G"B<(d d2) ~e2 | "G"d4 BA | "Em"G4 ~ED | "C"E<(G G4) |
"G"B4 ~A2 | "Em"G4 ~E2 | "C"D2 E<G "D"~A2 | "G"~G4 :|
"variant 4th measure"| "D"E<(D D4) |`,

    "Wild Mountain Thyme": `X:1
T:Wild Mountain Thyme
T:Will Ye Go, Lassie, Go?
C: (Arr. Scott's Low D)
M:4/4
L:1/8
Q:1/4=100
K:G
|: D2 | "G"G3 A "G/B"B2 G2 | "C"(B3 A) "G"B2 d2 | "C"e4 "G"d2 (Bd) | "C"(e3 f) "G"g2 (fe) |
"G"d3 B "Em"d2 e2 | "G"(B3 A) "Em"G2 B2 | "Am7"A3 G "C"E2 G2 | "D7"(A3 B) "D"A2 D2 |
"G"G3 A "G/B"B2 G2 | "C"(B3 A) "G"B2 d2 | "C"e4 "G"d2 (Bd) | "C"(e3 f) "G"g2 (fe) |
"G"d3 B "Em"d2 e2 | "G"(B3 A) "Em"G2 B2 | "Am7"A3 G "C"E2 G2 | "D7"(A3 B) "G"A2 :|`,

    "Amazing Grace": `X: 1
T: Amazing Grace
R: air
M: 3/4
L: 1/8
Q: 80
K: G
D2 | "G"G4 (BG) | "G"B4 (AG) | "C"E4 D2 | "G"D4 D2 |
"G"G4 (BG) | "G"B4 (AB) | "D"d4- d2 | "D"d4 B2 |
"G"d4 (BA) | "G"G4 (ED) | "C"E4 G2 | "G"G4 D2 |
"G"G4 (BG) | "D"B4 (AG) | "G"G4- G2 | "G"G4 |]`,

    "Carolan's Welcome": `X: 4
T: Carolan's Welcome
R: waltz
M: 3/4
L: 1/8
K: Gmaj
BA | "G"G2 Bc d2 | "G"G2 Bc d2 | "C"cd cB AG | "D"F/G/A F2 D2 |
"G"B3A G2 | "Am"c3B A2 | "G/B"Bd "D"D2 F2 | "G"G4 BA |
"G"G2 Bc d2 | "G"G2 Bc d2 | "C"cd cB AG | "D"F/G/A F2 D2 |
"D"f3e d2 | "Em"g3f "C"dc | "G"Bd "D"cB AB | "G"G4 ||
dc | "G"d2 ga b2 | "G"d2 ga b2 | "D"ba gf ga | "G"b2 d2 d2 |
"C"e2 ge dc | "G"d2 fd cB | "Am"c2 "D"d2 f2 | "G"g4 g2 |
"G"gf df g2 | "D"fd cd f2 | "G"dc Bc dB | "F"c2 A2 F2 |
"G"B3A G2 | "Am"c3B A2 | "G/B"Bd "D"D2 F2 | "G"G4 ||`,

    "Sí Bheag Sí Mhór": `X: 1
T: Sí Bheag Sí Mhór
R: waltz
M: 3/4
L: 1/8
K: Dmaj
de|: "D"f3e d2 | "D"d2 de d2 | "G"B4 A2 | "D"F4 A2 |
"G"BA Bc d2 | "Em"e4 de | "D"f2 f2 "A"e2 | "D"d4 f2 |
"G"B4 "A"e2 | "D"A4 "Bm"d2 | "D"F4 "A"E2 | "D"D4 e2 |
"G"B4 "Em"e2 | "A"A4 dc | "D"d6 | "D"d4 de :|
|: "D"f2 fe d2 | "A"ed ef a2 | "G"b4 a2 | "D"f4 ed |
"A"e4 a2 | "D"f4 e2 | "G"d4 B2 | "D"A4 BA |
"D"F4 "A"E2 | "D"D4 f2 | "G"B4 "Em"e2 | "D"A4 a2 |
"G"ba gf "D"ed | "A"e4 dc | "D"d6 |1 "D"d4 de :|2 "D"d6 ||`,

    "Kitty's Wedding": `X: 5
T: Kitty's Wedding
R: hornpipe
M: 4/4
L: 1/8
K: Dmaj
|:fe|"D"d2Bd A2FA|"A"BAFA "D"D2 ed|"G"BdAB "D"dfbf|"Em"afdf "A"e2fe|
"D"d2Bd A2FA|"A"BAFA "D"D2 ed|"G"BdAB "D"dfbf|"A"afef "D"d2:|
|:fg|"D"afed "G"bafd|"D"Adfd "G"edBd|"D"DFAd "Bm"FAde|"Em"fdgf "A"e2fg|
"D"afed "G"bafd|"D"Adfd "G"edBd|"D"DFAd "Bm"FAdf|"A"eABc "D"d2:|`,

    "MacLeod's Farewell": `X: 1
T: MacLeod's Farewell
R: reel
M: 4/4
L: 1/8
K: Dmaj
|:DE|"D"F2BF AFEF|"D"D2 DE FABd|"G"e2 fd efdB|"G"ABde dBAG|
"Bm"F2BF AFEF|"Bm"D2 DE FABd|"G"e2fd efdB|1 "A"ABd"D"e d2:|2 "A"ABde "D"d3||
B|"D"A3 f edfd|"D"A3 f edfd|"G"ABdA BdAB|"G"dBAF E2 DE|
"Bm"F2BF AFEF|"Bm"D2DE FABd|"G"2e2fd efdB|1 "A"ABde "D"d3:|2 "A"ABd"D"e d2||`,

    "Denis Murphy's": `X: 1
T: Denis Murphy's
R: slide
M: 12/8
L: 1/8
K: Dmaj
|: "D"A2D FED F2A A2f | "G"gfe "D"fed "A"e2d BdB |
"D"A2D FED F2A A2f | "D"a2f "A"efe "D"d3 d3 :|
|: "D"d2e f3 "G"gf"D"e f3 | "G"gfe "D"fed "A"e2 d BdB |
"D"d2e f3 "G"gf"D"e f2f | "D"a2f "A"efe "D"d3 d3 :|`,

    "The Flowers Of Edinburgh": `X: 5
T: The Flowers Of Edinburgh
R: reel
M: 4/4
L: 1/8
K: Gmaj
D2|: "G"G2 DG B2 GB | "G"d2 B2 "C"g3 e | "G"d2 B2 "D"BAGA | "G"B2 G2 "Em7"E2 D2 |
"G"G2 DG B2 GB | "G"d2 B2 "C"g3 e | "D"d2B2 "D"BAGA | "D"B2 G2 "G"G2 ||
f2| "G"g4 "D"f3 e | "Em7"B2 e2 e3 f | "G"g2 g2 "D"fafd | "Em7"B2 e2 e2 ge |
"G"dBGB d2 d2 | "C"edef "G"g2 fe | "D"d2 B2 "D"BAGA | "D"B2 G2 "G"G2 :||`,

    "Sliabh Na mBan": `X: 1
T: Sliabh Na mBan
T: The Mountain of the Women
R: waltz
M: 3/4
L: 1/8
K: Gmaj
DF |: "G"G4 cA | "D"B4 AF | "G"G4 Bd | "C"g4 a2 | "G"(3gfe f2 {c}d2 | "Am"AB c2 Bc |
"G"d3 e dc | "D"AB "G"G4 |1 "C"Bd c3 B | "D"A4 DE/F/ :|2 "D"cB A G2 F | "G"G4 A/B/d ||
"G"g2 B2 de | "C"fe e2 d2 | "Am"ca "G"B4- | "D"B4 AF | "G"G3 A Bd | "G"g2 B2 de |
"D"f2 fe f2 | "D7"fe d4 | "D"z2 D2 EF | "G"G4 cA | "D"B4 AF | "G"G4 Bd |
"C"g4 a2 | "G"ge f2 d2 | "Am"AB c2 Bc | "G"d3 e dc | "D"AB "G"G4 | "G"GFG2 ||`,

    "Casadh An tSúgáin": `X: 6
T: Casadh An tSúgáin
T: The White Blanket
N: See YouTube: Low Whistle Slow Air - Casadh an tsúgáin - Chris McMullan
R: hornpipe
M: 4/4
L: 1/8
K: Gmaj
M:3/4
(G>AB|c4 E2|G4 ED|EG-G4-|G3) (GAB|c4 A>c|B4 A2|G4 ED|E6-|E4) D2|
E2 G4|A4 B2|d4 BA|B2 G4-|G4 E2|D4 E2|G4 G2|G6-|G3||
(GBd|e4 d2|e g3 e2|d4 e2|d4 BA|G4) (AB|c4 dc|B4 A2|G4 ED|E6-|E4) D2|
E2 G4|A4 B2|d4 BA|B2 G4-|G4 E2|D4 E2|G4 G2|G6-|G3||`


};
