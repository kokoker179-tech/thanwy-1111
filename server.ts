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
        response: "لفهم مشكلة الكود: هل جربت الانتظار لأكثر من دقيقة؟ وهل رقم الهاتف المسجل يدعم الواتساب؟ إذا استمرت المشكلة، يرجى محاولة إعادة الطلب أو تواصل مع الدعم الفني: 01554353231."
      },
      {
        pattern: /طباعة|ورقة|تذكرة|إثبات|تأكيد/i,
        response: "مشكلة التذكرة غالباً ما تتعلق بتحديث المتصفح. هل قمت بتحديث الصفحة؟ وهل تأكدت من إتمام الحجز بنجاح؟ إذا لم تظهر، يرجى إرسال تفاصيل رقم الحجز للدعم الفني واتساب: 01554353231."
      },
      {
        pattern: /بيانات|حفظ|تسجيل|خطأ/i,
        response: "إذا واجهت خطأ أثناء حفظ البيانات: يرجى التأكد من ملء الحقول المطلوبة بدقة (مثل تنسيق الهاتف). هل يمكنك تكرار المحاولة بعد تحديث الصفحة؟ إذا استمرت المشكلة، يرجى تصوير رسالة الخطأ وإرسالها للدعم الفني واتساب: 01554353231."
      },
      {
        pattern: /حجز|مشكلة|مشكله|فنية|دعم|مساعدة/i,
        response: "أنا هنا للمساعدة! لتشخيص المشكلة بشكل صحيح، هل يمكنك إخباري تحديداً: هل المشكلة في (وصول الكود)؟ أم (حفظ البيانات)؟ أم (طباعة التذكرة)؟ بمجرد تحديدك للمشكلة سأعطيك الخطوات المناسبة."
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
