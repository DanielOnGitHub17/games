class Block{
    constructor(N, w, h, p){
        this.N = N; this.w = w; this.h = h;
        this.brick = make();
        [this.NAME, this.L, this.reflect] = BLOCKNAMES[N];
        site.appendChild(this.brick);
        this.powerUP = p;
        setSize(this.brick, new Vec(w*15, h*15), 'px');
        this.score = 450/(w*h*(1/this.L));
    }
    set type(n){
        this.N = n;
    }
    get type(){
        return this.N
    }
    set life(l){
        this.L=l;
         if (this.L==0){
//              console.log('spaced');
             this.brick.className += ' exploding';
             PlaYer.score+=this.score;
        }
        if (![0, 1].includes(this.L)) return;
//         console.log(this.L)
        [this.NAME, this.L, this.reflect] = BLOCKNAMES[this.L]
    }
    set NAME(n){
        this.name = n;
        this.brick.className = n + ' block';
//         this.type = BLOCKNAMES[this.N].indexOf(this.name)
    }
    get life(){
        return this.L
    }
    get body(){
        return this.brick.getBoundingClientRect();
    }
    fall(){
        setBackground(this.brick, `../images/${POWERUPS[this.P]}.png`)
        setInterval(()=>stuff)
    }
    remove(){
        delete this.brick.remove();
        delete blocks.splice(blocks.indexOf(this), 1);
    }
    ss = 9;
}
//before metal do block of three
//in ball.js do fireball to slow down when in action(breaking blocks)