import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import fs from "fs";
import dotenv from "dotenv";


dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINERY_CLOUD_NAME,
  api_key: process.env.CLOUDINERY_API_KEY,
  api_secret: process.env.CLOUDINERY_API_SECRET,
});

export const uploadOnCloudinery = async(localFilePath)=>{
 
  try {
      if(!localFilePath){
          console.log("no file provided");
          return null
      }
      // console.log("localpath:",localFilePath);
      
      //uplode the file on cloud
      const response = await cloudinary.uploader
     .upload(localFilePath,{
      resource_type:"auto",
      folder:"products"
     })
     // file status
      //  console.log("File is uploded on cloud successfully",response.url);
  //file will remove from local stoage also
    fs.unlinkSync(localFilePath)
     return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error.message);

    // Remove the file even if the upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
}
const extractPublicIdFromUrl = (url) => {
  const regex = /\/upload\/v\d+\/(.+?)(\.\w{3,4})?$/; 
  const match = url.match(regex);

  if (match && match[1]) {
      return match[1]; // Return the matched public ID
  }

  return null; 
};
export const deleteImageFromCloudinaryByUrl = async (imageUrl) => {
  const publicId = extractPublicIdFromUrl(imageUrl);
  // console.log(publicId);
  
  if (!publicId) {
      throw new Error('Invalid Cloudinary URL');
  }

  try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('line 75',result);
      return result;
  } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw new Error('Could not delete image');
  }
};
