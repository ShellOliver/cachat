var express = require('express');
var router = express.Router();
var TempUserRoomController = require('../controllers/TempUserRoomController.js');

/*
 * GET
 */
router.get('/', TempUserRoomController.list);

/*
 * GET
 */
router.get('/:id', TempUserRoomController.show);

/*
 * POST
 */
router.post('/', TempUserRoomController.create);

/*
 * PUT
 */
router.put('/:id', TempUserRoomController.update);

/*
 * DELETE
 */
router.delete('/:id', TempUserRoomController.remove);

module.exports = router;
