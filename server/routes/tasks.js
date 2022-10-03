const router = require("express").Router();
const { Task } = require("../db/models");

router.get('/all', async (req, res) => {
    try {
        const allTasks = await Task.findAll({ raw: true, order: [['createdAt', 'DESC']] });
        res.json(allTasks);
    } catch (err) {
        console.log(err);
    }
});

router.post('/one', async (req, res) => {
    const { id } = req.body;

    try {
        const task = await Task.findOne({ where: { id } });
        res.json(task);
    } catch (err) {
        console.log(err);
    }
})

router.post('/add', async (req, res) => {
    const { name, email, text } = req.body;

    try {
        await Task.create({ name, email, text, isDone: false, isChanged: false });
        const tasks = await await Task.findAll({ raw: true, order: [['createdAt', 'DESC']] });
        res.json(tasks);
    } catch (err) {
        console.log(err);
    }
})

router.post('/edit', async (req, res) => {
    const { id, name, email, text } = req.body;

    try {
        await Task.update({ name, email, text, isChanged: true }, { where: { id } });
        const tasks = await Task.findAll({ raw: true, order: [['createdAt', 'DESC']] });
        res.json(tasks);
    } catch (err) {
        console.log(err);
    }
})

router.post('/delete', async (req, res) => {
    const { id } = req.body;

    try {
        await Task.destroy({ where: { id } });
        const tasks = await Task.findAll({ raw: true, order: [['createdAt', 'DESC']] });
        res.json(tasks);
    } catch (err) {
        console.log(err);
    }
})

router.post('/status', async (req, res) => {
    const { id } = req.body;

    try {
        const task = await Task.findOne({ where: { id } });
        await Task.update({ isDone: !task.isDone }, { where: { id } });
        res.json('done');
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;
