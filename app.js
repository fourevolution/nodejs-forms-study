import http from 'http';
import { fileURLToPath } from 'url';
import path, { dirname, join } from 'path';
import fs, { copyFileSync } from 'fs';
import Mustache from 'mustache';
import { type } from 'os';
import { title } from 'process';

const PORT = 8000;

function deleteElemFromList(id) {
    let fileContent = fs.readFileSync('./items.json', 'utf8');
    console.log(fileContent);
    let data = JSON.parse
} 

const server = http.createServer(function (req, res) {
    if (req.url === '/' && req.method === 'GET') {
        let fileContent = fs.readFileSync('./items.json', 'utf8');
        let data = JSON.parse(fileContent);
        let template = fs.readFileSync('./pages/home.html').toString();
        // console.log(data);
        res.end(Mustache.render(template, { title: 'Home', items: data }, {
            header: fs.readFileSync('./pages/partials/header.html').toString(),
            navigation: fs.readFileSync('./pages/partials/navigation.html').toString(),
            footer: fs.readFileSync('./pages/partials/footer.html').toString(),
        }));
}

    if (/^\/items\/[0-9]+$/.test(req.url) && req.method === 'GET') {
        let fileContent = fs.readFileSync('./items.json', 'utf8');
        let data = JSON.parse(fileContent);

        let id = Number(req.url.split('/')[2]);
        let item = data.find(item => item.id === id);
        let template = fs.readFileSync('./pages/item.html').toString();

        res.end(Mustache.render(template, { item: item }));
    }

    if (/^\/items\/[0-9]+$/.test(req.url) && req.method === 'DELETE') {
        deleteElemFromList();
    }

    if (req.url === '/items/create' && req.method === 'GET') {
        let template = fs.readFileSync('./pages/create.html').toString();
        res.end(Mustache.render(template, { title: 'About us' }, {
            header: fs.readFileSync('./pages/partials/header.html').toString(),
            navigation: fs.readFileSync('./pages/partials/navigation.html').toString(),
            footer: fs.readFileSync('./pages/partials/footer.html').toString(),
        }));
    }

    if (req.url === "/items/store/change" && req.method === "POST") {
        let body = [];
        req
            .on('data', (chunk) => {
                body.push(chunk);
            })
            .on('end', () => {
                body = Buffer.concat(body).toString().split('&');
                body.forEach((e, i) => {
                    let s = e.split('=');
                    body[i] = {
                        key: s[0],
                        value: s[1],
                    };
                });
                let id = body[0].value;
                let fileContent = fs.readFileSync('./items.json', 'utf-8');
                let data = JSON.parse(fileContent);
                console.log("Data by id:", data[(id-1)]);

                let itemId = data[(id-1)].id;
                let itemTitle = data[(id-1)].title;
                let itemImage = data[(id-1)].image;
                
                // fs.writeFile('./items.json',
                    // JSON.stringify(data, null, 4),
                    // () => {
                        // res.writeHead(302, {
                            // "location" : "/"
                    // });
                // });
                let template = fs.readFileSync('./pages/change.html').toString();
                res.write(Mustache.render(template, 
                    {
                        title: 'Change',
                        itemId: itemId,
                        itemTitle: itemTitle,
                        itemImage: itemImage
                    }, 
                    {
                        header: fs.readFileSync('./pages/partials/header.html').toString(),
                        navigation: fs.readFileSync('./pages/partials/navigation.html').toString(),
                        footer: fs.readFileSync('./pages/partials/footer.html').toString(),
                    }
                ));
                res.end();
            });
            
    }

    if (req.url === "/items/store/change/submit" && req.method === "POST") {
        console.log("CHANGED!!!!");
    }

    if (req.url === "/items/store/delete" && req.method === "POST") {
        let body = [];
        req
            .on('data', (chunk) => {
                body.push(chunk);
            })
            .on('end', () => {
                body = Buffer.concat(body).toString().split('&');
                body.forEach((e, i) => {
                    let s = e.split('=');
                    body[i] = {
                        key: s[0],
                        value: s[1],
                    };
                });
                let id = body[0].value;
                let fileContent = fs.readFileSync('./items.json', 'utf-8');
                let data = JSON.parse(fileContent);
                // console.log("DATA: ", data);
                // console.log("ID:", id);
                // console.log("Data by id:", data[(id-1)]);
                data.splice(id-1,1);
                // console.log("DATA AFTER: ", data);
                
                fs.writeFile('./items.json',
                    JSON.stringify(data, null, 4),
                    () => {
                        res.writeHead(302, {
                            "location" : "/"
                    });
                    res.end();
                });
            });
    }

    if (req.url === '/items/store' && req.method === 'POST') {
        let body = [];
        console.log("Parsed Body: ", body);
        req
            .on('data', (chunk) => {
                body.push(chunk);
            })
            .on('end', () => {
                body = Buffer.concat(body).toString().split('&');
                console.log("Concatenated Body: ", body);
                body.forEach((e, i) => {
                    let s = e.split('=');
                    body[i] = {
                        key: s[0],
                        value: s[1],
                    };
                });

                let fileContent = fs.readFileSync('./items.json', 'utf8');
                let data = JSON.parse(fileContent);
                console.log("Data: ", data);

                data.push({
                    id: Number(body.find((e) => e.key == 'id').value),
                    title: body.find((e) => e.key == 'title').value,
                    image: body.find((e) => e.key == 'image').value,
                });

                console.log("Updated Data: ", data);

                fs.writeFile('./items.json',
                    JSON.stringify(data, null, 4),
                    () => {
                        res.writeHead(302, {
                            location: '/',
                        });
                        res.end();
                    }
                );
            });
    };

    if (req.url === '/about-us' && req.method === 'GET') {
        console.log('localhost:',PORT," --> /about-us")
        let template = fs.readFileSync('./pages/about-us.html').toString();
        res.end(Mustache.render(template, { title: 'About us' }, {
            header: fs.readFileSync('./pages/partials/header.html').toString(),
            navigation: fs.readFileSync('./pages/partials/navigation.html').toString(),
            footer: fs.readFileSync('./pages/partials/footer.html').toString(),
        }));
    }

    if (req.url.match('\.jpeg')) {
        let fileName = fileURLToPath(import.meta.url);
        let imagePath = path.join(dirname(fileName), 'img', req.url);

        fs.readFile(imagePath, function (err, img) {
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.end(img);
        });
    }

    if (req.url.match('\.css')) {
        let fileName = fileURLToPath(import.meta.url);
        let cssPath = path.join(dirname(fileName), '.', req.url);

        fs.readFile(cssPath, function (err, css) {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(css);
        });
    }
});

server.listen(PORT, function () {
    console.log('[START SERVER] localhost:', PORT);
});
