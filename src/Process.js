const { SchedulerInterrupt } = require("./constants/index");

// A class representation of a process that may be blocking
// or non-blocking. We can specify how much CPU time a process
// needs in order to complete, or we can specify if the process
// is blocking; if so, the amount of blocking time needed is
// randomly determined.
class Process {
  constructor(pid, cpuTimeNeeded = null, blocking = false) {
    this._pid = pid;
    this.queue = null;
    this.cpuTimeNeeded =
      cpuTimeNeeded !== null ? cpuTimeNeeded : Math.round(Math.random() * 1000);
    this.blockingTimeNeeded = blocking ? Math.round(Math.random() * 100) : 0;
    // A bool representing whether this process was toggled from blocking to non-blocking or vice versa
    this.stateChanged = false;
  }

  setParentQueue(queue) {
    // is this a string? An object of a class? What type is this argument?
    // TODO

    // GCR says: Done or more needed?
    this.queue = queue;
  }

  isFinished() {
    // GCR: What is this method supposed to be doing??
    // GCR: Delete refernence? Or is a bool to check if it's finished?
  }

  executeProcess(time) {
    // If no blocking time is needed by this process, decrement the amount of
    // CPU time it needs by the input time
    if (this.blockingTimeNeeded === 0) {
      this.cpuTimeNeeded -= time;
    }
    // If blocking time is needed by this process, move it to the blocking queue
    else {
      // blocking time required
      // by emitting the appropriate interrupt
      console.log("Emit my appropriate interrupt, but how?");
      // Make sure the `stateChanged` flag is toggled appropriately
      this.stateChanged = true;
    }
  }
  executeBlockingProcess(time) {
    // If this process requires blocking time,
    if (this.blockingTimeNeeded > 0) {
      //  decrement the amount of blocking time it needs by the input time
      this.blockingTimeNeeded -= time;
      if (this.blockingTimeNeeded <= 0) {
        // Once it no longer needs to perform any blocking execution, move it to the
        // top running queue by emitting the appropriate interrupt
        console.log("Do me, move it to top running queue");
        // Make sure the `stateChanged` flag is toggled appropriately
        this.stateChanged = true;
      }
    }
  }

  // Returns this process's stateChanged property
  isStateChanged() {
    return this.stateChanged;
  }

  get pid() {
    // GCR: Not sure what this is/What they want me to do, what the word "Get" does?
    return this._pid; // GCR I think this is what I need. Thanks for no guidance. 
  }

  // Private function used for testing; DO NOT MODIFY
  _getParentQueue() {
    return this.queue;
  }
}

module.exports = Process;
