require('dotenv').config()
const bodyParser = require("body-parser")
const jwt = require('jsonwebtoken')
const express = require("express")
const bcrypt = require('bcrypt')
const mysql = require('mysql')
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3001

var db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


module.exports = db;

app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

// handle delete tweet
app.delete("/api/tweet", authenticateToken, (req, res) => {
    const tweetId = req.query.tweetId
    db.query(`DELETE FROM tweets WHERE tweetId = '${tweetId}'`, (err, result) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            res.send({
                success: "Tweet has been deleted"
            });
        }
    })
})

app.get("/", (req, res) => {
    res.send("Oui")
})

// handle get user profile picture given username
app.get("/api/pp", (req, res) => {
    const username = req.query.username
    db.query(`SELECT userpp FROM users WHERE username = '${username}'`, (err, result) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            res.send(result)
        }
    })
})

// handle profile picture upload
app.post("/api/pp", authenticateToken,(req, res) => {
    const username = req.body.username
    const pp = req.body.pp
    // check if userid exists
    // if yes, update userpp

    db.query(`SELECT username FROM users WHERE username = '${username}'`, (err, result) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            if (result.length > 0) {
                db.query(`UPDATE users SET userpp = '${pp}' WHERE username = '${username}'`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.send(err)
                    } else {
                        res.send(result)
                    }
                })
            } else {
                res.send({
                    error: "User does not exist"
                })
            }
        }
    })
})

// select all tweets from database
app.get("/api/getTweets", authenticateToken,(req, res) => {
    db.query("SELECT * FROM tweets", (err, rows) => {
        if (err) {
            res.send(err)
        } else {
            res.json(rows)
            res.status(200)
        }
    })
})


// Insert tweet in database
app.post('/api/insert', authenticateToken, (req, res) => {
    const tweetContent = req.body.tweetContent;
    const tweetPoster = req.body.tweetPoster;
    const imageSrc = req.body.imageSrc;

    // check if tweetPoster exists
    // if yes, insert tweet
    db.query(`SELECT username FROM users WHERE username = '${tweetPoster}'`, (err, result) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            if (result.length > 0) {
                const sqlInsert = "INSERT INTO tweets (tweetPoster, tweetContent, tweetDate, tweetImg1, tweetImg2, tweetImg3) VALUES (?, ?, NOW(), ?, ?, ?);"
                db.query(sqlInsert, [tweetPoster, tweetContent, imageSrc[0], imageSrc[1], imageSrc[2]], (err, result) => {
                    if (err) {
                        res.send(err)
                    }
                    else {
                        res.send({
                            success: "Tweet inserted"
                        });
                    }
                });
            }
        }
    })
});

// handle tweet new reactions
app.post("/api/reactions", authenticateToken,(req, res) => {
    const tweetReactionValue = req.body.reaction
    const tweetId = req.body.tweetId
    const userid = req.body.userid

    // check if userid exists
    // if yes, update tweet reactions
    db.query(`SELECT userid FROM users WHERE userid = '${userid}'`, (err, result) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            // check if user already reacted to tweet
            db.query(`SELECT * FROM tweetreactions WHERE userid = '${userid}' AND tweetId = '${tweetId}' AND tweetReactionValue = '${tweetReactionValue}'`, (err, ret) => {
                if (err) {
                    console.log(err)
                    res.send(err)
                } else {
                    if (ret.length === 0) {
                        if (result.length > 0) {
                            // insert reaction in tweetreactions table
                            db.query(`INSERT INTO tweetreactions (tweetId, userid, tweetReactionValue) VALUES ('${tweetId}', '${userid}', '${tweetReactionValue}')`, (err, result) => {
                                if (err) {
                                    console.log(err)
                                    res.send(err)
                                } else {
                                    res.send({
                                        success: "Reaction has been added"
                                    });
                                }
                            })
                        } else {
                            res.send({
                                error: "User does not exist"
                            })
                        }
                    } else {
                        res.send({
                            error: "User already reacted to tweet"
                        })
                    }
                }
            })
        }
    })
})

