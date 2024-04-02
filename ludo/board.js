//to move, you can use appendChild if you cannot use position
identify();
// let all = [],
let colors = ['red', 'blue', 'yellow','green'];
//level loader;
let rot = 0;
for (let i = 0; i < 4; i++) {
    //use it to load all tomorrow later
    let div = make(); div.style.background = colors[i];
    div.id = div.style.gridArea = 'home'+i;
    board.appendChild(div);
    let road = make('table');
    road.id = road.style.gridArea = 'road'+i;
    board.appendChild(road);
    for (let y = 0; y < 3; y++) {
        let r = make('tr');
        road.appendChild(r);
        for (let x = 0; x < 6; x++) {
            let c = r.insertCell();
            if((y==0)&&(x==1)){
                c.className = 'spawnPoint';
                c.style.background = colors[i];
            }
            if ((y==1&&x!=0)) {
                c.className = 'specRoute';
                c.style.background = colors[i];
            }
        }
    }
    for (let j = 0; j < 2; j++) {
        let dir = make (); dir.id = 'dir'+i+j; board.appendChild(dir);
        // dir.style.top= '';
        dir.style.transform= `rotate(${45*rot+(j==1?-90:'')}deg)`
        rot++;
    }
};
delete rot;
    // for (let j = 0; j < 2; j++) {
        // let dir = make (); dir.id = 'dir'; board.appendChild(dir)
    // }
let end = make(); end.id = 'end'; board.appendChild(end);
identify();
let road = [];
// Array.from(document.querySelectorAll('#board td')).filter(i=>i.className!='specRoute');
// which, row, slicePoint, reverse=false;
// remember to reverse before slicing
let roadLoader = [
    '001', '1201', '1151',
    '100', '2201', '2151',
    '200', '3201', '3151',
    '300', '0201', '0151', '0051'
];
roadLoader.forEach(i=>{
    x = 'road'+i[0];
    let r = Array.from(window[x].rows[i[1]].cells);
    if(i[3]) r = r.reverse();
    r = r.slice(i[2]);
    // road = road.concat(r)
    road = road.concat(r);
})