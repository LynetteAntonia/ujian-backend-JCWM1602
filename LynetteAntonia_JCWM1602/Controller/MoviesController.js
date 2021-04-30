// Import Connection
const db = require('./../Connection/Connection')

const getMovies = (req,res) => {
    try {
        db.query('SELECT * FROM schedules JOIN'+
            '(SELECT * FROM movies) AS mov ON schedules.movie_id = mov.id JOIN' +
            '(SELECT * FROM movie_status) AS ms ON ms.id = mov.status JOIN' +
            '(SELECT * FROM locations) AS loc ON loc.id = schedules.location_id JOIN' +
            '(SELECT * FROM show_times) AS sh ON sh.id = schedules.time_id', (err, result) => {
            try {
                if (err) throw err

                console.log(result)
                res.status(200).send({
                    error: false,
                    message: 'Get movie list success',
                    data: result
                })


            } catch (error) {
                res.status(500).send({
                    error:true,
                    message:error.message
                })
                
            }
        })


    } catch (error) {
        res.status(500).send({
            error:true,
            message: error.message
        })
    }
}

const getUpcomingandOnShow = (req,res) => {

    // /movies/get?status=on%show%location=bandung&time=9%AM
    // /movies/get?:status/:location/:time

    try {

        const data = {
            location: req.params.location,
            time: req.params.time
        }

        db.query('SELECT * FROM schedules JOIN'+
        '(SELECT * FROM movies) AS mov ON schedules.movie_id = mov.id JOIN' +
        '(SELECT * FROM movie_status) AS ms ON ms.id = mov.status JOIN' +
        '(SELECT * FROM locations) AS loc ON loc.id = schedules.location_id JOIN' +
        '(SELECT * FROM show_times) AS sh ON sh.id = schedules.time_id WHERE location = ? AND time = ?' , [data.location, data.time], (err, result) => {
            try {
                res.status(200).send({
                    error: false,
                    message: "Get data success",
                    data: result
                })
            } catch (error) {
                res.status(500).send({
                    error:true,
                    message: error.message
                })
            }
        })

    } catch (error) {
        res.status(500).send({
            error: true,
            message:error.message
        })
        
    }
}

const addMovie = (req,res) => {
    try {

        const data = {
            name: req.body.name,
            release_date: req.body.release_date,
            release_month: req.body.release_month,
            release_year: req.body.release_year,
            duration_min: req.body.duration_min,
            genre: req.body.genre,
            description: req.body.description
        }
    
        const token = req.dataToken

        db.query('SELECT * FROM users WHERE uid = ?', token.uid, (err, result) => {
            console.log("test")
            if(result.length == 1 && result[0].role == 1){
                try {
                    db.query('INSERT INTO movies SET ?', data, (err, result2) => {
                         try {
                             if (err) throw err
    
                             res.status(200).send({
                                 error: false,
                                 message: "Add movie success",
                                 data: {
                                     id: result2.insertId,
                                     name: data.name,
                                     genre: data.genre,
                                     release_date: data.release_date,
                                     release_month: data.release_month,
                                     release_year: data.release_year,
                                     duration_min: data.duration_min,
                                     description: data.description 
                                 }
                             })

                             
                         } catch (error) {
                             res.status(500).send({
                                 error: true,
                                 message: error.message
                             })
                         }
                    })
    
                } catch (error) {
                    res.status(500).send({
                        error: true,
                        message:error.message
                    })
                }
    
            }else{
                res.status(500).send({
                    error: true,
                    message: "Access Denied"
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


const editMovieStatus = (req,res) => {
    try {

        const data = {
            id: req.body.id,
            status: req.body.status,
            token: req.body.token
        }
        
        const token = req.dataToken

        db.query('SELECT * FROM users WHERE uid = ?', token.uid, (err, result) => {
            if(result.length == 1 && result[0].role == 1){

                db.query('SELECT * FROM movies where id = ?', data.id, (err,result)=>{
                    if(result.length == 1){
                        try {
                            db.query('UPDATE movies SET status = ? WHERE id = ?', [data.status, data.id], (err, result2) => {
                                res.status(200).send({
                                    error: false,
                                    message: "updated",
                                    data: {
                                        id: data.id,
                                        status : "status has been changed"
                                    }
                                })
                            })
                        } catch (error) {
                            res.status(500).send({
                                error: true,
                                message: error.message
                            })
                        }
                    }else{
                        res.status(500).send({
                            error: true,
                            message: "movie not found"
                        })
                    }
                })

            }else{
                res.status(406).send({
                    error: true,
                    message:'Access Denied'
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

const addSchedule = (req,res) => {
    try {

        const id = req.params.id
        const token = req.dataToken
        const data = {
            location_id: req.body.location,
            time_id: req.body.time_id
        }

        db.query('SELECT * FROM users WHERE uid = ?', token.uid, (err, result) => {
            if(result.length == 1 && result[0].role == 1){

                
                db.query('INSERT INTO schedules SET ?', id, (err, result) => {
                    if (err) throw err
                    
                    res.status(200).send({
                        error: false,
                        message: "insert movie success",
                        data: result

                    })
                })
            }else{
                res.status(500).send({
                    error: true,
                    message: "Access Denied"
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
    getMovies: getMovies,
    getUpcomingandOnShow: getUpcomingandOnShow,
    addMovie: addMovie,
    editMovieStatus: editMovieStatus,
    addSchedule: addSchedule
}