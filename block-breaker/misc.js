for (let menu in MENUS){
    let n = make();
    n.id = menu;
    n.className = 'MENU'
    let cont = MENUS[menu];
    let name = make('h2')
    name.textContent = TITLES[menu]
    n.appendChild(name)
    cont.forEach(i=>{
        let but = make('button');
        [but.value, but.textContent] = i.split(',')
        n.appendChild(but)
    })
    document.body.appendChild(n)
}
identify();
selected = MAIN;
MAIN.back = MAIN;
goToScreen('MAIN');
buttonize();
level=()=>Array.from(LEVELS.children).forEach(i=>{
    if (i.textContent.startsWith('LEVEL')&&parseInt(i.textContent[5])>NL()){
        i.disabled = true;
    }
})
//overrides: buttons that don't goToScreens
//pass
let ballshold = BALLSPEED;
addEventListener('click', event=>{
    //a lot
    let T = event.target;
    t = T.textContent;
    //for game now
    if (T.value=='GAME') {
        if(T.parentElement==LEVELS && t!='BACK'){
            LEVEL = t.startsWith('LEVEL')?OFFICIALLEVELS[t[5]-1]:randomLevel()
            loadLevel(LEVEL);
            HUD.textContent = t
         }
         if(t=='NEW GAME'){
             LEVEL = OFFICIALLEVELS[0];
             loadLevel(LEVEL);
         }
         if((t=='CONTINUE') || t=='RESTART') loadLevel(LEVEL);
         PAUSED = false; BALLSPEED = ballshold;
    }
    if(t=='PAUSE') {PAUSED=true; ballshold = BALLSPEED; BALLSPEED=0}
     //END GAME
     //sounds
     if (t.startsWith('SOUND')){
         T.textContent = t.endsWith('N')?'SOUND OFF':'SOUND ON'
     }
     //end sounds
})