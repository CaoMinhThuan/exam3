const PORT = 8000;
const http = require('http');
const url = require("url");
const HomestayController = require('./src/controllers/homestay.controller');
let homestayController = new HomestayController();

const server = http.createServer((req, res) => {
    let urlPath = url.parse(req.url).pathname;
    switch (urlPath) {
        case '/':
            homestayController.showListHomestay(req, res);
            break;
        case '/add':
            if (req.method === 'GET') {
                homestayController.showFormAdd(req, res);
            } else {
                homestayController.addHomestay(req, res)
            }
            break;
        case '/update':
            if (req.method === 'GET') {
                homestayController.showFormUpdate(req, res);
            } else {
                homestayController.updateHomeStay(req, res);
            }
            break;
        case '/delete':
            homestayController.deleteHomestay(req, res);
            break;
        case '/detail':
            homestayController.showDetail(req, res)
            break;
        default:
            res.end();
    }
})
server.listen(PORT, 'localhost', () => {
    console.log(`listening on http://localhost:${PORT}`);
})