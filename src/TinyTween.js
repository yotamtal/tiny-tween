/*****
 * @author Yotam Tal
 * @description JS Component for tweening values easily
 * @param {object} options 
 *  {from, to, duration, ease, loop, yoyo, onProgress, onComplete} - 
 *  Gets all the options for this tween
 */
import EasingFunctions from './Easing'

const root = typeof window !== 'undefined' ? window : global;
const interval = 1000 / 60;

let scheduleFunction =
  root.requestAnimationFrame ||
  root.webkitRequestAnimationFrame ||
  root.oRequestAnimationFrame ||
  root.msRequestAnimationFrame ||
  (root.mozCancelRequestAnimationFrame && root.mozRequestAnimationFrame) ||
  setTimeout;

let setNestedValue = (obj, path, value) => {
    const pList = path.split('.');
    const key = pList.pop();
    const pointer = pList.reduce((accumulator, currentValue) => {
      if (accumulator[currentValue] === undefined) accumulator[currentValue] = {};
      return accumulator[currentValue];
    }, obj);
    pointer[key] = value;
    return obj;
}

class TinyTween {
    _timestamp = Date.now()
    _elapsed = 0
    _progress = 0
    _playing = 0
    _currentValues = {}

    constructor(options){
        const { __checkEase, __checkFunc, __checkObj, __checkNum, __checkBool } = this;

        this._from = __checkObj(options.from)
        this._to = __checkObj(options.to)

        this._duration = __checkNum(options.duration)
        this._ease = __checkEase(options.ease) || EasingFunctions['linear']

        this._onComplete = __checkFunc(options.onComplete)
        this._onProgress = __checkFunc(options.onProgress)

        this._loop = __checkBool(options.loop)
        this._yoyo = __checkBool(options.yoyo)
        this._reverse = __checkBool(options.reverse)
        this._target = options.target

        if(typeof options.autostart === 'undefined') options.autostart = true;

        /** START TWEEN **/
        if(__checkBool(options.autostart)) this.play()        
    }

    __checkObj = o => typeof o === 'object' ? o : {}
    __checkNum = n => typeof n === 'number' ? n : 0
    __checkBool = b => typeof b === 'boolean' ? b : false
    __checkEase = s => typeof EasingFunctions[s] === 'function' ? EasingFunctions[s] : false
    __checkFunc = f => typeof f === 'function' ? f : _ => _

    /**
     * Play tween from current state
     */
    play = () => {
        const now = Date.now()
        this._timestamp = now - this._elapsed

        this._playing = true
        this._runAnimation()
    }

    /**
     * Pause tween at current state
     */
    pause = () => this._playing = false

    /**
     * Stop and restart tween
     */
    stop = () => {
        this._playing = false
        this.seek(0);
    }

    /**
     * Seek to a state
     * @param {Number} progress
     */
    seek = (progress) => {
        const now = Date.now()

        this._elapsed = this._duration * progress
        this._timestamp = now - this._elapsed

        this.t = this._duration > 0 ? this._elapsed / this._duration : 1
        this._progress = this._ease(this.t)

        this._setValues()
        this._onProgress(this._currentValues)
    }

    /**
     * Destroy tween instance
     */
    destroy() {
        for (const prop in this) {
            delete this[prop];
        }
    }

    _setValues = () => {
        Object.keys(this._from).map( key => {
            let keyValue;

            if(this._reverse) keyValue = this._to[key] - (this._to[key] * this._progress) + (this._from[key] * this._progress);
            else keyValue = this._from[key] - (this._from[key] * this._progress) + (this._to[key] * this._progress);

            this._currentValues[key] = keyValue
            if(this._target) setNestedValue(this._target, key, keyValue)
        })
    }

    _restart = () => {
        this._timestamp = Date.now()
        this._elapsed = 0
        this._progress = 0
    }

    _runAnimation = () => {
        if(!this._playing) return;
        
        const now = Date.now()

        this._elapsed = now - this._timestamp
        this.t = (this._duration > 0 ? this._elapsed / this._duration : 1).toFixed(5)
        this._progress = this._ease(this.t)

        if (this.t >= 1) this._progress = 1
        else if(this.t <= 0) this._progress = 0

        this._setValues()

        // If completed
        if (this.t >= 1) {

            // Finished tween! Final update and call complete function.
            this._onProgress(this._currentValues)
            if((this._yoyo && this._yoyoRun) || !this._yoyo ) this._onComplete()
            
            // if looping is on, start from the beginning
            if(this._loop){

                this._restart()
                
                if(this._yoyo) {
                    this._reverse = !this._reverse;
                    if(this._yoyoRun) this._yoyoRun = false;
                    else this._yoyoRun = true;
                }
                // requestAnimationFrame(this._runAnimation)
                scheduleFunction.call(root, this._runAnimation, interval);

            } 
            else if(this._yoyo){

                this._reverse = !this._reverse;
                if(!this._yoyoRun) this.playing = true;
                this._yoyoRun = true;

            }

        } else {
            // Run update callback and loop until finished
            this._onProgress(this._currentValues)
            // requestAnimationFrame(this._runAnimation)
            scheduleFunction.call(root, this._runAnimation, interval);
        }

        
    }

}

root.TinyTween = TinyTween;
export default TinyTween;
