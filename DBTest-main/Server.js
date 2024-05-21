const http = require('http');
const fs = require('fs');
const path = require('path');
const connection = require('./db');

// HTTP 서버 생성
const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        // index.html 파일 읽기
        fs.readFile(path.join(__dirname, 'test.html'), (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Error reading HTML file');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    } else if (req.url === '/post') {
        const js = fs.readFileSync('./DBTest-main/index.html');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.write(js);
        res.end();
    } else if (req.url === '/save' && req.method === 'POST') {
        // 사용자 추가
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { name, content } = JSON.parse(body);
            const query = 'INSERT INTO users (name, content) VALUES (?, ?)';
            connection.query(query, [name, content], (err, result) => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Error inserting data');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('Data inserted successfully');
                }
            });
        });
    } else if (req.url === '/load' && req.method === 'GET') {
        // 사용자 불러오기
        connection.query('SELECT * FROM users', (err, rows) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Error fetching data');
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(rows));
            }
        });
    } else if (req.url === '/app.js') {
        const js = fs.readFileSync('./DBTest-main/app.js');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
        res.write(js);
        res.end();
    } else if (req.url === '/style.css') {
        const css = fs.readFileSync('./DBTest-main/style.css');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
        res.write(css);
        res.end();
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not found');
    }
    console.log(req.url);
});

// 서버 시작
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
