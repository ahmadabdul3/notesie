import express from 'express';
import models from 'src/db/models';

const router = express.Router();

router.get('/', getNotebooks);

module.exports = router;

function getNotebooks(req, res) {

}
