// ELISE MOVIE FIGHT PROJECT JS UTILITY

//delay = 1000 means that the delay will default to 1000 unless a different amount is specified below
const debounce = (func, delay = 1000) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            //apply = call the fxn as normal and take all the arguments (args) inside that array and pass them in as separate arguments to the original fxn 
            func.apply(null, args);
        }, delay);
    };
};