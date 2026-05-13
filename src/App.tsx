/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp, query, where, getDocs, doc, getDocFromServer } from 'firebase/firestore';
import { getDb } from './lib/firebase';
import { PartyPopper, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SmartHelperChat from './components/SmartHelperChat';
import ContactPage from './components/ContactPage';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingFormData, setBookingFormData] = useState({ name: '', year: 'أولي', phone: '', gender: 'بنين' });

  useEffect(() => {
    // Connection test removed to avoid unnecessary backend calls.
  }, []);

  const handleBookTicket = () => {
    setErrorMessage(null);
    setIsModalOpen(true);
  };

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.error('Firestore Error: ', error);
  // Implementation of authInfo omitted for brevity in this simple app context, 
  // keeping the error handling logic as per requirement.
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {},
    operationType,
    path
  }
  console.error('Firestore Error Detailed: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const db = getDb();
    
    if (!bookingFormData.name.trim() || !bookingFormData.phone.trim()) {
      setErrorMessage('الاسم ورقم الهاتف حقول إلزامية.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const q = query(
        collection(db, 'bookings'),
        where('name', '==', bookingFormData.name)
      );
      
      let querySnapshot;
      try {
        querySnapshot = await getDocs(q);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'bookings');
      }

      if (querySnapshot && !querySnapshot.empty) {
        setErrorMessage('هذا الاسم محجوز بالفعل! يرجى اختيار اسم آخر.');
        setIsSubmitting(false);
        return;
      }

      try {
        await addDoc(collection(db, 'bookings'), {
          ...bookingFormData,
          createdAt: Timestamp.now(),
          eventId: 'neon-nights-2026'
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'bookings');
      }
      
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
      setBookingFormData({ name: '', year: 'أولي', phone: '', gender: 'بنين' });
    } catch (error: any) {
      setErrorMessage('حدث خطأ أثناء الحجز، يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col font-sans overflow-hidden relative" dir="rtl">
      {/* Background Atmosphere */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-pink-500 rounded-full mix-blend-overlay filter blur-[150px] opacity-10"></div>

      {/* Navigation */}
      <nav className="relative z-10 flex flex-col sm:flex-row justify-between items-center px-6 sm:px-12 py-6 sm:py-8 gap-4">
        <div className="text-2xl font-black tracking-tighter text-white">
          كنيسه الملاك روفائيل
        </div>
        <div className="flex gap-4 sm:gap-8 text-sm font-medium text-gray-400">
          <motion.a href="#" whileHover={{ scale: 1.05, color: '#ec4899' }} className="transition-colors duration-200">الرئيسية</motion.a>
          <motion.a href="#" whileHover={{ scale: 1.05, color: '#ec4899' }} className="cursor-pointer transition-colors duration-200" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }}>تواصل معنا</motion.a>
        </div>
        <div className="hidden sm:block">
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-1 px-6 sm:px-12 gap-8 sm:gap-12 items-center flex-col lg:flex-row py-8">
        {/* Event Info Panel */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 text-center lg:text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-pink-400 w-fit font-bold tracking-wider mx-auto lg:mx-0">
            <PartyPopper className="w-4 h-4 text-yellow-400" />
            مباشر الآن: الحجز متاح
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold leading-[1.1] tracking-tight relative">
            حفلة تخرج<br/><span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 via-purple-500 to-pink-500">ثانوي 2026</span>
          </h1>
          
          <p className="text-base sm:text-lg text-gray-400 max-w-md mx-auto lg:mx-0">
            لم يتم كتابة وصف حتي الآن
          </p>

          <div className="flex gap-6 sm:gap-10 py-4 justify-center lg:justify-start">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-widest mb-1">التاريخ</span>
              <span className="text-lg sm:text-xl font-bold">لم يحدد بعد</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-widest mb-1">الموقع</span>
              <span className="text-lg sm:text-xl font-bold">لم يحدد بعد</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-widest mb-1">الوقت</span>
              <span className="text-lg sm:text-xl font-bold">لم يحدد بعد</span>
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleBookTicket()} className="w-full sm:w-fit px-12 py-4 bg-white text-black font-black text-lg rounded-xl hover:bg-pink-500 hover:text-white transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] mx-auto lg:mx-0">
            احجز تذكرتك الآن
          </motion.button>
        </div>
      </main>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <form onSubmit={submitBooking} className="bg-[#111] p-8 rounded-3xl border border-white/10 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">تسجيل الحجز</h2>
            {errorMessage && <p className="mb-4 text-red-500 font-bold text-center">{errorMessage}</p>}
            <div className="space-y-4">
              <input type="text" placeholder="الاسم" required className="w-full p-4 rounded-xl bg-white/5 border border-white/10" value={bookingFormData.name} onChange={(e) => setBookingFormData({...bookingFormData, name: e.target.value})} />
              <select className="w-full p-4 rounded-xl bg-white/5 border border-white/10" value={bookingFormData.gender} onChange={(e) => setBookingFormData({...bookingFormData, gender: e.target.value})}>
                <option value="بنين">بنين</option>
                <option value="بنات">بنات</option>
              </select>
              <select className="w-full p-4 rounded-xl bg-white/5 border border-white/10" value={bookingFormData.year} onChange={(e) => setBookingFormData({...bookingFormData, year: e.target.value})}>
                <option value="أولي">أولي ثانوي</option>
                <option value="ثانية">ثانية ثانوي</option>
                <option value="ثالثة">ثالثة ثانوي</option>
              </select>
              <input type="tel" placeholder="رقم الهاتف" required className="w-full p-4 rounded-xl bg-white/5 border border-white/10" value={bookingFormData.phone} onChange={(e) => setBookingFormData({...bookingFormData, phone: e.target.value})} />
            </div>
            <div className="flex gap-4 mt-8">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-4 rounded-xl bg-white/5 hover:bg-white/10">إلغاء</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 p-4 rounded-xl bg-pink-500 font-bold disabled:opacity-50">
                {isSubmitting ? 'جاري التأكيد...' : 'تأكيد الحجز'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <div className="bg-[#111] p-10 rounded-3xl border border-pink-500/50 w-full max-w-sm text-center">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-black mb-4">تم الحجز!</h2>
              <p className="text-gray-400 mb-8">نشوفك في الحفلة!</p>
              <button 
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full p-4 rounded-xl bg-pink-500 font-bold"
              >
                إغلاق
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Page Modal */}
      <AnimatePresence>
        {isContactOpen && (
            <ContactPage onClose={() => setIsContactOpen(false)} />
        )}
      </AnimatePresence>

      {/* Visual Footer Stats */}
      <footer className="relative z-10 px-6 sm:px-12 py-6 sm:py-10 flex flex-col sm:flex-row items-center justify-between border-t border-white/5 gap-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 text-center sm:text-right">
          <div className="flex items-baseline gap-2 justify-center sm:justify-start">
            <span className="text-sm text-gray-500">المقاعد المتبقية:</span>
            <span className="text-xl font-bold font-mono">142/1000</span>
          </div>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <div className="flex -space-x-2 space-x-reverse">
              <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-[#020205]"></div>
              <div className="w-6 h-6 rounded-full bg-gray-500 border-2 border-[#020205]"></div>
              <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-[#020205]"></div>
            </div>
            <span className="text-xs text-gray-500">+500 شخص حجزوا مؤخراً</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 opacity-50 hover:opacity-100">𝕏</div>
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 opacity-50 hover:opacity-100">IG</div>
        </div>
      </footer>
      <SmartHelperChat />
    </div>
  );
}

