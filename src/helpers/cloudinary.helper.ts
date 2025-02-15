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

    return {
      url: optimizeUrl,
    };
  } catch (error: any) {
    console.log("Error while uploading to cloudinary", error);
    throw new Error("Error while uploading to cloudinary");
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

    return {
      url: optimizeUrl,
    };
  } catch (error) {
    console.log("Error while updating to cloudinary", error);
    throw new Error("Error while updating to cloudinary");
  }
};

export { uploadToCloudinary, updateToCloudinary };
