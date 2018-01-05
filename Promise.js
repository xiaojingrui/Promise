// 一个简单的promise例子
// asyncFunction 这个函数会返回promise对象， 对于这个promise
// 对象，我们调用它的 then 方法来设置resolve后的回调函数， 
// catch 方法来设置发生错误时的回调函数。
function asyncFunction(timeNum) {    
    return new Promise(function (resolve, reject) {
    	if(timeNum <10000){
    		setTimeout(function () {
	            resolve('time is up');
	        }, timeNum);
    	} else {
    		reject(new Error('something bad happened!'))
    	}        
    });
}

asyncFunction(20).then(function (value) {
    console.log(value);   
}).catch(function (error) {
    console.log(error);
});



// 创建promise对象
// new Promise(fn) 返回一个promise对象
// 在fn 中指定异步等处理
// 处理结果正常的话，调用resolve(处理结果值)
// 处理结果错误的话，调用reject(Error对象)
// 创建一个用Promise把XHR处理包装起来的名为 getURL 的函数。
function getURL(URL) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', URL, true);
        req.onload = function () {
            if (req.status === 200) {
                resolve(req.responseText);
            } else {
                reject(new Error(req.statusText));
            }
        };
        req.onerror = function () {
            reject(new Error(req.statusText));
        };
        req.send();
    });
}
// 运行示例
var URL = "http://httpbin.org/get";
getURL(URL).then(function onFulfilled(value){
    console.log(value);
}).catch(function onRejected(error){
    console.error(error);
});


//  promise只能进行异步操作
var promise = new Promise(function (resolve){
    console.log("inner promise");
    resolve(42);
});
promise.then(function(value){
    console.log(value);
});
console.log("outer promise"); 


// 每次调用then都会返回一个新创建的promise对象
var aPromise = new Promise(function (resolve) {
    resolve(100);
});
var thenPromise = aPromise.then(function (value) {
    console.log(value);
});
var catchPromise = thenPromise.catch(function (error) {
    console.error(error);
});
console.log(aPromise !== thenPromise); 
console.log(thenPromise !== catchPromise);


var aa = function badAsyncCall() {
    var promise = Promise.resolve(); // 'initial'
    promise.then(function() {
        return 'aa';
    });
    return promise;
}
aa().then(function(val){console.log(val)})

var bb = function anAsyncCall() {
    var promise = Promise.resolve();
    return promise.then(function() {
        return 'bb';
    });
}
bb().then(function(val){console.log(val)})


// promise.all()
function timerPromisefy(delay) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(delay);
        }, delay);
    });
}
var startDate = Date.now();
Promise.all([
    timerPromisefy(1),
    timerPromisefy(32),
    timerPromisefy(64),
    timerPromisefy(128)
]).then(function (values) {
    console.log(Date.now() - startDate + 'ms');
    console.log(values);
});

// promise.all()
function getURL(URL) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', URL, true);
        req.onload = function () {
            if (req.status === 200) {
                resolve(req.responseText);
            } else {
                reject(new Error(req.statusText));
            }
        };
        req.onerror = function () {
            reject(new Error(req.statusText));
        };
        req.send();
    });
}
var request = {
    comment: function getComment() {
        return getURL('http://azu.github.io/promises-book/json/comment.json').then(JSON.parse);
    },
    people: function getPeople() {
        return getURL('http://azu.github.io/promises-book/json/people.json').then(JSON.parse);
    }
};

function main() {
    return Promise.all([request.comment(), request.people()]);
}

main().then(function (value) {
    console.log(value);
}).catch(function(error){
    console.log(error);
});



// promise race
function timerPromisefy(delay) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(delay);
        }, delay);
    });
}
Promise.race([
    timerPromisefy(1),
    timerPromisefy(32),
    timerPromisefy(64),
    timerPromisefy(128)
]).then(function (value) {
    console.log(value);
});

// promise race
var winnerPromise = new Promise(function (resolve) {
    setTimeout(function () {
        console.log('this is winner');
        resolve('this is winner');
    }, 4);
});
var loserPromise = new Promise(function (resolve) {
    setTimeout(function () {
        console.log('this is loser');
        resolve('this is loser');
    }, 1000);
});

Promise.race([winnerPromise, loserPromise]).then(function (value) {
    console.log(value);
});


// 使用promise.race与delay来取消XHR操作
function delayPromise(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
function timeoutPromise(promise, ms) {
    var timeout = delayPromise(ms).then(function () {
            throw new Error('Operation timed out after ' + ms + ' ms');
        });
    return Promise.race([promise, timeout]);
}
// 运行示例
var taskPromise = new Promise(function(resolve){
    var delay = Math.random() * 2000;
    setTimeout(function(){
        console.log('reslove in : ' + delay );
        resolve(delay + "ms");
    }, delay);
});
timeoutPromise(taskPromise, 1000).then(function(value){
    console.log("taskPromise在规定时间内结束 : " + value);
}).catch(function(error){
    console.log("发生超时", error);
});


// 使用promise.race与delay来取消XHR操作
// 扩展Error类，自定义TimeoutError类
function copyOwnFrom(target, source) {
    Object.getOwnPropertyNames(source).forEach(function (propName) {
        Object.defineProperty(target, propName, Object.getOwnPropertyDescriptor(source, propName));
    });
    return target;
}
function TimeoutError() {
    var superInstance = Error.apply(null, arguments);
    copyOwnFrom(this, superInstance);
}
TimeoutError.prototype = Object.create(Error.prototype);
TimeoutError.prototype.constructor = TimeoutError;

// 创建
function delayPromise(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
function timeoutPromise(promise, ms) {
    var timeout = delayPromise(ms).then(function () {
            return Promise.reject(new TimeoutError('Operation timed out after ' + ms + ' ms'));
        });
    return Promise.race([promise, timeout]);
}
function cancelableXHR(URL) {
    var req = new XMLHttpRequest();
    var promise = new Promise(function (resolve, reject) {
            req.open('GET', URL, true);
            req.onload = function () {
                if (req.status === 200) {
                    resolve(req.responseText);
                } else {
                    reject(new Error(req.statusText));
                }
            };
            req.onerror = function () {
                reject(new Error(req.statusText));
            };
            req.onabort = function () {
                reject(new Error('abort this request'));
            };
            req.send();
        });
    var abort = function () {
        // 如果request还没有结束的话就执行abort
        if (req.readyState !== XMLHttpRequest.UNSENT) {
            req.abort();
        }
    };
    return {
        promise: promise,
        abort: abort
    };
}
var object = cancelableXHR('http://httpbin.org/get');
// main
timeoutPromise(object.promise, 1000).then(function (contents) {
    console.log('Contents', contents);
}).catch(function (error) {
    if (error instanceof TimeoutError) {
        object.abort();
        return console.log(error);
    }
    console.log('XHR Error :', error);
});