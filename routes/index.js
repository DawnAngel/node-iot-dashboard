var express = require('express');
var redis = require('redis');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    var scope = {
        title: 'Node IoT Dashboard'
    };

    res.render('index', scope);
});

router.get('/api/data', function(req, res, next) {
    var client = redis.createClient();
    var scope = {
        data: []
    };

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    var keys_prefix = 'iot:sensor:list:';

    client.keys(keys_prefix + "*", function(err, keysReply) {
        var multi = client.multi();

        keysReply.forEach(function(keyName, index) {
            var keyId = keyName.replace(keys_prefix, '');
            multi.lrange([keyName, 0, 100]);
            console.log(index, keyName);
            scope.data[index] = {
                id: keyId
            };
        });

        multi.exec(function(err, replies) {
            replies.forEach(function(reply, index) {
                var rows = [];
                var min, max;

                reply.forEach(function(row, index) {
                    var xy = row.split(',');
                    var tick = {
                        x: parseFloat(xy[0]),
                        y: parseFloat(xy[1])
                    };
                    rows.push(tick);
                    if (undefined === min) {
                        min = max = tick.y;
                    } else {
                        min = Math.min(min, tick.y);
                        max = Math.max(max, tick.y);
                    }
                });

                scope.data[index].data = rows;
                scope.data[index].min = min;
                scope.data[index].max = max;
            });

            res.json(scope);
        });
    });


});

module.exports = router;
