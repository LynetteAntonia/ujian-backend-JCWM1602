// Import Connection
const db = require('./../Connection/Connection')

const validator = require('validator')
const jwt = require('jsonwebtoken')

const Register = (req,res) => {
    try {

        const data = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }
    
        //validasi data
    
        if(!data.email || !data.password || !data.username) throw {message: 'Data must be filled!'} 
    
        if(!(validator.isEmail(data.email))) throw {message: 'Email invalid!'}
    
        if(data.username.length < 6 ) throw {message: "Username minimum length is 6 characters!"}
    
        if(data.password.length < 6) throw {message: 'Password minimum length is 6 characters!'}
    
        let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    
        if(regex.test(data.password)) throw {message: "Password must contains special character!"}
        
            const uid = Date.now()
            const role = "user"
            jwt.sign({uid: uid, role:role}, '123abc', (err, token) =>{
                
                res.status(200).send({
                    error: false,
                    message:"Register Success",
                    data: {
                        uid: uid,
                        username: data.username,
                        email: data.email,
                        token: token
                    }
                })
            }) 

            const dataToSend = {
                uid: uid,
                username: data.username,
                email: data.email,
                password: data.password,
                role: 2,
            }
    
            db.query('INSERT INTO users SET ?', dataToSend, (err, result) => {

                if (err) throw err

            })
        
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error.message
        })
    }
    
}

const Login = (req, res) => {
    try {

        const data = req.body

        db.query('SELECT * FROM users WHERE email = ? OR username = ? AND password = ?', [data.email, data.user, data.password], (err, result) => {
         
            if(result.length == 1 && result[0].status == 1){

                const uid = result[0].uid
                const role = result[0].role
                jwt.sign({uid: uid, role:role}, '123abc', (err, token) =>{

                    res.status(200).send({
                        error: true,
                        message: "Login Success",
                        data: {
                            id: result[0].id,
                            uid: result[0].uid,
                            username: result[0].username,
                            email: result[0].email,
                            status: result[0].status,
                            role: result[0].role,
                            token: token
                        }
                    })
            
                }) 
            }else{
                res.status(500).send({
                    error: true,
                    message: "Account not found or has been deactivated. Please check again"
                })
            }
        })
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error.message
        })
        
    }
}

const DeactivateAccount = (req, res) => {
    try {
  
        const token = req.dataToken
        console.log("ini token" , token)
        console.log("ini uid", token.uid)

        db.query('SELECT * FROM users WHERE uid = ?', token.uid, (err, result) => {
            console.log(result)
            if(result.length == 1){

                db.query('UPDATE users SET status = 2 WHERE uid = ?', token.uid, (err, result) => {
                    if (err) throw err

                    res.status(200).send({
                        error: false,
                        message: "account deactivated",
                        data: {
                            uid: token.uid,
                            status:"deactive"
                        }
                    })
                })

            }else{
                res.status(500).send({
                    error: true,
                    message: "Account not found"
                })
            }
        })
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error.message
        })
        
    }
}

const ActivateAccount = (req, res) => {
    try {
  
        const token = req.dataToken
        console.log("ini token" , token)
        console.log("ini uid", token.uid)

        db.query('SELECT * FROM users WHERE uid = ?', token.uid, (err, result) => {
            console.log(result)
            if(result.length == 1 && result[0].status == 2){

                db.query('UPDATE users SET status = 1 WHERE uid = ?', token.uid, (err, result) => {
                    if (err) throw err

                    res.status(200).send({
                        error: false,
                        message: "account activated",
                        data: {
                            uid: token.uid,
                            status:"active"
                        }
                    })
                })

            }else{
                res.status(500).send({
                    error: true,
                    message: "Account not found or already active/deleted"
                })
            }
        })
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error.message
        })
        
    }
}


const CloseAccount = (req, res) => {
    try {
  
        const token = req.dataToken
        console.log("ini token" , token)
        console.log("ini uid", token.uid)

        db.query('SELECT * FROM users WHERE uid = ?', token.uid, (err, result) => {
            console.log(result)
            if(result.length == 1 && result[0].status !== 3){

                db.query('UPDATE users SET status = 3 WHERE uid = ?', token.uid, (err, result) => {
                    if (err) throw err

                    res.status(200).send({
                        error: false,
                        message: "account closed",
                        data: {
                            uid: token.uid,
                            status:"closed"
                        }
                    })
                })

            }else{
                res.status(500).send({
                    error: true,
                    message: "Account not found or already closed"
                })
            }
        })
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error.message
        })
        
    }
}

module.exports = {
    Register: Register,
    Login: Login,
    DeactivateAccount: DeactivateAccount,
    ActivateAccount: ActivateAccount,
    CloseAccount: CloseAccount
}