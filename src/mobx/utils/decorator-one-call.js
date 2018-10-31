function oneCall(flowMethod) {
    let task;
    let inProgress = 0;
    let method = async function(...args) {
        try {
            task && task.cancel()
            inProgress++;
            task  = flowMethod.apply(this, args);
            await task;
        } catch (e) {
            console.error(e)
        } finally {
            inProgress--;
        }
    }

    method.cancel = () => {
        console.log('>>> try to cancel');
        if (inProgress) {
            console.log('>>> canceling');
            task.cancel();
            console.log('>>> canceled');
        } else {
            console.log('>>> no task in proress');
        }
        console.log('---');
    }

    method.inProgress = () => {
        return inProgress;
    }

    return method;
}

module.exports = { oneCall };