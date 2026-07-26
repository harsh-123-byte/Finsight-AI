import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export const pdfParseShape = (req, res) => {
  try {
    const pdfParseModule = require('pdf-parse');
    const pdfParse = pdfParseModule && pdfParseModule.default ? pdfParseModule.default : pdfParseModule;

    res.status(200).json({
      ok: true,
      pdfParseType: typeof pdfParse,
      pdfParseModuleType: typeof pdfParseModule,
      hasDefault: !!pdfParseModule.default,
      moduleKeys: Object.keys(pdfParseModule),
    });
  } catch (err) {
    console.error('debug pdf-parse error', err);
    res.status(500).json({ ok: false, message: err.message });
  }
};
