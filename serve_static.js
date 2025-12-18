const http = require('http');
const fs = require('fs');
const path = require('path');
const rootDir = path.join(__dirname, 'INSTA_QUEUE');
const port = process.env.PORT || 8000;

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  try {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(rootDir, reqPath);
    if (!filePath.startsWith(rootDir)) { res.writeHead(403); res.end('Forbidden'); return; }
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) { res.writeHead(404); res.end('Not found'); return; }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });
  } catch (e) {
    res.writeHead(500); res.end('Server error');
  }
});

server.listen(port, () => console.log(`Static server running at http://localhost:${port} serving ${rootDir}`));

process.on('SIGINT', () => { server.close(); process.exit(0); });
