import { EventEmitter } from 'events';

export class Chronometer {
    private timer: NodeJS.Timeout | null;
    private emitter: EventEmitter;
    private freq: number;
    public time: number;
    public maxTime: number;
    public state: "stopped" | "running";

    constructor(frequency: number = 100) {
        this.timer = null;
        this.emitter = new EventEmitter();
        this.freq = frequency;
        this.time = 0;
        this.state = "stopped";
    }

    private measureTime() {
        this.timer = setTimeout(() => {
            if(this.state === "running"){
                this.time += this.freq;
                if(this.maxTime !=-1 && this.time >= this.maxTime){
                    this.emitter.emit('timeout');
                    this.reset();
                }
                else {
                    this.emitter.emit('tick', this.time);
                    this.measureTime();
                }
            }
        }, this.freq);
    }

    // can be called with -1 to run indefinitely
    start(maxTime: number) {
        if (!this.timer) {
            this.maxTime =  maxTime;
            this.state = "running";
            console.log('Chronometer started');
            this.measureTime();
        }
    }

    reset() {
        this.time = 0; // Reset the time back to zero
        this.state = "stopped";
        clearTimeout(this.timer);
        this.timer = null;
    }

    on(event: 'tick' | 'timeout', listener: () => void) {
        this.emitter.on(event, listener);
    }
}
