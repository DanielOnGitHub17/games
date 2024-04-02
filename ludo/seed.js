class Seed {
    constructor(color) {
        this.color = colors[color];
        this.type = color;
        this.seed = make();
        this.seed.className = 'seed';
        this.seed.style.background = this.color;
        this.home = window['home'+color];
        this.seed.obj=this;
        this.chop(); this.values = [];
        this.deviation = color*13;
        this.spawnPoint = document.querySelectorAll('.spawnPoint')[color];
        this.homeroad = Array.from(window['road'+color].querySelectorAll('.specroute'));
        this.road = road.concat(this.homeroad);
        this.mod = 52;
    }
    chop(){
        this.pos = -1; sound[2].play();
        this.home.appendChild(this.seed);
    }
    get atHome(){
        return this.pos==-1;
    }
    get safe(){
        return this.pos>51;
    }
    get cantmove(){
        return (this.atHome&&!dice.values.includes(6))||
            (dice.values.every(i=>this.pos+i>57));
    }
    spawn(){
        this.pos = 0; sound[1].play();
        this.spawnPoint.appendChild(this.seed);
        let P = this.seed.previousElementSibling;
        if (P&&!this.isMyFriend(P.obj)) {
            P.obj.chop(); this.win(); sound[2].play()
        } 
    }
    move(n){
        for (let i = 0; i < Math.abs(n); i++) {
            setTimeout(()=>{
                this.pos+=Math.sign(n); this.at=this.pos;
               if(Math.abs(n)-i==1){
                   let P = this.seed.previousElementSibling;
                   if (P&&!this.isMyFriend(P.obj)) {
                       P.obj.chop(); this.win(); sound[2].play()
                   }
               }
            }, i*200)
        }
        setTimeout(()=>{ 
        }, Math.abs(n)*205)
    }
    isMyFriend(seed){
        return Boolean(this.owner.seeds.indexOf(seed)+1);
    }
    set at(n){
        if(this.won) return;
        this.pos = n; sound[1].play();
        this.seed.scrollIntoView();
        if(this.pos==57) {this.win(); return}
        this.road[(this.pos+this.deviation)%this.mod].appendChild(this.seed)
        if(this.pos==50) {
            this.deviation = 0; this.mod=100; this.pos++;
        };
    }
    set hinted(b){
        this.seed.style.boxShadow=b?'0px 0px 4px 4px #00ffe7':'';
        this.seed.style.cursor=b?'pointer':'';
    }
    get at(){return this.pos}
    win(){
        this.seed.remove(); this.won = true;
        delete this.owner.seeds.splice(this.owner.seeds.indexOf(this),1);
        if (!this.owner.seeds.length) {
            game.winners.push(this);
            this.owner.done = 1;
            game.check();
        }
    };
}