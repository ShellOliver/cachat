var express = require('express');
var router = express.Router();
var messageEventController = require('../controllers/messageEventController.js');

/*
 * GET
 */
router.get('/', messageEventController.list);

/*
 * GET
 */
router.get('/:id', messageEventController.show);

/*
 * POST
 */
router.post('/', messageEventController.create);

/*
 * PUT
 */
router.put('/:id', messageEventController.update);

/*
 * DELETE
 */
router.delete('/:id', messageEventController.remove);

module.exports = router;
