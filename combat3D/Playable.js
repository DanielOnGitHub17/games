class Playable{
    constructor(type){
        if (!type) throw TypeError("Playable is called with one argument: type, which is either 'Player', 'Enemy', 'Friend'")
        this.type = type; /*Player, Enemy, or Friend*/
        this.block = make();
        for (let face of playableFaces){
            this.block[face] = makeBlock('part '+face);
            this.block.appendChild(this.block[face]);
        }
        this.block.className = this.type+' playable'; this.block.obj = this;
        gameBox/*gameFrame*/.appendChild(this.block)
        this.motions=['translateZ', 'translateX', 'translateY',
             'rotateX', 'rotateY', 'rotateZ'];
        this.motions.forEach(m=>{
            this[m[0]+m[m.length-1]] = this[m[0]+m[m.length-1].toLowerCase()] = 0;
        })
        this.tZ=60;
        this.moving = setInterval(()=>{
            if (this.askedToMove)this.move()
        }, 20);
        let life = 100;
        this.__defineGetter__('life', ()=>life);
        this.__defineSetter__('life', (n)=>{this.block.body.top.textContent=parseInt(life=n); if(life<1) this.kill()});
        this.life=life;
        if(type=='Player') this.event();
        playables[this.type+'s'].push(this)
    }
    get center() {let me = this.info;return new Vec(me.right - me.width / 2,me.bottom - me.height / 2)}
    move(){
        this.block.style.transform = `
        translateX(${this.tX+=this.tx}px) translateY(${this.tY+=this.ty}px)
        translateZ(${this.tZ+=this.tz}px) rotateX(${this.rX+=this.rx}deg)
        rotateY(${this.rY+=this.ry}deg) rotateZ(${this.rZ+=this.rz}deg)`;
        if(this.type=='Player') {gameBox.tX=-this.tX; gameBox.tY=-this.tY}
    }
    event(){
        this.keys=['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];
        let rots = ['ArrowLeft', '', 'ArrowRight'];
        this.reverse = 1; this.bearing = 1; this.beingpressed = -1;
        this.slowmo = 1;
        addEventListener('keydown', ()=>{
            let n = this.keys.indexOf(event.key);
            if (n==-1) /*or not on this screen -for later*/return
            this.beingpressed = n;
            let r = rots.indexOf(event.key)-1;
//             console.log(r)
            if([-1, 1].includes(r)){
//                 this.bearing=this.blocked?-1:1;
                this.rz=this.bearing*5*r;
            }else{
                let x = [1, -1];
                this.slowmo = this.blocked?.1:1;
//                 this.reverse=this.blocked?-5:1;
                let mul = this.slowmo*this.reverse*x[n]*5;
                this.tx=mul*sin(this.rZ); this.ty=-mul*cos(this.rZ);
            }
        })
        addEventListener('keyup', ()=>{
            //reset
            let n = this.keys.indexOf(event.key);
            if (!this.dead && event.key=='x' && bullets['Players'].length<3) new Bullet(this);
            if (n==-1) return
            let r = rots.indexOf(event.key)-1;
            if([-1, 1].includes(r))this.rz=0;
            if(n==0 || n==1) this.tx=this.ty=0;
        })
        addEventListener('blur', ()=>{
            this.differences.forEach(i=>this[i]==0);
        })
    }
    get differences(){
        return ['tx', 'ty', 'tz', 'rx', 'ry', 'rz']
    }
    get askedToMove(){
        this.rZ %= 360;
        if(!touching(this.block.getBoundingClientRect(), gameBox.getBoundingClientRect())){
            this.tX = this.tY = 0;
        }
        return this.differences.some(i=>this[i]!=0)
//         !this.blocked&&
    }
    get info(){
        return this.block.getBoundingClientRect()
    }
    get surrouindings(){
        let b = document.elementsFromPoint(this.info.x, this.info.y)
        .filter(i=>i.classList.contains('block'))[0];
        if (!b) return [];
        let n = bloks.indexOf(b.obj), l = gameBox.level.length;
        return [
        bloks[n-l-3], bloks[n-l-2], bloks[n-l-1],
        bloks[n-1], bloks[n], bloks[n+1],
        bloks[n+l+1], bloks[n+l+2], bloks[n+l+3]
        ].filter(i=>i).filter(i=>i.type).map(i=>i.block).map(i=>i.getBoundingClientRect());
    }
    get blocked(){
        return this.surrouindings.some(i=>touching(i, this.block.getBoundingClientRect()));
    }
    kill(){
        this.block.remove(); clearInterval(this.moving);
        this.dead = true;
        delete playables[this.type+'s'].splice(playables[this.type+'s'].indexOf(this), 1)
        delete this;
    }
}

let playables={Players: [], Enemys: [], Friends: []};
window.__defineGetter__('player', ()=>playables.Players[0])