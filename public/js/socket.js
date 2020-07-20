let socket = io(socketURL + ':' + socketPort);

socket.on(socketChannel, data => {
    switch(socketChannel) {
        case 'stats':

            //uptime
            document.getElementById('gauge-uptime').innerHTML = `${ new Date(data.uptime).getDate() }d ${ new Date(data.uptime).getHours() }h ${ new Date(data.uptime).getMinutes() }m ${ new Date(data.uptime).getSeconds() }s`;
            
            //cpu
            document.getElementById('gauge-cpu').style.backgroundPositionX = data.cpuusage * -100 + '%';
            document.getElementById('gauge-cpu').innerHTML = Math.round(data.cpuusage * 100) + '%';
            
            //ram
            document.getElementById('gauge-ram').style.backgroundPositionX = data.ramusage.slice(0,data.ramusage.length - 2) / 60 * -100 + '%'; // HARDCODE
            document.getElementById('gauge-ram').innerHTML = data.ramusage + '/' + '60GB'; // HARDCODE
            
            //player
            document.getElementById('gauge-players').style.backgroundPositionX = data.playercount / 20 * -100 + '%'; // HARDCODE
            document.getElementById('gauge-players').innerHTML = data.playercount + '/' + '20'; // HARDCODE

            break;
        
        case 'players':
            if(data.length) data.forEach(p => {
                let htmlElement = new DOMParser().parseFromString(`
                <div id="player-::PLAYERNAME::" class="stat-list">
                    <img class="stat-list-icon" src="https://crafatar.com/renders/head/::UUID::"> <a href="/player/::UUID::">::PLAYERNAME::</a> <span style="float:right">Deaths: ::DEATHS::</span><br>
                    <div class="gauge-inner" style="width: calc(::HEALTH:: / 20 * 100%)">::HEALTH:: HP</div>
                    <div class="gauge-inner" style="width: calc(::HUNGER:: / 20 * 100%)">::HUNGER:: Hunger</div>
                    <a href="/player/::UUID::"><div style="color: #eee" class="gauge-inner">View detailed player information</div></a>
                </div>`
                .replace(/::PLAYERNAME::/g, p.name)
                .replace(/::HEALTH::/g, Math.round(p.health))
                .replace(/::HUNGER::/g, Math.round(p.hunger))
                .replace(/::DEATHS::/g, Math.round(p.deaths))
                .replace(/::UUID::/g, p.uuid)
                , 'text/html');
                if(document.getElementById('player-' + p.name)) document.getElementById('player-' + p.name).remove();
                document.getElementById('players-append').append(htmlElement.children[0]);
            });
            else document.getElementById('players-append').innerHTML = '<span class="error-msg">There are no players online.</span>';

            break;
    }
});