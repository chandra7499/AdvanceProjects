import PDFDocument from "pdfkit";
import BwipJs from "bwip-js";
import fs from "fs";
import path from "path";
import { dateSpliter } from "../functions/dateSpliter.js";

//sample data orders

const orders = {
  orderId: "ORD123456",
  customerName: "John Doe",
  address: "123 Street, City, Country",
  items: [
    { name: "Item 1", qty: 2, price: 100 },
    { name: "Item 2", qty: 1, price: 50 },
  ],
  total: 250,
  paymentMode: "Credit Card",
  brand: "Tarzon Store",
};

async function generateBarCode(orderId) {
  return await BwipJs.toBuffer({
    bcid: "code128",
    text: orderId,
    scale: 3,
    height: 15,
    includetext: true,
    textxalign: "center",
    textfont: "Arial",
  });
}
export const pdfBill = async (order) => {
  try {
    const doc = new PDFDocument({ margin: 50 });
    const buffer = [];
   
    doc.on("end",async()=>{})

    const Imagepath = path.resolve(
      "public/Flux_Dev_a_dynamic_illustration_of_Tarzan_with_a_lush_green_fo_0 Background Removed.png"
    );

    //Add brandName and  Logo
    doc.image(Imagepath, doc.page.width / 2 - 100, doc.y - 5, {
      width: 30,
      height: 30,
    });
    doc.fontSize(28).text(order.brand, { align: "center" });
    doc.moveDown(1);

    //Add barcode

    const barCode = await generateBarCode(order.orderId);
    //make image small and align right  top
    doc.image(barCode, doc.page.width - 100 - 50, doc.y, {
      width: 100,
      height: 50,
      align: "right",
    });
    doc.moveDown(2);

    //order info
    const obj = dateSpliter(new Date());
    const startX = 50; // left margin
    const valueX = 150; // where the values start
    let currentY = doc.y;

    doc.fontSize(15);
    const info = [
      ["Date", obj],
      ["Order Id", order.orderId],
      ["Name", order.customerName],
      ["Address", order.address],
      ["phone", order.phone],
    ];

    info.forEach(([key, value]) => {
      // Draw key
      doc.text(`${key}`, startX, currentY);
      doc.text(":", valueX - 10, currentY);

      // Draw value aligned at same X for all
      doc.text(String(value), valueX, currentY, {
        width: doc.page.width - valueX - 50, // leave right margin
      });

      // Move Y downward for next line
      currentY = doc.y + 5;
    });

    doc.moveDown(2);
    //items tables

    //Table heade

    //table body
    const tableTop = doc.y;
    const itemX = 50; //left margin
    const brandX = 200;
    const qtyX = 350; //quntity column
    const priceX = 415; //price column
    const totalX = 490; //total column

    doc.font("Helvetica-Bold");
    doc.text("Item", itemX, tableTop);
    doc.text("Brand", brandX, tableTop);
    doc.text("Qty", qtyX, tableTop);
    doc.text("Price", priceX, tableTop);
    doc.text("Total", totalX, tableTop);
    doc.moveDown(0.5);
    doc.font("Helvetica");

    //Draw line between table header
    doc.moveTo(30, doc.y).lineTo(540, doc.y).strokeColor("gray").stroke();
    doc.moveDown(0.8);

    //Table rows

    let y = doc.y + 5;
    let SumOftotal = 0;
    order.items.forEach((item) => {
      const total = item.qty * item.price;
      SumOftotal += total;
      doc.text(item.name, itemX, y);
      doc.text(item.qty, qtyX + 6.5, y);
      doc.text(item.price, priceX + 6.5, y);
      doc.text(total, totalX + 6.5, y);
      doc.moveDown(0.8);
      y = doc.y + 2;
    });
    doc.moveDown(1);

    doc
      .moveTo(30, doc.y - 10)
      .lineTo(540, doc.y - 10)
      .strokeColor("gray")
      .stroke();

    doc.moveDown(1);

    const info2 = [
      ["Total", `Rs:${Number(SumOftotal).toFixed(2)}`],
      ["Payment Mode", order.paymentMode],
    ];

    const startX2 = 50; // left margin
    let valueX2 = 200; // where the values start
    let currentY2 = doc.y;
    //Total payment
    doc.moveDown(1);
    doc.fontSize(14);
    doc.font("Helvetica-Bold");

    info2.forEach(([key, value]) => {
      // Key
      doc.text(`${key}`, startX2, currentY2, { continued: true });
      doc.text(":", valueX2 - 50, currentY2, { continued: true });

      // Value
      doc.font("Helvetica").text(String(value), valueX2 - 10, currentY2);

      // Move Y down for next lin
      // Reset font for next iteation
      currentY2 = doc.y + 2;
      valueX2 -= 65;
      doc.font("Helvetica-Bold");
    });

    
    const pdfBuffer = await new Promise((resolve) => {
       doc.on("data",(chunk)=>buffer.push(chunk));
      doc.on("end",()=>resolve(Buffer.concat(buffer)));
      doc.end();
    });

    return pdfBuffer;
  } catch (error) {
    console.log(error.message);
  }
};
