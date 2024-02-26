const ControllerEvent = {
    MOVE: 'move',
};

class Controller extends EventTarget{
    active = true;
    x = 0;
    y = 0;
    size = 0.05;

    move(x, y){
        if(this.active){
            this.x = x;
            this.y = y;
            this.#emitEvent(ControllerEvent.MOVE, {x, y});
        }
    }
    
    #emitEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        this.dispatchEvent(event);
    }

    angle(x, y){
        return Math.atan2(y - this.y, x - this.x);
    }

}


// Publish the class for jest tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Controller;
  } 
  