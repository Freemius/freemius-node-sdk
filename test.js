const Freemius = require("./Freemius");

const FS__API_SCOPE = 'developer'
const FS__API_DEV_ID = 007;
const FS__API_PUBLIC_KEY = 'pk_ed92a20a378ddd3c7e6bdb1be1234';
const FS__API_SECRET_KEY = 'sk_hv[xgNzLilJQHXgeTy2Qi<siz1324';


const fb = new Freemius(FS__API_SCOPE, FS__API_DEV_ID, FS__API_PUBLIC_KEY, FS__API_SECRET_KEY);

fb.Api('/plugins.json', 'GET', [], [], function (e) {
    console.log(JSON.parse(e));
});

/*
fb.FindClockDiff(function (e) {

    let timediff = Date.now() - strtotime(JSON.parse(e).timestamp);

    console.log(timediff);
});

fb.Test(function (e) {
    console.log(e);
    if (JSON.parse(e).api === 'pong')
        console.log("Ping Success");
    else
        console.log("Ping Failure");
})

fb.Api('/plugins.json', 'GET', [], [], function (e) {
    console.log(e);
});

fb.Api('/plugins.json', 'GET', [], [], function (e) {
    console.log(JSON.parse(e));
});


fb.Api('/plugins/5082.json', 'GET', [], [], function (e) {
    console.log(e);
});



// Update title.
fb.Api("/plugins/5082.json", 'PUT', { 'title': 'Axxxx My New Title' }, {}, function (e) {
    console.log(e);
});


*/


/*fb.Api('plugins/5082/tags.json', 'POST', {
    'add_contributor': true
}, {
    'file': 'freemius.zip'
}, function (e) {
    console.log(e);
});*/
