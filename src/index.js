import TinyTween from './TinyTween';

let example = document.getElementById('example');
let range = document.getElementById('example-range');
let loops = document.getElementById('loops');
const tweenOptions = { 
    from: 0,
    to: 100,
    duration: 2000, // In Milliseconds
    loop: true,  // In Loop tween
    yoyo: true, // Play forward and then reverse to inital value
    autostart: true,
    ease: 'easeInOutCubic', // Easing effect, default is Linear
    onUpdate: function(val){
        range.value = parseInt(val);
        example.innerText = parseInt(val);
    },
    onComplete: function(){
        loops.innerText = parseInt(loops.innerText) + 1 || 1
    }
};
let tween = new TinyTween(tweenOptions);
console.log(tween);