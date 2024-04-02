//Build
let board=get('board'), container = get('container'), seeds = [], mark=get('mark'), marker = get('marker');
start=()=>{
//     board.querySelectorAll('*').forEach(i=>i.remove());
//     seeds.forEach(i=>i.remove())
    for (let r=0; r<7; r++){
    let row = board.insertRow();
    for (let c=0; c<6; c++){
        let col = row.insertCell();
        let hold = make(); hold.className = 'holder';
        col.appendChild(hold);
    }
    j = new Seed(0);
}};
window.__defineGetter__('firstseed', ()=>document.querySelector('#container .seed').obj)
let firstseed;
class Seed{
    constructor(n=0){
        if ([...container.children].some(i=>i.className.includes('seed'))) return;
        this.type = n;
        (this.seed = make()).className = ['first', 'second'][n]+' seed';
        document.body.style.background = ['#ff00006e', '#0000ff6e'][n];
        container.insertBefore(this.seed, board); this.seed.obj = this;
        this.canmove = 0; this.event();
        firstseed = this; let pos = 0;
        Object.defineProperty(this, 'pos', {
            get: function(){return pos},
            set: function(x){
                this.seed.style.transform = `translate(${(pos=x)}px, 3vh)`;
            }
        })
    }
    event(){
        window.onmousedown = window.ontouchstart =()=> {
//             if(event.target!=container) return;
            this.canmove = 1;
            this.x = (event.type.includes('touch')?event.touches[0].clientX:event.x);
        }
        window.onmouseup = window.ontouchend =()=> {
//             if(event.target!=container) return;
            this.canmove = 0 ; this.canfall && this.fall();;
        }
        window.onmousemove = window.ontouchmove= ()=> {
//             event.prevent
//                 console.log(event)
//             if(event.target!=container) return;
            if (this.canmove){
                this.pos = (event.type.includes('touch')?event.touches[0].clientX:event.x)-this.x; board.highlightrow(this.rowon);
                let c = 19.5*window.innerHeight/100;
                if (this.pos>c) this.pos=c;
                if (this.pos<-c) this.pos=-c;
            }
        }
    }
    fall(){
         board.highlightrow(this.rowon);
        this.seed.onmouseup=this.seed.onmousedown=this.seed.onmousemove = null;
        let cell = board.rows[this.rowon].cells;
        this.X = this.rowon; this.c = 0; let n=0, h,
        i=
        setInterval(()=>{
            this.seed.style.transform = '';
            if (n<6&&cell[n].firstElementChild.className=='holder'){
                h = cell[n].firstElementChild;
                cell[n].replaceChild(this.seed, h);
                if(n)cell[n-1].appendChild(h)
                n+=1;
            }else{
                clearInterval(i);
                this.Y = n-1; board.highlightrow();
                seeds.push(this);
                new Seed(this.type?0:1);
                checkfourinall();
            }
        }, 100);
    }
    get canfall(){
        return !!(board.rows[this.rowon].firstElementChild.querySelector('.holder'))
    }
    get rowon(){
        let xs = [...board.rows].map(r=>Math.abs(r.getBoundingClientRect().x-this.seed.getBoundingClientRect().x));
        return xs.indexOf(Math.min(...xs));
    }
    //after the fall
    get fours(){
        let x = this.X, y = this.Y, checkers = [];
        if(x-3>-1) checkers.push([[x-3, y], [x-2, y], [x-1, y], [x, y]])
        if(x+3<7) checkers.push([[x, y], [x+1, y], [x+2, y], [x+3, y]]);
        if(y-3>-1) checkers.push([[x, y-3], [x, y-2], [x, y-1], [x, y]])
        if(y+3<6) checkers.push([[y, x], [x, y+1], [x, y+2], [x, y+3]]);
        if(x+3<7&&y-3>-1) checkers.push([[x,y], [x+1,y-1], [x+2,y-2], [x+3,y-3]]);
        if(x+3<7&&y+3<6) checkers.push([[x,y], [x+1,y+1], [x+2,y+2], [x+3,y+3]]);
        if(x-3>-1&&y-3>-1) checkers.push([[x,y], [x-1,y-1], [x-2,y-2], [x-3,y-3]]);
        if(x-3>-1&&y+3<6) checkers.push([[x,y], [x-1,y+1], [x-2,y+2], [x-3,y+3]]);
        return checkers;
    }
    get wherefour(){
        let ret;
        for (let f of this.fours){
            if(f.every(s=>Seed.seedAt(s[0], s[1]).type==this.type)){
                return f;
            }
        }
    }
    get center(){
        let b = this.seed.getBoundingClientRect();
        return new Vec(b.width/2+b.x, b.height/2+b.y);
    }
    remove(){
        delete seeds.splice(seeds.indexOf(this),1);
        this.seed.remove();
    }
    static seedAt(x,y){
        x=+x; y=+y;
        let obj = {x: x, y: y};
        let n = x!=0&&!x?'y':y!=0&&!y?'x':1;
        if(!+n){
            let ret = [];
            for (let s of seeds){
                if(s[n.toUpperCase()]==obj[n]) ret.push(s);
            }
            return ret;
        }
        for (let s of seeds){
            if(s.X==x && s.Y==y) return s;
        }
        return {type: 'adfa'}
    }
}
//  columns
board.highlightrow=(n)=>{
    [...board.rows].forEach(i=>i.style.background='');
    n = +n;
    if(n!=0&&!n) return;
    if (n>6) n=6; if (n<0) n = 0;
    board.rows[n].style.background = 'black';
}
function checkfourinall(){
    if(seeds.length==42) location=location;
    for (let s of seeds){
        if (s.wherefour) gameover(s);
    }
}
function gameover(s){
    let start = Seed.seedAt(s.wherefour[0][0], s.wherefour[0][1]).center;
     end = Seed.seedAt(s.wherefour[3][0], s.wherefour[3][1]).center;
    mark.setAttribute('d', `M${start.x} ${start.y} L${end.x} ${end.y}`);
//     alert(['red', 'blue'][s.type]+' wins');
    setTimeout(()=>location=location, 2000)
}
onresize = ()=>location=location;
// board.
start();