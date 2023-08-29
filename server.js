const express = require(`express`);

const multer = require(`multer`);
const bodyParser = require('body-parser');
const session = require("express-session");
const path = require(`path`);


const app = express();

const PORT = process.env.PORT || 8000;

const validUsername = 'kev';
const validPassword = 'kev';

app.set("view engine", "ejs");
app.set('case sensitive routing', true);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    session({
        secret: "ugo",
        resave: false,
        saveUninitialized: false
    })
);
app.use(express.static(path.join(__dirname, 'static')));

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return next();
    } else {
        res.render('/login.ejs');
    }
}

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === validUsername && password === validPassword) {
        req.session.isAuthenticated = true;
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

app.get("/", (req, res) => {
    if (req.session.isAuthenticated)
        res.render("home.ejs");
    else
        res.render("login.ejs");
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});



