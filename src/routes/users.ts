const router = require('express').Router();
const fileUpload = require('express-fileupload');
const {getCurrentUser, modifyCurrentUserData} = require('../controllers/users');
const { validateModifyUserData } = require('../middleware/validation');

router.use(fileUpload());
router.get('/me', getCurrentUser);
router.patch('/me', validateModifyUserData, modifyCurrentUserData);
router.post('/me', (req, res => {
    console.log(req.files);
}))
module.exports = router;