const uWS = require('uWebSockets.js');
const fs = require('fs');
const path = require('path');

const port = 80

const app = uWS./*SSL*/App()
  .get('/*', (res, req) => {
    let filePath = '.' + req.getUrl();
    if (filePath == './') { filePath = './index.html'; }
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
        contentType = 'image/jpg';
        break;
    }
    try {
      const content = fs.readFileSync('build/' + filePath);
      res.writeStatus('200');
      res.writeHeader('Content-Type', contentType);
      res.end(content);
    } catch (error) {
      if (error.code == 'ENOENT') {
        try {
          const notFound = fs.readFileSync('build/404.html');
          res.writeStatus('200');
          res.writeHeader('Content-Type', 'text/html');
          res.end(notFound);
        } catch (error) {
          res.writeStatus('404');
          res.end('Not found!');
        }
      }
      else {
        res.writeStatus('500');
        res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
      }
    }
}).listen(port, (token) => {
  if (token) {
    console.log('Listening to port ' + port);
  } else {
    console.log('Failed to listen to port ' + port);
  }
});