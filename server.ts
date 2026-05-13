import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  app.post("/api/chat", async (req, res) => {
    const { message } = req.body;
    const msg = message.toLowerCase();

    const rules = [
      {
        pattern: /مطور|مصمم|مين|مبرمج|صاحب|سوى|عمل/i,
        response: "يسعدني اهتمامك! الموقع تم تطويره بواسطة المبرمج الشاطر والمحترف كيرلس صفوت (Kerolos Sfwat)."
      },
      {
        pattern: /ميعاد|وقت|تاريخ|متى|امتى/i,
        response: "بخصوص الميعاد، ما زال التاريخ والوقت قيد التحديد. تابع الموقع للحصول على التحديثات فور توفرها."
      },
      {
        pattern: /مكان|فين|موقع|عنوان/i,
        response: "عن مكان الحفلة، لم يتم تحديد الموقع بعد. سنقوم بالإعلان عنه بمجرد تحديده، تابعنا!"
      },
      {
        pattern: /وصف|عن|حفلة|تفاصيل/i,
        response: "الحفلة ستكون تجمعاً مميزاً. لم يتم كتابة وصف تفصيلي لها حتى الآن، لكننا نعمل على كل الترتيبات لجعلها تجربة رائعة."
      },
      {
        pattern: /سلام|هاي|مرحبا|اهلا/i,
        response: "أهلاً بك! أنا مساعد ذكي لمساعدتك في معرفة آخر تفاصيل حفلة كنيسة الملاك روفائيل. كيف يمكنني مساعدتك اليوم؟"
      },
      {
        pattern: /كود|رسالة|تحقق|تفعيل/i,
        response: "إذا لم يصلك كود التحقق/التفعيل، يرجى التأكد من أن رقم الهاتف المكتوب صحيح ومسجل عليه واتساب، أو الانتظار لدقيقة وإعادة المحاولة. هل قمت بالتأكد من الرقم؟"
      },
      {
        pattern: /طباعة|ورقة|تذكرة|إثبات|تأكيد/i,
        response: "إذا واجهت مشكلة في طباعة أو ظهور التذكرة، يرجى التأكد من إتمام الحجز بنجاح أولاً، أو حاول تحديث الصفحة. هل تظهر لك رسالة خطأ معينة؟"
      },
      {
        pattern: /بيانات|حفظ|تسجيل|خطأ/i,
        response: "إذا لم تحفظ البيانات، يرجى التأكد من ملء جميع الحقول المطلوبة ومراجعة المدخلات. هل تظهر أي رسالة توضح مكان الخطأ؟"
      },
      {
        pattern: /حجز|مشكلة|مشكله|فنية|دعم|مساعدة/i,
        response: "أنا هنا للمساعدة! هل يمكنك توضيح ما هي المشكلة التي تواجهك بالتحديد في الحجز؟ (مثلاً: الكود لا يصل، البيانات لا تُحفظ، أو غيرها). إذا لم أستطع مساعدتك، يمكنك دائماً التواصل مع الدعم الفني واتساب على: 01554353231."
      }
    ];

    // Find the best match
    const matchedRule = rules.find(rule => rule.pattern.test(msg));
    const responseText = matchedRule ? matchedRule.response : "عذراً، لم تتوفر لدي هذه المعلومة حالياً، لكن يمكنك سؤالي عن ميعاد الحفلة، مكانها، أو عن مطور الموقع، أو التواصل مع الدعم الفني إذا واجهت مشكلة في الحجز.";

    res.json({ text: responseText });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
