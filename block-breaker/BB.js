function loadLevel(rawMaterial){
    LEVEL = rawMaterial;
    blocks.forEach(i=>i.remove())
    PlaYer.balls.forEach(i=>i.remove())
    if(PlaYer.remove) PlaYer.remove();
//     [blocks, PlaYer.balls].forEach(i=>i.forEach(j=>j.remove()));
    let all = rawMaterial.split(' ');
    for (let each of all){
        blocks.push(new Block(...[...each].map(i=>i=+i)))
    }
    PlaYer = new Player
}
onbeforeunload = ()=> localStorage.setItem('LEVEL', LEVEL)
// loadLevel()