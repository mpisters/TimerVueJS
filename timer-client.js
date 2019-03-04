
var socket = io.connect();

function startTimer() {
    console.log("is this reached?")
    socket.on('stream', function (data) {
        console.log("data", data)
        app.timer = data.timer;
    });
}

startTimer();
var app = new Vue({
    el: "#app",
    data: {
        timer: 0
    },
    methods: {
        stop: function () {
            socket.emit('stop')
        },
        start: function () {
            socket.emit('start')
        },
        reset: function () {
            socket.emit('reset')
        }
    }
})
