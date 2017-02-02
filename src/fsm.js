class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(!config) {
            throw Error();
        }
        this.state = this.firstState = config.initial;
        this.paths = {};
        this.history = [];
        this.futures = [];
        for(var field in config.states) {
            this.paths[field] = {};
        }
        for(var field in config.states) {
            for(var to in config.states[field].transitions) {
                this.paths[field][to] = config.states[field].transitions[to];
            }
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(state in this.paths) {
            this.history.push(this.state);
            this.futures = [];
            this.state = state;
        } else {
            throw Error();
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if(event in this.paths[this.state]) {
            this.history.push(this.state);
            this.futures = [];
            this.state = this.paths[this.state][event];
        } else {
            throw Error();
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.firstState;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if(event) {
            var states = [];
            for(var path in this.paths) {
                if(event in this.paths[path])
                    states.push(path);
            }
            return states;
        } else {
            var states = [];
            for(var state in this.paths) {
                states.push(state);
            }
            return states;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.history.length == 0) {
            return false;
        }
        this.futures.push(this.state);
        this.state = this.history[this.history.length - 1];
        this.history.pop();
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this.futures.length == 0) {
            return false;
        }
        this.history.push(this.state);
        this.state = this.futures[this.futures.length - 1];
        this.futures.pop();
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [];
        this.futures = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
