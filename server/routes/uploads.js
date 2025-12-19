import express from "express";
import multer from "multer";
import cloudinaryServer from "../cloud/clodanaryServer.js";
import DataURIParser from "datauri/parser.js";
import { searchResults } from "../SearchEngine/searchProducts.js";
import { pdfBill } from "../pdfs/pdfBill.js";

const route = express.Router();

// Use memory storage
const uploads = multer({ storage: multer.memoryStorage() });

//profile-upload

route.post("/profile-upload", uploads.single("profile"), async (req, res) => {
  try {
    const parser = new DataURIParser();
    const mimeType = req.file.mimetype;
    const datauri = parser.format(mimeType, req.file.buffer);
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    // Upload to Cloudinary
    const result = await cloudinaryServer.uploader.upload(datauri.content, {
      public_id: `userProfile/${userId}`,
      overwrite: true,
      upload_preset: "e-commers-userProfile-floder", // if needed
    });

    const profileUrl = result.secure_url;

    return res.status(200).json({ profileUrl });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//search products;

route.get("/search", searchResults);

//purchase bill

route.post("/purchases-bill", async (req, res) => {
  try {
    const orderData = req.body;
    //generate pdf
    const pdf = await pdfBill(orderData);
    const resutl_url = await new Promise((resolve, reject) => {
      const stream = cloudinaryServer.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "invoices",
          public_id: `invoice-${orderData.orderId}`,
          format: "pdf",
          overwrite: true,
          access_mode: "authenticated",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(pdf);
    });

    return res
      .status(200)
      .json({ success: true, pdfUrl: resutl_url.public_id });
  } catch (error) {
    console.log(error.message);
  }
});

export default route;
