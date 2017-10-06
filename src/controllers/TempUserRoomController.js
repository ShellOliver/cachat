import TempUserRoomModel from '../models/TempUserRoomModel';
import "babel-polyfill";

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
    async userExistAtRoom(user, room) {
        let userAtRoom = await TempUserRoomModel.findOne({user: user, room:room});
            return userAtRoom;
    },

    /**
     * TempUserRoomController.create()
     */
    create: function (user, room) {
        const TempUserRoom = new TempUserRoomModel({
			user : user,
			room : room
        });

        TempUserRoom.save(function (err, TempUserRoom) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating TempUserRoom',
                    error: err
                });
            }
            return TempUserRoom;
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
    },

    removeUserFromRoom: async function (user, room) {//to implement correctly
        let _user = await TempUserRoomModel.find({user: user, room:room});
        // console.log('was looking for:', user,'at room:',room,'user finded:', _user);
        _user.map((val) => {
            val.remove().then(function (usr) {
               return true;
             }).catch(function (err) {
                return false;
             })

        });
    }
};
