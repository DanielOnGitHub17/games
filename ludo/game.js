class Game {
  constructor() {
    loadSounds('noise/','.wav',['click', 'step', 'kill', 'choose']);
    //sound editing
    sound[0].playbackRate*=2;
    sound[3].volume/=2;
    //end sound editing
  }
  modes = ['default', 2, 4]; winners=[];
  get mode(){
    let x;
    modes.forEach(i=>{if(i.checked) x= this.modes[modes.indexOf(i)]})
    return x;
  }
  get names(){
    let x = [];
    namess.forEach(i=>{
      if(!i.hidden)x.push(i.firstElementChild.value?i.firstElementChild.value:i.firstElementChild.placeholder)
    });
    return x
  }
  start(){
    // this.restart();
    this.players = getParameters();
    window['dice'] = new Dice;
    this.players.forEach(i=>{
      i.seeds = [];
      i.colors.forEach(c=>{
        [0, 0, 0,0].forEach(x=>{
          let s = new Seed(c); s.owner=i; i.seeds.push(s)
        });
      })
    });
    this.manage();
  }
  manage(){
    this.turn = 0;
  };
  set turn(n){
    this.whoseturn = n; this.whoseturn %= this.stillPlaying.length;
//      dice.canturn=true;
    setTimeout(()=>{board.style.cssText=`--message: "${this.player.name}'s turn"`;
    setTimeout(()=>{board.style.cssText='--message:d';
     this.players.forEach(p=>p.turn=0);
     this.player.turn=1;
    }, 500)}, 1000);
  }
  restart(){
    if (!this.over) {
      this.players.forEach(j=>j.seeds.forEach(j=>j.win()));
    }
  }
  get stillPlaying(){
    return this.players.filter(i=>i.seeds.length)
  }
  get over(){
     return !document.querySelectorAll('.seed').length;
  }
  get player(){
    return this.players[this.whoseturn]
  }
}
function chooseNext(present, array) {
    return array[(array.indexOf(present)+1)%array.length]
}
let game = new Game;
goToScreen('MAIN'); modes[2].click();