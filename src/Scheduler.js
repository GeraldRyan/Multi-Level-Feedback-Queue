const Queue = require("./Queue");
const { QueueType, PRIORITY_LEVELS } = require("./constants/index");

// A class representing the scheduler
// It holds a single blocking queue for blocking processes and three running queues
// for non-blocking processes
class Scheduler
{
    constructor()
    {
        this.clock = Date.now();
        this.blockingQueue = new Queue(this, 50, 0, QueueType.BLOCKING_QUEUE);
        this.runningQueues = [];
        // Initialize all the CPU running queues
        for (let i = 0; i < PRIORITY_LEVELS; i++)
        {
            this.runningQueues[i] = new Queue(
                this,
                10 + i * 20,
                i,
                QueueType.CPU_QUEUE
            );
        }
    }

    // Executes the scheduler in an infinite loop as long as there are processes in any of the queues
    // Calculate the (((time slice for the next iteration of the scheduler))) by subtracting the current
    // time from the clock property. Don't forget to update the clock property afterwards.
    // On every iteration of the scheduler, if the blocking queue is not empty, blocking work
    // should be done. Once the blocking work has been done, perform some CPU work in the same iteration.
    run()
    {
        while (!this.allQueuesEmpty)
        {
            const currentTime = Date.now();
            const workTime = currentTime - this.clock; // the time from when 'run' was called and scheduler was instantiated
            this.clock = currentTime;

            while (this.blockingQueue.length !== 0)
            {
                // Do Blocking Queue Work
            }

            this.runningQueues.forEach(q =>
            {
                if (q.length !== 0)
                {
                    // Do queue work
                }
            })
        }
    }

    allQueuesEmpty()
    {
        for (let i = 0; i < this.runningQueues.length; i++)
        {
            if (this.runningQueues[i].length > 0 || this.blockingQueue.length > 0)
            {
                return false;
            }
        }
        return true;
    }

    addNewProcess(process)
    {
        this.runningQueues[0].enqueue(process);  // because process object is passed by reference to queues object that is a component member of scheduler object.
    }

    // The scheduler's interrupt handler that receives a queue, a process, and an interrupt string constant
    // Should handle PROCESS_BLOCKED, PROCESS_READY, and LOWER_PRIORITY interrupts.
    handleInterrupt(queue, process, interrupt)
    {
        switch (interrupt)
        {
            case 'PROCESS_BLOCKED':
                this.blockingQueue.enqueue(queue.dequeue(process));
                break;
            case 'PROCESS_READY': // for first level queue? 
                this.addNewProcess(process);
                break;
            case 'LOWER_PRIORITY':
                if (queue.getQueueType() === QueueType.CPU_QUEUE)
                {
                    let downPriority = Math.max(queue.getPriorityLevel - 1,0)
                    this.runningQueues[downPriority].enqueue(process)
                }
                else {
                    this.blockingQueue.enqueue(process)
                }
                break;
        }


    }

    // Private function used for testing; DO NOT MODIFY
    _getCPUQueue(priorityLevel)
    {
        return this.runningQueues[priorityLevel];
    }

    // Private function used for testing; DO NOT MODIFY
    _getBlockingQueue()
    {
        return this.blockingQueue;
    }
}

module.exports = Scheduler;
