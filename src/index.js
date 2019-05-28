import TinyTween from './TinyTween';

let gE = function(id){return document.getElementById(id)}

let example = gE('example'),
    range = gE('example-range'),
    loops = gE('loops');

const tweenOptions = {
    target: range,
    from: {value: 0},
    to: {value: 100},
    duration: 5000, // In Milliseconds
    loop: true,  // In Loop tween
    yoyo: true, // Play forward and then reverse to inital value
    autostart: true,
    ease: 'easeInOutCubic', // Easing effect, default is Linear
    onProgress: function(progress){
        example.innerText = parseInt(progress.value);
    },
    onComplete: function(){
        loops.innerText = parseInt(loops.innerText) + 1 || 1
    }
};
let tween = new TinyTween(tweenOptions);

let play = gE('play'),
    pause = gE('pause'),
    stop = gE('stop'),
    seek = gE('seek');

let listener = function() {
    window.requestAnimationFrame(function() {
        tween.seek(seek.value)
    });
};
    
seek.addEventListener("mousedown", function() {
    listener();
    seek.addEventListener("mousemove", listener);
});
seek.addEventListener("mouseup", function() {
    seek.removeEventListener("mousemove", listener);
});
    

play.onclick = () => tween.play()
pause.onclick = () => tween.pause()
stop.onclick = () => tween.stop()

console.log(tween);