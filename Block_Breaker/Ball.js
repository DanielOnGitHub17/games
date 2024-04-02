class Ball{
    constructor(angle, at){
        this.skin = make();
        this.skin.className = 'ball';
        this.where = at; this.angle = angle;
        PLAYER.appendChild(this.skin);
        this.moving = setInterval(()=>{
            if (PAUSED) return;
            if(this.onedge||this.hit) this.bounce();
            if (touching(this.body, PlaYer.body)) {this.changeDir()}
            position(this.skin, this.where.x+=cos(this.angle)*BALLSPEED, this.where.y+=sin(this.angle)*BALLSPEED);
//             position(this.skin, this.where.plus(new Vec(tan(this.angle)))*BALLSPEED);
//             this.where = new Vec(-100, -100);
        }, 10);
//         this.holde=setInterval(()=>this.hold=this.angle)
        this.size = 0; this.side = 0;
        this.damage = 1;
    }
    set size(n){
        BALLWIDTH+=n;
        this.skin.style['--size'] = BALLWIDTH;
//         setSize(this.skin, new Vec(BALLWIDTH*20), 'px');
    }
    bounce(side){
//         the method GOD showed me
        this.angle += 180-(2*(this.angle - 90*parseInt(this.angle/90)));
        this.angle %= 360;
    }
    get dir(){
        return Math.sign(tan(this.angle))*this.side;
    }
    get center(){
        let me = this.body;
        return new Vec(me.right-me.width/2, me.bottom-me.height/2)
    }
    changeDir(){
        PlaYer.hitBall();
        let x = this.center.x, y = PlaYer.body.right;
        this.angle = 320-(y-x);
//         this.angle%=360;
//         this.angle = randBtw(220, 320);
    }
    get onedge(){
//         this.hold = this.angle;
        if(this.where.y<0){this.side=1;return true;}
        if(this.where.y>SITEHEIGHT){
            this.side=-1;
            setTimeout(()=>(PlaYer.balls.length)? this.remove():goToScreen('LOST'), 100);
         }
        if(this.where.x<0){this.side=1; return true;}
        if(this.where.x>SITEWIDTH){this.side=-1; return true;}
        return false;
    }
    get hit(){
        let which = false;
        //you can get the position of the last block and decide not to check all
        //till you've reached that position;
        blocks.forEach(i=>{
            if (touching(i.body, this.body)){
                if(i.reflect) which = true;
                if(i.life) i.life--;
            }
        })
        if(which&&!remaining()) {
            goToScreen('WIN');
            if(OFFICIALLEVELS.includes(LEVEL)) {
                LEVEL = OFFICIALLEVELS[OFFICIALLEVELS.indexOf(LEVEL)+1];
//                 level();
             }
            this.remove()
        }
        return which;
    }
    get body(){
        return this.skin.getBoundingClientRect();
    }
    remove(){
        clearInterval(this.moving);
        delete this.skin.remove();
        delete PlaYer.balls.splice(PlaYer.balls.indexOf(this), 1);
    }
}