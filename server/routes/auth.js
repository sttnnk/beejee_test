const router = require("express").Router();
const { User } = require("../db/models");
const bcrypt = require("bcrypt");

router.get('/name', async (req, res) => {
    const user = req.session?.user;

    if (user?.login) {
        try {
            const myUser = await User.findOne({ where: { id: user.id } });
            res.json(myUser);
        } catch (err) {
            console.log(err);
        }
    }
});

router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const user = await User.findOne({ where: { login } });
        if (!user) return res.json('Неверное имя или пароль!');

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.json('Неверное имя или пароль!');

        req.session.user = { id: user.id, login: user.login };
        return res.json(user);
    } catch (err) {
        console.error(err);
    }
});

router.get('/signout', (req, res) => {
    req.session.destroy();
    res.clearCookie('sid');
    res.sendStatus(200);
});

module.exports = router;
