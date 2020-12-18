const SchedulerInterrupt = {
    PROCESS_BLOCKED: 'PROCESS_BLOCKED',
    PROCESS_READY: 'PROCESS_READY',
    LOWER_PRIORITY: 'LOWER_PRIORITY',
    PRIORITY_BOOST: 'PRIORITY_BOOST', // STRETCH

};

const QueueType = {
    CPU_QUEUE: 'CPU_QUEUE',
    BLOCKING_QUEUE: 'BLOCKING_QUEUE',
};

const PRIORITY_LEVELS = 3;

const TT_PRIORITY_BOOST = 500; // milliseconds

module.exports = {
    SchedulerInterrupt,
    QueueType,
    PRIORITY_LEVELS,
    TT_PRIORITY_BOOST
};
