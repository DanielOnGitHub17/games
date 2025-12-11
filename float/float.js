let parts = ['head', 'body', 'hands', 'legs'],
    box = document.getElementById('box'),
    cont = box.getBoundingClientRect(),
    submit = document.querySelector("[type='submit']"),
    enemies = [], bullets = [], ouch = ['Ow, my head', 'my tommy aches',
        "I can't catch a bullet! You know", 'Was that a ball on my feet???']
info = document.getElementById('info')
function start(n) {
    if (!n) n = 2
    player = new Player(new Vec(100, 100), 0)
    player.controls = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']
    handleInput(player)
    while (n > 0) {
        enemies.push(new Enemy(new Vec(random(cont.width),
            random(cont.height)), 0))
        n--;
    }
    loadSounds()
    endGame = setInterval(() => {
        if (!enemies.length) { end('You win'); clearInterval(endGame); clearInterval(player.int) }
    }, 1000)
}
function end(str) {
    let restart = document.getElementById('restart')
    restart.innerHTML = `${str}<input value='restart' type='submit'
    onclick="event=>document.forms[1].submit()">`
    restart.style.opacity = 1
}
function shot(rect, obj) {
    rect.dom == obj.hum.head ? obj.life -= 1.5 : obj.life--
    //         obj.hum.textContent = obj.life
    if (obj.life <= 0) obj.remove(); sound[4].play();
    document.querySelector('#hud #you').textContent = player.life;
    (obj instanceof Enemy) ? document.querySelector('#hud #shot').textContent = obj.life + " enemies left: " + enemies.length : showAndHide(ouch[obj.full.indexOf(rect)], 1000)

    rect.dom.style.background = 'transparent'
    setTimeout(() => {
        rect.dom.style.background = obj.color
    }, 500)
}

class Player {
    constructor(where, rangle) {
        this.where = where; this.color = 'black'
        this.life = 10; this.rangle = rangle; this.pangle = rangle
        this.hum = make()
        this.hum.setAttribute('class', 'human')
        this.hum.setAttribute('id', 'player')
        box.appendChild(this.hum)
        for (let each of parts) {
            this.hum[each] = make()
            this.hum[each].setAttribute('class', each)
            this.hum.appendChild(this.hum[each])
        }
        setPosition(this.hum, this.where, 'px')
        this.int = setInterval(() => {
            this.move(2, .5); this.part()
        }, 10)
        this.part()
        this.reload = new Date;
        /*this.__defineGetter__(this.all) = this.hum.getBoundingClientRect()
        for (let each of parts){
            this[each] = this.hum[each].getBoundingClientRect()
        }*/
    }
    part() {
        this.all = this.hum.getBoundingClientRect()
        this.full = []
        for (let each of parts) {
            this[each] = this.hum[each].getBoundingClientRect()
            this.full.push(this[each])
            this[each]['dom'] = this.hum[each]
        }
    }
    move(dir, amount = 10, threeD = false, go = true) {
        let _x = this.where.x, _y = this.where.y;
        let stay = !touching(this.all, cont)
        if (stay && go) this.remove()
        let x = 0, y = 0
        switch (dir) {
            case 0:
                y = -amount;
                break;
            case 1:
                x = amount;
                break;
            case 2:
                y = amount;
                break;
            case 3:
                x = -amount;
                break;
        }
        this.where.plus(new Vec(x, y))
        setPosition(this.hum, this.where, 'px');
        this.rangle -= x;
        this.pangle -= (x + y);/*this.part()*/
        for (let each of [this.hum.hands, this.hum.legs]) {
            setRotation(each, this.pangle)
        }
        threeD && setRotation(this.hum, this.rangle);
    }
    shoot(who = 'enemies', to) {
        let det = new Date;
        let shootOk = (det.getTime() - this.reload.getTime()) / 1000;
        if (shootOk > 0.5) {
            sound[1].play()
            this.reload = det; bullets.push(new Bullet(this.center, this.angle(to), who));
        }
    }
    remove() {
        clearInterval(this.int); delete this.hum.remove();
        this.constructor.name == 'Player' ? end('You lose') :
            delete enemies.splice(enemies.indexOf(this), 1);
    }
    angle(to) {
        let angy = (to.y - this.center.y), angx = (to.x - this.center.x)
        return (Math.atan2(angy, angx) / Math.PI) * 180 + 90
    }
    get center() {
        let me = this.all;
        return new Vec(me.right - me.width / 2, me.bottom - me.height / 2)
    }
}
class Enemy extends Player {
    constructor(where, angle) {
        super(where, angle); this.enemy()
    }
    enemy() {
        this.hum.removeAttribute('id')
        clearInterval(this.int); this.life = 5;
        this.int = setInterval(() => {
            let r = random(4)
            this.innerint = setInterval(() => { this.move(r, 3, true, false); this.part() }, 100)
            let w = this.where
            if (w.x > cont.width || w.x < 0 || w.y > cont.height || w.y < 0) {
                let newEnemy = new Enemy(new Vec(cont.width / 2, cont.height / 2), 0); newEnemy.life = this.life
                enemies.push(newEnemy);
                this.remove();
                //                 this.where = new Vec(random(cont.width), random(cont.height))
                //                 setPosition(this.hum, this.where), 'px'
            }; this.shoot('player', player.where)
        }, random(300) + 1600)
        this.color = 'red'
    }
}

class Bullet {
    constructor(start, direction, target) {
        this.start = start; this.target = target;
        this.bullet = make();
        this.bullet.setAttribute('class', 'bullet');
        box.appendChild(this.bullet);
        setPosition(this.bullet, this.start, 'px');
        this.size = new Vec(randP1(), 0)
        setSize(this.bullet, this.size)
        this.moving = setInterval(() => {
            this.move(direction); if (this.tracked) this.remove();
        }, 50)
    }
    move(angle) {
        let pos = this.start;
        pos.plus(new Vec(cos(angle - 90) * 20, sin(angle - 90) * 20));
        setPosition(this.bullet, pos, 'px');
    }
    get body() {
        return this.bullet.getBoundingClientRect()
    }
    get tracked() {
        let x = this.start.x, y = this.start.y;
        if (this.target == 'enemies') {
            for (let enemy of enemies) {
                for (let part of enemy.full) {
                    if (touching(this.body, part)) {
                        shot(part, enemy); return true;
                    }
                }
            }
        } else if (this.target == 'player') {
            for (let part of player.full) {
                if (touching(this.body, part)) {
                    shot(part, player); return true;
                }
            }
        }
        if (x > cont.width || x < 0 || y > cont.height || y < 0) {
            return true;
        }
        else return false;
    }
    remove() {
        delete this.bullet.remove();
        clearInterval(this.moving)
        delete bullets.splice(bullets.indexOf(this), 1)
    }
}

function handleInput(x) {
    addEventListener('keydown', event => {
        let key = event.key;
        if (x.controls.includes(key)) {
            x.move(x.controls.indexOf(key))
        }
    })
    addEventListener('click', event => {
        x.shoot('enemies', new Vec(event.clientX, event.clientY))
    })
}
submit.addEventListener('click', event => {
    event.preventDefault()
    let form = document.forms[0]; form.style.opacity = '0';
    event.target.disabled = true; let s = form.firstElementChild.value
    start(s < 6 ? s : 6);
})