# Tiny Tween JS

Tiny Tween - A JS Component for tweening values easily

## Installation

Using package managers
```sh
yarn add tiny-tween-js

# OR

npm install tiny-tween-js
```
And include in your JS
```js
import TinyTween from 'tiny-tween-js' // ES6
```

OR 

Manually add as script
```html
<script src="//unpkg.com/tiny-tween-js"></script>
```

And get the exposed class:
```js
new Window.TinyTween
```

## Usage

```js

const tweenOptions = { 
    from: 0,
    to: 100,
    duration: 2000, // In Milliseconds
    loop: true,  // In Loop tween
    yoyo: true, // Play forward and then reverse to inital value
    autostart: false,
    ease: 'easeInOutCubic' // Easing effect, default is Linear
};

// ES6 Usage
import TinyTween from 'tiny-tween-js'
let tween = new TinyTween(tweenOptions);

// Vanilla Usage
let tween = new window.TinyTween(tweenOptions);
```

## TODO

- [ ] Add seeking methods

## Credits

Easing functions Taken from https://gist.github.com/gre/1650294

