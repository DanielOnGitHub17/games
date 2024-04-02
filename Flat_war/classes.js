class Character {
    constructor(x, y) {
        add(this.all = make(), world).className = 'Character';
        ['head', 'body', 'feet'].forEach(p=>{
            add(this.all[p] = make(), this.all).className = p;
            this.__defineGetter__(p, ()=>box(this.all[p]))
        });
        ['bullets', 'life'].forEach(i=>{
            add(this.all[i]=make(), this.all.body).className = i;
            this.__defineGetter__(i,()=>3)
        });
        Object.defineProperty(this, 'X', {
            set: function(n){/*this.pose = n>x?'right':n<x?'left':0;*/ x=n;},
            get: function(){return x}
        });
        Object.defineProperty(this, 'Y', {
            set: function(n){/*this.pose = n>y?'down':n<y?'up':0;*/ y=n;},
            get: function(){return y}
        });
        Object.defineProperty(this, 'pose', {
            set: function(n){this.all.setAttribute('pose', n)},
            get: function(n){return this.all.getAttribute('pose')}
        });
        this.falling=(this.jumping = (this.step = 5));
        this.s= 1
        characters.push(this);
    }
    get standing(){
        return notspaces.some(b=>touching(box(b.block), this.feet));
    }
}
class Player extends Character{
    constructor(x, y) {
        super(x, y);
        this.all.className+=' player';
        this.event();
    }
    move(){
        this.int=setInterval(()=>{
            if(!this.standing){
                this.Y += this.step;
            }
            this.all.style.transform = `translate(${this.X+=this._x}%, ${this.Y+=this._y}%) skewX(${this.zx}deg) skewY(${this.zy}deg) scaleX(${this.s}`;
            // world.scrollLeft = parseFloat(getComputedStyle(world).width) * (25/100);
            // world.style.left = player.body.x-nn+'px'
        })
    }
    jump(){
        if (!this.standing) return;
        let a = (this.jumping=this.step=1)-1,
            hold = this.Y,
        u = setInterval(()=>{
            this.Y+=2*[-1,1][a]*this.step;
            if (hold-this.Y>=150) {
                this.jumping = !(a=1);
                clearInterval(u)
                this.forling=this.falling=false;
                this.all.style.top='';
            }
        });
    }
    event(){
        let mv=(n, touch=1)=>{
            if (n<0)return;
            this._x = this.step*[0, 1, 0, -1][n];
            n==0&&this.jump()
            if(n==2) {this.step+=.2*touch;this.forling = true;};
            this.pose = ['up', 'right', 'down', 'left'][n];
            this.zx = [0, -10, 0, 10][n];
            this.zy = [-10, 0, 10, 0][n];
            this.s = [this.s, 1, this.s, -1][n]
        }
        controls.onmousedown=controls.ontouchstart=()=>{
            event.stopPropagation(); event.preventDefault();
            let n = [...controls.children].indexOf(event.target);
            mv(n, 5)
        }
        addEventListener('keydown', event=>{
            event.preventDefault();
            let n =['Up', 'Right', 'Down', 'Left'].map(i=>'Arrow'+i).indexOf(event.key);
            mv(n)
        });
        addEventListener('keyup', event=>{
            9;            
        });
        onkeyup=onmouseup=window.ontouchend=()=>{
            // console.log(this);
            this.all.setAttribute('pose', `${this.zx=this.zy=this._x=this._y=0}`);
            this.shoot(event);
        };
        
        addEventListener('keyup', window.ontouchend)
        window.ontouchend(); this.move()
    }
    shoot(event){
        if (event.target==controls) return;
        let me = this.body;
        let n = new Vec(me.right-me.width/2, me.bottom-me.height/2)
        // console.log(event)
        this.all.body.style.setProperty(
            '--r', `${(180*Math.atan2(event.y-n.y, event.x-n.x))}deg`)
    }
}

class Block{
    constructor(w=4, h=2, isspace=false, r=randBtw(0, 360)+'deg') {
        add(this.block = make(), world).className = 'block';
        this.w = w; this.h = h; this.r = r;
        ['w', 'h', 'r'].forEach(p=>this.block.style.setProperty('--'+p, this[p]));
        if(isspace) this.block.setAttribute('isspace', this.isspace=isspace)
        blocks.push(this)
    }
}
