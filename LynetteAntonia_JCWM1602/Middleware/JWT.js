const jwt = require('jsonwebtoken')

const jwtVerify = (req, res, next) => {

    const token = req.body.token 
  
    if(!token) return res.status(406).send({ error: true, message: 'Token Not Found' }) //tokennya ada ga? kalo ada throw error


    //ini kalau tokennya ada, di decode
    jwt.verify(token, "123abc" , (err, dataToken) => { //process env isinya 123abc
        try {
            if(err) throw err

            req.dataToken = dataToken
            next() //next itu untuk supaya bisa lanjut ke function berikutnya setelah middleware

        } catch (error) {
            res.status(500).send({
                error: true,
                message: error.message
            })
        }
    })
}

module.exports = jwtVerify