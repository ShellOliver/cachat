var TempUserRoomModel = require('../models/TempUserRoomModel.js');

/**
 * TempUserRoomController.js
 *
 * @description :: Server-side logic for managing TempUserRooms.
 */
module.exports = {

    /**
     * TempUserRoomController.list()
     */
    list: function (req, res) {
        TempUserRoomModel.find(function (err, TempUserRooms) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting TempUserRoom.',
                    error: err
                });
            }
            return res.json(TempUserRooms);
        });
    },

    /**
     * TempUserRoomController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        TempUserRoomModel.findOne({_id: id}, function (err, TempUserRoom) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting TempUserRoom.',
                    error: err
                });
            }
            if (!TempUserRoom) {
                return res.status(404).json({
                    message: 'No such TempUserRoom'
                });
            }
            return res.json(TempUserRoom);
        });
    },

    /**
     * TempUserRoomController.create()
     */
    create: function (req, res) {
        var TempUserRoom = new TempUserRoomModel({
			user : req.body.user,
			room : req.body.room

        });

        TempUserRoom.save(function (err, TempUserRoom) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating TempUserRoom',
                    error: err
                });
            }
            return res.status(201).json(TempUserRoom);
        });
    },

    /**
     * TempUserRoomController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        TempUserRoomModel.findOne({_id: id}, function (err, TempUserRoom) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting TempUserRoom',
                    error: err
                });
            }
            if (!TempUserRoom) {
                return res.status(404).json({
                    message: 'No such TempUserRoom'
                });
            }

            TempUserRoom.user = req.body.user ? req.body.user : TempUserRoom.user;
			TempUserRoom.room = req.body.room ? req.body.room : TempUserRoom.room;
			
            TempUserRoom.save(function (err, TempUserRoom) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating TempUserRoom.',
                        error: err
                    });
                }

                return res.json(TempUserRoom);
            });
        });
    },

    /**
     * TempUserRoomController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        TempUserRoomModel.findByIdAndRemove(id, function (err, TempUserRoom) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the TempUserRoom.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
