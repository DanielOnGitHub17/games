bullets = { Players: [], Enemys: [], Friends: [] }
class Bullet {
    constructor(from) {
        this.from = from;
        this.block = makeBlock('Bullet');
        this.block.classList.add(from.type[0]);
        this.dir = from.rZ; this.speed = this.damage = 10;
        this.where = new Vec(parseInt(from.block.style.left) + from.tX,
            parseInt(from.block.style.top) + from.tY);
        setPosition(this.block,
            this.where, 'px');
        this.block.style.transform = `translateZ(100px) rotate(${from.rZ}deg)`;
        this.moving = setInterval(() => {
            let b = document.elementsFromPoint(this.info.x, this.info.y)
                .filter(i => i.classList.contains('block'))[0];
            this.move();
            this.damage -= .1; this.speed -= .1;
            if (this.speed <= 0) this.remove();
        });
        gameBox.appendChild(this.block);
        bullets[from.type + 's'].push(this);
    }
    get info() { return this.block.getBoundingClientRect(); } get center() { let me = this.info; return new Vec(me.right - me.width / 2, me.bottom - me.height / 2) }
    move() {
        this.where.plus(new Vec(cos(this.dir - 90) * this.speed, sin(this.dir - 90) * this.speed));
        setPosition(this.block, this.where, 'px');
        if (!touching(this.block.getBoundingClientRect(), gameBox.getBoundingClientRect())) this.remove();
        for (let a in playables) {
            for (let n of playables[a]) {
                if (n != this.from && touching(n.info, this.info)) {
                    n.life -= this.damage; this.remove()
                }
            }
        }
    }
    remove() {
        this.block.remove();
        clearInterval(this.moving);
        delete bullets[this.from.type + 's'].splice(bullets[this.from.type + 's'].indexOf(this), 1);
        delete this;
    }
}
