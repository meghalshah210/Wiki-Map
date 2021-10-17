/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

module.exports = (db) => {
  // Get user info
  router.get("/info", (req, res) => {
    const userID = req.session.userId;
    console.log("user ID", userID);
    return db
      .query(
        `
      SELECT * FROM users where id = $1`,
        [userID]
      )
      .then((result) => {
        // console.log("server", result.rows[0]);
        return res.json({ user: result.rows[0] });
      })
      .catch((err) => err.message);
  });

  // Create a new user
  router.post("/register", (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);
    const { name, email, password } = user;
    return db
      .query(
        `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *`,
        [name, email, password]
      )
      .then((result) => {
        //set cookie
        req.session.userId = result.rows[0].id;
        return res.json({ user: result.rows[0] });
      })
      .catch((err) => err.message);
  });

  //logout route
  router.post("/logout", (req, res) => {
    req.session = null;
    res.send({});
  });

  // Login existing user and set cookie
  const verifyLogin = (email, password) => {
    // verify email
    return (
      db
        .query(`SELECT * FROM users WHERE email = $1`, [email])
        // verify password
        .then((data) => {
          if (data.rows) {
            const userPassword = data.rows[0].password;
            console.log(bcrypt.compareSync(password, userPassword));
            if (bcrypt.compareSync(password, userPassword)) {
              return data.rows[0];
            }
          }
          return null;
        })
        .catch((err) => {
          console.log(err.message);
        })
    );
  };
  exports.verifyLogin = verifyLogin;

  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    verifyLogin(email, password)
      .then((user) => {
        console.log("user:", user);
        if (!user) {
          res.send({ error: "error" });
          return;
        }
        console.log("user after verified:", user);
        req.session.userId = user.id;
        res.send({ user: { name: user.name, email: user.email, id: user.id } });
      })
      .catch((err) => res.send(err));
  });
  return router;
};
