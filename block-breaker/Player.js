stats = {
    balls: 1,
    shields: 0,
    bullets: 0,
    quakes: 0,
}
PlaYer = {balls:[]}
keys = ['ArrowLeft', 'ArrowRight'];
class Player{
    constructor(){
        this.pad = pad; this.balls = [new Ball(270, new Vec(SITEWIDTH/2, SITEHEIGHT/2))];
        this.L = 3+(NL()*2);
        this.listen();
        this.dir = 0;
        this.where=0;
        this.int = setInterval(()=>{
             if(this.shouldmove) this.place+=this.dir;
        })
    }
    get body(){
        return this.pad.getBoundingClientRect();
    }
    get center(){
        let me = this.body;
        return new Vec(me.right-me.width/2, me.bottom-me.height/2)
    }
    set score(n){
        SCORE.textContent = this.SCORE;
        this.SCORE = n;
    } 
    get score() {return this.SCORE;}
    SCORE = 0;
    get fallingPowerups(){}
    listen(){
        weapons.onclick = function bomb(){
            let id = event.target.id;
            if(stats[id]) {
                stats[id]--; new PowerUp(POWERUPS.indexOf(id.slice(0,id.length-1)))
            }
        }
        controls.ontouchstart = function move(){
//             event.preventDefault()
            console.log('over here')
            if (!event.target.value) return;
            PlaYer.dir = Array.from(controls.children).indexOf(event.target)?1:-1;
            this.shouldmove = true
        }; 
        controls.ontouchend = ()=>{
            console.log('')
            event.preventDefault()
            this.shouldmove = false
        };
        addEventListener('keydown', function move(){
            let k = event.key;
            if (!keys.includes(k)) return;
            PlaYer.dir=keys.indexOf(k)?1:-1;
            PlaYer.shouldmove = true;
        })
        addEventListener('keyup', ()=>PlaYer.shouldmove=false)
    }
    set place(n){
        if(n<0)n=1; if(n>SITEWIDTH-65) n=SITEWIDTH-65;
        this.where = n;
        pad.style.transform = `translateX(${PlaYer.where+=PlaYer.dir*PADSPEED}px)`;
    }
    get place(){return this.where}
    collect(){
        s
    }
    hitBall(){
        pad.style.top = '84.7%';
        setTimeout(()=>pad.style.top='', 200)
    }
    remove(){
        clearInterval(this.int)
        pad.style.transform = '';
    }
}
class PowerUp{
    constructor(n){
        this.N = n;
        this.type = POWERUPS[n];
        this.EFFECT[this.type];
    }
}
EFFECTS={
    shield: 1,
    shooter: 1,
    quake: 1,
    fireball: 0,
    multiball: 9,
    slowmo: 2,
    largepad: 1,
    bigBall: 0
}