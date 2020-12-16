const { SchedulerInterrupt } = require("./constants/index");

// A class representation of a process queue that may hold either a
// blocking or non-blocking process
class Queue {
  constructor(scheduler, quantum, priorityLevel, queueType) {
    this.processes = [];
    // The queue's priority level; the lower the number, the higher the priority
    this.priorityLevel = priorityLevel;
    // The queue's parent scheduler
    this.scheduler = scheduler;
    // The queue's allotted time slice; each process in this queue is executed for this amount of time in total
    // This may be done over multiple scheduler iterations
    this.quantum = quantum;
    // A counter to keep track of how much time the queue has been executing so far
    this.quantumClock = 0;
    this.queueType = queueType;
  }

  // Enqueues the given process. Return the enqueue'd process
  enqueue(process) {
    this.processes.push(process);
    console.log("Process ID is ", process.getpid());
    return process.getpid();
  }

  // Dequeues the next process in the queue. Return the dequeue'd process
  dequeue() {
    if (this.isEmpty()) {
      return "Underflow";
    }
    return this.processes.shift();
  }

  // Return the least-recently added process without removing it from the list of processes
  peek() {
    return processes[0];
  }

  isEmpty() {
    return this.processes.length == 0;
  }

  getPriorityLevel() {
    return this.priorityLevel;
  }

  getQueueType() {
    return this.queueType;
  }

  // Manages a process's execution for the given amount of time
  // Processes that have had their states changed should not be affected
  // Once a process has received the alloted time, it needs to be dequeue'd and
  // then handled accordingly, depending on whether it has finished executing or not
  manageTimeSlice(currentProcess, time) {
    if (currentProcess.stateChanged) {
      this.quantumClock = 0;
      return;
    }
    this.quantumClock += time;
    if (this.quantumClock >= this.quantum) {
      this.quantumClock = 0;
      const process = this.dequeue();
      if (!process.isFinished()) {
        this.scheduler.handleInterrupt(
          this,
          process,
          SchedulerInterrupt.LOWER_PRIORITY
        );
      }
    }
    // // G: Manage a process's execution. What the heck does that mean? Do I call a process method?
    // currentProcess.blocking
    //   ? currentProcess.executeBlockingProcess(time)
    //   : currentProcess.executeProcess(time);
    // this.dequeue();
    // // Handle Accordingly? In other words go somewhere, in other words move to a new queue. Re-queued.
    // // TODO: How do I requeue?
    // if (currentProcess.isFinished()) {
    //   // Do nothing. The process leaves the queue
    // }
    //TODO: Depending on process type or what queue it was on and it's state, have to reassign it to a queue.
  }

  // Execute the next non-blocking process (assuming this is a CPU queue)
  // This method should call `manageTimeSlice` as well as execute the next running process
  doCPUWork(time) {}

  // Execute the next blocking process (assuming this is the blocking queue)
  // This method should call `manageTimeSlice` as well as execute the next blocking process
  doBlockingWork(time) {}

  // The queue's interrupt handler for notifying when a process needs to be moved to a different queue
  // Should handle PROCESS_BLOCKED and PROCESS_READY interrupts
  // The process also needs to be removed from the queue
  emitInterrupt(source, interrupt) {}
}

module.exports = Queue;
