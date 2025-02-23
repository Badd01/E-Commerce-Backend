import cloudinary from "../config/cloudinary";

const uploadToCloudinary = async (publicId: string, filePath: string) => {
  try {
    await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
    });

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(publicId, {
      fetch_format: "auto",
      quality: "auto",
    });

    return optimizeUrl;
  } catch (error: any) {
    console.error("Error while uploading to cloudinary", error);
    return null;
  }
};

const updateToCloudinary = async (publicId: string, filePath: string) => {
  try {
    // Delete
    await cloudinary.uploader.destroy(publicId);

    //Upload
    await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
    });

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(publicId, {
      fetch_format: "auto",
      quality: "auto",
    });

    return optimizeUrl;
  } catch (error) {
    console.error("Error while updating to cloudinary", error);
    return null;
  }
};

export { uploadToCloudinary, updateToCloudinary };
