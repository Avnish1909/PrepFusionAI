import express from "express";
import multer from "multer";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

let pdfText = "";

/* =========================
   Upload PDF
========================= */

router.post(
    "/upload",
    upload.single("pdf"),
    async (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No PDF uploaded"
                });
            }

            const dataBuffer = new Uint8Array(
                fs.readFileSync(req.file.path)
            );

            const pdf = await pdfjsLib.getDocument({
                data: dataBuffer
            }).promise;

            let extractedText = "";

            for (let i = 1; i <= pdf.numPages; i++) {

                const page = await pdf.getPage(i);

                const textContent = await page.getTextContent();

                const pageText = textContent.items
                    .map(item => item.str)
                    .join(" ");

                extractedText += pageText + "\n";
            }

            pdfText = extractedText;

            fs.unlinkSync(req.file.path);

            res.json({
                success: true,
                message: "PDF uploaded successfully"
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                message: "Error processing PDF"
            });
        }
    }
);

/* =========================
   Ask Question
========================= */

router.post("/ask", async (req, res) => {

    try {

        const { question } = req.body;

        if (!pdfText) {
            return res.status(400).json({
                success: false,
                message: "Upload PDF first"
            });
        }

        const answer = `
Question:
${question}

PDF Content:
${pdfText.slice(0, 3000)}
`;

        res.json({
            success: true,
            answer
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error generating answer"
        });
    }
});

export default router;