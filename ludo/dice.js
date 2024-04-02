class Dice{
    constructor(){
        let cylinder = make();
        ['left', 'right'].forEach(i=>{
            let die = make(); die.className = 'die';
            cylinder.appendChild(die);
        }); end.appendChild(cylinder);
        cylinder.id = 'cylinder';
        this.cylinder = cylinder;
        this.dices = Array.from(cylinder.children);
        this.event();
        this.cylinder.obj = this;
        this.turning = 0;
        this.values=[0,0]; this.setDices();
    }
    forThem(f){
        this.dices.forEach(f);
    }
    setDices(){
        this.forThem(i=>i.__defineSetter__('clicked', function name(bool) {
            i.touched = bool; i.style.border=bool?'5px solid black':''; 
        }))
    }
    roll(){
        this.forThem(i=>i.style.transform = i.style.transform?'':'scale(-1) rotate(1080deg)');
        this.textContent = ()=>randBtw(1, 6);
    }
    set textContent(n){
        this.turning = 1;
        this.reset();
        this.forThem(i=>{
            let x=n(); this.values[i.n]=x;;
            setTimeout(()=>{i.textContent = '.'.repeat(x); setTimeout(()=>this.turning = 0, 1000)}, 950)});
        if(/*this.movableSeeds.length==0*/this.canturn) {
            this.reset()
            setTimeout(()=>game.turn=game.whoseturn+1, 500);
        }
    }
    event(){
        this.forThem(i=>{i.obj=this; i.n = this.dices.indexOf(i)});
        cylinder.onclick=()=>{
            if(this.canturn&&!this.turning) this.roll();
        }
        this.forThem(i=>i.onclick=()=>{
            event.stopPropagation();
//             do an 'undo' feature that when you touch it the second time, it will reset
//             january 31, 2023 20:53
            if (i.touched) {
                i.clicked=false;
                let v = i.obj.values[i.n];
                dice.thoseicanmove(v).forEach(s=>{s.seed.removeEventListener('click', i.wait); s.hinted=0});
                return
            };
//             january 31, 2023 20:53
            if(this.canturn||i.touched/*||i.undone*/) return;
            let v = i.obj.values[this.dices.indexOf(i)];
            i.wait = function wait() {
                dice.thoseicanmove(v).forEach(s=>{s.seed.removeEventListener('click',i.wait); s.hinted=0});
                if (event.target.obj.atHome&&v==6) {
                    event.target.obj.spawn()
                }else{
                    event.target.obj.move(v)
                }
                dice.values[i.n] = 0; i.clicked = false;
//                 console.log(dice.thoseicanmove(dice.values[i.n==1?0:1]).length)
                if(dice.canturn){
                    dice.reset(); console.log(dice.values);
                    game.turn = game.whoseturn+1;
                }
            };
            if(dice.values[i.n]){this.thoseicanmove(v).forEach(s=>{
                i.clicked=true;
                s.hinted = 1;
                s.seed.addEventListener('click', i.wait);
            })}
        })
    }
    thoseicanmove(me){
        let p = game.player;
        if (me==6) {
            return p.seeds.filter(i=>(i.atHome||(!i.safe)))
        } else {
            return p.seeds.filter(i=>(!i.atHome&&(i.pos+me<=57)))
        }
    }
    get canturn(){
        let ret = false, p = game.player;
        return (
            (this.CT||p.seeds.every(i=>i.cantmove))||
            !p.seeds.length||!sum(this.values)
        )
    }
    set canturn(bool){
        this.CT=bool;
    }
    get nextCantPlay(){
        let ret = false, p = game.player;
        return (
            (p.seeds.every(i=>i.cantmove))||
            p.seeds.length == 0
        );
    }
    get movableSeeds(){
        return game.player.seeds.filter(i=>!i.cantmove)
    }
    reset(n=2){
        for (let i=0; i<n;i++){
            this.values[i]=0
        }
    }
    remove(n){}
}