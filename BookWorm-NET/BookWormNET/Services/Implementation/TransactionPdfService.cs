using BookWormNET.Models;
using iText.IO.Font.Constants;
using iText.Kernel.Font;
using iText.Kernel.Pdf;
using iText.Layout.Element;
using iText.Layout.Properties;
using iText.Layout;


namespace BookWormNET.Services.Implementation
{
    public class TransactionPdfService
    {
        public byte[] GenerateInvoice(Transaction transaction,
                                      List<TransactionItem> items)
        {
            using var stream = new MemoryStream();

            PdfWriter writer = new PdfWriter(stream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            PdfFont titleFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);
            PdfFont normalFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);

            // Title
            document.Add(new Paragraph("Bookworm - Transaction Invoice")
                .SetFont(titleFont)
                .SetFontSize(18)
                .SetTextAlignment(TextAlignment.CENTER));

            document.Add(new Paragraph(" "));

            // Transaction Details
            document.Add(new Paragraph($"Transaction ID: {transaction.TransactionId}")
                .SetFont(normalFont));

            document.Add(new Paragraph($"User: {transaction.User.UserName}")
                .SetFont(normalFont));

            document.Add(new Paragraph($"Type: {transaction.TransactionType}")
                .SetFont(normalFont));

            document.Add(new Paragraph($"Status: {transaction.Status}")
                .SetFont(normalFont));

            document.Add(new Paragraph($"Date: {transaction.CreatedAt}")
                .SetFont(normalFont));

            document.Add(new Paragraph(" "));

            // Table (4 columns)
            Table table = new Table(4).UseAllAvailableWidth();

            table.AddHeaderCell("Book");
            table.AddHeaderCell("Price");
            table.AddHeaderCell("Qty");
            table.AddHeaderCell("Total");

            foreach (var item in items)
            {
                decimal lineTotal = (item!.Price ?? 0m) * (item.Quantity ?? 0);

                table.AddCell(item.Product?.ProductName ?? "N/A");
                table.AddCell("₹" + (item.Price ?? 0m));
                table.AddCell(item.Quantity.ToString());
                table.AddCell("₹" + lineTotal);
            }


            document.Add(table);

            document.Add(new Paragraph(" "));
            document.Add(new Paragraph("Total Amount: ₹" + transaction.TotalAmount)
                .SetFont(titleFont));

            document.Close();

            return stream.ToArray();
        }
    }
}
