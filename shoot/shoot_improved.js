window.addEventListener('click', event=>{
    document.querySelector("[type='radio']").checked ? (document.getElementById('player2').style.display = 'none') : (document.getElementById('player2').style.display = 'block')
    if (event.target.name == 'mode') {
        sound[0].play()
    }
}
)
document.body.spellcheck = false;

window.addEventListener('keyup', event=>{
    if (event.target.placeholder) {
        event.target.value = event.key;
    }
}
)

loadSounds('../sound/');
//
/*variables Variables VAriables VARiables VARIables VARIAbles VARIABles*/
//
tips = ["don't chose a whitish (or blackish) color for your player", "hover at left of the screen for in-depth controls", "Two are better than one", "press another key in the box to change controls for a player", "not all enemies are after you, but they don't deserve to live, do they???"];
document.getElementsByTagName('legend')[0].textContent = 'tip:' + tips[random(5)]
bullets = []
let enemies = []
players = []
window.addEventListener('dblclick', event=>{
    event.preventDefault()
}
)
//
/*classes classes classes classes classes classes classes*/
//

class Player {
    constructor(where, angle) {
        this.you = make();
        this.you.setAttribute('class', 'player')
        this.yourHead = make();
        this.yourHead.setAttribute('class', 'head');
        this.you.appendChild(this.yourHead);
        container.appendChild(this.you);
        this.where = where;
        this.angle = angle;
        this.reload = new Date();
        this.life = 10;
        this.size = new Vec(5,5);
        setSize(this.you, this.size)
        setRotation(this.you, this.angle);
        setPosition(this.you, where);
        this.dirs = [0, 0, 0, 0];
        this.rotate = true;
        setInterval(()=>this.move());
        this.yourHead.textContent = this.life
    }

    get body() {
        return new DOMRect(this.where.x,this.where.y,this.size.x,this.size.y)
    }
    get center() {
        let me = this.body;
        return new Vec(me.right - me.width / 2,me.bottom - me.height / 2)
    }
    move() {
        let _x = this.where.x
          , _y = this.where.y;
        let x = 0
          , y = 0;
        if (_x < 0)
            this.where.x = 1;
        if (_x > 98)
            this.where.x = 97;
        if (_y < 0)
            this.where.y = 1;
        if (_y > 95)
            this.where.y = 94;
        setPosition(this.you, this.where)
        if (!sum(this.dirs))
            return;
        this.where.plus(new Vec(this.dirs[1] - this.dirs[3],this.dirs[2] - this.dirs[0]));
        setPosition(this.you, this.where);
        if (this.rotate) {
            let dir = 0;
            //              this.dirs.forEach(i=>{if(i) dir+=this.dirs.indexOf(i)})
            for (let i = 0; i < this.dirs.length; i++) {
                if (this.dirs[i])
                    dir += i;
            }
            dir /= (sum(this.dirs) * 5);
            if (dir == 1.5 && this.dirs[0])
                dir += 2
            this.angle = dir * 90;
            setRotation(this.you, this.angle);
        } else {
            console.log(this.rotate)
        }
        //          requestAnimationFrame(this.move)
    }

    shoot() {
        let det = new Date;
        let shootOk = (det.getTime() - this.reload.getTime()) / 1000;
        if (shootOk > 0.2) {
            sound[2].play()
            this.reload = det;
            bullets.push(new Bullet(this.center,this.angle,this.target));
        }
    }
    shot() {
        if (this.life <= 0)
            this.remove();
        sound[4].play();
        this.you.style.background = this.hold + '40'
        setTimeout(()=>{
            this.you.style.background = this.hold;
        }
        , 500)
        this.yourHead.textContent = this.life
    }
    remove() {
        this.shoot = this.move = ()=>{}
        sound[9].play();
        delete this.you.remove();
        let p = players.indexOf(this);
        delete players.splice(players.indexOf(this), 1);
        //         console.log('got here')
        if (over)
            return
        if (!players.length && l.mode != 'hatred') {
            restart('YOU LOSE<hr><hr>')
        }
        if (l.mode == 'hatred') {
            restart(`${document.getElementsByClassName('namer')[1 - p].value} wins<br></hr>`)
        }
        this.remove = ()=>{}
    }
}
class Enemy extends Player {
    constructor(where, angle) {
        super(where, angle);
        this.you.setAttribute('class', 'enemy');
        this.move = ()=>{}
        this.turn = setInterval(()=>{
            this.update()
        }
        , this.update())
        this.zoop = setInterval(()=>{
            this.shoot();
        }
        , random(500) + 2500)
    }
    update() {
        this.yourHead.textContent = this.life;
        if (this.life <= 0) {
            this.remove();
            ;return;
        }
        if (this.target) {
            let angy = (this.target.center.y - this.center.y)
              , angx = (this.target.center.x - this.center.x)
            this.angle = (Math.atan2(angy, angx) / Math.PI) * 180 + 90
            setRotation(this.you, this.angle);
            return random(30) + 40;
        } else {
            this.angle = random(360);
            setRotation(this.you, this.angle);
            return random(300) + 900;
        }
    }
    shoot() {
        sound[1].play();
        bullets.push(new Bullet(this.center,this.angle,'players'))
    }
    remove() {
        sound[5].play()
        delete this.you.remove();
        clearInterval(this.turn);
        clearInterval(this.zoop)
        delete enemies.splice(enemies.indexOf(this), 1)
        if (over)
            return
        if (!enemies.length)
            restart('YOU WIN<br><hr>')
    }
}

