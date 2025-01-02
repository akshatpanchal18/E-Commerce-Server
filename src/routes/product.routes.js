import { Router } from "express";
import { verifyAdmin, verifyJwt } from "../middelware/auth.middelware.js";
import { upload } from "../middelware/multer.middelware.js";
import { addProduct, addReview, deleteSingleProduct, editUplodedProducts, getAllProducts, getAllProductsUser, getCategoryandBrand, getSingleProduct } from "../controller/product.controller.js";

const router = Router();

router.get('/all-products',getAllProductsUser)
router.get('/all-products/product/:id',getSingleProduct)
router.get('/all-products/filter',getCategoryandBrand)
router.patch('/all-products/product/:id',verifyJwt,addReview)

//secured routes
router.post("/add-product", verifyAdmin, upload.single("image"), addProduct);
// router.delete('/delete/:id',verifyAdmin,deleteSingleProduct)
router.delete('/delete',verifyAdmin,deleteSingleProduct)
// router.put('/update/:id',verifyAdmin,editUplodedProducts)
router.put('/update',verifyAdmin,editUplodedProducts)
router.get('/products',verifyAdmin,getAllProducts)

//ex. of quray 'GET /all-products?page=2&limit=10'


export default router