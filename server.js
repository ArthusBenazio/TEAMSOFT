import express from 'express'
import bodyParser from 'body-parser'
import mysql from 'mysql'

const app = express()
app.use(bodyParser.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Thorpipoca10',
    database: 'transportadora',
})

const validTelefone = (telefone) => {
    const brazilianPhoneRegex = /^\(\d{2}\)\d{4,5}-\d{4}$/gi;
    return brazilianPhoneRegex.test(telefone);
};

app.get('/client', (req, res) => {
    const q = 'SELECT * FROM client'
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)

    })
})

app.get('/client/:id', (req, res) => {
    const clientId = req.params.id
    const q = 'SELECT * FROM client WHERE id = ?'
    db.query(q, clientId, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)

    })
})

app.post('/client', (req, res) => {

    const { cnpj, razaosocial, nome, telefone } = req.body

    let erros = []

    if (!validaCnpj(cnpj)) {
        erros.push('CNPJ inválido')
    }
    console.log(validaCnpj(cnpj))

    if (razaosocial == null || razaosocial.length < 2) {
        erros.push('Razão social não pode ser vazio ou possuir menos do que dois caracteres')
    }

    if (nome == null || nome.length < 2) {
        erros.push(' Nome não pode ser vazio ou possuir menos do que dois caracteres ')
    }

    if (telefone == null || !validTelefone(telefone)) {
        erros.push('Telefone inválido')
    }
    console.log(telefone)

    const q = 'INSERT INTO client (cnpj, razaosocial, nome, telefone) VALUES (?)';
    const values = [
        cnpj, razaosocial, nome, telefone
    ]

    if (erros.length > 0) {
        return res.json(erros)
    } 
    db.query(q, [values], (err, data) => {
    if (err) return res.json(err).status(404)
    return res.json(data).status(200)

        })
    


})

app.get('/address', (req, res) => {
    const q = 'SELECT * FROM address'
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)

    })
})

app.post('/address', (req, res) => {

    const { endereco, numero, complemento, bairro, cidade, estado, cep, cid } = req.body

    const validEstados = [
        'AC', 'AM', 'AL', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ]

    let erros = []

    if (!endereco || endereco.length < 4) {
        erros.push(' Endereço não pode ser vazio ou possuir menos do que quatro caracteres ')
    }

    if (!numero) {
        erros.push(' Numero não pode ser vazio!')
    }

    if (!bairro || bairro.length < 2) {
        erros.push(' Bairro não pode ser vazio ou possuir menos do que dois caracteres ')
    }

    if (!cidade || cidade.length < 2) {
        erros.push(' Cidade não pode ser vazio ou possuir menos do que dois caracteres ')
    }

    let estadoExiste = validEstados.some(item => item === estado)

    if (!estadoExiste) {
        erros.push('Estado não existe')
    }

    if (cep == null || cep.length < 8) {
        erros.push(cep.length + ' Cep não pode ser vazio ou possuir menos do que oito digitos ')
    }


    const q = 'INSERT INTO address (endereco, numero, complemento, bairro, cidade, estado, cep, cid ) VALUES (?)';
    const values = [
        endereco, numero, complemento, bairro, cidade, estado, cep, cid
    ]

    if (erros.length > 0) {
        return res.json(erros)
    } 
    db.query(q, [values], (err, data) => {
    if (err) return res.json(err).status(404)
    return res.json(data).status(200)

        })
    
})

app.delete("/client/:id", (req, res) => {
    const clientId = req.params.id
    const q = 'DELETE FROM client WHERE id = ?'

    db.query(q, [clientId], (err, data) => {
        if (err) return res.json(err)
        return res.json(data)

    })
})

app.put("/client/:id", (req, res) => {
    const clientId = req.params.id
    const { cnpj, razaosocial, nome, telefone } = req.body

    const q = `UPDATE client SET cnpj = '${cnpj}', razaosocial = '${razaosocial}', nome = '${nome}', telefone = '${telefone}'  WHERE id=${clientId}`;

    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)

    })
})

app.put("/address/:id", (req, res) => {
    const clientId = req.params.id
    const { endereco, numero, complemento, bairro, cidade, estado, cep, cid } = req.body

    const q = `UPDATE address SET endereco = '${endereco}', numero = '${numero}', complemento = '${complemento}', bairro = '${bairro}', cidade = ${cidade}, estado = ${estado}, cep = ${cep}, cid = ${cid}  WHERE id=${clientId}`;


    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)

    })
})

app.listen(5500, () => {
    console.log('Conectado server!')

})

function validaCnpj(val) {
    if (val.length == 18) {

        var cnpj = val.trim();

        cnpj = cnpj.replace(/\./g, '');
        cnpj = cnpj.replace('-', '');
        cnpj = cnpj.replace('/', '');
        cnpj = cnpj.split('');

        var v1 = 0;
        var v2 = 0;
        var aux = false;

        for (var i = 1; cnpj.length > i; i++) {
            if (cnpj[i - 1] != cnpj[i]) {
                aux = true;
            }
        }

        if (aux == false) {
            return false;
        }

        for (var i = 0, p1 = 5, p2 = 13; (cnpj.length - 2) > i; i++, p1--, p2--) {
            if (p1 >= 2) {
                v1 += cnpj[i] * p1;
            } else {
                v1 += cnpj[i] * p2;
            }
        }

        v1 = (v1 % 11);

        if (v1 < 2) {
            v1 = 0;
        } else {
            v1 = (11 - v1);
        }

        if (v1 != cnpj[12]) {
            return false;
        }

        for (var i = 0, p1 = 6, p2 = 14; (cnpj.length - 1) > i; i++, p1--, p2--) {
            if (p1 >= 2) {
                v2 += cnpj[i] * p1;
            } else {
                v2 += cnpj[i] * p2;
            }
        }

        v2 = (v2 % 11);

        if (v2 < 2) {
            v2 = 0;
        } else {
            v2 = (11 - v2);
        }

        if (v2 != cnpj[13]) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }


}

// {
//     "cnpj": "00789232798754",
//     "razaosocial": "gadfsec",
//     "nome": "carwai",
//     "telefone": "24589335"
// }

// {
//     "endereco": "Rua mil amores",
//     "numero": "55",
//     "complemento": "",
//     "bairro": "Caxanga",
//     "cidade": "Brasolia",
//     "estado": "DF",
//     "cep": "70000050",
//     "cid": "1"
// }


