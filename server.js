const express = require(`express`);
const fs = require(`fs`);
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


function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return next();
    } else {
        res.render('/login.ejs');
    }
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "static/f/");
    },
    filename: (req, file, callback) => {
        const fileName = `${(new Date().toJSON().slice(0, 19))}_${file.originalname}`;
        console.log(`Created file ${fileName}`)
        callback(null, fileName);
    }
});
const upload = multer({ storage: storage });


app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === validUsername && password === validPassword) {
        req.session.isAuthenticated = true;
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

app.post("/files/new", isAuthenticated, upload.single('file'), (req, res) => {
    res.redirect("/");
});

app.get("/files/delete/:FileName", async (req, res) => {
    if (req.session.isAuthenticated) {
        const fileName = req.params.FileName;
        fs.unlink(`static/f/${fileName}`, (err) => console.log(err));
        res.redirect("/");
    } else {
        res.render("login.ejs");
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
  
app.get("/", (req, res) => {
    if (req.session.isAuthenticated) {
        let files;
        fs.readdir('static/f/', (err, files) => {
            if (err) {
                return res.status(500).send('Errore nel leggere la cartella');
            }
            res.render("home.ejs", {files: files});
        });        
    } else {
        res.render("login.ejs");
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});



