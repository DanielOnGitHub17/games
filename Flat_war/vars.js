//for player class
let characters = [], blocks = [];
window.__defineGetter__('spaces', ()=>blocks.filter(i=>i.isspace))
window.__defineGetter__('notspaces', ()=>blocks.filter(i=>!i.isspace))
function generateLevel(level) {
    level.forEach(b=>new Block(...[...b].map(x=>+x)))
}