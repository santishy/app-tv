
const { Router } = require('express');
const { search } = require('../controllers/search/search.controller');
const { verifyToken, validateRequests } = require('../middlewares');

const router = Router();


router.get('/:model/:term', [
    verifyToken,
    validateRequests
], search);