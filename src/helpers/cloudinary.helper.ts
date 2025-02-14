import cloudinary from "../config/cloudinary";

const uploadToCloudinary = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(`${result.public_id}`, {
      fetch_format: "auto",
      quality: "auto",
    });

    return {
      url: optimizeUrl,
      publicId: result.public_id,
    };
  } catch (error: any) {
    console.log("Error while uploading to cloudinary", error);
    throw new Error("Error while uploading to cloudinary");
  }
};

export { uploadToCloudinary };
