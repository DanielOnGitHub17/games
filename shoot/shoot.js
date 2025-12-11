window.addEventListener('keydown', event => { event.preventDefault() })
window.addEventListener('click', event => {
    document.querySelector("[type='radio']").checked ? (document.getElementById('player2').style.display = 'none') : (document.getElementById('player2').style.display = 'block')
    if (event.target.name == 'mode') {
        sound[0].play()
    }
})
document.body.spellcheck = false;


window.addEventListener('keyup', event => {
    if (event.target.placeholder) {
        event.target.value = event.key;
    }
})

loadSounds();//
/*variables Variables VAriables VARiables VARIables VARIAbles VARIABles*/
//
tips = ["don't chose a whitish (or blackish) color for your player",
    "hover at left of the screen for in-depth controls",
    "Two are better than one",
    "press another key in the box to change controls for a player", "not all enemies are after you, but they don't deserve to live, do they???"
];
document.getElementsByTagName('legend')[0].textContent = 'tip:' + tips[random(5)]
bullets = []
let enemies = []
players = []
window.addEventListener('dblclick', event => { event.preventDefault() })
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
        this.where = where; this.angle = angle;
        this.reload = new Date(); this.life = 10;
        this.size = new Vec(5, 5); setSize(this.you, this.size)
        setRotation(this.you, this.angle); setPosition(this.you, where)

    }

    get body() {
        return new DOMRect(this.where.x, this.where.y, this.size.x, this.size.y)
    }
    get head() {
        let me = this.body;
        return new DOMRect(me.left + 1, me.top, me.width - 2, 2);
    }
    get left() {
        let me = this.body
        return new DOMRect(me.left, me.top + 1, 2, me.height - 2)
    }
    get right() {
        let me = this.body
        return new DOMRect(me.right - 2, me.top + 1, 2, me.height - 2)
    }
    get bottom() {
        let me = this.body;
        return new DOMRect(me.left + 1, me.bottom - 2, me.width - 2, 2);
    }
    get center() {
        let me = this.body;
        return new Vec(me.right - me.width / 2, me.bottom - me.height / 2)
    }
    move(dir) {
        let _x = this.where.x, _y = this.where.y;
        let x = 0, y = 0
        switch (dir) {
            case 0:
                (_y > 0) && (y = -1);
                break;
            case 1:
                (_x < 98) && (x = 1);
                break;
            case 2:
                (_y < 95) && (y = 1);
                break;
            case 3:
                (_x > 0) && (x = -1);
                break;
        }
        this.where.plus(new Vec(x, y))
        setPosition(this.you, this.where);
        this.angle = dir * 90;
        setRotation(this.you, this.angle);
    }

    shoot() {
        let det = new Date;
        let shootOk = (det.getTime() - this.reload.getTime()) / 1000;
        if (shootOk > 0.5) {
            sound[2].play()
            this.reload = det; bullets.push(new Bullet(this.center, this.angle, this.target));
        }
    }
    shot() {
        if (this.life <= 0) this.remove();
        sound[4].play(); this.you.style.background = '#00ff0045'
        setTimeout(() => {
            this.you.style.background = this.hold;
        }, 500)
    }
    remove() {
        this.shoot = this.move = ''
        sound[6].play(); delete container.removeChild(this.you);
        delete players.splice(players.indexOf(this), 1)
    }
}
class Enemy extends Player {
    constructor(where, angle) {
        super(where, angle);
        this.you.setAttribute('class', 'enemy');
        this.turn = setInterval(() => {
            this.update()
        }, this.update())
        this.zoop = setInterval(() => {
            this.shoot();
        }, random(500) + 2500)
    }
    update() {
        this.yourHead.textContent = this.life;
        if (this.life <= 0) {
            this.remove(); return;
        }
        if (this.target) {
            let angy = (this.target.center.y - this.center.y), angx = (this.target.center.x - this.center.x)
            this.angle = (Math.atan2(angy, angx) / Math.PI) * 180 + 90
            setRotation(this.you, this.angle);
            return random(30) + 40;
        } else {
            this.angle = random(360);
            setRotation(this.you, this.angle); return random(300) + 900;
        }
    }
    shoot() {
        sound[1].play();
        bullets.push(new Bullet(this.center, this.angle, 'players'))
    }
    remove() {
        sound[5].play()
        delete container.removeChild(this.you);
        clearInterval(this.turn); clearInterval(this.zoop)
        delete enemies.splice(enemies.indexOf(this), 1)
    }
}

class Bullet {
    constructor(start, direction, target) {
        this.start = start; this.target = target;
        this.bullet = make();
        this.bullet.setAttribute('class', 'bullet');
        box.appendChild(this.bullet);
        setPosition(this.bullet, this.start);
        this.size = new Vec(randP1())
        setSize(this.bullet, this.size)
        this.moving = setInterval(() => {
            this.move(direction); if (this.tracked) {
                this.remove();
            }
        }, 50)
    }
    move(angle) {
        let pos = this.start;
        pos.plus(new Vec(cos(angle - 90) * 2, sin(angle - 90) * 2));
        setPosition(this.bullet, pos);
    }
    get body() {
        return new DOMRect(this.start.x, this.start.y, this.size.x, this.size.y)
    }
    get tracked() {
        let x = this.start.x, y = this.start.y;
        if (this.target == 'enemies') {
            for (let enemy of enemies) {
                if (touching(this.body, enemy.body)) {
                    enemy.life--; sound[3].play(); return true;
                }
            }
        } else if (this.target == 'players') {
            for (let charac of players) {
                if (touching(this.body, charac.body)) {
                    charac.life--; charac.shot(); return true;
                }
            }
        } else if (this.target.body) {
            if (touching(this.body, this.target.body)) {
                this.target.life--; this.target.shot(); return true;
            }
        }
        if (x > 100 || x < 0 || y > 100 || y < 0) {
            return true;
        }
        else return false;
    }
    remove() {
        delete container.removeChild(this.bullet);
        clearInterval(this.moving)
        delete bullets.splice(bullets.indexOf(this), 1)
    }
}



//settings//settings settings
let container = document.getElementById('box'),
    submit = document.querySelector("[type='submit']");

submit.addEventListener('click', event => {
    event.preventDefault();
    container.style.opacity = '100%';
    container.style.background = 'ghostwhite';
    document.getElementById('settings').style.display = 'none'
    //load level
    l = modeDif();
    switch (l.mode) {
        case 'alone':
            player = new Player(new Vec(random(100)), 90);
            loadKeys(player, 'player1')
            enemies = loadThem(l.difficulty, player);
            player.target = 'enemies'; players.push(player)
            break;
        case 'united':
            player1 = new Player(new Vec(random(100)), 90);
            player2 = new Player(new Vec(random(100)), 90);
            loadKeys(player1, 'player1'); loadKeys(player2, 'player2')
            enemies = loadThem(l.difficulty / 2, player1).concat(loadThem(l.difficulty / 2, player2));
            player1.target = player2.target = 'enemies';
            players.push(player1, player2)
            break;
        case 'hatred':
            player1 = new Player(new Vec(random(95)), 90); player1.life = 11 - l.difficulty;
            player2 = new Player(new Vec(random(95)), 90); player2.life = 11 - l.difficulty;
            loadKeys(player1, 'player1'); loadKeys(player2, 'player2')
            player1.target = player2; player2.target = player1;
            players.push(player1, player2);
            break;
    }
    gameOver = setInterval(() => {
        checkAll(l);
    }, 700)
})
/*
window.addEventListener('error', ()=>{
    console.clear();
})*/