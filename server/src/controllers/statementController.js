import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");
const pdfParse = pdfParseModule && pdfParseModule.default ? pdfParseModule.default : pdfParseModule;
import Transaction from "../models/Transaction.js";

let pdfjsLib = null;
try {
  pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
} catch (err) {
  // will handle absence later when needed
  pdfjsLib = null;
}

const storage = multer.memoryStorage();
export const statementUploadMiddleware = multer({ storage }).single("statement");

const toNumber = (value) => {
  if (!value) return 0;

  const cleaned = String(value)
    .replace(/[^0-9.-]+/g, "")
    .replace(/,(?=.*\d{3})/g, "")
    .trim();

  return Number(cleaned) || 0;
};

const parseCsv = (text) => {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (rows.length === 0) {
    return [];
  }

  const header = rows[0]
    .split(/,|\t/)
    .map((column) => column.trim().toLowerCase());

  const hasHeader = header.includes("date") && header.includes("description");
  const dataRows = hasHeader ? rows.slice(1) : rows;

  return dataRows
    .map((row) => row.split(/,|\t/).map((value) => value.trim().replace(/^"|"$/g, "")))
    .map((values) => {
      const getValue = (key) => {
        const index = header.indexOf(key);
        return index !== -1 ? values[index] || "" : "";
      };

      const dateValue = getValue("date") || values[0] || "";
      const descriptionValue =
        getValue("description") || values[1] || "Statement transaction";
      const amountValue =
        getValue("amount") || values[3] || values[2] || "0";
      const typeValue = getValue("type") || "";
      const categoryValue =
        getValue("category") || values[2] || "Others";

      const amount = toNumber(amountValue);
      const type =
        typeValue.toLowerCase() === "income"
          ? "income"
          : typeValue.toLowerCase() === "expense"
          ? "expense"
          : amount >= 0
          ? "income"
          : "expense";

      return {
        date: new Date(dateValue),
        description: descriptionValue,
        amount: Math.abs(amount),
        category: categoryValue || "Others",
        type,
      };
    })
    .filter(
      (transaction) =>
        transaction.date instanceof Date &&
        !isNaN(transaction.date) &&
        transaction.description &&
        transaction.amount > 0
    );
};

const parsePdfText = (text) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const dateRegex = /(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|\d{4}[\/.-]\d{1,2}[\/.-]\d{1,2})/;
  const amountRegex = /-?\d{1,3}(?:,\d{3})*(?:\.\d+)?/;

  return lines
    .map((line) => {
      const dateMatch = line.match(dateRegex);
      const amountMatch = line.match(amountRegex);

      if (!dateMatch || !amountMatch) {
        return null;
      }

      const dateValue = dateMatch[0].replace(/\./g, "/");
      const amountValue = amountMatch[0];
      const remaining = line
        .replace(dateMatch[0], "")
        .replace(amountMatch[0], "")
        .trim();

      const description = remaining || "Statement transaction";
      const amount = toNumber(amountValue);
      const type = amount >= 0 ? "income" : "expense";

      return {
        date: new Date(dateValue),
        description,
        amount: Math.abs(amount),
        category: "Others",
        type,
      };
    })
    .filter(
      (transaction) =>
        transaction &&
        transaction.date instanceof Date &&
        !isNaN(transaction.date) &&
        transaction.description &&
        transaction.amount > 0
    );
};

const transactionFingerprint = ({ date, description, amount, type }) => {
  return `${date.toISOString()}|${String(description).trim().toLowerCase()}|${amount}|${type}`;
};

