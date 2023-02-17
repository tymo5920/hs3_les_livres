const express = require("express");
const proxy = require('express-http-proxy');

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.end("siema");
});

//https://inventaire.io/api/items?lang=fr
app.use('/api', proxy('inventaire.io/api/', {
  userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
    console.log(proxyResData.toString('utf8'))

    return proxyResData.toString('utf8')
  },
  userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
    console.log(headers)
    return headers;
  }
}));


// app.use("/api", proxy('inventaire.io/api'));

// sslserver.listen(port, () => { console.log(`Secure Server is listening on port ${port}`) });

app.listen(port, ()=>{})
