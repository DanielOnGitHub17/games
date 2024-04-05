//change goToScreen later to hidden not display: none
buttonize = () =>document.querySelectorAll('button').forEach(i=>{
    i.onclick = function go(){
        goToScreen(i.textContent=='BACK' || i.value=='BACK'?i.parentElement.back.id:(i.value?i.value:i.textContent), event.target.textContent)
    };
})
function randomLevel(){
    let n = randBtw(70, 75);
    let raw = ``;
    for (let i=0; i<n; i++){
       let x = randBtw(0, 6), w=randBtw(1, 5), h=(w==1)?randBtw(1, 5):1;
       x!=6?x=randBtw(0, 5):0;
       if (x==6||x==3||x==4) h = 1;
       if (x==3) w=1;
       if(x==5) w = h = 2;
       [x, w, h].forEach(i=>raw+=i);
       raw += ' ';
    }
    return raw.trim();
}