// handle get tweet reactions
app.get("/api/reactions", authenticateToken, (req, res) => {
    const tweetId = req.query.tweetid;
    const userid = req.query.userid;
    // select all reactions of tweet from tweetreactions table
    // then count number of comments, retweets and likes
    db.query(`SELECT * FROM tweetreactions WHERE tweetId = '${tweetId}'`, (err, result) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            // get reactions where user has reacted
            let userReacted = new Object();
            userReacted.likes = false;
            userReacted.comments = false;
            userReacted.retweets = false;

            // count all reactions
            let nbLikes = 0;
            let nbRetweets = 0;
            let nbComments = 0;
            for (let i = 0; i < result.length; i++) {
                if (result[i].tweetReactionValue === 3) {
                    if (result[i].userid == userid) {
                        userReacted.likes = true;
                    }
                    nbLikes++;
                } else if (result[i].tweetReactionValue === 2) {
                    if (result[i].userid == userid) {
                        userReacted.retweets = true;
                    }
                    nbRetweets++;
                } else if (result[i].tweetReactionValue === 1) {
                    if (result[i].userid == userid) {
                        userReacted.comments = true;
                    }
                    nbComments++;
                }
            }
            res.send({
                nbComments: nbComments,
                nbRetweets: nbRetweets,
                nbLikes: nbLikes,
                userReacted : userReacted
            })
        }
    })
})

// handle delete reaction
app.delete("/api/reactions", authenticateToken, (req, res) => {
    const tweetId = req.query.tweetid;
    const userid = req.query.userid;
    const tweetReactionValue = req.query.reaction;
    // delete reaction from tweetreactions table
    db.query(`DELETE FROM tweetreactions WHERE tweetId = '${tweetId}' AND userid = '${userid}' AND tweetReactionValue = '${tweetReactionValue}'`, (err, result) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            res.send({
                success: "Reaction has been deleted"
            })
        }
    })
})

// handle request for new user
app.post("/api/register", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const username = req.body.username
    const password = req.body.password
    const userpp = req.body.userpp
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

            // check if username already exists
        db.query(`SELECT * FROM users WHERE username = '${username}'`, (err, result) => {
            if (err) {
                console.log(err)
                res.send(err)
            } else {
                if (result === undefined || result.length === 0) {
                    // create a random user id
                    const userId = Math.floor(Math.random() * 1000000)
                    db.query(`INSERT INTO users (userid, username, userpassword, userpp, userjoindate) VALUES ('${userId}', '${username}', '${hashedPassword}', '${userpp}', NOW())`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.send(err)
                        } else {
                            const user = {
                                username: username,
                            }
                            const accessToken = jwt.sign(user, "" + process.env.ACCESS_TOKEN_SECRET)
                            res.json({
                                username: username,
                                userpp: userpp,
                                accessToken: accessToken,
                                userid: userId
                            })
                        }
                    })
                } else {
                    res.send({
                        error: "Username already exists"
                    })
                }
            }
        })
    } catch {
        res.send({
            error: "Error"
        })
    }
})

// handle login request
app.post("/api/login", async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    try {
        // check if username exists
        db.query(`SELECT * FROM users WHERE username = '${username}'`, (err, result) => {
            if (err) {
                console.log(err)
                res.send(err)
            } else {
                if (result === undefined || result.length === 0) {
                    res.send({
                        error: "Username does not exist"
                    })
                } else {
                    userpp = result[0].userpp
                    userid = result[0].userid
                    // check if password is correct
                    bcrypt.compare(password, result[0].userpassword, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.send(err)
                        } else {
                            if (result) {
                                const user = {
                                    username: username,
                                }
                                const accessToken = jwt.sign(user, "" + process.env.ACCESS_TOKEN_SECRET)
                                // send access token and user data
                                res.json({
                                    username: username,
                                    userpp: userpp,
                                    accessToken: accessToken,
                                    userid: userid
                                })
                            } else {
                                res.send({
                                    error: "Wrong password"
                                })
                            }
                        }
                    })
                }
            }
        })
    } catch {
        res.send({
            error: "Error"
        })
    }
})

// handle logout request
app.delete("/api/logout", (req, res) => {
    const refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post("/api/token", (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken === null) {
        return res.sendStatus(401)
    }
    if (!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403)
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })
})


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, "" + process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

function generateAccessToken(user) {
    return jwt.sign(user, "" + process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
