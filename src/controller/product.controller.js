import asyncHandeler from "../utils/asyncHandeler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import {deleteImageFromCloudinaryByUrl, uploadOnCloudinery} from "../utils/cloudinary.js";
import { Product } from "../models/product.models.js";


export const addProduct = asyncHandeler(async (req,res) => {
    // console.log("Incoming request body:", req.body);
    // console.log("Uploaded file details:", req.file); 

    const {name,description,brand,category,price,stock,isFeatured}=req.body

    const imagePath = req.file?.path

    // if (
    //     [name, description,brand,category,price,stock].some((field) => field?.trim() === "")
    //   ) {
    //     throw new apiError(400, "All fields are required");
    //   }
    if (
        [name, description, brand, category, price, stock].some(
          (field) => typeof field !== "string" || field.trim() === ""
        )
      ) {
        throw new apiError(400, "All fields are required");
      }
    if (!req.file || !req.file.path) {
        throw new apiError(400, "Image file is required");
      }
      const imageUrl = req.file.path;
      const product = await Product.create({
        name,
        description,
        category,
        image:imageUrl,
        brand,
        stock,
        price,
        isFeatured: isFeatured || false
      })
      if (!product) {
        throw new apiError(502,"something wrong while adding product")
      }
       res.status(201)
       .json(new apiResponse(201,product,"Products Added Successfully"))
})

export const getAllProducts = asyncHandeler(async (req,res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit; 

    const products = await Product.find().skip(skip).limit(limit)
    const totalProducts = await Product.countDocuments()
    if (!products || products.length === 0) {
        throw new apiError(504,"Products not found")
    }
    const pagination = {
        totalProducts:totalProducts,
        currentPage:page,
        totalPages: Math.ceil(totalProducts / limit)
    }
    res.status(200)
    .json(new apiResponse(200,{products,pagination},"Products Fecthed Successfully"))
})
// export const getAllProductsUser = asyncHandeler(async (req,res) => {
//     const page = parseInt(req.query.page) || 1; 
//     const limit = parseInt(req.query.limit) || 10; 
//     const skip = (page - 1) * limit; 

//     const { sort, category, brand, search } = req.query;

//     const products = await Product.find().select('-createdAt -updatedAt').skip(skip).limit(limit)
//     const totalProducts = await Product.countDocuments()

//     if (!products || products.length === 0) {
//         throw new apiError(504,"Products not found")
//     }

//     const pagination = {
//         totalProducts:totalProducts,
//         currentPage:page,
//         totalPages: Math.ceil(totalProducts / limit)
//     }
//     res.status(200)
//     .json(new apiResponse(200,{products,pagination},"Products Fecthed Successfully"))
// })
export const getAllProductsUser = asyncHandeler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit; 

    // Extract filters from query params
    const { sort, category, brand, search } = req.query;
    console.log("sort:",sort,"|","brand:",brand,"|","cate:",category,"|","serch:",search,"|");
    

    // Build the query filter object
    const filter = {};
    if (category) filter.category = category; // Match exact category
    if (brand) filter.brand = brand; // Match exact brand
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } }, // Search in name (case-insensitive)
            { description: { $regex: search, $options: 'i' } }, // Search in description
        ];
    }

    // Build the sort object
    let sortOptions = {};
    if (sort) {
        const [field, order] = sort.split(':'); // Example: 'price:asc' or 'price:desc'
        sortOptions[field] = order === 'desc' ? -1 : 1;
    }

    // Query database with filter and sort
    const products = await Product.find(filter)
        .select('-createdAt -updatedAt') // Exclude unwanted fields
        .sort(sortOptions) // Apply sorting
        .skip(skip) // Pagination: skip records
        .limit(limit); // Pagination: limit records

    // Count total products matching the filter
    const totalProducts = await Product.countDocuments(filter);

    if (!products || products.length === 0) {
        throw new apiError(504, "Products not found");
    }

    // Pagination details
    const pagination = {
        totalProducts: totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
    };

    res.status(200).json(new apiResponse(200, { products, pagination }, "Products Fetched Successfully"));
});

