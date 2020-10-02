const express = require('express');
const projectModel = require('../data/helpers/projectModel');

const router = express.Router();


router.get('/', (req, res) => {
    projectModel
        .get()
        .then(projects => {
            res.status(200).json(projects);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Error inserting user' });
        });
});


router.get('/:id', validateProject, (req, res) => {
    res.status(200).json(req.project);
});

router.post('/', (req, res) => {
    const body = req.body;
    if (!body.name || !body.description) {
        res.status(400).json({ error: 'Name and Description fields are required' });
    } else {
        projectModel
            .insert(body)
            .then(newProject => {
                res.status(200).json(newProject);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ errorMessage: 'Error creating new project post' });
            });
    }
});

router.delete('/:id', validateProject, (req, res) => {
    projectModel
        .remove(req.params.id)
        .then(removedProject => {
            res.status(200).json({ removedProject });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Error removing project' });
        });
});

router.put('/:id', validateProject, (req, res) => {
    projectModel
        .update(req.params.id, req.body)
        .then(updatedProject => {
            res.status(200).json({ updatedProject });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error updating project' });
        });
});

//Middleware
function validateProject(req, res, next) {
    const id = req.params.id;
    projectModel
        .get(id)
        .then(project => {
            if (project) {
                req.project = project;
                next();
            } else {
                res.status(404).json({ errorMessage: 'Project with that ID does not exist' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Error finding project' });
        });
};

module.exports = router; 