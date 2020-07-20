var express = require('express'),
    router = express.Router(),
    axios = require('axios'),
    config = require('./../config.json');

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: config.serverName + ' | MCStatus', config, layout: 'mainViews'});
  });

  /* GET stats page. */
  router.get('/stats', function(req, res, next) {
    res.render('stats', { pageID: 'stats', title: config.serverName + ' - System | MCStatus', config, layout: 'mainViews'});
  });

  /* GET players page. */
  router.get('/players', function(req, res, next) {
    res.render('players', { pageID: 'players', title: config.serverName + ' - Players | MCStatus', config, layout: 'mainViews'});
  });

  /* GET player specific page. */
  router.get('/player/*', function(req, res, next) {
    axios.get('http://' + config.serverAddress + ':' + config.apiPort + config.baseURI + '/player', 
    {
      headers: {
        playerIdType: 'uuid',
        playerId: req.params[0]
      }
    }).then(rs => {
      res.render('player', { pageID: 'players', playerdata: rs.data, title: config.serverName + ' - Player ' + rs.data.name + ' | MCStatus', config, layout: 'mainViews'});
    }).catch(err => {
      res.locals.message = err.response.data.error;
      res.locals.status = err.response.status || 500;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.response.status || 500);
      res.render('error', { title: config.serverName + ' - ' + (err.response.status || 500) + ' | MCStatus', config });
    });
  });

module.exports = router;
