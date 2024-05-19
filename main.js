module.exports.loop = function () {
    if(Game.cpu.bucket > 5000)
        Game.cpu.generatePixel();
}