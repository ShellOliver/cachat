var messageEventModel = require('../models/messageEventModel.js');

/**
 * messageEventController.js
 *
 * @description :: Server-side logic for managing messageEvents.
 */
module.exports = {

    /**
     * messageEventController.list()
     */
    list: function (req, res) {
        messageEventModel.find(function (err, messageEvents) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting messageEvent.',
                    error: err
                });
            }
            return res.json(messageEvents);
        });
    },

    /**
     * messageEventController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        messageEventModel.findOne({_id: id}, function (err, messageEvent) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting messageEvent.',
                    error: err
                });
            }
            if (!messageEvent) {
                return res.status(404).json({
                    message: 'No such messageEvent'
                });
            }
            return res.json(messageEvent);
        });
    },

    /**
     * messageEventController.create()
     */
    create: function (req, res) {
        var messageEvent = new messageEventModel({
			nome : req.body.nome,
			time : req.body.time

        });

        messageEvent.save(function (err, messageEvent) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating messageEvent',
                    error: err
                });
            }
            return res.status(201).json(messageEvent);
        });
    },

    /**
     * messageEventController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        messageEventModel.findOne({_id: id}, function (err, messageEvent) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting messageEvent',
                    error: err
                });
            }
            if (!messageEvent) {
                return res.status(404).json({
                    message: 'No such messageEvent'
                });
            }

            messageEvent.nome = req.body.nome ? req.body.nome : messageEvent.nome;
			messageEvent.time = req.body.time ? req.body.time : messageEvent.time;
			
            messageEvent.save(function (err, messageEvent) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating messageEvent.',
                        error: err
                    });
                }

                return res.json(messageEvent);
            });
        });
    },

    /**
     * messageEventController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        messageEventModel.findByIdAndRemove(id, function (err, messageEvent) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the messageEvent.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
