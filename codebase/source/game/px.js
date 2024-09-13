/////////////////////////////////////////////////////
// Sprite Data
/////////////////////////////////////////////////////
// 5x6
const p6B = [
    "23,BF,F2,38", //Spade 0
    "73,BF,B2,38", //Club 3
];
const p6R = [
    "6,FF,F7,10", //Heart 1
    "23,BF,F7,10", //Diamond 2
];
// 32x32
const pA = [
    "0,0,0,0,0,0,0,0,0,7F,FF,80,0,FF,FF,C0,1,FF,FF,E0,3,EF,FF,F0,3,DB,EF,F8,83,B7,DF,FC,C3,F7,DB,FC,E3,EF,B1,FC,F3,DF,E0,FC,FB,F8,0,3C,FB,F0,0,1C,FB,E0,10,1C,F3,F0,F1,C8,EF,F1,0,8,D3,F0,61,88,A1,E0,61,88,AD,C0,0,8,A4,0,4,8,D0,0,2,8,EC,0,1,8,F4,0,6,8,F4,0,0,10,FA,0,0,20,FD,80,E0,40,FD,C0,0,A0,FB,FF,FF,70,F6,FF,E8,F8,F6,E0,34,FC,F7,30,3A,7E,F7,98,3D,BF", //Lab Man 0
    "0,0,0,0,0,0,0,0,0,FF,FE,0,1,FF,FF,0,83,DF,FF,80,C7,BF,FF,C0,E7,6F,DF,E0,F7,DF,BF,F0,F7,BF,77,F0,F7,7F,E3,F0,F7,FF,C1,F0,F7,F0,0,F0,F7,E0,0,70,F7,C0,63,20,F7,E1,D7,A0,EF,E0,0,20,D3,FE,DB,60,A1,C2,51,60,AD,80,14,60,A4,3,E5,E0,D0,0,4,20,CC,0,2,20,E4,0,C,20,F4,0,0,20,F2,1,E0,40,F9,0,0,A0,F1,80,1,70,E7,FF,FE,F8,E9,FF,E9,FC,ED,80,35,FE,EE,C0,3A,FF,EF,60,3D,7F", //Lab Man 1
    "0,0,0,0,0,7F,F8,0,0,FF,FC,0,1,FF,FE,0,3,EF,DB,0,7,DF,B7,80,7,BF,6F,80,7,FF,FF,80,7,EF,EF,80,7,CF,CF,80,87,C0,1,0,CF,C0,1,0,D1,C0,1,0,D6,CF,3D,0,D6,C6,19,0,D2,C0,1,0,D0,C0,21,0,C8,80,21,0,E6,0,60,80,F2,1,0,40,FA,0,F8,40,FA,0,0,40,FA,0,0,40,F9,0,0,40,FD,0,0,40,F9,80,0,80,F3,C0,7F,20,F7,FF,FE,70,E6,7F,FF,38,EC,3F,F9,9C,EF,38,18,DE,ED,90,8,DF", //Tech Man 
    "0,0,0,0,0,7F,F8,0,0,FF,FC,0,1,FF,FE,0,3,EF,DB,0,7,DF,B7,80,7,BF,6F,80,7,FF,FF,80,7,EF,EF,80,7,CF,CF,80,87,C0,1,0,CF,C0,1,0,D1,C0,1,0,D6,CF,3D,0,D6,C6,19,0,D2,C0,1,0,D0,C0,21,0,C8,80,21,0,E6,0,60,80,F2,1,0,40,FA,0,F8,40,FA,0,0,40,FA,0,0,40,F9,0,0,40,FD,0,0,40,F9,80,0,80,F3,C0,7F,20,F7,FF,FE,70,E6,7F,FF,38,EC,3F,F9,9C,EF,38,18,DE,ED,90,8,DF", //Military Man
];
// 9x12
const p9 = [
    "0,11,17,44,42,A0,40,70,10,22,2E,88,80,0", //Card Back 7x10
];
// 12x12
const p12 = [
    "1F,83,FC,79,EF,1F,F1,FE,3F,E3,7C,67,C6,77,FE,3F,C1,F8", //AVAX 12x12
];
// 18x18
const p18 = [
    // "0,C0,0,78,1,FF,E0,FF,FC,3F,FF,7,FF,81,FF,E0,7F,F8,1F,FE,7,FF,81,FF,E0,7F,F8,1F,FE,7,FF,81,FF,E0,3F,F0,7,F8,0,FC,0", //Badge Outline
    "0,0,0,FC,3,F3,F1,FF,FE,7F,FF,8F,FF,C3,FF,F0,FF,FC,3F,FF,F,FF,C3,FF,F0,FF,FC,3F,FF,F,FF,C3,FF,F0,7F,F8,F,FC,1,FE,0", //Badge Outline
    "0,0,0,30,0,33,1,FB,7E,7B,F7,8D,FE,C2,FF,D0,FF,FC,3F,FF,F,FF,C3,FF,F0,FF,FC,3F,FF,7,FF,80,FF,C0,1F,E0,3,F0,0,0,0", //Badge Inner
];
// 5x4
const p5 = [
    "F5,6B,50", //M 45
    "E4,AC,F0", //Q 46
    "8D,6A,F0", //W 47
    "91,11,20", //% 48
];
// 3x4
const p4 = [
    "77,D0", //A 0
    "DE,F0", //B 1 BA,F0
    "72,30", //C 2
    "D6,E0", //D 3
    "F3,70", //E 4
    "F3,40", //F 5
    "72,F0", //G 6
    "BE,D0", //H 7
    "E9,70", //I 8
    "26,B0", //J 9
    "BA,D0", //K 10
    "92,70", //L 11
    "BE,D0", //M 12
    "D6,D0", //N 13
    "F6,F0", //0 14
    "F7,C0", //P 15
    "F7,90", //Q 16
    "F7,50", //R 17
    "F1,F0", //S 18
    "E9,20", //T 19
    "B6,F0", //U 20
    "B6,A0", //V 21
    "B7,D0", //W 22
    "B9,D0", //X 23
    "B5,20", //Y 24
    "EE,70", //Z 25
    
    "76,E0", //0 26
    "59,20", //1 27
    "E7,70", //2 28
    "EC,F0", //3 29
    "B5,90", //4 30
    "F8,F0", //5 31
    "9E,F0", //6 32
    "E5,20", //7 33
    "FE,F0", //8 34 BE,F0
    "FC,90", //9 35 F7,90

    "3,60", //. 36
    "48,20",//! 37
    "E4,20",//? 38
    "1C,0", //- 39
    "49,20",//| 40
    "40,20", //: 41
    "0,70", //_ 42
    "52,20",//( 43
    "44,A0",//) 44

];