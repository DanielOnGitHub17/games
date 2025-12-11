k = localStorage.setItem('me', 'ddaniel')
let walls = ['top', 'side', 'face'], world = document.getElementById('world'),
    sides = ['left', 'right']
class Block {
    constructor() {
        this.block = make()
        this.block.setAttribute('class', 'block')
        for (let each of walls) {
            this.block[each] = make()
            this.block[each].setAttribute('class', each)
            this.block.appendChild(this.block[each])
        }
        world.appendChild(this.block)
    }
}
class Space {
    constructor(at, size) {
        this.space = make();
        this.space.setAttribute('class', 'space');
        world.appendChild(this.space)
        this.at = at; this.width = size.x; this.height = size.y;
        setPosition(this.space, at, 'px'); setSize(this.space, size, 'px')
    }
}
class Player {
    constructor() {
        this.human = make();
        this.human.setAttribute('class', 'human');
        this.axial = ['head', 'back'];
        this.apendicular = {
            hand: ['humerus', 'ulnoradius'],
            leg: ['femur', 'tibiofibula']
        };
        for (let each of this.axial) {
            this[each] = make()
            this[each].setAttribute('class', each)
            this.human.appendChild(this[each])
        }
        for (let each in this.apendicular) {
            for (let side of sides) {
                let part = side + ' ' + each
                this[part] = make()
                this[part].setAttribute('class', part)
                this.human.appendChild(this[part])
                for (let bone of this.apendicular[each]) {
                    let both = side + ' ' + bone
                    this[both] = make()
                    this[both].setAttribute('class', bone)
                    this[part].appendChild(this[both])
                }
            }
        }
        world.appendChild(this.human)
    }
}
let a = new Block, h = new Player
swing = () => setInterval(() => {
    document.querySelector('.leg.left').style.transform = 'rotate(-70deg)'
    document.querySelector('.hand.right').style.transform = 'rotate(-70deg)'
    document.querySelector('.leg.right').style.transform = 'rotate(70deg)'
    document.querySelector('.hand.left').style.transform = 'rotate(70deg)'
    setTimeout(() => {
        document.querySelector('.leg.left').style.transform = 'rotate(70deg)'
        document.querySelector('.hand.right').style.transform = 'rotate(70deg)'
        document.querySelector('.leg.right').style.transform = 'rotate(-70deg)'
        document.querySelector('.hand.left').style.transform = 'rotate(-70deg)'
    }, 700)
}, 1300)
j = new Space(new Vec(200, 0), new Vec(100, 200))
s = 0
function move(n = 3) {
    s += n
    h.human.style.left = s + 'px'
}
/*addEventListener('keydown', event=>{
    /*event.preventDefault(); move()
    })*/
swing()