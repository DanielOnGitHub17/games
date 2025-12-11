//gameBox


motions.concat('scale').forEach(m => {
    gameBox[m[0] + m[m.length - 1]] = gameBox[m[0] + m[m.length - 1].toLowerCase()] = 0;
})
gameBox.se = 1
gameBox.move = function () {
    gameBox.style.transform = `scale(${gameBox.se}) translateX(${this.tX += gameBox.tx}px) translateY(${gameBox.tY += gameBox.ty}px)
     translateZ(${gameBox.tZ += gameBox.tz}px) rotateX(${gameBox.rX += gameBox.rx}deg)
     rotateY(${gameBox.rY += gameBox.ry}deg) rotateZ(${gameBox.rZ += gameBox.rz}deg)`;
}
// gameBox.move()
gameBox.movement = setInterval(() => gameBox.move(), 20)
gameBox.rX = 30; gameBox.rZ = 40;