import TinyTween from '../src/TinyTween';

let gE = function(id){return document.getElementById(id)}

let example = gE('example'),
    range = gE('example-range'),
    loops = gE('loops');

const tweenOptions = {
    target: range,
    from: {value:0, 'style.opacity': 0},
    to: {value:100, 'style.opacity': 1},
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

let tween = new TinyTween(tweenOptions),
    play = gE('play'),
    pause = gE('pause'),
    stop = gE('stop'),
    seek = gE('seek');

let listener = () => window.requestAnimationFrame( () => tween.seek(seek.value) );
seek.addEventListener("mousedown", () => {
    listener();
    seek.addEventListener("mousemove", listener);
});
seek.addEventListener("mouseup", () => seek.removeEventListener("mousemove", listener) );
play.onclick = () => tween.play()
pause.onclick = () => tween.pause()
stop.onclick = () => tween.stop()

console.log(tween);