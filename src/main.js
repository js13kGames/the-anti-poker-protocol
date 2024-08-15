/////////////////////////////////////////////////////
// Main Game Class
/////////////////////////////////////////////////////

import { createNumberGenerator, createSeedFromString, generateNumber } from './rng.js';
import * as gpc from './graphics.js';
import card from './card.js';

var html = null;
var body = null;
var canvas = null;
var ctx = null;

var width = 0;
var height = 0;

var rng = null;
var seed = null;
var complex = true;
var rand = null;

var cardNum = 0;
var deckTotal = 52;

var mouseX = -999;
var mouseY = -999;

const flashDuration = 200;

const cardSlot1 = new card(0, {x: 0.15, y: 0.45}, 'SPD');
const cardSlot2 = new card(0, {x: 0.30, y: 0.45}, 'HRT');
const cardSlot3 = new card(0, {x: 0.45, y: 0.45}, 'DMD');
const cardSlot4 = new card(0, {x: 0.60, y: 0.45}, 'CLB');

const cardBCK1 = new card(0, {x: 0.875, y: 0.450}, 'BCK');
const cardBCK2 = new card(0, {x: 0.880, y: 0.445}, 'BCK');
const cardBCK3 = new card(0, {x: 0.885, y: 0.440}, 'BCK');
const cardBCK4 = new card(0, {x: 0.890, y: 0.435}, 'BCK');

var currentHeld = null;

var playerCardHand = [
    cardSlot1,
    cardSlot2,
    cardSlot3,
    cardSlot4,
    null,
    null,
    null,
    null 
];
var deck = [
    cardBCK1,
    cardBCK2,
    cardBCK3,
    cardBCK4
];
var enemyCardHand = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null 
];

window.onload = function() {
    //Setup
    html = document.documentElement;
    body = document.body;

    //canvas setup
    canvas = document.getElementById('canvasMain');
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    width = canvas.clientWidth;
    height = canvas.clientHeight;

    // initial flash effect on load
    ctx.fillStyle = '#8888FF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.style.outlineColor  = '#000000';

    setupEventListeners();

    // Basic count cards
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            cardNum++;
            deckTotal--;
        }
    }

    // Setup RNG
    if(complex) { // Non deterministic seed
        seed = Date.now().toString(); 
    } else { // Deterministic
        seed = "ItsGamejamTime"; 
    }

    //rng test   
    //PRNG via ooflorent/example.js
    rng = createNumberGenerator(
        createSeedFromString(seed)
    );
    rand = generateNumber(rng, -10, 10);

    // setTimeout clears the white flash after the specified duration
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw initial content (if any)
        renderScene();
    }, flashDuration);
}

function renderBacking() {
    gpc.drawBox(ctx, 40, 140, 560, 220, '#22222250');
    gpc.drawBox(ctx, 50, 150, 540, 200, '#33224488');
    gpc.drawDashBox(ctx, 50, 150, 540, 200);
    gpc.drawBox(ctx, 555, 202, 57, 90, '#333355FF');
    gpc.drawDashBox(ctx, 555, 202, 57, 90);
    gpc.drawDashBox(ctx, 75, 420, 500, 53);
    gpc.drawDashBox(ctx, 275, 7, 300, 53);
}

function setupEventListeners() {
    // Event listener to track mouse movement
    canvas.addEventListener('pointermove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        // Check if the card is hovered
        for (let i = 0; i < playerCardHand.length; i++) {
            if(playerCardHand[i] != null) {
                if (playerCardHand[i].checkHover(mouseX, mouseY, width, height)) {
                    playerCardHand[i].isHovered = true;
                    currentHeld = playerCardHand[i];
                } else {
                    playerCardHand[i].isHovered = false;
                }
            }
        }
    });
    canvas.addEventListener('pointerdown', (e) => {
        for (let i = 0; i < playerCardHand.length; i++) {
            if(playerCardHand[i] != null) {
                playerCardHand[i].checkClick(true);
            }
        }
    });
    canvas.addEventListener('pointerup', (e) => {
        for (let i = 0; i < playerCardHand.length; i++) {
            if(playerCardHand[i] != null) {
                playerCardHand[i].checkClick(false);
            }
        }
        //switch current held card to end of array for render ordering
        
    });
}

function renderScene() {
    ctx.clearRect(0, 0, width, height);

    renderBacking();

    // Draw Test #1
    ctx.globalAlpha = 0.8;
    // [font style][font weight][font size][font face]
    ctx.font = "normal bold 22px monospace";
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText("JS13K 2024 Day II", 0.04*width, 0.1*height);
    
    // Draw Test #2
    ctx.font = "normal bold 16px monospace";
    ctx.fillText("RNG TEST: " + rand, 0.04*width, 0.15*height);
    ctx.fillText("CARDS SPAWNED: " + cardNum, 0.04*width, 0.24*height);
    ctx.fillText("LEFT IN DECK: " + deckTotal, 0.04*width, 0.27*height);
    
    setTimeout(() => {
        canvas.style.outlineColor  = '#66c2fb';
    }, flashDuration/2);

    ctx.globalAlpha = 1.0;
    // Draw Player Cards
    for (let i = 0; i < playerCardHand.length; i++) {
        if(playerCardHand[i] != null) {
            playerCardHand[i].render(ctx, width, height);
        }
    }
    // Draw Deck Cards
    for (let i = 0; i < deck.length; i++) {
        if(deck[i] != null) {
            deck[i].render(ctx, width, height);
        }
    }

    gpc.drawBox(ctx, mouseX-10, mouseY-10, 20, 20, '#FF000080');

    // Request next frame
    requestAnimationFrame(renderScene);
}