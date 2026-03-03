import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export function KakaoFloatingButton() {
    return (
        <motion.a
            href="https://open.kakao.com/o/s6pETmdi"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-[#FAE100] text-[#371D1E] px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer font-bold no-underline"
        >
            <MessageCircle size={20} fill="currentColor" />
            <span className="text-sm">카카오톡 문의하기</span>
        </motion.a>
    );
}
