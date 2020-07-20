const   axios = require('axios'),
        config = require('./config.json');

let     io = require('socket.io')(config.socketPort);
var     cache = { players: [] }

setInterval(() => {
    getRq('stats').then(r => {
        io.emit('stats', r.data);
    });

    getRq('players').then(r => {
        cache.players = r.data.players;
    });
}, config.updateInterval);

io.on('connection', socket => {
    io.emit('players', cache.players);
    console.log('websocket connection established')
});



async function getRq(endpoint) {
    try {
        const response = await axios.get('http://' + config.serverAddress + ':' + config.apiPort + config.baseURI + (endpoint.startsWith('/') ? '' : '/') + endpoint);
        return response;
    } catch (error) {
        console.error(error);
    }
}