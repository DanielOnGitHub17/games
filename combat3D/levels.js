const LEVELS = {
    LEVEL1:  ['1111111111111111111',
             '1000001000001000001',
             '100e00100000100e001',
             '1000001000001000001',
             '100001000f000100001',
             '1000010000000100001',
             '1000010000000100001',
             '1000000001000000001',
             '100000000p000000001',
             '100e00000100000e001',
             '1000010000000100001',
             '1000010000000100001',
             '100001000f000100001',
             '1000001000001000001',
             '100e00100000100e001',
             '1000001000001000001',
             '1111111111111111111']
}
function loadLevel(level){
    gameBox.level = level;
    let n = level.length, m=level[0].length
    , keyp = {p: 'Player', e: 'Enemy', f: 'Friend'};
    for (let x=0; x<n; x++){
        for (let y =0; y<m; y++){
            let a = parseInt(level[x][y]), b = new Block(a?a:0);
            if (a!=0 && !a){
                let xy = new Playable(keyp[level[x][y]]);
                xy.block.style.top = x*60+5+'px';
                xy.block.style.left = y*60+5+'px';
            }
            b.block.style.top = x*60+'px'; b.block.style.left = y*60+'px';
        }
    }
    setSize(gameBox, new Vec(level[0].length*60, level.length*60), 'px');
    return level
}