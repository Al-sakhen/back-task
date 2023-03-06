const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController')
const productController = require('../controllers/productController')
router.get('/' , (req , res) => {
    res.send('holla')
})

// ======= Authintication Routes =======
router.post('/register' , authController.register )
router.post('/login' , authController.login)
router.get('/logout' , authController.logout)

// ======= Products Routes =======
router.post('/products/create' , productController.create)
router.get('/products' , productController.getAll)
router.get('/products/:id' , productController.get)
router.put('/products/update/:id' , productController.update)
router.delete('/products/delete/:id' , productController.delete)


module.exports = router