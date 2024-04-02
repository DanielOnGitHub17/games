container = document.getElementById('container');
make=(name='div')=>document.createElement(name)
window.addEventListener('click', event=>{
    if (event.target.parentNode!=container) return;
    highlight(event.target)
    boxForTwo.push(event.target)
    if (boxForTwo.length==2){
        if(thoseTouching(boxForTwo[0]).includes(boxForTwo[1])){
            switchNodes(allBoxes.indexOf(boxForTwo[0]), allBoxes.indexOf(boxForTwo[1]))
                for(let box of boxForTwo){
                    try{
                        clearNear(box)
                    } catch (error){
                        console.log('error')
                    }
                 }
        } else{
            console.log('not my neighbour')
        }
        for(let i=0; i<2; i++){
            highlight(boxForTwo[i])
        }; boxForTwo = []; movesBox.textContent= --movesleft;
        refresh()
    }; refresh()
})
window.addEventListener('error', event=>{
    a = event;
})
const colors = ['skyblue','red','orange','yellow','green','blue','purple'
 ,'pink','brown','gold','gray','silver']

function loadGrid(n){
    if(n>12) n = 12
    container.style.width = 52*n+'px'
    for(let i=0; i<n;i++){
        for (let j=0; j<n; j++){
            let box = make();
            box.style.width = '50px'
            box.style.background = colors[i%13];
            container.appendChild(box);
        }
    }
    allBoxes = Array.from(container.children);
}
function start(){
    Array.from(container.children).forEach(i=>i.remove())
    container.style.width = '';
    n = parseInt(prompt('Difficulty(3 - 12): '))
    if(n<3||n>12||!n) n=6
    if(n%2) n++; n_ = n;
    boxForTwo = []; moves.textContent = movesleft = parseInt(n*n)/2;
    container.addEventListener('click', loadLevel)
}
function renewBoxes(){
    allBoxes = Array.from(container.children);
    allBoxes = allBoxes.filter(i=>i.style.display=='')
}
function random(n){
    return parseInt(10000*Math.random())%n
}
function thoseTouching(box){
    let pos = allBoxes.indexOf(box)
    return [allBoxes[pos-n], allBoxes[pos+1], allBoxes[pos+n], allBoxes[pos-1]].filter(i=>i);
}
function highlight(dom){
    (dom.style.boxShadow) ? dom.style.boxShadow = '': dom.style.boxShadow = '3px 3px 7px 8px black';
}
function switchNodes(first, last, time){
    if (first>last){let hold=first; first=last, last=hold}
    let firstbox = allBoxes[first], lastbox = allBoxes[last]
    firstbox.replaceWith(lastbox); container.insertBefore(firstbox, allBoxes[last+1])
    renewBoxes()
}
function scatterThem(){
    for(let i=0; i<2*n*n; i++){
        switchNodes(random(n*n), random(n*n))
    }
}
function loadLevel(){
    movesBox = document.getElementById('moves');
    loadGrid(n);
    scatterThem();
    container.removeEventListener('click', loadLevel)
}
function clearNear(box){
    for (let neighbour  of thoseTouching(box)){
        if(neighbour.style.background==box.style.background){
            lessen(box); lessen(neighbour);
        }
    }
    n=Math.round(Math.sqrt(allBoxes.length))
    container.style.width = 52*n+'px';
}
function refresh(){
    if(checkForMatches() && movesleft>0 && allBoxes.length) return;
    if (movesleft<1) {alert('you lose')} else {alert('you win')}
    start();
}
function lessen(dom){
    let w = setInterval(()=>{
        let a = parseFloat(dom.style.width)
        a--;
        dom.style.width = dom.style.height = a + 'px'
        if (a<=0) {
            clearInterval(w);
            dom.style.display = 'none';  renewBoxes();
        }
    }, 10)
}

function checkForMatches(){
    checkbox = []
    for(let div of allBoxes){
        if(colors.includes(div.style.background)){
            checkbox.push(div.style.background)
        }
    }
    setBox = new Set(checkbox);
    if (setBox.size == checkbox.length){
        return false;
    } else return true
}
start()