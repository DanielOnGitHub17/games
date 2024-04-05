//start general
class Vec{
    constructor(x, y){
        this.x = x;
        (y==undefined) ? this.y = x: this.y = y;
    }
    plus(another){
     this.x = this.x + another.x; this.y = this.y + another.y;
    }
    factor(n){
        return new Vec(this.x*n, this.y*n)
    }
}
function setPosition(sprite, where, str='%'){
    sprite.style.left = where.x+str; sprite.style.top=where.y+str;
}
function setRotation(sprite, angle){
    sprite.style.transform = `rotate(${angle}deg)`;
}
function setBackground(sprite, src){
    sprite.style.backgroundImage = `url(${src})`
}
function touching(rect1, rect2){
    if(rect1.right > rect2.left
        && rect1.left < rect2.right ){
       // rect1 is intersecting rect2 on x axis
       // But they could be at different heights

       if(rect1.top < rect2.bottom
           && rect1.bottom > rect2.top ){
           // rect1 is intersecting rect2 on y axis as well
           // Collision detected
           return true;
     }
   }; return false;
};
function d(dom){
    let f = parseFloat;
    return new DOMRect(f(dom.style.left),f(dom.style.top)
      ,f(dom.style.width),f(dom.style.height))
};
/*for shoot before but can be used for others*/function restart(msg, run=reset, styles, prompt='restart'){
    //this can also be used for pausing
    let msgbox = make();
    msgbox.id = 'restarter';
    msgbox.innerHTML = msg;
    document.body.appendChild(msgbox)
    let button = make('button')
    button.textContent = prompt; msgbox.appendChild(button)
    button.before(' click button to restart: ')
    if (styles) manyStyles(msg, styles)
    button.onclick = run
    button.addEventListener('click', ()=>{msgbox.remove()})
}
/*this one too*/function loadSounds(folder = '../../Vs Projects/sound/Wav/',_='.wav',
    sources = ['mouse_click', 'monster_minigun','shotgun',
     'monster_hit', 'mouse_error', 'explosion', 'male_death',
     'bomb_activate', 'energy_on', 'big_explosion', 'Rip']){
    sound = [];
    for(let i=0; i<sources.length; i++){
        sound[i]= new Audio;
        sound[i].src = folder+sources[i]+_
    }
}
function sameChild(first, second){
    for (let i = 0; i<first.length; i++){
        if (first[i]==second[i]) return true
    }
    return false
}
function showAndHide(text='Ouch', time){
    //do that it will check if info exists, create if it doesn't and style it;
    info.textContent = text;
    info.style.opacity = 1;
    setTimeout(()=>info.style.opacity=0, time)
}
function repeat(n, f){
    for (let i = 0; i<n; i++){
        f()
    }
}
function identical(A1, A2){
    for (let i of A1){
        if (A2.indexOf(i)==-1) return false
    }
    return true;
}
function manyStyles(node, a={}){
    for (let x in node.style){
        if (x in a){
            node.style[x]= a[x];
        }
    }
}
function anyStyles(node, a={}){
    for (let x in a){
        node.style.setProperty(x,  a[x])
    }
}
/*was for matrix.html*/function stopSign(){
    if (['-', '+', ''].includes(event.key)){
        event.preventDefault()
    }
}
/*was for matrix.html*/function changeSign(){
    event.target.textContent = (event.target.textContent == '+')?'-':'+'
}
function sum(array){
    let s = 0;
    array.forEach(i=>s+=i);
    return s;
}

function noSound(where, pos='absolute'){let mute = make('input');
mute.id = 'mute'; mute.type = 'checkbox';
where.appendChild(mute); mute.style.position = pos;
mute.onchange = ()=>sound.forEach(i=>i.volume = mute.checked+0);
mute.before('Play sound '); mute.checked = true;}

function startAgainWithoutRefresh(){}
function collapser(){}
//for phone
touch = {'↖':[0, 3],
'↑':0,
'↗':[0, 1],
'←':3,
'→':1,
'↙':[2, 3],
'↓':2,
'↘':[1, 2],}
tX = 0; tY = 0;
pad = window['pad']
//i did it for block breaker
function goToScreen(screenName, t='', container=document.body, selected=window['selected']){
    Array.from(container.children).forEach(i=>{
        let det = (i.id==screenName);
        i.selected = det;
        if(det){
           i.incase = t;
           i.style.display='';
           i.back = selected;
           i.selected = det;
           selected = i;
//            return
        } else{i.style.display='none'}
    })
}
function position(div, x, y, _='px'){
    div.style.transform = `translate(${x+_}, ${y+_})`
}
function copy(array, fill){
    let ans = [];
    array.forEach(i=>{
        if(i instanceof Array){
            let j = copy(i, fill);
            ans.push(j);
        } else{ans.push(fill?fill:i)}
    });
    return ans;
}
function clearArray(array) {
    array.forEach(i=>{
        if(i instanceof Array){
            clearArray(i);
        }
        delete i;
    });
    array.length=0;
    delete array;
}
let make= (name='div')=>document.createElement(name),
    makeSVG=(name)=>document.createElementNS('http://www.w3.org/2000/svg', name),
