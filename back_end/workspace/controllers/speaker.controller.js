const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL');

function read(req, res) {
    connect.con.query('SELECT idSpeaker, nome, foto, bio, link, filiacao, active, filiacao, linkedin, twitter, facebook, cargo, active FROM speaker order by idSpeaker desc', function(err, rows, fields) {
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
    const idspeaker = req.sanitize('id').escape();
    const post = { idSponsor: idspeaker };
    connect.con.query('SELECT idSpeaker, nome, foto, bio, link, filiacao, active, filiacao, linkedin, twitter, facebook, cargo FROM speaker where idSpeaker = ? order by idSpeaker desc', post, function(err, rows, fields) {
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
    const nome = req.sanitize('nome').escape();
    const foto = req.sanitize('foto').escape();
    const bio = req.sanitize('bio').escape();
    const link = req.sanitize('link').escape();
    const filiacao = req.sanitize('filiacao').escape();
    const cargo = req.sanitize('cargo').escape();
    const facebook = req.sanitize('facebook').escape();
    const linkedin = req.sanitize('linkedin').escape();
    const twitter = req.sanitize('twitter').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody("cargo", "Insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody("link", "Insira um url válido.").optional({ checkFalsy: true }).isURL();
    req.checkBody("foto", "Insira um url válido.").optional({ checkFalsy: true }).isURL();
    req.checkBody("facebook", "Insira um url válido: https://facebook.com/name.").optional({ checkFalsy: true }).matches("https://facebook.com/*");
    req.checkBody("linkedin", "Insira um url válido: https://linkedin.com/name.").optional({ checkFalsy: true }).matches("https://linkedin.com/*");
    req.checkBody("twitter", "Insira um url válido: https://twitter.com/name.").optional({ checkFalsy: true }).matches("https://twitter.com/*");
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (nome != "NULL" && filiacao != "NULL" && typeof(nome) != "undefined") {
            const post = { nome: nome, foto: foto, bio: bio, link: link, filiacao: filiacao, facebook: facebook, linkedin: linkedin, twitter: twitter, cargo: cargo };
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO speaker SET ?', post, function(err, rows, fields) {
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
            res.status(jsonMessages.db.requiredData.status).end(jsonMessages.db.requiredData);
    }
}

function update(req, res) {
    const nome = req.sanitize('nome').escape();
    const foto = req.sanitize('foto').escape();
    const bio = req.sanitize('bio').escape();
    const link = req.sanitize('link').escape();
    const filiacao = req.sanitize('filiacao').escape();
    const cargo = req.sanitize('cargo').escape();
    const facebook = req.sanitize('facebook').escape();
    const linkedin = req.sanitize('linkedin').escape();
    const twitter = req.sanitize('twitter').escape();
    const idSpeaker = req.sanitize('id').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody("cargo", "Insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody("link", "Insira um url válido.").optional({ checkFalsy: true }).isURL();
    req.checkBody("foto", "Insira um url válido.").optional({ checkFalsy: true }).isURL();
    req.checkBody("facebook", "Insira um url válido: https://facebook.com/name.").optional({ checkFalsy: true }).matches("https://facebook.com/*");
    req.checkBody("linkedin", "Insira um url válido: https://linkedin.com/name.").optional({ checkFalsy: true }).matches("https://linkedin.com/*");
    req.checkBody("twitter", "Insira um url válido: https://twitter.com/name.").optional({ checkFalsy: true }).matches("https://twitter.com/*");
    req.checkParams("idSpeaker", "Insira um ID de speaker válido").isNumeric();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idSpeaker != "NULL" && typeof(nome) != 'undefined' && typeof(cargo) != 'undefined' && typeof(idSpeaker) != 'undefined') {
            const update = [nome, foto, bio, link, filiacao, cargo, facebook, linkedin, twitter, idSpeaker];
            const query = connect.con.query('UPDATE speaker SET nome =?, foto =?, bio=?,link=?, filiacao=?, cargo=?, facebook=? , linkedin=?, twitter=?  WHERE idSpeaker=?', update, function(err, rows, fields) {
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

function deleteL(req, res) {
    const update = [0, req.sanitize('id').escape()];
    const query = connect.con.query('UPDATE speaker SET active = ? WHERE idSpeaker=?', update, function(err, rows, fields) {
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

function deleteF(req, res) {
    const update = req.sanitize('id').escape();
    const query = connect.con.query('DELETE FROM speaker WHERE idSpeaker=?', update, function(err, rows, fields) {
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
};
