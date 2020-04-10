const express = require('express');
const actionModel = require('../data/helpers/actionModel');
const projectModel = require('../data/helpers/projectModel');

const router = express.Router();


router.get('/', (req, res) => {
    actionModel
        .get()
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessasge: 'Error getting all actions' });
        });
});


router.get('/:id', validateActionId, (req, res) => {
    res.status(200).json(req.action);
});


router.post('/', validateProjectId, (req, res) => {
    const body = req.body;
    if (!body.description || !body.notes || !body.project_id) {
        res
            .status(400)
            .json({ error: 'Fields required: description, notes, project_id' });
    } else {
        if (body.description.length > 128) {
        res
            .status(400)
            .json({ error: 'description cannot exceed 128 characters' });
        } else {
            actionModel
                .insert(body)
                .then(newAction => {
                    res.status(200).json(newAction);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ errorMessage: 'Error posting new action' });
                });
        };
    };
});


router.delete('/:id', validateActionId, (req, res) => {
    actionModel
        .remove(req.params.id)
        .then(removedAction => {
            res.status(200).json({ removedAction });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Error removing action' });
        });
});


router.put('/:id', validateActionId, (req, res) => {
    actionModel
        .update(req.params.id, req.body)
        .then(updatedAction => {
            console.log('Updated record: ', updatedAction);
            res.status(200).json(updatedAction);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Error updating action' });
        });
});

//Middleware
function validateActionId(req, res, next) {
    const id = req.params.id;
    actionModel
        .get(id)
        .then(action => {
            if (action) {
                req.action = action;
                next();
            } else {
                res.status(404).json({ error: 'Action with that ID does not exist' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error finding action' });
        });
};

function validateProjectId(req, res, next) {
    if (req.body.project_id) {
        projectModel
            .get(req.body.project_id)
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
    } else {
        res.status(400).json({ error: 'The project_id field is required' });
    };
};

module.exports = router; 