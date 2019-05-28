/*****
 * @author Yotam Tal
 * @description JS Component for tweening values easily
 * @param options 
 *  {from, to, duration, ease, loop, yoyo, onUpdate, onComplete} - 
 *  Gets all the options for this tween
 */

import EasingFunctions from './Easing'
class TinyTween {
    constructor(options){
        const { checkEase, checkFunc, checkNum, checkBool } = this;

        this._from = checkNum(options.from)
        this._to = checkNum(options.to)

        this._duration = checkNum(options.duration)
        this._ease = checkEase(options.ease) || EasingFunctions['linear']

        this._onComplete = checkFunc(options.onComplete)
        this._onUpdate = checkFunc(options.onUpdate)

        this._loop = checkBool(options.loop)
        this._yoyo = checkBool(options.yoyo)
        this._reverse = checkBool(options.reverse)

        this._timestamp = Date.now()
        this._elapsed = 0
        this._progress = 0

        if(typeof options.autostart === 'undefined') options.autostart = true;

        /** START TWEEN **/
        if(checkBool(options.autostart)) this.playing = true
        else this.playing = false
        
    }

    checkNum = n => typeof n === 'number' ? n : 0
    checkBool = b => typeof b === 'boolean' ? b : false
    checkEase = s => typeof EasingFunctions[s] === 'function' ? EasingFunctions[s] : false
    checkFunc = f => typeof f === 'function' ? f : _ => _

    get duration(){return this._duration};

    get from(){return this._from};
    set from(val){
        this._from = this.checkNum(val)
        // this.restart()
    }

    get to(){return this._to};
    set to(val){
        this._to = this.checkNum(val)
        // this.restart()
    }

    get timestamp(){return this._timestamp};
    set timestamp(date){this._timestamp = date};

    get elapsed(){return this._elapsed};
    set elapsed(date){this._elapsed = date};

    get progress(){return this._progress};
    set progress(val){this._progress = val};

    setProgress(val){
        this._progress = this.checkNum(val)
    };

    get currentValue(){return this._currentValue};
    set currentValue(val){this._currentValue = this.checkNum(val)};

    setCurrentValue(val){  
        const now = Date.now() 
            this.currentValue = this.checkNum(val)
            this.timestamp = now - ( this._duration * (val / this._to) );
            this.elapsed = ( this._duration * (val / this._to) );
            this.progress = this._ease((now - this._timestamp) / (this._duration));

        };

        get playing(){return this._playing};
        set playing(val){
            this._playing = this.checkBool(val); 
            if(val === true) {
            // Continue playing where left off...
            this.timestamp = Date.now() - this.elapsed;
            this._runAnimation()
            }
        };

        get reverse(){return this._reverse};
        set reverse(val){this._reverse = this.checkBool(val)};

        get onUpdate(){return this._onUpdate}
        set onUpdate(func){this._onUpdate = this.checkFunc(func)}

        get onComplete(){return this._onComplete;}
        set onComplete(func){this._onComplete = this.checkFunc(func)}

        restart = () => {
            this.elapsed = 0;
            if(this._reverse) this.progress = 100;
            else this.progress = 0;
        }

        _runAnimation = () => {
            if(this._playing){
            const now = Date.now()
            let tweenVal
            this.t = this._duration > 0 ? (now - this._timestamp) / (this._duration) : 1

            this.elapsed = now - this._timestamp
            this.progress = this._ease(this.t);

            if(this._reverse) tweenVal = this._to - (this._to * this._progress) + (this._from * this._progress);
            else tweenVal = this._from - (this._from * this._progress) + (this._to * this._progress);

            this.currentValue = tweenVal

            // If completed
            if (this.t >= 1) {

                // Finished tween! Final update and call complete function.
                this._onUpdate(this._currentValue)
                if((this._yoyo && this._yoyoRun) || !this._yoyo ) this._onComplete()

                this.progress = 0;
                this.elapsed = 0;
                this.timestamp = Date.now();
                
                // if looping is on, start from the beginning
                if(this._loop){
                if(this._yoyo) {
                    this.reverse = !this.reverse;
                    if(this._yoyoRun) this._yoyoRun = false;
                    else this._yoyoRun = true;
                }
                requestAnimationFrame(this._runAnimation)
                } 
                else if(this._yoyo){
                this.reverse = !this.reverse;
                if(!this._yoyoRun) this.playing = true;
                this._yoyoRun = true;

                }

            } else {
                // Run update callback and loop until finished
                this._onUpdate(this._currentValue)
                requestAnimationFrame(this._runAnimation)
            }

            }
        }

}

window.TinyTween = TinyTween;
export default TinyTween;
