const MENUS={
  MAIN: ['SETTINGS,START', 'OPTIONS,OPTIONS', 'HELP,HELP', 'ABOUT,ABOUT'],
  OPTIONS: ['MAIN,MAIN MENU','BACK,SOUND ON','BACK,BACK'],
  HELP: ['BACK,BACK'],
  ABOUT: ['BACK,BACK'],
  END: ['SETTINGS,RESTART', 'MAIN,MAIN MENU'],
};
for (let menu in MENUS){
    let div = make();
    div.id = menu;
    div.className = 'menu';
    let h2 = make('h2'); h2.textContent = menu;
    div.appendChild(h2)
    MENUS[menu].forEach(i=>{
        let but = make('button');
        [but.value , but.textContent] = i.split(',');
        but.onclick=but.value=='BACK'?()=>goToScreen(but.parentElement.back.id):()=>goToScreen(but.value);
        div.appendChild(but);
    })
    container.appendChild(div);
};identify();
let modes = Array.from(SETTINGS.querySelectorAll('#SETTINGS [type=radio]')),
  namess = Array.from(names.querySelectorAll('label'));
addEventListener('click', event=>{
    let t = event.target.textContent, T = event.target;
    if(T.nodeName!='BUTTON') return;
    sound[0].play()
    if (t.includes('SOUND')) {
        T.textContent=t=='SOUND ON'?'SOUND OFF':'SOUND ON';
        sound.forEach(i=>i.volume=i.volume?0:1);
    }
    if(t=='START GAME') game.start();
    // switch(t){
    //     case ()
    // }
})
addEventListener('change', event=>{
    let t = event.target.textContent, T = event.target;
    if(T.type=='radio'){
        sound[3].play();
        let i = modes.indexOf(T);
        // console.log(i);
        namess.forEach(i=>{i.style.display='none';i.lastElementChild.style.display=''});
        clearNames(i);
    }
})
selected = MAIN;
MAIN.back = MAIN;
addEventListener('keyup', ()=>{
    if (event.key=='o'&&board.selected) {
        goToScreen('OPTIONS'); OPTIONS.back = board;
    }
})
// document.querySelectorAll('[placeholder]').forEach(i=>i.style.borderColor=i.placeholder)
function clearNames(i) {
  switch (i){
    case 0:
      namess[0].style.display='';
      break;
    case 1:
      namess[0].style.display=namess[1].style.display='';
      break;
    case 2:
      namess.forEach(i=>i.style.display='');
      namess.forEach(i=>i.lastElementChild.style.display='none')
      break;
  }
}