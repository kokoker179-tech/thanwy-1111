import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());
  
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });

  console.log("NODE_ENV:", process.env.NODE_ENV);

  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      console.log("Received message:", message);
      console.log("Req body:", JSON.stringify(req.body));
    
      if (!message || typeof message !== 'string') {
        console.error("Invalid input detected");
        return res.status(400).json({ error: "Message is required and must be a string" });
      }
    
      const msg = message.toLowerCase();
      console.log("Message lowercased:", msg);

      const rules = [
        { pattern: /مطور|مصمم|مين|مبرمج|صاحب|سوى|عمل/i, response: "الموقع تم تطويره بواسطة المبرمج الشاطر والمحترف كيرلس صفوت (Kerolos Sfwat)." },
        { pattern: /ميعاد|وقت|تاريخ|متى|امتى/i, response: "حتى الآن، التاريخ والوقت لم يحدد بعد. سنقوم بالإعلان عنه فور تحديده، تابع الموقع للحصول على آخر التحديثات!" },
        { pattern: /مكان|فين|موقع|عنوان/i, response: "موقع الحفلة لا يزال قيد التحديد. سنعلن عنه قريباً. هل هناك شيء آخر تود الاستفسار عنه؟" },
        { pattern: /وصف|عن|حفلة|تفاصيل/i, response: "الحفلة ستكون تجمعاً مميزاً. لا يوجد وصف تفصيلي حتى الآن، لكننا نعدك بتجربة رائعة." },
        { pattern: /سلام|هاي|مرحبا|اهلا/i, response: "أهلاً بك في كنيسة الملاك روفائيل! أنا مساعدك الذكي لكل ما يخص الحفلة القادمة. كيف يمكنني مساعدتك؟" },
        { pattern: /كود|رسالة|تحقق|تفعيل/i, response: "مشكلة كود التحقق غالباً ما تكون بسبب التأخير في الشبكة أو الرقم غير المسجل على واتساب. هل جربت الانتظار لدقيقة وإعادة الطلب؟" },
        { pattern: /طباعة|ورقة|تذكرة|إثبات|تأكيد/i, response: "لمشكلة التذكرة: تأكد من إتمام الحجز بنجاح، حاول تحديث الصفحة. إذا استمرت، أرسل رقم حجزك للدعم الفني واتساب: 01554353231." },
        { pattern: /بيانات|حفظ|تسجيل|خطأ/i, response: "عند وجود خطأ في البيانات، تأكد من ملء الحقول المطلوبة بدقة (مثل تنسيق الهاتف). هل تظهر لك رسالة خطأ محددة؟" },
        { pattern: /مشكلة|مشكله|خطأ|فنية|دعم|مساعدة|عطل/i, response: "يقلقني أنك تواجه مشكلة. لتشخيص الأمر، هل المشكلة في (الكود) أو (حفظ البيانات) أو (التذكرة)؟ بمجرد تحديدك للمشكلة، سأعطيك الخطوات الدقيقة للحل." }
      ];

      const matchedRule = rules.find(rule => rule.pattern.test(msg));
      console.log("Matched rule:", !!matchedRule);
      
      const responseText = matchedRule ? matchedRule.response : "عذراً، لم تتوفر لدي هذه المعلومة حالياً، لكن يمكنك سؤالي عن ميعاد الحفلة، مكانها، أو عن مطور الموقع، أو التواصل مع الدعم الفني إذا واجهت مشكلة في الحجز.";
      console.log("Response text:", responseText);

      res.json({ text: responseText });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
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
