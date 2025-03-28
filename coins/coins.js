let parts = ['head', 'body', 'hands', 'legs'],
sky = document.getElementById('sky'),
cont = sky.getBoundingClientRect(),
submit = document.querySelector("[type='submit']"),
life = document.getElementById('life'), coins = [], score = 0
info = document.getElementById('info')
function start(n){
    if (!n) n = 2
    player =new Player
    player.controls = ['ArrowLeft', 'ArrowRight']
    handleInput(player)
    loadSounds('../../sounds/', '.wav',['slide', 'Coin', 'Bomb']); sound[0].volume = .1
    LevelManageMent = setInterval(()=>{
        if (coins.length<10) coins.push(new Coin(random(4)))
    }, 1000)
}
function tend(){
    return score<=0;
}
function showAndHide(text='Ouch', time=1000){
    info.textContent = text;
    info.style.opacity = 1;
    setTimeout(()=>info.style.opacity=0, time)
}
function end(str){
    let restart = document.getElementById('restart')
    restart.innerHTML= `${str}<input value='restart' type='submit'
    onclick="event=>document.forms[1].submit()">`
    restart.style.opacity=1; clearInterval(LevelManageMent);
}
class Player{
    constructor(where = 1){
        this.where = where; this.color = 'black'
        this.hum = make()
        this.hum.setAttribute('class', 'human')
        this.hum.setAttribute('id', 'player')
        sky.appendChild(this.hum)
        for (let each of parts){
            this.hum[each] = make()
            this.hum[each].setAttribute('class', each)
            this.hum.appendChild(this.hum[each])
        }
    }
    get body(){
        return this.hum.getBoundingClientRect()
    }
    move(dir){
        if (!dir) dir--; this.where += dir
        if (this.where<0){
            this.where = 0;
        }else if (this.where>2){
            this.where = 2;
        } else sound[0].play()
        this.hum.style.left =  `${this.where*250 + 24}`
        document.querySelectorAll('.hands, .legs').
            forEach(i=>i.style.transform=`rotate(${this.where*360}deg)`)
    }
    get center(){
        let me = this.all;
        return new Vec(me.right-me.width/2, me.bottom-me.height/2)
    }
}
class Coin{
    constructor(where){
        this.where = where;
        this.hum = make()
        if (this.where==3){
            where = random(3)
            this.hum.setAttribute('class', 'coin bomb')
        } else this.hum.setAttribute('class', 'coin')
        sky.appendChild(this.hum); this.rot = -10;
        this.hum.style.left = `${where*300 - (where-1)*50}`
        this.move = setInterval(()=>{
            this.rot += 5
            this.hum.style.transform = `rotateY(${this.rot}deg)`;
            this.hum.style.top = `${this.rot}px`;
            if (touching(this.box, player.body)){
                if (this.where==3) {
                    end(`Game Over. You score: ${score}`)
                    sound[2].play(); showAndHide('oops!')
                    for (let x of coins){x.remove()}
                } else{
                     score++; sound[1].play(); showAndHide('Nice!')
                }
                this.remove()
            }
            if (this.rot>cont.height) {
              this.remove(); if(this.where!=3) {score-=2; showAndHide('Missed!')
             if (tend()) {
                 end(`Game Over. You score: ${score}`)
                 for (let x of coins){x.remove()}
             }
           }
            }
           life.style.width = 5*score+'%'
        })
    }
    get box(){
        return this.hum.getBoundingClientRect()
    }
    remove(){
       delete this.hum.remove();
       clearInterval(this.shake); clearInterval(this.move)
       delete coins.splice(coins.indexOf(this), 1);
    }
}
function handleInput(x){
    addEventListener('keydown', event=>{
        let key = event.key;
        if (x.controls.includes(key)){
            x.move(x.controls.indexOf(key))
        }
    })
    addEventListener('touchstart', event=>{X = event.changedTouches[0].screenX})
    addEventListener('touchend', event=>{
        let a = event.changedTouches[0].screenX-X;
        if (a>100) x.move(1); if (a<-100) x.move(0)
    })
}
submit.addEventListener('click', event=>{
    event.preventDefault()
    let form = document.forms[0]; form.style.opacity='0';
    event.target.disabled= true;
    start();
})