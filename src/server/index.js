const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const os = require('os');
var path = require('path');
var hostname = os.hostname();
var WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const port = 3090;
const devPort = 3091;
const corsPort = 3093;
const app = express();
const axios = require('axios')
app.enable('trust proxy');
var bodyParser = require('body-parser')
var compression = require('compression')

var admin = require('firebase-admin');
var serviceAccount = require('../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://learnenglishrss.firebaseio.com'
});
const db = admin.database();
const firestore = admin.firestore()

app.use(bodyParser.json())
app.use(compression())
var cors_proxy = require('cors-anywhere');
var whitelist = [
  'local-server',
  'https://learnenglishrss.herokuapp.com',
  'https://learnenglishrss.com',
  'http://learnenglishrss.com',
  'http://localhost:3091',
  'http://localhost:3090',
];
cors_proxy.createServer({
    originWhitelist: whitelist, // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2', 'User-Agent', 'user-agent']
}).listen(corsPort, function() {
    console.log('Running CORS Anywhere on port ' + corsPort);
});

const axiosCorsServer = axios.create({
  baseURL: `http://localhost:${corsPort}`,
  headers: {'Origin': 'local-server'}
});

app.use('/vendors', express.static(__dirname + '/node_modules/'));



app.use('/read-url', function(req, res) {
  axiosCorsServer.get(`${req.url}`)
  .then((response) =>{
    res.send(response.data)
  })
  .catch((error) => {
    res.status(404).send("Url error")
    console.log(error.message);
  });
});

function ensureSecure(req, res, next){
  if(req.secure){
    return next();
  };
  // handle port numbers if you need non defaults
  // res.redirect('https://' + req.host + req.url); // express 3.x
  var path = 'https://' + req.hostname + req.url
  console.log("checkredirect", path)
  res.redirect(path); // express 4.x
}


app.use("/build/", express.static('dist/', { maxAge: "1h" }))
app.use("/res/", express.static('res/', { maxAge: "1h" }))

function onRssShortLinkItem(rssItemDoc, res){
  const rssItem = rssItemDoc.data()
  const rssRootLink = rssItem.link
  res.writeHead(301,{Location: rssRootLink});
  res.end();
}
app.use('/s', function(req, res){
  const shortLink = req.url.substring(1)
  var query = firestore.collection('rss')
  .where('shortlink','==', shortLink);
  query.get().then((documentSnapshots)=>{
    const docs = documentSnapshots.docs
    if(docs.length>0){
      onRssShortLinkItem(docs[0], res)
    }else{
      firestore.collection('rss').doc(shortLink).get()
      .then(doc => {
        if (doc.exists) {
          onRssShortLinkItem(doc, res)
        } else {
          console.log('Rss id not found', shortLink);
          res.send({error: 'Rss short link not found'})
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
    }
  }).catch(err => {
    console.log('Error getting documents', err);
    res.send({error: 'something error'})
  });
})

app.use('/robots.txt', function (req, res) {
  console.log("checkgetrobots.txt")
    res.sendFile(path.join(__dirname, '../../res', 'robots.txt'));
});
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
});
if(process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');

    const config = require('../../webpack.dev.config');
    let compiler = webpack(config);
    let devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(devPort, () => {
        console.log('webpack-dev-server is listening on port', devPort);
    });
}

if(process.env.NODE_ENV == 'production') {
  if (fs.existsSync('/etc/letsencrypt/live/eslres.com/privkey.pem')) {
    app.use(ensureSecure);

    const privateKey = fs.readFileSync('/etc/letsencrypt/live/eslres.com/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/eslres.com/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/eslres.com/chain.pem', 'utf8');

    const credentials = {
    	key: privateKey,
    	cert: certificate,
    	ca: ca
    };
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(process.env.PORT||443, () => {
    	console.log('HTTPS Server running on port 443');
    });
  }
}
const httpServer = http.createServer(app);
httpServer.listen(process.env.PORT||port, () => {
  console.log("Ensure you runned port-redirect.sh")
  console.log('HTTP Server running2 on port 80');
});
