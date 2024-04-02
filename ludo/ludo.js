colors.forEach(i=>{
    let lab = make('label'), nam = make('input');
    lab.textContent = nam.placeholder='Player '+(1+colors.indexOf(i));
    lab.appendChild(nam);
    [1,2].forEach(j=>{
        let col = make('select');
        lab.appendChild(col)
        colors.forEach(k=>{
            let op = make('option');
            op.textContent = op.style.background= k;
            col.add(op);
        })
        col.value = j==1?i:colors[3-colors.indexOf(i)];
    })
    names.appendChild(lab);
});
function getParameters(){
    let ret = [],
    n = namess.filter(i=>!i.style.display),x;
    n.forEach(i=>{
        let player = {}, x=i.firstElementChild;
        player.name = x.value?x.value:x.placeholder;
        player.colors = [];
        [...i.querySelectorAll('select')].
            forEach(j=>!j.style.display?player.colors.push(colors.indexOf(j.value)):'');
        ret.push(player);
        player.homes=player.colors.map(c=>window['home'+c])
        //14feb2023 13:35
        Object.defineProperty(player, 'turn', {
            set: function(bool){
                this.homes.forEach(i=>i.style.setProperty('--message', bool?'':'a'))
            }
        })
    });
    return ret;
}