get=(id)=>document.getElementById(id),
getE=(selector, value)=>document.querySelector(`[${selector}=${value}]`),
getS=(query)=>document.querySelector(query),
getAll=(query)=>[...document.querySelectorAll(query)];
let identify=()=>getAll('[id]').forEach(i=>window[i.id]=i),
    add=(what, to=document.body)=>to.appendChild(what),
    bx = (who)=>who.getBoundingClientRect();
//did it for MEMORY game April 15 2023; 00:00
// function count(value, array){
//     ret = 0;
//     array.forEach(i=>i==value&&ret++)
    //use filter.length instead
// }
//start math
function randP1(){
    n = Math.random();
    while (n<0.5) n *= 2;
    return n;
}
function random(n){
    return parseInt(n*Math.random())
}
function randBtw(x=0, y=0, prec=0){
    let n = `${(y-x+1)*Math.random()+x}`;
    let s = n.split('.'),
    N = s[0]+s[1].slice(0, prec)
    return Number(N)
}
function sin(deg){
    deg = deg*Math.PI/180;
    return Math.sin(deg);
}

function cos(deg){
    deg = deg*Math.PI/180;
    return Math.cos(deg);
}
tan = (x) => sin(x)/cos(x);
atan=(y, x=1)=>Math.atan2(y, x)*(180/Math.PI);
['asin', 'acos'].forEach(a=>window[a]=(x)=>Math[a](x)*(180/Math.PI));
//end math
//end general

//start shoot.html
function setSize(sprite, size, _='%'){
    sprite.style.width = size.x+_; sprite.style.height = size.y+_;
}
//Holy Spirit thank you for showing me 2 Nov, 2022
function handleInputsImproved(player){
    addEventListener('keydown', event=>{
        key = event.key;
        if(player.controls.slice(0, 4).includes(key)){
            player.dirs[player.controls.indexOf(key)] = .2;
        }
       else if(player.controls[5].includes(key)){
           let add = 5*(player.controls[5].indexOf(key)-1);
           player.rotate = false;
           player.angle += add;
           setRotation(player.you, player.angle);
       }
    })
    addEventListener('keyup', event=>{
        key = event.key;
        if(player.controls.slice(0, 4).includes(key)){
            player.dirs[player.controls.indexOf(key)] = 0;
        }
       else if(player.controls[5].includes(key)){
           player.rotate = true;
       }
       else if(player.controls[4].includes(key)){
           player.shoot();
       }
    })
}
//end Holy Spirit thank you for showing me 2 Nov, 2022

function modeDif(){
    let mode, difficulty, level;
    for (let button of getAll("[name='mode']")){
         if(button.checked) {mode = button.value; break}
    }
    difficulty = getS("[type='range']").value;
    level = {mode: mode, difficulty: difficulty}
    return level;
}

function loadKeys(player, name){
    player.controls = []
    player.you.style.background = player.hold = document.getElementById(name).children[7].children[0].value;
    let source = document.getElementById(name).children;
    for (let i=0; i<5; i++){
        player.controls[i] = source[i].value ?  source[i].value : source[i].className;
    }
    player.controls[5] = (source[6].value+source[5].value)?source[6].value+' '+ source[5].value:source[6].className+' '+ source[5].className;
    handleInputsImproved(player);
}
function loadThem(n,target){
        let enemies = []
        for (let i=0; i<n; i++){
            enemies.push(new Enemy(new Vec(random(100), random(100)), 0));
        }
        for (let i=0; i<enemies.length; i++){
                if(i%2==0) {enemies[i].target = target;
                enemies[i].yourHead.style.background = target.you.style.background;}
        }
        return enemies;
    }

function load(){
    location.reload();
}
function refresh(what){
    let boom = endOfGame(); clearInterval(gameOver);
    setTimeout(()=>{
      alert(what); document.location.href=document.location.href
    }, boom)
}
function endOfGame(){
    sound[7].play();
    setTimeout(()=>{
        sound[9].play();
    }, sound[7].duration*1000)
    return (sound[7].duration + sound[9].duration)*1000;
}
//end shoot.html
//start combat

function drawBox(pic) {
    let newBox = make();
    newBox.style.width = newBox.style.height = `${scale}`;
    setBackground(newBox, `images/${pic}.png`);
    container.appendChild(newBox);
    return newBox;
}
//end combat