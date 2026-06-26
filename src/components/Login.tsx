import React, { useState } from 'react';
import { Personnel } from '../types';
import { ShieldCheck, Mail, AlertCircle, ChevronRight, HelpCircle, ExternalLink } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface LoginProps {
  personnelList: Personnel[];
  onLoginSuccess: (user: Personnel) => void;
}

const GoogleIcon = () => (
  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export default function Login({ personnelList, onLoginSuccess }: LoginProps) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [iframeWarning, setIframeWarning] = useState(false);

  // Trigger Real Google Authentication
  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setIsAuthenticating(true);
    setIframeWarning(false);

    try {
      // Use Firebase Auth Provider to sign in via popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user.email) {
        throw new Error('Không thể lấy địa chỉ email từ tài khoản Google của bạn.');
      }

      const googleEmail = user.email.toLowerCase();
      
      // Match with authorized media roster
      const matchedUser = personnelList.find(p => p.email?.toLowerCase() === googleEmail);

      if (!matchedUser) {
        setError(`Email Google [ ${googleEmail} ] chưa được cấp quyền truy cập hệ thống. Vui lòng liên hệ Trưởng phòng Hồ Văn An.`);
        setIsAuthenticating(false);
        return;
      }

      setSuccess(`Đăng nhập thành công! Xin chào ${matchedUser.name}`);
      setTimeout(() => {
        onLoginSuccess(matchedUser);
      }, 800);

    } catch (err: any) {
      console.error('Firebase Google Auth error:', err);
      setIsAuthenticating(false);

      // Handle common blockages / iframe constraints
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
        setError('Popup đăng nhập bị chặn hoặc bị hủy bởi trình duyệt.');
        setIframeWarning(true);
      } else if (err.code === 'auth/internal-error' || err.message?.includes('iframe')) {
        setError('Lỗi kết nối xác thực bên trong môi trường iFrame.');
        setIframeWarning(true);
      } else {
        setError(err.message || 'Có lỗi xảy ra trong quá trình đăng nhập Google Auth.');
      }
    }
  };

  // Helper to open the app in a new tab if iframe auth fails
  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4 relative">
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-amber-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-red-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <img 
            src="https://mkt.fugalo.vn/logo-banner.png" 
            alt="Fugalo Logo Banner" 
            className="h-20 sm:h-24 object-contain drop-shadow-md transition-transform hover:scale-105 duration-300"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // fallback to logo stamp if banner fails
              e.currentTarget.src = "https://mkt.fugalo.vn/logo-stamp.png";
            }}
          />
        </div>
        <h2 className="mt-2 text-center text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
          <span className="bg-gradient-to-r from-red-800 via-amber-700 to-amber-900 bg-clip-text text-transparent">
            Hệ Thống Bảo Mật & Đánh Giá KPIs
          </span>
        </h2>
        <p className="mt-1.5 text-center text-xs sm:text-sm text-slate-500 font-medium">
          Team Marketing — Công ty <span className="font-semibold text-red-800">Fugalo</span> & <span className="font-semibold text-amber-700">Anh Long</span>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl border border-slate-200/80 sm:px-10 space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold flex items-start gap-2">
              <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-green-500" />
              <span className="leading-relaxed">{success}</span>
            </div>
          )}

          {/* Core Interactive Section */}
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-ping"></span>
                Xác Thực Google Auth
              </span>
              <p className="text-xs text-slate-500 leading-relaxed px-2">
                Để bảo vệ an toàn thông tin quỹ lương, cơ cấu thưởng và KPIs bảo mật, vui lòng đăng nhập bằng đúng Gmail của bạn trong danh sách nhân sự.
              </p>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isAuthenticating}
              className="w-full flex justify-center items-center gap-3 py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-amber-400 rounded-xl shadow-xs text-sm font-bold text-slate-700 transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-amber-500/20 outline-none"
            >
              {isAuthenticating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Đang liên kết Google Auth...</span>
                </>
              ) : (
                <>
                  <GoogleIcon />
                  <span>Đăng nhập bằng Google (Gmail)</span>
                </>
              )}
            </button>

            {/* Iframe Warning / Guide (Extremely helpful for preview tab) */}
            {iframeWarning && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex gap-2">
                  <HelpCircle className="h-4.5 w-4.5 shrink-0 text-amber-600" />
                  <p className="text-xs font-semibold text-amber-800 leading-relaxed">
                    Môi trường xem trước (iFrame) có thể chặn các cửa sổ phụ của Google Auth để bảo mật.
                  </p>
                </div>
                <button
                  onClick={handleOpenNewTab}
                  className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>Mở trong Tab Mới để đăng nhập</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>



        </div>
      </div>
    </div>
  );
}