export const uploadStatement = async (req, res) => {
  try {
    if (!req.file) {
      console.error("No file received in uploadStatement");

      return res.status(400).json({
        success: false,
        message: "Statement file is required.",
      });
    }

    console.log("Received statement upload:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size || req.file.buffer?.length,
      user: req.user ? req.user.id : null,
    });

    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname.toLowerCase();
    const text = fileBuffer.toString("utf-8");

    let transactions = [];

    if (originalName.endsWith(".csv") || req.file.mimetype.includes("csv")) {
      transactions = parseCsv(text);
    } else if (
      originalName.endsWith(".pdf") || req.file.mimetype.includes("pdf")
    ) {
      // pdf-parse may export several shapes depending on version/build.
      let parsePdfFn = null;

      if (typeof pdfParse === "function") {
        parsePdfFn = pdfParse;
      } else if (pdfParse && typeof pdfParse.default === "function") {
        parsePdfFn = pdfParse.default;
      } else if (pdfParseModule && typeof pdfParseModule.parse === "function") {
        parsePdfFn = pdfParseModule.parse;
      }

      console.log("pdfParse type:", typeof pdfParse, "pdfParseModule type:", typeof pdfParseModule);

      if (!parsePdfFn) {
        console.warn("pdf-parse export shape unexpected, attempting fallback strategies");

        let data = null;

        // Strategy 1: call module as function
        try {
          if (typeof pdfParseModule === "function") {
            console.log("Trying pdfParseModule(fileBuffer)");
            data = await pdfParseModule(fileBuffer);
          }
        } catch (err) {
          console.log("pdfParseModule(fileBuffer) failed:", err.message);
        }

        // Strategy 2: call PDFParse as function
        try {
          if (!data && typeof pdfParseModule.PDFParse === "function") {
            console.log("Trying pdfParseModule.PDFParse(fileBuffer)");
            data = await pdfParseModule.PDFParse(fileBuffer);
          }
        } catch (err) {
          console.log("pdfParseModule.PDFParse(fileBuffer) failed:", err.message);
        }

        // Strategy 3: instantiate PDFParse and call instance.parseBuffer
        try {
          if (!data && typeof pdfParseModule.PDFParse === "function") {
            console.log("Trying new pdfParseModule.PDFParse().parseBuffer(fileBuffer)");
            const inst = new pdfParseModule.PDFParse();
            if (typeof inst.parseBuffer === "function") {
              data = await inst.parseBuffer(fileBuffer);
            } else if (typeof inst.parse === "function") {
              data = await inst.parse(fileBuffer);
            }
          }
        } catch (err) {
          console.log("PDFParse instance parsing failed:", err.message);
        }

        // Strategy 4: check for other possible helpers
        try {
          if (!data && pdfParseModule && typeof pdfParseModule.parse === "function") {
            console.log("Trying pdfParseModule.parse(fileBuffer)");
            data = await pdfParseModule.parse(fileBuffer);
          }
        } catch (err) {
          console.log("pdfParseModule.parse failed:", err.message);
        }

        if (!data || !data.text) {
          console.warn("All pdf-parse strategies failed; attempting pdfjs-dist fallback if available");

          if (!pdfjsLib) {
            console.error("No pdf parsing strategies succeeded and pdfjs-dist is not installed.");
            console.error("pdf-parse module keys:", Object.keys(pdfParseModule));
            throw new Error(
              "PDF parsing failed. Install 'pdfjs-dist' (npm i pdfjs-dist) or upload CSV instead."
            );
          }

          try {
            const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
            const pdfDoc = await loadingTask.promise;

            let fullText = "";
            for (let i = 1; i <= pdfDoc.numPages; i++) {
              const page = await pdfDoc.getPage(i);
              const content = await page.getTextContent();
              const strings = content.items.map((item) => item.str || "");
              fullText += strings.join(" ") + "\n";
            }

            console.log("PDF parsed using pdfjs-dist fallback, length:", fullText.length);

            transactions = parsePdfText(fullText);
          } catch (err) {
            console.error("pdfjs-dist fallback failed:", err.message);
            throw new Error("PDF parsing failed using all available parsers.");
          }
        } else {
          console.log("PDF parsed using fallback strategy");
          transactions = parsePdfText(data.text);
        }
      } else {
        const data = await parsePdfFn(fileBuffer);
        transactions = parsePdfText(data.text);
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type. Upload a PDF or CSV statement.",
      });
    }

    if (transactions.length === 0) {
      console.warn("No transactions parsed from the statement file");

      return res.status(400).json({
        success: false,
        message: "No valid transactions could be extracted from the statement.",
      });
    }

    console.log("Parsed transactions count:", transactions.length);
    console.log("Sample parsed transaction:", transactions[0]);

    const parsedFingerprints = transactions.map(transactionFingerprint);
    const minDate = new Date(Math.min(...transactions.map((t) => t.date.getTime())));
    const maxDate = new Date(Math.max(...transactions.map((t) => t.date.getTime())));

    const existingTransactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: new Date(minDate.getTime() - 24 * 60 * 60 * 1000), $lte: new Date(maxDate.getTime() + 24 * 60 * 60 * 1000) },
      amount: { $in: transactions.map((t) => t.amount) },
    }).lean();

    const existingFingerprints = new Set(
      existingTransactions.map((transaction) =>
        transactionFingerprint({
          date: transaction.date,
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type,
        })
      )
    );

    const uniqueTransactions = transactions.filter(
      (transaction) => !existingFingerprints.has(transactionFingerprint(transaction))
    );

    if (uniqueTransactions.length === 0) {
      console.log("No new transactions to insert after deduplication.");
      return res.status(200).json({
        success: true,
        message: "No new transactions were added because the uploaded file has already been processed.",
        transactions: [],
      });
    }

    const createdTransactions = await Transaction.insertMany(
      uniqueTransactions.map((transaction) => ({
        user: req.user.id,
        ...transaction,
      })),
      { ordered: true }
    );

    console.log("Inserted transactions:", createdTransactions.length);

    res.status(201).json({
      success: true,
      message: `Statement uploaded successfully. ${createdTransactions.length} new transactions added.`,
      transactions: createdTransactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to parse statement.",
    });
  }
};
