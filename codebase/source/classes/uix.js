/////////////////////////////////////////////////////
// User Interface 'X' Class
// Multi class for a variety of UI objects
/////////////////////////////////////////////////////
// uix object (where x = the type)
// 0 image 
// 1 text 
// 2 button
class uix {
    constructor(ix, x, y, dx, dy, c, str, img, w) {
        this.ix = ix;   // UIX type
        this.x = x;     // x position
        this.y = y;     // y position
        this.dx = dx;     // x dimension
        this.dy = dy;     // y dimension
        this.c = c;     // color
        this.str = str; // string
        this.img = img; // image
        this.w = w; // wobble
        this.incX = w; // incrementer
        this.incY = w; // incrementer
        this.wx = 0; // wobble X
        this.wy = 0; // wobble Y

        this.isAc = false, this.isHov = false, this.clk = false, this.pld = false;
        if(str != null) {
            this.conv = strToIndex(this.str);
            // console.log("Converted string: " + this.conv);
        } // Buttons need to be activated via call
        if(this.ix != 2) { this.isAc = true; }
    }
    render() {
        // ACTIVE
        if(this.isAc) {
            // wobble
            if(this.w!=0) { 
                this.wobbleXY();
            }

            if(this.ix == 0) { //image
                cx.drawImage(this.img, (w * (this.x + this.wx)), h * (this.y + this.wy), h*this.dx, h*this.dy); }
            
            
            else if(this.ix == 1) { //text
                let fnt = fntW; // colour select
                if(this.c == 1) {fnt = fntB}
                if(this.c == 2) {fnt = fntR}
                // cx.drawImage(img, w * this.pos.x, h * this.pos.y, h/dx, w/dy);
                renderFont(this.x, this.y, w, h, this.dx, fnt, this.conv); }
            
            
            else if(this.ix == 2) { //button
                if(this.isHov) {
                    if(this.clk) {
                        cx.globalAlpha = .8;
                        drawBox(this.x, this.y+this.wy, this.dx, this.dy, '#FFF')
                    } else {
                        cx.globalAlpha = .4;
                        drawBox(this.x, this.y+this.wy, this.dx, this.dy, '#AAA') }
                    cx.globalAlpha = .5;
                    drawBox(this.x, this.y+this.wy, this.dx, this.dy, this.c)
                } else {
                    cx.globalAlpha = .3;
                    drawBox(this.x, this.y+this.wy, this.dx, this.dy, this.c) }
                cx.globalAlpha = 1.0;
                renderFont(this.x+.02, this.y+this.wy+.01, w, h, 1.6, fntW, this.conv);
                cx.globalAlpha = .8;
            } }
    }
    wobbleXY() {
        // console.log("wx: " + this.wx);
        this.wx += this.incX;
        if(this.wx >= .03 || this.wx <= -.03) {
            this.incX = -this.incX;
        }
        this.wy += this.incY;
        if(this.wy >= .02 || this.wy <= -.02) {
            this.incY = -this.incY;
        }
    }
    checkHover(val) {
        if(val) {
            if(this.isAc) {
                let hover = (mouseX >= w*this.x && mouseX <= (w*this.x) + w*this.dx 
                && mouseY >= h*this.y && mouseY <= (h*this.y) + h*this.dy);
                if(hover) {
                    this.isHov = true;
                    // Hover SFX, toggle if played
                    if(!this.pld) {
                        this.pld = true;
                        zzfx(...[3*mVo,,194,,.04,.02,,3,-7,,-50,.39,,,,,,.51,.02,.03,930]); // button hover
                    }
                    return true;
                }
            }
        } else {
            this.isHov = false;
            this.clk = false;
            this.pld = false;
        }
        return false;
    }
    // Check on click event 
    checkClick(clk) {
        if(clk) {
            if(this.isHov) {
                this.clk = true;
                return true; }
        } else {
            this.clk = false;
            return false; }
        // console.log("clk: " + clk);
    }
    // Toggles active state of element
    togActive(v) {
        this.isAc = v;
        // console.log("active: " + this.str);
        if(!v) {
            this.isHov = false;
            this.clk = false; 
        }
    }
    updateSTR(str) {
        this.str = str.toString();
        this.conv = strToIndex(this.str);
    }
    updateCOL(c) {
        this.c = c;
    }
    updatePOS(x, y) {
        this.x = x;
        this.y = y;
    }
}