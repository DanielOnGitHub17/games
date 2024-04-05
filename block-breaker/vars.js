const OFFICIALLEVELS = [
`231 313 313 123 091 091 021 131 121`,
`331 011 113 323 021 291 121 131 121`,
`031 111 013 323 191 333 111 222 231 323 191 333 111 222 231`
]
const BLOCKNAMES = [
['space', 0, 0],
 ['pink', 1, 1],
  ['green', 2, 1],
   ['metal', Infinity, 1],
    ['colorful', Infinity, 1],
     ['star', 1, 0],
      ['powerup', 1, 1, randBtw(0, 9)],
]
const POWERUPS = ['shield', 'shooter', 'quake', 'fireball', 'multiball', 'slowmo', 'largepad', 'bigBall']

const MENUS={
  MAIN: ['GAME,NEW GAME', 'GAME,CONTINUE', ',LEVELS', ',OPTIONS', ',HELP', ',ABOUT'],
  PAUSE: ['GAME, RESUME', 'GAME,RESTART', ',HELP', 'MAIN,MAIN MENU',',OPTIONS'],
  LEVELS: ['GAME,LEVEL1', 'GAME,LEVEL2', 'GAME,LEVEL3', 'GAME,RANDOM'],
  OPTIONS: ['BACK,SOUND ON'],
  HELP: [],
  ABOUT: [],
  LOST: ['GAME,RESTART', 'MAIN,MAIN MENU'],
  WIN: ['GAME,RESTART', 'MAIN,MAIN MENU', 'LEVELS,CHOOSE NEXT LEVEL'],
  SHOP: []
};
const TITLES={
MAIN:'MAIN MENU',
PAUSE: 'PAUSED',
LEVELS: 'CHOOSE A LEVEL',
OPTIONS: 'OPTIONS',
HELP: 'HELP',
ABOUT: 'BLOCK BREAKER',
LOST: 'SORRY, YOU LOST',
WIN: 'CONGRATS, YOU WON',
SHOP: 'BY YOUR POWERUPS HERE'
};
const EXTRAS={
  HELP: {p: 'Use < and > buttons to move left and right respectively',
  }
};
// do add item description to each in MENUS or do another object(dictionary)
for (let n in MENUS){
  MENUS[n].push(',BACK')
}
[MENUS.LOST, MENUS.WIN].forEach(i=>{i.pop()})
dddd = localStorage.getItem('LEVEL');
let BALLSPEED = 3, BALLWIDTH = 1, PADSPEED = 2, blocks = [],
 LEVEL = dddd!="undefined"?dddd:OFFICIALLEVELS[0], PAUSED = true,
NL =()=>OFFICIALLEVELS.includes(LEVEL)?OFFICIALLEVELS.indexOf(LEVEL)+1:1;
remaining=()=>{
  return blocks.filter(i=>(['pink', 'green', 'star', 'powerup'].includes(i.name))).length
}
const FACTOR = 15;
let SITEWIDTH, SITEHEIGHT;
onresize = ()=>[SITEWIDTH, SITEHEIGHT]=[site.clientWidth-20, site.clientHeight-20]
onresize();