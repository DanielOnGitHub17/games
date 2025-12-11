blocks = [[], []],
    bloks = [];
class Block {
    constructor(type) {
        this.type = type;
        //         this.height = type==0?60:120;
        this.block = makeBlock('block');
        this.block.classList.add(type ? 'long' : 'short')
        gameBox.appendChild(this.block);
        this.block.obj = this;
        blocks[this.type].push(this);
        bloks.push(this)
    }
}