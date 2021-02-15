const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL');
//função de leitura que retorna o resultado no callback
function readConference(req, res) {
    const query = connect.con.query('SELECT idConference, acronimo, nome, descricao, local, data FROM conference order by data desc', function(err, rows, fields) {
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

function readConferenceID(req, res) {
    const idConf = req.sanitize('idconf').escape();
    const post = { idConference: idConf };
    const query = connect.con.query('SELECT idConference, acronimo, nome,descricao,local,data FROM conference where ? order by data desc', post, function(err, rows, fields) {
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

function readParticipant(req, res) {
    const idconference = req.sanitize('idconf').escape();
    const post = { idConference: idconference };
    const query = connect.con.query('SELECT distinct idParticipant, nomeParticipante FROM conf_participant where ? order by idParticipant desc', post, function(err, rows, fields) {
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

function saveParticipant(req, res) {
    //receber os dados do formulário que são enviados por post
    req.sanitize('idparticipant').escape();
    req.sanitize('idconf').escape();
    req.sanitize('nomeparticipant').escape();
    req.checkParams("idparticipant", "Insira um email válido.").isEmail();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        const idParticipant = req.params.idparticipant;
        const idConf = req.params.idconf;
        const nome = req.body.nomeparticipant;
        if (idParticipant != "NULL" && idConf != "NULL" && typeof(idParticipant) != 'undefined' && typeof(idConf) != 'undefined') {
            const post = { idParticipant: idParticipant, idConference: idConf, nomeParticipante: nome };
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO conf_participant SET ?', post, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
                }
                else {
                    console.log(err);
                    if (err.code == "ER_DUP_ENTRY") {
                        res.status(jsonMessages.db.duplicateEmail.status).send(jsonMessages.db.duplicateEmail);
                    }
                    else
                        res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
            });
        }
        else
            res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
    }
}

function deleteConfParticipant(req, res) {
    //criar e executar a query de leitura na BD
    req.sanitize('idparticipant').escape();
    req.sanitize('idconf').escape();
    req.sanitize('nomeparticipant').escape();
    req.checkParams("idparticipant", "Insira um email válido.").isEmail();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        const idconference = req.params.idconf;
        const idparticipant = req.params.idparticipant;
        const params = [idconference, idparticipant];
        const query = connect.con.query('DELETE FROM conf_participant where idConference = ? and idParticipant = ?', params, function(err, rows, fields) {
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
}

function readConfSponsor(req, res) {
    const idconference = req.sanitize('idconf').escape();
    const post = { idConference: idconference };
    const query = connect.con.query('SELECT distinct sponsor.idSponsor, nome, logo,categoria, link, active FROM sponsor, conf_sponsor where ? order by idSponsor desc', post, function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            console.log(err);
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

function saveConfSponsor(req, res) {
    //receber os dados do formuário que são enviados por post
    const idSponsor = req.sanitize('idsponsor').escape();
    const idConf = req.sanitize('idconf');
    if (idSponsor != "NULL" && idConf != "NULL" && typeof(idSponsor) != 'undefined' && typeof(idConf) != 'undefined') {
        const post = { idSponsor: idSponsor, idConference: idConf };
        //criar e executar a query de gravação na BD para inserir os dados presentes no post
        const query = connect.con.query('INSERT INTO conf_sponsor SET ?', post, function(err, rows, fields) {
            console.log(query.sql);
            if (!err) {
                res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
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

function deleteConfSponsor(req, res) {
    //criar e executar a query de leitura na BD
    const idSponsor = req.sanitize('idsponsor').escape();
    const idConf = req.sanitize('idconf').escape();
    const params = [idConf, idSponsor];
    const query = connect.con.query('DELETE FROM conf_sponsor where idConference = ? and idSponsor = ?', params, function(err, rows, fields) {
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

function readConfSpeaker(req, res) {
    //criar e executar a query de leitura na BD
    const idConf = req.sanitize('idconf').escape();
    const post = { idConference: idConf };
    const query = connect.con.query('SELECT distinct a.idSpeaker, nome, foto, bio,link, filiacao, linkedin,twitter,facebook, cargo, active FROM speaker a, conf_speaker b where a.idSpeaker = b.idSpeaker  and ? order by idSpeaker desc', post, function(err, rows, fields) {
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

function saveConfSpeaker(req, res) {
    //receber os dados do formuário que são enviados por post
    const idConf = req.sanitize('idconf').escape();
    const idSpeaker = req.sanitize('idspeaker').escape();
    if (idSpeaker != "NULL" && idConf != "NULL" && typeof(idSpeaker) != 'undefined' && typeof(idConf) != 'undefined') {
        const post = { idSpeaker: idSpeaker, idConference: idConf };
        //criar e executar a query de gravação na BD para inserir os dados presentes no post
        const query = connect.con.query('INSERT INTO conf_speaker SET ?', post, function(err, rows, fields) {
            console.log(query.sql);
            if (!err) {
                res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
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

function deleteConfSpeaker(req, res) {
    //criar e executar a query de leitura na BD
    const idConf = req.sanitize('idconf').escape();
    const idSpeaker = req.sanitize('idspeaker').escape();
    const params = [idConf, idSpeaker];
    console.log(params);
    const query = connect.con.query('DELETE FROM conf_speaker where idConference = ? and idSpeaker = ?', params, function(err, rows, fields) {
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

//exportar as funções
module.exports = {
    readConference: readConference,
    readConferenceID: readConferenceID,
    readParticipant: readParticipant,
    saveParticipant: saveParticipant,
    readSponsor: readConfSponsor,
    saveSponsor: saveConfSponsor,
    readSpeaker: readConfSpeaker,
    saveSpeaker: saveConfSpeaker,
    deleteSpeaker: deleteConfSpeaker,
    deleteSponsor: deleteConfSponsor,
    deleteParticipant: deleteConfParticipant
};