class Bullet {
    constructor(start, direction, target) {
        this.start = start;
        this.target = target;
        this.bullet = make();
        this.bullet.setAttribute('class', 'bullet');
        box.appendChild(this.bullet);
        setPosition(this.bullet, this.start);
        this.size = new Vec(randP1())
        setSize(this.bullet, this.size)
        this.moving = setInterval(()=>{
            this.move(direction);
            if (this.tracked) {
                this.remove();
            }
        }
        , 50)
    }
    move(angle) {
        let pos = this.start;
        pos.plus(new Vec(cos(angle - 90) * 2,sin(angle - 90) * 2));
        setPosition(this.bullet, pos);
    }
    get body() {
        return new DOMRect(this.start.x,this.start.y,this.size.x,this.size.y)
    }
    get tracked() {
        let x = this.start.x
          , y = this.start.y;
        if (this.target == 'enemies') {
            for (let enemy of enemies) {
                if (touching(this.body, enemy.body)) {
                    enemy.life--;
                    sound[3].play();
                    return true;
                }
            }
        } else if (this.target == 'players') {
            for (let charac of players) {
                if (touching(this.body, charac.body)) {
                    charac.life--;
                    charac.shot();
                    return true;
                }
            }
        } else if (this.target.body) {
            if (touching(this.body, this.target.body)) {
                this.target.life--;
                this.target.shot();
                return true;
            }
        }
        if (x > 100 || x < 0 || y > 100 || y < 0) {
            return true;
        } else
            return false;
    }
    remove() {
        delete this.bullet.remove();
        clearInterval(this.moving)
        delete bullets.splice(bullets.indexOf(this), 1)
    }
}

//settings//settings settings
let container = document.getElementById('box')
  , submit = document.querySelector("[type='submit']");

submit.addEventListener('click', event=>{
    event.preventDefault();
    //console.clear()
    container.style.opacity = '100%';
    container.style.background = 'ghostwhite';
    document.getElementById('settings').style.display = 'none';
    let ch = sf.checked;
    pad.style.display = ch ? 'flex' : 'none';
    container.style.width = ch ? `${+(getComputedStyle(container).width) - 150}px` : ''
    //load level
    over = false
    l = modeDif();
    n = ['alone', 'united', 'hatred'].indexOf(l.mode) + 1
    for (let i = 0; i < n; i++) {
        if (i == 2)
            return;
        players.push(new Player(new Vec(random(100)),90))
        loadKeys(players[i], `player${i + 1}`)
        players[i].target = 'enemies';
        if (n != 3) {
            enemies = enemies.concat(loadThem(l.difficulty / n, players[i]))
        } else {
            setTimeout(()=>{
                players[i].target = players[1 - i];
                players[i].life = 11 - l.difficulty;
            }
            , 1000)
        }
        ;
    }
}
)

// window.addEventListener('error', ()=>{
//     console.clear();
// })
noSound(settings)
function reset() {
    over = true;
    //     for (let x=0; x<4; x++){
    players.forEach(i=>i.remove());
    enemies.forEach(i=>setTimeout(()=>i.remove(), 500 * enemies.indexOf(i)));
    bullets.forEach(i=>i.remove());
    //     }
    settings.style.display = '';
    container.style.background = '';
    container.style.opacity = '';
    container.style.width = '';
    document.getElementsByTagName('legend')[0].textContent = 'tip:' + tips[random(5)]
}
function handleTouches() {
    pad.addEventListener('touchstart', event=>{
        event.preventDefault();
        event.target.style.boxShadow = 'none';
        which = touch[event.target.value];
        !(which instanceof Array) ? players[0].dirs[which] = .2 : which.forEach(i=>players[0].dirs[i] = .2);
    }
    )
    pad.addEventListener('touchend', event=>{
        event.target.style.boxShadow = '';
        event.target.value == 'X' ? players[0].shoot() : players[0].dirs = [0, 0, 0, 0];
    }
    )
    pad.addEventListener('touchmove', event=>{
        event.preventDefault();
        //         event.target.style.boxShadow = 'none';
        //         console.log(event.target.value)
    }
    )
}

handleTouches()
