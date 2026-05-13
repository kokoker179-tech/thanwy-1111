import { useState } from 'react';
import { MessageCircle, Send, X, Headset } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SmartHelperChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'أهلاً! أنا فريق Chat Support. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulated delay to mimic real chat
    await new Promise(resolve => setTimeout(resolve, 500));

    const msg = input.toLowerCase();
    const rules = [
      { pattern: /مطور|مصمم|مين|مبرمج|صاحب|سوى|عمل/i, response: "الموقع تم تطويره بواسطة المبرمج الشاطر والمحترف كيرلس صفوت (Kerolos Sfwat)." },
      { pattern: /ميعاد|وقت|تاريخ|متى|امتى/i, response: "حتى الآن، التاريخ والوقت لم يحدد بعد. سنقوم بالإعلان عنه فور تحديده، تابع الموقع للحصول على آخر التحديثات!" },
      { pattern: /مكان|فين|موقع|عنوان/i, response: "موقع الحفلة لا يزال قيد التحديد. سنعلن عنه قريباً. هل هناك شيء آخر تود الاستفسار عنه؟" },
      { pattern: /وصف|عن|حفلة|تفاصيل/i, response: "الحفلة ستكون تجمعاً مميزاً. لا يوجد وصف تفصيلي حتى الآن، لكننا نعدك بتجربة رائعة." },
      { pattern: /سلام|هاي|مرحبا|اهلا/i, response: "أهلاً بك في كنيسة الملاك روفائيل! أنا مساعدك الذكي لكل ما يخص الحفلة القادمة. كيف يمكنني مساعدتك؟" },
      { pattern: /كود|رسالة|تحقق|تفعيل/i, response: "مشكلة كود التحقق غالباً ما تكون بسبب التأخير في الشبكة أو الرقم غير المسجل على واتساب. هل جربت الانتظار لدقيقة وإعادة الطلب؟" },
      { pattern: /طباعة|ورقة|تذكرة|إثبات|تأكيد/i, response: "لمشكلة التذكرة: تأكد من إتمام الحجز بنجاح، حاول تحديث الصفحة. إذا استمرت، أرسل رقم حجزك للدعم الفني واتساب: 01554353231." },
      { pattern: /بيانات|حفظ|تسجيل|خطأ/i, response: "عند وجود خطأ في البيانات، تأكد من ملء الحقول المطلوبة بدقة (مثل تنسيق الهاتف). هل تظهر لك رسالة خطأ محددة؟" },
      { pattern: /مشكلة|مشكله|خطأ|فنية|دعم|مساعدة|عطل/i, response: "يقلقني أنك تواجه مشكلة. لتشخيص الأمر، هل المشكلة في (الكود) أو (حفظ البيانات) أو (التذكرة)؟ بمجرد تحديدك للمشكلة، سأعطيك الخطوات الدقيقة للحل." },
      { pattern: /شكر|شكرا/i, response: "عفواً، أنا في خدمتك دائماً! هل هناك أي شيء آخر يمكنني مساعدتك به؟" },
      { pattern: /باي|مع السلامة|سلام/i, response: "إلى اللقاء! نتمنى لك يوماً سعيداً. أنا هنا إذا احتجت لأي شيء آخر." },
      { pattern: /كيف|أخبارك|حالك/i, response: "أنا بخير وأعمل بكامل طاقتي لمساعدتك! كيف يمكنني إفادتك اليوم؟" }
    ];

    const matchedRule = rules.find(rule => rule.pattern.test(msg));
    const responseText = matchedRule ? matchedRule.response : "عذراً، لم تتوفر لدي هذه المعلومة حالياً، لكن يمكنك سؤالي عن ميعاد الحفلة، مكانها، أو عن مطور الموقع، أو التواصل مع الدعم الفني إذا واجهت مشكلة في الحجز.";

    setMessages((prev) => [...prev, { role: 'ai', text: responseText }]);
    
    // Play sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.error("Sound play failed:", e));
    
    setIsLoading(false);
  };

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-pink-500 text-white shadow-lg z-50 hover:bg-pink-600 transition"
      >
        <Headset size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-6 w-96 max-w-[90vw] h-[500px] bg-[#111] rounded-2xl border border-white/10 shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
              <h3 className="font-bold flex items-center gap-2 text-pink-400">
                <Headset size={20} /> Chat Support
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
              {messages.map((msg, i) => (
                <div key={i} className={`p-3 rounded-xl max-w-[85%] text-base ${msg.role === 'user' ? 'bg-pink-500/20 self-end' : 'bg-white/5 self-start text-gray-200'}`}>
                  {msg.text}
                </div>
              ))}
              {isLoading && <div className="bg-white/5 p-3 rounded-xl self-start text-sm text-gray-400">جاري التفكير...</div>}
            </div>

            <div className="p-4 border-t border-white/10 bg-[#1a1a1a] flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="اسألني أي شيء عن الحفلة..." 
                className="flex-1 bg-transparent border-none outline-none text-base"
              />
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={sendMessage} className="p-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600"><Send size={18} /></motion.button>
            </div>
            <div className="text-xs text-center text-gray-500 py-1 bg-[#1a1a1a]">
              developer by: kerolos sfwat
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
