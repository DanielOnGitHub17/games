function makeBlock(c){
//     make this to be a constructor: it should have
// methods like: transform... 
// or make a 'brick' class that other classes can inherit from
    let block = make(); block.className = c;
    blockFaces.forEach(face=>{
        let side = make(); side.className = face+' side';
        block.appendChild(side);
        block[face] = side;
    })
    return block
}
// function setPosition(obj, point={x:0, y:0, z:0}){
//     for (let p in point){
//         obj[p] = point[p];
//     }
// }