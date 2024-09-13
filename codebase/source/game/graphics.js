/////////////////////////////////////////////////////
// Graphical Drawing Functions
/////////////////////////////////////////////////////

//Simple canvas draw functions
function drawB(x, y, wd, ht, c) {
    cx.fillStyle = c;
    cx.fillRect(x*w, y*h, wd*w, ht*h);
}
function drawO(x, y, wd, ht, ty) {
    cx.beginPath();
    if(ty == 0) {
        cx.strokeStyle = '#212';
        cx.lineWidth = 4;
        cx.setLineDash([0, 0]); } 
    else {
        cx.strokeStyle = c4;
        cx.lineWidth = 5;
        // Dashed line (5px dash, 5px gap)
        cx.setLineDash([5, 5]); }
    cx.rect(x*w, y*h, wd*w, ht*h);
    cx.stroke();
    cx.setLineDash([]);
}

// Draws NPC Actor Art
function drawNPC(i, x, y) {
    if(i==1) {
        drawB(x, y, 0.065, .13, c2); //grey backing
        // drawB(190, 15, 70, 70, '#001'); //grey backing
        // drawB(190, 32, 40, 20, '#8888FFAA'); //grey pad
        // drawB(198, 18, 55, 56, '#5555FFAA'); //grey pad
        // drawB(214, 42, 45, 20, '#8888FFAA'); //grey pad
        // drawB(195, 48, 10, 14, '#5555FFAA'); //ear
        // drawB(223, 46, 10, 10, '#FFA50066'); //glasses1
        // drawB(238, 46, 10, 10, '#FFA50066'); //glasses2
        // drawB(198, 75, 50, 10, '#FFFFFFAA'); //white basis
        
        uiS[2].updatePOS(x, y);
        uiS[2].render();
        // cx.drawImage(spriteActors[4], 192, 17, 66, 66);
        // drawO(190, 15, 70, 70, 0);
    } else if (i==2) {
        drawB(x, y, 0.065, .13, c2); //grey backing
        // drawB(190, 32, 40, 20, '#8888FF77'); //light blue back
        // drawB(198, 19, 52, 56, '#AA55AAAA'); //darker blue
        // drawB(206, 41, 40, 22, '#FF88AA77'); //light blue front
        // drawB(195, 38, 10, 18, '#AA55FFAA'); //ear
        
        // gpc.drawB(cx,    223, 46, 10, 10, '#FFA50066'); //glasses1
        // gpc.drawB(cx,    238, 46, 10, 10, '#FFA50066'); //glasses2
        
        // drawB(194, 74, 57, 12, '#FF5588CC'); //white basis
        
        uiS[3].updatePOS(x, y);
        uiS[3].render();
        // cx.drawImage(spriteActors[1], .417, .016, .065, .12);
        // drawOutline(190, 15, 70, 70, 0);
    } else if (i==3) {
        drawB(x, y, 0.065, .13, c2); //grey backing

        uiS[4].updatePOS(x, y);
        uiS[4].render();
    } else if (i==4) {
        drawB(x, y, 0.065, .13, c2); //grey backing

        uiS[17].updatePOS(x, y);
        uiS[17].render();

    }

}

function renderSuits(x,y, n) {
    let s = 4;
    cx.drawImage(spriteIcons[n], w*x, h*y, 9*s, 12*s);
}

// 9x12 Card Graphics
function genMiniCards(p, s) {
    
    cx.globalAlpha = 0.8;
    cg.clearRect(0, 0, p, s);
    //Borders
    cg.fillStyle = c7;
    cg.fillRect(1, 0, p-2, s);
    cg.fillRect(0, 1, p, s-2);
    //Card
    cg.fillStyle = c2; // change this for negative? 
    cg.fillRect(1, 1, p-2, s-2);

    const saveBacking = cg.canvas.toDataURL("image/png"); 
    const imgBacking = new Image();
    imgBacking.src = saveBacking;

    setTimeout(() => {
        for (let i = 0; i <= 7; i++) {
            sprM[i] = new Image();    
            cg.clearRect(0, 0, p, s);

            cg.drawImage(imgBacking, 0, 0);
            if(i <= 3) {
                //Suit
                // 0 SPD
                // 1 HRT
                // 2 CLB
                // 3 DMD
                cg.drawImage(spriteIcons[i], 2, 3, 5, 6);
            } else if ( i == 4) { //null
                cg.fillStyle = c7;
                cg.fillRect(2, 5, 3, 2);
                cg.fillStyle = c6;
                cg.fillRect(5, 5, 2, 2);
            } else if ( i == 5) { //blank
            } else if ( i == 6 || i == 7) { //back of card & deck
                let j = 0; // for deck card shift
                if(i == 7) { // deck
                    j = 1;                    
                    cg.canvas.width = p+2;
                    cg.canvas.height = s+2;
                    // cg.canvas.style.width = p*10 + 'px';
                    // cg.canvas.style.height = s*10 + 'px';
                    cg.fillStyle = '#112'; //deck outline
                    cg.fillRect(0, 0, p+2, s+2);
                    cg.fillStyle = '#001'; //deck side
                    cg.fillRect(0, 0, 1, s+2);
                    cg.fillRect(0, s+1, p+2, 1);
                    //redraw Borders over darker
                    // cg.fillStyle = '#444';
                    cg.fillStyle = c4;
                    cg.fillRect(1+j, 0+j, p-2, s);
                    cg.fillRect(0+j, 1+j, p, s-2);
                    cg.fillStyle = c5; //darker
                } else {
                    cg.fillStyle = c7;
                    //redraw Borders over darker
                    // cg.fillStyle = '#444';
                    cg.fillRect(1+j, 0+j, p-2, s);
                    cg.fillRect(0+j, 1+j, p, s-2);
                    cg.fillStyle = c4; //darker
                }
                //Card center
                cg.fillRect(2+j, 1+j, p-4, s-2);
                cg.fillRect(1+j, 3+j, p-2, s-6);
                // cg.fillStyle = '#333'; //darkest
                cg.fillStyle = c7; //darkest
                cg.fillRect(2+j, 3+j, p-4, s-6);
                cg.drawImage(sprN[0], 0+j, 0+j, 9, 12);
            }
            //return base 64 image data
            let imgCard = cg.canvas.toDataURL("image/png");
            sprM[i].src = imgCard;
        }
    }, 200);


    setTimeout(() => {
        
        cg.globalAlpha = 0.1;
        //generate background
        // ctp.drawImage(spriteIcons[3], 2, 3, 5, 6);
        let gridSizeX = 60;
        let gridSizeY = 40;
        let gap = 2, xO=0;
        let b = false;
        cg.canvas.width = (5 * gridSizeX) + (gap * (gridSizeX - 1));
        cg.canvas.height = (6 * gridSizeY) + (gap * (gridSizeY - 1));
        for (let row = 0; row < gridSizeX; row++) {
            if(b) {
                xO = 2.5;
                b = false;
            } else {
                xO = 0;
                b = true;
            }
            for (let col = 0; col < gridSizeY; col++) {
                // Calculate the x and y position for the current sprite
                const x = (col * (5 + gap));
                const y = row * (6 + gap);
        
                // let s = generateNumber(rng, 0, 3);
                // Draw the sprite at the calculated position
                cg.drawImage(spriteIcons[0], x+xO, y, 5, 6);
            }

        }
        const saveBG = cg.canvas.toDataURL("image/png"); 
        bg.src = saveBG;
        
    }, 400);

    cg.globalAlpha = 1.0;
}

