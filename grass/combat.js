alert('Use X to shoot bullets for breaking blocks, and arrow keys to move')
class Box {
    constructor(pic) {
        this.pic = pic;
        if (this.pic == 1) {
            this.life = 5;
            this.int = setInterval(()=>{
                if (this.life <= 0) {
                    this.crack();
                    clearInterval(this.int);
                    delete this.life;
                    this.pic = 0
                }
                ;
            }
            , 500)
        }
        this.div = drawBox(this.pic)
    }
    get body() {
        let box = this.div
        return new DOMRect(box.offsetLeft,box.offsetTop,scale,scale)
    }
    crack() {
        this.pic = 0;
        setBackground(this.div, `images/${this.pic}.png`)
    }
}
class Bullet {
    constructor(start, direction) {
        this.start = start;
        this.bullet = make();
        this.bullet.setAttribute('class', 'bullet');
        container.appendChild(this.bullet);
        setPosition(this.bullet, this.start, 'px');
        this.stop = 0;
        this.moving = setInterval(()=>{
            this.stop++
            this.move(direction);
            if (this.tracked) {
                this.remove();
            }
        }
        )
    }
    move(angle) {
        let pos = this.start;
        pos.plus(new Vec(cos(angle - 90) * 2,sin(angle - 90) * 2));
        setPosition(this.bullet, pos, 'px');
    }
    get body() {
        return this.bullet.getBoundingClientRect()
    }
    get tracked() {
        let x = this.start.x
          , y = this.start.y;
        for (let conc of background.filter(i=>i.life)) {
            if (touching(this.body, conc.body)) {
                conc.life--;
                sound[3].play();
                return true;
            }
        }
        if (this.stop >= 50)
            return true;
    }
    remove() {
        delete this.bullet.remove()
        clearInterval(this.moving)
        delete bullets.splice(bullets.indexOf(this), 1)
    }
}
class Player {
    constructor(where) {
        this.where = where;
        this.angle = 0;
        this.controls = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'x X.']
        this.div = make();
        this.div.setAttribute('class', 'player');
        container.appendChild(this.div)
        setPosition(this.div, this.where, 'px');
        handleInput(this)
    }
    get body() {
        return this.div.getBoundingClientRect();
    }
    get head() {
        let me = this.body;
        return new DOMRect(me.left + 7,me.top,me.width - 14,7);
    }
    get left() {
        let me = this.body
        return new DOMRect(me.left,me.top + 7,7,me.height - 14)
    }
    get right() {
        let me = this.body
        return new DOMRect(me.right - 7,me.top + 7,7,me.height - 14)
    }
    get bottom() {
        let me = this.body;
        return new DOMRect(me.left + 7,me.bottom - 7,me.width - 14,7);
    }
    get center() {
        let me = this.body;
        return new Vec(me.right - me.width / 2,me.bottom - me.height / 2)
    }
    move(dir) {
        let _x = this.where.x
          , _y = this.where.y
          , cant = cantMove();
        let x = 0
          , y = 0;
        if (!touching(box, this.body)) {
            this.where = new Vec(20);
            setPosition(this.div, this.where, 'px');
            return
        };
        switch (dir) {
        case 0:
            !cant.up && (y = -5);
            break;
        case 1:
            !cant.ri && (x = 5);
            break;
        case 2:
            !cant.dn && (y = 5);
            break;
        case 3:
            !cant.lf && (x = -5);
            break;
        }
        this.where.plus(new Vec(x,y))
        setPosition(this.div, this.where, 'px');
        this.angle = dir * 90;
        setRotation(this.div, this.angle);
    }

    shoot() {
        bullets.push(new Bullet(this.center,this.angle));
    }
}
function loadLevel(nrows, ncolumns) {
    for (let i = 0; i < nrows; i++) {
        let row = [];
        for (let j = 0; j < ncolumns; j++) {
            let r = random(3);
            background.push(new Box(r))
            row.push(r)
        }
        levelSource.push(row)
    }
    gy = levelSource.length * scale;
    gx = levelSource[0].length * scale
    container.style.width = gx;
}
loadSounds(folder='../sound/');
function handleInput(player) {
    window.addEventListener('keydown', event=>{
        event.preventDefault()
        let key = event.key;
        if (player.controls.slice(0, 4).includes(key)) {
            player.move(player.controls.indexOf(key));
        }
    }
    );
}
window.addEventListener('keyup', event=>{
    if (player.controls[4].includes(event.key))
        player.shoot();
}
)
function start(y, x) {scale = 35;
     levelSource = [],
       background = [],
       bullets = [], container=document.getElementById('container'),
       timer = document.getElementById('timer');
    t = 0
    loadLevel(y, x);
    e = background.filter(i=>i.life)
    scrollTo(0, 0);
    box = container.getBoundingClientRect()
    player = new Player(new Vec(0,0))
    time = y * x / 2 - y;
    foods = background.filter(i=>i.pic == 2).length;
    handleTouches()
    gameOver = setInterval(()=>{
        checkGrass();
        time -= 0.1
        if (them.length == 0 || time < 1) {
            clearInterval(gameOver)
            restart(`<h1>Good game</h1>
        <p>You got: ${100 - parseInt((them.length / foods) * 100)}%</p>
        <p>Time left is: ${parseInt(time)} seconds</p>`, run=()=>start(15, 15))
        clearInterval(mv);
        t = 0;
        background.forEach(i=>i.div.remove());
        background.length = 0;
        player.div.remove()
        delete player
        }
    }
    , 100)
}
function cantMove() {
    let nove = {}, t = touching, bost
    h = player.head,
    r = player.right,
    d = player.bottom,
    l = player.left;
    for (let obst of background.filter(i=>i.life)) {
        bost = obst.body;
        if (t(h, bost)) {
            nove.up = true;
            break
        }
    }
    for (let obst of background.filter(i=>i.life)) {
        bost = obst.body;
        if (t(r, bost)) {
            nove.ri = true;
            break
        }
    }
    for (let obst of background.filter(i=>i.life)) {
        bost = obst.body;
        if (t(d, bost)) {
            nove.dn = true;
            break
        }
    }
    for (let obst of background.filter(i=>i.life)) {
        bost = obst.body;
        if (t(l, bost)) {
            nove.lf = true;
            break
        }
    }
    return nove;
}
function checkGrass() {
    timer.innerHTML = parseInt(time) + 'seconds';
    timer.style.background=time<21?'#BF360C':''
    them = background.filter(i=>i.pic == 2);
    for (let food of them) {
        if (touching(player.body, food.body)) {
            food.crack();
            sound[10].play();
        }
    }
}
noSound(document.body)
//for phone
t = 0
function handleTouches(){
    pad.addEventListener('touchstart', event=>{
//         event.preventDefault();
        t = 1; tar = event.target.value
        event.target.style.boxShadow = 'none'
    })
    pad.addEventListener('touchend', event=>{
        try{
            event.preventDefault()
        }catch (Error){
            0
        }
        t = 0;
        if (event.target.value=='X') {player.shoot();}
        event.target.style.boxShadow=''
    })
    mv = setInterval(()=>{
        if(t && tar!='X')player.move(touch[tar]);
    }, 50)
}
start(15, 15);