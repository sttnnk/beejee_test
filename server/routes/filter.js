const router = require("express").Router();
const { Task } = require("../db/models");

router.post('/checked', async (req, res) => {
    const { state } = req.body;

    if (state) {
        try {
            const tasks = await Task.findAll({ raw: true });
            res.json(tasks);
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            const tasks = await Task.findAll({ raw: true, order: [['isDone', 'DESC']] });
            res.json(tasks);
        } catch (err) {
            console.log(err);
        }
    }
});

router.post('/name', async (req, res) => {
    const { state } = req.body;

    if (state) {
        try {
            const tasks = await Task.findAll({ raw: true, order: [['name', 'ASC']] });
            res.json(tasks);
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            const tasks = await Task.findAll({ raw: true, order: [['name', 'DESC']] });
            res.json(tasks);
        } catch (err) {
            console.log(err);
        }
    }
});

router.post('/email', async (req, res) => {
    const { state } = req.body;

    if (state) {
        try {
            const tasks = await Task.findAll({ raw: true, order: [['email', 'ASC']] });
            res.json(tasks);
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            const tasks = await Task.findAll({ raw: true, order: [['email', 'DESC']] });
            res.json(tasks);
        } catch (err) {
            console.log(err);
        }
    }
});


module.exports = router;
