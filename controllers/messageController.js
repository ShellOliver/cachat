var messageModel = require('../models/messageModel.js');

/**
 * messageController.js
 *
 * @description :: Server-side logic for managing messages.
 */
module.exports = {

    /**
     * messageController.list()
     */
    list: function (req, res) {
        messageModel.find(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting message.',
                    error: err
                });
            }
            return res.json(messages);
        });
    },

    /**
     * messageController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        messageModel.findOne({ _id: id }, function (err, message) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting message.',
                    error: err
                });
            }
            if (!message) {
                return res.status(404).json({
                    message: 'No such message'
                });
            }
            return res.json(message);
        });
    },

    /**
     * messageController.create()
     */
    create: function (req) {
        var message = new messageModel({
            message: req.text,
            receptor: req.receptor,
            datetime: new Date(),
            room: req.room

        });
        message.save(function (err, message) {
            return !err ? true : false;
        });
    },
    /**
     * messageController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        messageModel.findOne({ _id: id }, function (err, message) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting message',
                    error: err
                });
            }
            if (!message) {
                return res.status(404).json({
                    message: 'No such message'
                });
            }

            message.message = req.body.message ? req.body.message : message.message;
            message.receptor = req.body.receptor ? req.body.receptor : message.receptor;
            message.datetime = req.body.datetime ? req.body.datetime : message.datetime;
            message.room = req.body.room ? req.body.room : message.room;

            message.save(function (err, message) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating message.',
                        error: err
                    });
                }

                return res.json(message);
            });
        });
    },

    /**
     * messageController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        messageModel.findByIdAndRemove(id, function (err, message) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the message.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
