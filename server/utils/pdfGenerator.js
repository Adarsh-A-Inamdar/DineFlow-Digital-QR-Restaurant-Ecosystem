const PDFDocument = require('pdfkit');

const generateInvoice = (order, stream) => {
    const doc = new PDFDocument({ margin: 50 });

    // Header
    doc.fillColor("#444444")
       .fontSize(20)
       .text("RESTAURANT PREMIUM", 110, 57)
       .fontSize(10)
       .text("GSTIN: 27AAAAA0000A1Z5", 200, 65, { align: "right" })
       .text("123 Food Street, City", 200, 80, { align: "right" })
       .moveDown();

    // Invoice Header
    doc.fillColor("#000000")
       .fontSize(15)
       .text(`Invoice #${order._id.toString().slice(-6).toUpperCase()}`, 50, 160);

    const invoiceTableTop = 200;

    doc.font("Helvetica-Bold");
    generateTableRow(doc, invoiceTableTop, "Item", "Price", "Qty", "Total");
    doc.font("Helvetica");

    let i;
    for (i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.menuItem?.name || "Item",
            `INR ${item.price}`,
            item.quantity.toString(),
            `INR ${item.price * item.quantity}`
        );
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30 + 20;
    doc.font("Helvetica-Bold");
    doc.text("Subtotal", 350, subtotalPosition);
    doc.text(`INR ${order.totalAmount}`, 450, subtotalPosition);

    const gstPosition = subtotalPosition + 20;
    doc.text("GST (5%)", 350, gstPosition);
    doc.text(`INR ${Math.round(order.totalAmount * 0.05)}`, 450, gstPosition);

    const grandTotalPosition = gstPosition + 25;
    doc.fontSize(15).text("Grand Total", 350, grandTotalPosition);
    doc.text(`INR ${order.totalAmount + Math.round(order.totalAmount * 0.05)}`, 450, grandTotalPosition);

    doc.pipe(stream);
    doc.end();
};

function generateTableRow(doc, y, item, price, qty, total) {
    doc.fontSize(10)
       .text(item, 50, y)
       .text(price, 280, y, { width: 90, align: "right" })
       .text(qty, 370, y, { width: 90, align: "right" })
       .text(total, 0, y, { align: "right" });
}

module.exports = { generateInvoice };
