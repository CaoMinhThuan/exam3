const url = require('url');
const qs = require('qs');
const BaseController = require("./base.controller");
const _handle = require("../../handler/handle");

class HomestayController extends BaseController {
    async showFormAdd(req, res) {
        let data = await _handle.getTemplate('./src/view/add.html')
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    }

    addHomestay(req, res) {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', async () => {
            const homestay = qs.parse(data);
            const sql = `INSERT INTO Homestay (nameHomestay, City, num_bedroom, price, num_badroom, description)
                         values ("${homestay.nameHomestay}",
                                 "${homestay.City}",
                                 +${homestay.num_bedroom},
                                 +${homestay.price},
                                 +${homestay.num_badroom},
                                 "${homestay.description}")`;
            await this.querySQL(sql);
            res.writeHead(301, {'Location': '/'});
            return res.end();
        });
    }

    async showListHomestay(req, res) {
        const sql = 'SELECT id,nameHomestay,City,price FROM  Homestay';
        let homestays = await this.querySQL(sql);
        let html = '';
        homestays.forEach((homestay, index) => {
            html += `<tr>`;
            html += `<th>${index+1}</th>`
            html += `<th>${homestay.nameHomestay}</th>`
            html += `<th>${homestay.City}</th>`
            html += `<th>${homestay.price}</th>`
            html += `<th><a onclick="return confirm('Are you sure?')" href="delete?id=${homestay.id}" class="btn btn-primary m-1">Delete</a><a href="update?id=${homestay.id}" class="btn btn-danger m-1">Update</a><a href="detail?id=${homestay.id}" class="btn btn-primary m-1">Detail</a></th>`
            html += `</tr>`
        })
        let data = await _handle.getTemplate('./src/view/list.html');
        data = data.replace('{list-homestay}', html);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    }
    async showFormUpdate(req,res){
        let id = url.parse(req.url, true).query.id;
        let getHomestaytSql = `select * from Homestay where id = '${id}'`;
        let homestay = await this.querySQL(getHomestaytSql);

        let data = await _handle.getTemplate('./src/view/update.html');
        data = data.replace('{nameHomestay}', `<input type="text" class="form-control" name="nameHomestay" value="${homestay[0].nameHomestay}" placeholder="Update Name Homestay">`);
        data = data.replace('{City}', `<input type="text" class="form-control" name="City" value="${homestay[0].City}" placeholder="Update City">`);
        data = data.replace('{num_bedroom}', `<input type="number" name ="num_bedroom" class="form-control" value="${homestay[0].num_bedroom}" placeholder="Update Num_Bedroom">`);
        data = data.replace('{price}', `<input type="number" name="price" class="form-control" value="${homestay[0].price}" placeholder="Update Price">`);
        data = data.replace('{num_badroom}', `<input type="text" name="num_badroom" class="form-control" value="${homestay[0].num_badroom}" placeholder="Update Num_Bedroom">`);
        data = data.replace('{description}', `<input type="text" name="description" class="form-control" value="${homestay[0].description}" placeholder="Update Description">`);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    }
    updateHomeStay(req, res){
        let parseUrl = url.parse(req.url, true);
        let queryStringObject = parseUrl.query;
        let id = queryStringObject.id;
        let data = '';
        req.on('data', chunk => data += chunk)
        req.on('end', async () => {
            let homestay = qs.parse(data);
            const sql = `UPDATE Homestay
                     SET nameHomestay = '${homestay.nameHomestay}', 
                         City = '${homestay.City}',
                         num_bedroom = '${homestay.num_bedroom}', 
                         price = '${homestay.price}',
                         num_badroom = '${homestay.num_badroom}', 
                         description ='${homestay.description}'
                     WHERE id = '${id}';`
            await this.querySQL(sql);
            res.writeHead(301,{'Location': '/'});
            res.end();
        })
    }
    async deleteHomestay(req, res){
        let parseUrl = url.parse(req.url, true);
        let queryStringObject = parseUrl.query;
        let id = queryStringObject.id;
        const sql = `DELETE
                     FROM Homestay
                     WHERE id = '${id}'`;
        await this.querySQL(sql);
        res.writeHead(301, {'Location': '/'})
        res.end();
    }
    async showDetail(req, res){
        let parseUrl = url.parse(req.url, true);
        let queryStringObject = parseUrl.query;
        let id = queryStringObject.id;
        const sql = `SELECT * FROM Homestay WHERE id ='${id}'`;
        let result = await this.querySQL(sql);
        let dataHomestay = result[0];
        let homestayName = dataHomestay.nameHomestay;
        let homestayCity = dataHomestay.City;
        let homestayNum_bedroom = dataHomestay.num_bedroom;
        let homestayPrice= dataHomestay.price;
        let homestayNum_badroom = dataHomestay.num_badroom;
        let homestayDescription = dataHomestay.description;

        let data = await _handle.getTemplate('./src/view/detail.html');
        data = data.replace('{nameHomestay}',homestayName );
        data = data.replace('{City}',homestayCity);
        data = data.replace('{num_bedroom}',homestayNum_bedroom);
        data = data.replace('{price}',homestayPrice);
        data = data.replace('{num_badroom}',homestayNum_badroom);
        data = data.replace('{description}',homestayDescription);
        res.writeHead(200, {'Content-type': 'text/html'});
        res.write(data);
        res.end();

    }

}
module.exports = HomestayController;