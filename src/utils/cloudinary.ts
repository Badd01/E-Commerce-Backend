import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "./config";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (
  slug: string,
  filePath: string
): Promise<string> => {
  try {
    await cloudinary.uploader.upload(filePath, {
      public_id: slug,
    });

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(slug, {
      fetch_format: "auto",
      quality: "auto",
    });

    return optimizeUrl;
  } catch (error) {
    throw new Error(`Error uploading ${slug} from Cloudinary: ${error}`);
  }
};

const updateToCloudinary = async (
  slug: string,
  filePath: string
): Promise<string> => {
  try {
    // Delete
    await cloudinary.uploader.destroy(slug);

    //Upload
    await cloudinary.uploader.upload(filePath, {
      public_id: slug,
    });

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(slug, {
      fetch_format: "auto",
      quality: "auto",
    });

    return optimizeUrl;
  } catch (error) {
    throw new Error(`Error updating ${slug} from Cloudinary: ${error}`);
  }
};

const deleteFromCloudinary = async (slug: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(slug);
  } catch (error) {
    throw new Error(`Error deleting ${slug} from Cloudinary: ${error}`);
  }
};

export { uploadToCloudinary, updateToCloudinary, deleteFromCloudinary };
