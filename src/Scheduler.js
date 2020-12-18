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
        this.globalCounter = 0; //stretch goal for priority boost tracking
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
    // Calculate the time slice for the next iteration of the scheduler by subtracting the current
    // time from the clock property. Don't forget to update the clock property afterwards.
    // On every iteration of the scheduler, if the blocking queue is not empty, blocking work
    // should be done. Once the blocking work has been done, perform some CPU work in the same iteration.
    run()
    {
        let pbTime = 0;
        while (!this.allQueuesEmpty())
        {
            const currentTime = Date.now();
            const workTime = currentTime - this.clock; // semi random
            this.clock = currentTime;
            pbTime += workTime;

            if (!this.blockingQueue.isEmpty())
            {
                // console.log("Blocking Queue length", this.blockingQueue);

                // console.log("Blocking Queue[0]", this.blockingQueue[0]);
                // Do Blocking Queue Work
                this.blockingQueue.doBlockingWork(workTime);
            }
            // console.log("Blocking Queue length", this.blockingQueue.length);
            if (pbTime >= 500)
            { // Stretch goal
                console.log(`PB to be called ${pbTime}`)
                pbTime = 0; // reset to zero
                //priority boost everything
                for (let i = 0; i < this.runningQueues.length; i++)
                {
                    if (i != 0)
                    {
                        this.runningQueues[i].priorityBoost();
                    }
                }
            }

            this.runningQueues.forEach(q =>
            {
                if (!q.isEmpty())
                {
                    // Do CPU queue work
                    q.doCPUWork(workTime);
                }
            })
        }
        // console.log("finishing\n")
    }

    allQueuesEmpty()
    {
        for (let i = 0; i < this.runningQueues.length; i++)
        {
            if (!this.runningQueues[i].isEmpty())
            {
                return false;
            }
        }
        return this.blockingQueue.isEmpty();
    }

    addNewProcess(process)
    {
        if (this.runningQueues.length > 0)
        {
            this.runningQueues[0].enqueue(process);
        }
    }

    // The scheduler's interrupt handler that receives a queue, a process, and an interrupt string constant
    // Should handle PROCESS_BLOCKED, PROCESS_READY, and LOWER_PRIORITY interrupts.
    handleInterrupt(queue, process, interrupt)
    {
        switch (interrupt)
        {
            case 'PROCESS_BLOCKED':
                this.blockingQueue.enqueue(process);
                break;
            case 'PROCESS_READY':
                this.addNewProcess(process);
                break;
            case 'LOWER_PRIORITY':
                if (queue.getQueueType() === QueueType.CPU_QUEUE)
                {
                    let downPriority = Math.min(queue.getPriorityLevel() + 1, 2);
                    this.runningQueues[downPriority].enqueue(process);
                }
                else
                {
                    this.blockingQueue.enqueue(process);
                }
            case 'PRIORITY_BOOST':
                this.addNewProcess(process)
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
