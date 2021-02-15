const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL'); //função de leitura que retorna o resultado no callback
function read(req, res) {
    //criar e executar a query de leitura na BD
    const query = connect.con.query('SELECT idparticipant, nome, email FROM participant order by idparticipant desc', function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

function save(req, res) {
    //receber os dados do formuário que são enviados por post
    const nome = req.sanitize('nome').escape();
    const email = req.sanitize('email').escape();
    req.checkBody("nome", "Insira apenas texto").isAlpha();
    req.checkBody("email", "Insira um email válido").isEmail();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (nome != "NULL" && email != "NULL" && typeof(nome) != "undefined") {
            const post = { nome: nome, email: email };
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO participant SET ?', post, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    res.status(jsonMessages.db.successInsert.status).location(rows.insertId).send(jsonMessages.db.successInsert);
                }
                else {
                    console.log(err);
                    res.send(jsonMessages.db.dbError);
                }
            });
        }
        else

            res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
    }
}

//exportar as funções
module.exports = {
    read: read,
    save: save
};
