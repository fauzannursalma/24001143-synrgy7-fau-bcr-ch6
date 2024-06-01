import cloudinary from "./cloudinary";
export async function uploadImageToCloudinary(image: any, folder: string) {
  const filBase64 = image.buffer.toString("base64");
  const fileUpload = `data:${image.mimetype};base64,${filBase64}`;
  return await cloudinary.uploader.upload(fileUpload, {
    folder: folder,
  });
}

export async function deleteImageFromCloudinary(publicId: string) {
  try {
    await cloudinary.uploader.destroy(`${publicId}`);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
}