// Convert a string to numbered indexes
function strToIndex(str) {
    str = (str.toString()).toLowerCase();
    let positions = Array.from(str).map(char => {
        //handle characters
        if (char >= 'a' && char <= 'z') {
            //overrides for specials
            if (char == 'm') {return -450;}
            if (char == 'q') {return -460;}
            if (char == 'w') {return -470;}
            return char.charCodeAt(0) - 'a'.charCodeAt(0);
        } else if (char >= '0' && char <= '9') {
            return 26 + (Number(char));}
        else if (char == '.') {return 36;}
        else if (char == '!') {return 37;}
        else if (char == '?') {return 38;}
        else if (char == '-') {return 39;}
        else if (char == '|') {return 40;}
        else if (char == ':') {return 41;}
        else if (char == '_') {return 42;}
        else if (char == '(') {return 43;}
        else if (char == ')') {return 44;}
        else if (char == '%') {return -480;}
        else {return -1;}//everything else, represent with -1
         
    });

    return positions;
}

function renderFont(x, y, w, h, s, fntA, outputArray) {
    let letterWidth = 10*s;
    let letterHeight = 10*s;
    let spaceBetweenLetters = 4*s; 
    let spaceWidth = letterWidth;
        
    // Starting position for drawing
    let xPosition = 0;

    outputArray.forEach(value => {
        if(value >= 26) {
            // Draw number from fnt0
            const image = fntA[value];
            cx.drawImage(image, (x*w) + xPosition, (y*h), letterWidth, letterHeight);
            // Setup for next position
            xPosition += letterWidth + spaceBetweenLetters;
        } else if(value === -1) {
            // Add Space
            xPosition += spaceWidth;
        } else {
            let image = null;
            if(value < -400) { //special overrides
                let v = (value/10)*-1;
                image = fntA[v];
            } else {
                // Draw letter from fntA
                image = fntA[value];
            }
            cx.drawImage(image, (x*w) + xPosition, (y*h), letterWidth, letterHeight);
            // Setup for next position
            xPosition += letterWidth + spaceBetweenLetters;
        }
    });

}

// Convert given hex to 8-bit binary
function hexToBinary(hex) {
    return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
}

// Generate Sprite from HEX String
// D10 2022 rewritten sprite system code (rewritten again 2024 js13k)
function genSpriteImg(el, c, out) {

        const img = new Image();
        cg.clearRect(0, 0, cg.canvas.width, cg.canvas.height);
        //console.log("Decompiling sprite data: [" + px[sNum] + "]");
        // let splitData = ar[sNum].split(",");
        let splitData = el.split(",");
        // Set color register
        cg.fillStyle = c;
        // console.log("splitData.length: " + splitData.length);
        // console.log("splitData: " + splitData);
        // console.log("splitData: " + splitData);
        let x=0, y=0;
        //iterate over every pixel value, pixels
        for(var i=0; i < splitData.length; i++) { 
            //convert each hex element into binary
            let bRow = hexToBinary(splitData[i]);
            //bin[bin.length] = hex;
            // console.log("Sprite HEX -> Binary: " + bRow);
            for (var j = 0; j < bRow.length; j++) { //iterate over binary
                if (bRow[j]==1) { //check for pixel value
                    // console.log("Drawing row[j]: " + j);
                    cg.fillRect(x, y*1, 1, 1);
                    // ctp.fillRect(x, y*1, 1, 1);
                }
                x += 1;
                if(x >= cg.canvas.width) { //next line
                    y+=1;
                    x=0;
                }
            }
        }
        loadPer++;
        // Output
        img.src = cg.canvas.toDataURL("image/png");
        out[out.length] = img;
        return img;
}