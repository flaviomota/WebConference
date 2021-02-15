const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");

const connect = require('../config/connectMySQL'); //função de leitura que retorna o resultado no callback
function read(req, res) {
    //criar e executar a query de leitura na BD
    const query = connect.con.query('SELECT idSponsor, nome, logo,categoria, link, active FROM sponsor order by idSponsor desc', function(err, rows, fields) {
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

function readID(req, res) {
    //criar e executar a query de leitura na BD para um ID específico
    const idsponsor = req.sanitize('id').escape();
    const post = { idSponsor: idsponsor };
    const query = connect.con.query('SELECT idSponsor, nome, logo,categoria, link, active FROM sponsor where idSponsor = ? order by idSponsor desc ', post, function(err, rows, fields) {
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
    const logo = req.sanitize('logo').escape();
    const categoria = req.sanitize('categoria').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody("categoria", "Insira apenas texto").optional({ checkFalsy: true }).matches(/^[a-z ]+$/i);
    req.checkBody("logo", "Insira um url válido.").optional({ checkFalsy: true }).isURL();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (nome != "NULL" && categoria != "NULL" && typeof(nome) != 'undefined') {
            const post = { nome: nome, logo: logo, categoria: categoria };
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO sponsor SET ?', post, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    res.status(jsonMessages.db.successInsert.status).location(rows.insertId).send(jsonMessages.db.successInsert);
                }
                else {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
            });
        }
        else
            res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
    }
}
//criar e executar a query de update  na BD
function update(req, res) {
    const nome = req.sanitize('nome').escape();
    const logo = req.sanitize('logo').escape();
    const categoria = req.sanitize('categoria').escape();
    const idsponsor = req.sanitize('id').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody("categoria", "Insira apenas texto").optional({ checkFalsy: true }).matches(/^[a-z ]+$/i);
    req.checkBody("logo", "Insira um url válido.").optional({ checkFalsy: true }).isURL();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idsponsor != "NULL" && typeof(nome) != 'undefined' && typeof(categoria) != 'undefined' && typeof(idsponsor) != 'undefined') {
            const update = [nome, categoria, logo, idsponsor];
            const query = connect.con.query('UPDATE sponsor SET nome =?, categoria =?, logo=? WHERE idSponsor=?', update, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
                }
                else {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
            });
        }
        else
            res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
    }
}
//delete lógico
function deleteL(req, res) {
    const update = [0, req.sanitize('id').escape()];
    const query = connect.con.query('UPDATE sponsor SET active = ? WHERE idSponsor=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}

//delete físico
function deleteF(req, res) {
    const update = req.sanitize('id').escape();
    const query = connect.con.query('DELETE FROM sponsor WHERE idSponsor=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDeleteU.status).send(jsonMessages.db.successDeleteU);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}

module.exports = {
    read: read,
    readID: readID,
    save: save,
    update: update,
    deleteL: deleteL,
    deleteF: deleteF,
}
