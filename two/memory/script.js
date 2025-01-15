let startar = getS('[type=submit]'), 
board = get('board'),
form = get('settings'), words, cards=[], hold=false,
level = [], lev=[],
players = [...getAll('.player')], 
backgrounds = ["rgba(255, 0, 0, 0.44)", "rgba(0, 0, 255, 0.44)"];
players.forEach(p=>p.querySelectorAll('[class]').forEach(i=>p[i.className]=i))
onresize = ()=>location=location;
fetch;
window.__defineGetter__('k', ()=>[...new FormData(form).values()])
bible=(n)=>{return bibleVerses[n]};
pictures=(n)=>{return picsrces[n]};
numbers=(n)=>{return n};
Object.defineProperty(window, 'turn', {
    set: function(v){
        document.body.style.background=backgrounds[v];
         hold=false;
    },
    get: function(){return backgrounds.indexOf(document.body.style.background)}
});
form.onsubmit=(event)=>{
    event.preventDefault();
    if (getAll('[id*=player]').reduce((i, j)=>(i.value==j.value)&&i.value!='')) return errormessages.innerHTML = 'Please choose different names.';
    errormessages.innerHTML = '';
    gameBox.hidden = !(form.hidden = 1);
    players.forEach((p, i)=>{p.nameof.textContent = k[i+1]?k[i+1]:get('player'+(i+1)).placeholder;
     p.points.textContent = 0; p.style.background=backgrounds[i]})
    startGame(k[0]);
}
// form.onsubmit({preventDefault: console.log});
function startGame(scheme){
    turn = 0; gameBox.style.display= 'flex';
    w = board.offsetWidth; h = board.offsetHeight;
    r = parseInt((h-50)/110), sr = (h-50-r*110),
    c = parseInt((w-50)/110), sc = w-50-c*110;
    while(r*c>30) r>c?r--:c--;
    if((r*c)%2){r>c?r--:c--};
    for (let n=1; n<r*c/2+1; n++){
        lev.push(window[scheme](n)); lev.push(window[scheme](n));
    }
//     console.log(lev.length)
    for (let n=0; n<r; n++){
        let row = [];
        for (let i=0; i<c; i++){
            let ran = randBtw(0, lev.length-1);
            row.push(lev.splice(ran, 1)[0]);
        };
        level.push(row);
    }
    level.forEach((r, n)=>{
        r.forEach((c, i)=>{
            let card = new Card(scheme=='pictures'?'':c, scheme=='pictures'?c:'');
            setPosition(card.card, new Vec(i*120+sc, n*120+sr), 'px')
        })
    })
}
function reset(){
    3
}
class Card{
    constructor(text='', src=''){
        (board.appendChild(this.card = make('div'))).className = 'card';
        ['front', 'back'].forEach(s=>(this.card.appendChild(this[s] = make('div'))).className=s)
        this.src=src?setBackground(this.front, `images/${src}`)
        :this.front.innerHTML=text; this.det=this.src?this.src:this.text;
        Object.defineProperty(this, 'selected', {
            get: function(){return eval(this.card.getAttribute('selected'))},
            set: function(s){this.card.setAttribute('selected', !!eval(s))}
        });
        this.card.onclick = ()=>{
            if(hold) return;
            this.selected = 1;
            if(Card.selected.length==2){
                hold = true;
                if(Card.selected.every(c=>c.det==this.det)){
                    setTimeout(Card.collect, 800);
                }else{
                    setTimeout(Card.reset, 800)
                }
            }
            this.card.blur()
        };
        this.card.onkeydown=()=>{
            event.key=='Enter'&&this.card.click()
        }
        cards.push(this);
        this.card.tabIndex= 1;
        this.card.name = 'card';
        this.card.type ='radio';
        
    }
    collect(){
        anyStyles(this.card, {
            position: 'fixed',
            top: 'calc(50% - 65px)',
             left: 'calc(50% - 65px)', 
             '--sc': 2});
        setTimeout(()=>anyStyles(this.card, {
            top: turn*(board.offsetWidth)/2+[-1, 1][turn]*125+'px',
             '--sc': 0}), 500);
        this.collected = true; this.owner = turn;
        setTimeout(()=>this.selected=false||this.remove(), 1000);
    };
    remove(){
        cards.splice(cards.indexOf(this), 1).length = 0;
        this.card.remove();
    }
    static collect(){
        Card.selected.forEach(i=>i.collect());
        setTimeout(()=>{
             players[turn].points.textContent++; turn=turn;
             let p0 = +players[0].points.textContent, p1 = +players[1].points.textContent,
             n0 = players[0].nameof.textContent, n1=players[1].nameof.textContent;
             if(!cards.filter(i=>i.owner==undefined).length) {
                 board.innerHTML = (`${p0>p1?n0:p1>p0?n1:'Nobody'} wins!<br><br>
                 Click the restart button to restart the game--> <button>Restart</button>`);
//                  alert(p0>p1?n0+' wins':p1>p0?n1+' wins':'Draw');
                 board.onclick=()=>event.target.nodeName=='BUTTON' && (gameBox.hidden = !(board.onclick=board.innerHTML=level.length=form.hidden=gameBox.style.display=document.body.style.background=''));
             }
         }, 1200);
    }
    static get selected(){
        return cards.filter(i=>i.selected);
    }
    static reset(){
        setTimeout(()=>turn = turn?0:1, 500);
        Card.selected.forEach(c=>c.selected=false);
    }
}