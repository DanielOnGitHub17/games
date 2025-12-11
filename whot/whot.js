let board = document.getElementById('board'),
    cards = [[1, 1],
    [1, 2], [1, 3], [1, 4], [1, 5], [1, 7], [1, 8], [1, 10], [1, 11],
    [1, 12], [1, 13], [1, 14], [2, 1], [2, 2], [2, 3], [2, 5],
    [2, 7], [2, 10], [2, 11], [2, 13], [2, 14], [3, 1], [3, 2], [3, 3], [3, 5],
    [3, 7], [3, 10], [3, 11], [3, 13], [3, 14], [4, 1], [4, 2], [4, 3],
    [4, 4], [4, 5], [4, 7], [4, 8], [5, 1], [5, 2], [5, 3], [5, 4],
    [5, 5], [5, 7], [5, 8], [5, 10], [5, 11], [5, 12], [5, 13], [5, 14],
    ],
    shapes = { need: 0, triangle: 1, square: 2, cross: 3, star: 4, circle: 5 },
    cards2 = cards.flat();
class Card {
    constructor(info, owner, turn = false) {
        this.turn = turn; this.owner = owner; this.info = info;
        this.card = make(); this.card.setAttribute('class', 'card')
        this.card.obj = this;
        this.owner.hand.appendChild(this.card);
        for (let x in shapes) {
            if (shapes[x] == this.info[0]) {
                this.shape = x
                break;
            }
        } this.draw()
    }
    draw() {
        if (this.turn) {
            this.card.textContent = 'whot'
            this.card.style.cssText =
                "background-color: sienna; color: white";
            return;
        }
        let x = this.shape; this.card.textContent = ''
        this.card.style.cssText = `background-image: url(../../images/${x}.png), url(../../images/${x}.png), url(../../images/${x}.png); --value: '${this.info[1]}'`;
    }
    get selected() {
        let s = this.card.style;
        if (s.border == '4px solid blue') {
            s.border = '2px solid brown'; this.choosen = false
        } else {
            s.border = '4px solid blue'; this.choosen = true
        }
    }
    go(to, from) {
        this.card.style.left = ''
        //from here
        board.appendChild(this.card);
        let f = from.hand.getBoundingClientRect(), g = to.hand.getBoundingClientRect()
        this.card.style.left = f.x; this.card.style.top = f.y
        this.card.style.transform = `translate(${g.x - f.x}px, ${g.y - f.y}px)`
        setTimeout(() => {
            to.hand.appendChild(this.card); this.owner = to
            to.cards.push(this); this.draw(this.card)
            //         delete from.cards[from.cards.indexOf(this)]
            //         from.cards = from.cards.filter(i=>i)
            delete from.cards.splice(from.cards.indexOf(this), 1)
        }, 1000)
    }
    remove() {
        delete this.card.remove()
    }
}
class Market {
    constructor() {
        this.hand = document.getElementById('market');
        this.cards = cards; this.startGame()
        this.hand.addEventListener('dblclick', event => { this.deal(1, player); setTimeout(() => wazobia.play(), 1000) })
    }
    deal(n, to) {
        let s = this.cards,
            turn = to.constructor.name == 'Wazobia' ? 1 : 0
        for (let i = 0; i < n; i++) {
            setTimeout(() => {
                let r = random(s.length)
                this.hand.textContent = ' cards remaining: ' + this.cards.length
                let c = new Card(s[r], this, turn)
                c.go(to, this)
                delete s.splice(r, 1);
            }, 1000 * i)
        }
    }
    startGame(x = random(4) + 3) {
        this.deal(x, player)
        setTimeout(() => this.deal(x, wazobia), x * 1000)
        setTimeout(() => {
            let i = setInterval(() => {
                if (this.cards.length == 0) {
                    showAndHide('wait', 1000)
                    clearInterval(i);
                    setTimeout(() => {
                        let you = count(player)
                        setTimeout(() => {
                            this.ene = count(wazobia);
                            setTimeout(() => {
                                let end = this.ene[0] < you[0] ? 'you lose' : 'you win'
                                if (!end) end = 'its a tie'; alert(end); load();
                            }, this.ene[1])
                        }, you[1])
                    }, 2000)
                }
                if (player.cards.length == 0) { clearInterval(i); alert('you win'); load() }
                if (wazobia.cards.length == 0) { clearInterval(i); { alert('you lose'); load() } }
                speak(player); speak(wazobia);
            }, 500)
        }, x * 2000)
        for (let x of this.cards) {
            if (x[0] != 0) { this.deal(1, holder); break }
        };
    }
}
class Player {
    constructor() {
        this.hand = document.getElementById('cp'); this.turn = true;
        this.cards = []; this.shiftValue = 0; this.play();
    }
    play() {
        this.hand.addEventListener('dblclick', event => {
            let c = event.target
            if (c.parentElement == this.hand) {
                if (holder.receive(c.obj, this)) setTimeout(() => wazobia.play(), 1000)
            }
        })
        this.hand.addEventListener('click', event => {
            if (event.target.parentElement == this.hand) event.target.obj.selected;
        })
        addEventListener('keyup', event => {
            let keys = ['p', 'P']
            console.log(event.key)
            if (keys.includes(event.key)) {
                console.log(event.key)
                this.cards.forEach(i => {
                    if (i.choosen) { if (holder.receive(i, this)) setTimeout(() => wazobia.play(), 1000) }
                })
            }
        })
    }
    goMarket() {
        k
    }
    shift(dir = 730) {
        this.shiftValue += dir
        this.cards.forEach(i => i.card.style.left = `${this.shiftValue}px`)
    }
}
class Wazobia {
    constructor() {
        this.hand = document.getElementById('cw');
        this.cards = []; this.shiftValue = 0; this.turn = false;
    }
    shift(dir = 730) {
        this.shiftValue += dir
        this.cards.forEach(i => i.card.style.left = `${this.shiftValue}px`)
    }
    play() {
        let card = holder.cards[holder.cards.length - 1]
        let c = []
        for (let x of this.cards) {
            if (sameChild(x.info, card.info)) {
                x.turn = false; x.draw();
                holder.receive(x, this);
                return;
            }
        }
        market.deal(1, this)
    }
    give(c) {
        holder.receive()
    }
}
class Holder {//more like  the level manager since all calls start mainly from here
    constructor() {
        this.hand = document.getElementById('holder');
        this.cards = []; this.wait = [1, 2, 14];
        this.pick = [2, 14]
    }
    receive(card, from) {
        let it = this.cards[this.cards.length - 1]
        if (this.cards.length == 0) { card.go(this, from); return }
        if (card.info[0] == 0) {
            for (let need; !(need in shapes) || need == 'need';) {
                need = prompt('What do you need'); this.need = need;
            }
            card.info[0] = shapes[this.need];
            card.go(this, from); from.turn = false; return true;
        }
        if (sameChild(card.info, it.info)) {
            card.go(this, from); return true;
        }
    }
}
let player = new Player, holder = new Holder,
    wazobia = new Wazobia, market = new Market
function count(sprite) {
    [player, wazobia].forEach(i => i.turn = false)
    countingBoard = document.getElementById('count');
    countingBoard.style.opacity = 1;
    let c = 0, str = '';
    sprite.cards.forEach(i => {
        i.turn = false; i.draw()
        str += i.info[1] + ' + '
        c += i.info[1];
    })
    str += `0 = ${c}`
    countingBoard.append(sprite.constructor.name + ': ');
    let x = 0, t = '', r = 0,
        s = setInterval(() => {
            countingBoard.append(str[x])
            x += 1;
            if (x >= str.length) { clearInterval(s); }
            if (str[x] == '+') { sprite.cards[r].remove(); r += 1 }
        }, 200)
    setTimeout(() => countingBoard.innerHTML = '', 250 * str.length)
    return [c, str.length * 260]
}
function speak(x) {
    switch (x.cards.length) {
        case 2:
            showAndHide(x.constructor.name + ': warning', 1000); break;
        case 1:
            showAndHide(x.constructor.name + ': Last card', 1000); break;
        case 0:
            showAndHide(x.constructor.name + ': Check up', 1000); break;
    }
}
//console.log('x');