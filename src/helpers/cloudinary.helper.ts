import cloudinary from "../config/cloudinary";

const uploadToCloudinary = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error: any) {
    console.log("Error while uploading to cloudinary", error);
    throw new Error("Error while uploading to cloudinary");
  }
};

export { uploadToCloudinary };
