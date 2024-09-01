/////////////////////////////////////////////////////
// Render Functions
/////////////////////////////////////////////////////

function renderGame(timestamp) {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);
}

function loadingScreen(timestamp) {
    let calcPer = Math.ceil((loadPer/maxPer)*100);
    
    // Initial flash effect on load
    cx.fillStyle = '#66c2fb';
    cx.fillRect(0, 0, cvs.width, cvs.height);
    cvs.style.outlineColor  = '#000000';
    
    cx.fillStyle = '#000';
    cx.font = "normal bold 24px monospace";
    
    if(calcPer >= 100) {
        cx.fillText("LOADING... 100%" , 0.05*w, 0.9*h);
        if(!loaded) {
            loaded = true;
            setTimeout(() => {
                stateMain = MAIN_STATES.TITLE;
            }, 1000);
            console.log("LOADED == TRUE");
        }
    } else {
        cx.fillText("LOADING... " + calcPer +"%" , 0.05*w, 0.9*h);
    }
}

function renderTitle(timestamp) {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);

    cx.globalAlpha = 0.5;
    drawBox(0, 0, w, h, '#111111EE'); //background
    drawBox(0, 0.032, w, 0.35, '#33333399'); //title
    
    cx.globalAlpha = 0.9;
    cx.font = "normal bold 22px monospace";
    cx.fillStyle = '#FFFFFF';
    
    // console.log("spritesIcons array size: " + spriteIcons.length);
    
    // Title Text 
    uiT[0].render();
    
    renderButtons();
    
    drawBox(0.415, 0.85, 0.032, 0.058, '#CCC'); //button outer
    drawBox(0.418, 0.855, 0.026, 0.048, '#F55'); //red frame
    drawBox(0.423, 0.865, 0.016, 0.024, '#FDD'); //white center
    //Wallet AVAX Sprite render
    uiS[0].render();
    
    // Debug
    cx.fillStyle = '#FFF';
    cx.font = "normal bold 12px monospace";
    if(mobile) {
        cx.fillText("[MOBILE]", 0.92*w, 0.96*h);
    } else {
        cx.fillText("[BROWSER]", 0.92*w, 0.96*h);
    }
    
    // Draw Player A Cards
    for (let i = 0; i < titleCds.length; i++) {
        if(titleCds[i] != null) {
            titleCds[i].render();
        }
    }

    renderSuits();
    // cx.font = "normal bold 22px monospace";
    // cx.fillText("TITLE", 0.45*w, 0.25*h);
    debugMouse();
}

function renderOptions(timestamp) {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);

    // Draw Test #1
    cx.globalAlpha = 0.8;
    drawBox(0, 0, w, h, '#222222EE'); //bg
    
    // uiT[2].render(cx, w, h);

    // renderButtons();
}
function renderCredits(timestamp) {
    // Timeout for flash
    setTimeout(() => {
        // console.log("flash timeout");
        cvs.style.outlineColor  = '#66c2fb';
    }, 200);

    // Draw Test #1
    cx.globalAlpha = 0.8;
    drawBox(0, 0, w, h, '#222222EE'); //bg

    // uiT[3].render(cx, w, h);
    // uiT[4].render(cx, w, h);
    // uiT[5].render(cx, w, h);

    // renderButtons();
}

// Draw all buttons
function renderButtons() {
    for (let i = 1; i < uiB.length; i++) {
        uiB[i].render();
        uiB[i].checkHover(mouseX, mouseY);
    }
    // console.log("rendering buttons: ");
}