import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MyPopup({ 
  isOpen, 
  onClose,
  title, 
  children,
  confirmText = 'Confirm',
  showConfirmButton = true,
  executeFn
}) {
  const [isClosing, setIsClosing] = useState(false); // 彈窗關閉特效

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };
  
  const handleConfirm = () => {
    if (typeof executeFn === 'function') {
      executeFn();
    } 
    handleClose()
  }

  // 重置關閉動畫狀態
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      // 針對彈窗開啟後頁面會跳動問題處理（因body被設置overflow-hidden導致原有滾動條消失造成的螢幕左右跳動）
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      // window.innerWidth 返回整個window的寬度，包括工具欄、滾動條、地址欄等
      // document.documentElement.clientWidth 返回viewport的寬度，網頁內容的區域，不包括瀏覽器的工具欄、滾動條等
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      return () => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`
        fixed inset-0 bg-black/50 flex items-center justify-center z-50
        transition-opacity duration-300 ease-in-out spacialMask
        ${isClosing ? 'opacity-0' : 'opacity-100'}
      `}
      onClick={handleClose}
    >
      <div className={`
          bg-white rounded-lg p-6 max-w-md w-full mx-4
          transition-all duration-300 ease-in-out spacialMask-inner
          ${isClosing ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}
          transform
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
            <X className="h-6 w-6 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer" onClick={handleClose}/>
        </div>
        <div className="mb-4">
          {children}
        </div>
        {showConfirmButton && (
          <button
            onClick={handleConfirm}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {confirmText}
          </button>
        )}
      </div>
    </div>
  );
} 