export const getSingleProduct = asyncHandeler(async (req,res) => {
    const product_id = req.params.id
    console.log(product_id);
    
     if (!product_id) {
        throw new apiError(400,"productID required")
     }
      const findProduct = await Product.findById(product_id)

      if (!findProduct) {
        throw new apiError(504, "Product not found")
      }
      res.status(200)
      .json(new apiResponse(200,findProduct,"Product Found"))
})
export const deleteSingleProduct = asyncHandeler(async (req,res) => {
    // const product_id = req.params.id
    const product_id = req.body
    console.log(product_id);
    
     if (!product_id) {
        throw new apiError(400,"productID required")
     }
    
     const deleteProduct = await Product.findById(product_id);
    
     if (!deleteProduct) {
         throw new apiError(404, "Product not found");
     }
     console.log("image delete Success");
     
     // Delete the image from Cloudinary using the product's image URL
     await deleteImageFromCloudinaryByUrl(deleteProduct.image);
 
     // Now delete the product from the database
     await Product.findByIdAndDelete(product_id);
     console.log("Success ");
     
    res.status(200)
    .json(new apiResponse(200,{},"Product deleted successfully "))
})

export const editUplodedProducts = asyncHandeler(async (req,res) => {
    // const product_id = req.params.id
    const product_id = req.body
    // console.log(product_id);
    
     if (!product_id) {
        throw new apiError(400,"productID required")
     }
     const existingProduct = await Product.findById(product_id);
     if (!existingProduct) {
         throw new apiError(404, "Product not found");
     }
 
     const updatedData = {
         name: req.body.name || existingProduct.name,
         description: req.body.description || existingProduct.description,
         brand: req.body.brand || existingProduct.brand,
         category: req.body.category || existingProduct.category,
         price: req.body.price || existingProduct.price,
         stock: req.body.stock || existingProduct.stock,
         isFeatured: req.body.isFeatured !== undefined ? req.body.isFeatured : existingProduct.isFeatured,
         image:req.body.image || existingProduct.image
     };
 
     const updatedProduct = await Product.findByIdAndUpdate(product_id, updatedData, { new: true });

     res.status(200)
     .json(new apiResponse(200,updatedProduct ,"Product data updeted success"))
})

export const addReview = asyncHandeler(async (req,res) => {
    const product_id = req.params.id;
    const user = req.user.userInfo
    const {comment,rating}=req.body
    console.log(product_id);
    console.log(req.body);
    
     if (!product_id) {
        throw new apiError(400,"productID required")
     }
    if(!comment || !rating){
        throw new apiError(400,"All feilds are required")
    }

    const findProduct= await Product.findById(product_id)
    if (!findProduct) {
        throw new apiError(404,"Product not found")
    }
    const addComment = {
        user:{
        name:user.username,
        email:user.email
    },
    rating,
    comment
    }
    findProduct.reviews.push(addComment)
    findProduct.numReviews = findProduct.reviews.length;
    findProduct.rating = findProduct.reviews.reduce((acc, review) => acc + review.rating, 0)

    const updatedProduct = await findProduct.save()
    if (!updatedProduct) {
        throw new apiError(500,"something went wrond while saving product")
    }
    res.status(200)
    .json(new apiResponse(200,updatedProduct,"review added successfully"))
})

export const getCategoryandBrand = asyncHandeler(async (req,res) => {
    try {
        const category = await Product.distinct('category')
        const brand = await Product.distinct('brand')
        if (!category || !brand) {
            throw new apiError(404,"not found")
        }
        res.status(200)
        .json(new apiResponse(200,{category,brand},"fetched successfully"))
    } catch (error) {
        console.error("Error fetching unique categories and brands:", error);
        res.json(new apiError(500,"Server error"))
    }
})