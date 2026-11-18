import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import {
  User,
  X,
  Shield,
  Smartphone,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
  FileText,
  Mail,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
}) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [identityNumber, setIdentityNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setActiveTab(initialTab);
    setStep('form');
    setErrorMessage(null);
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d]/g, '').slice(0, 11);
    setIdentityNumber(val);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d]/g, '').slice(0, 11);
    setPhone(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (identityNumber.length < 10) {
      setErrorMessage(
        isTr
          ? 'Lütfen geçerli bir T.C. Kimlik (11 hane) veya Vergi No (10 hane) giriniz.'
          : 'Please enter a valid National ID (11 digits) or Tax ID (10 digits).'
      );
      return;
    }

    if (phone.length < 10) {
      setErrorMessage(
        isTr
          ? 'Lütfen geçerli bir cep telefonu numarası giriniz (05xx...).'
          : 'Please enter a valid mobile phone number.'
      );
      return;
    }

    if (activeTab === 'register' && !kvkkAccepted) {
      setErrorMessage(
        isTr
          ? 'Devam etmek için KVKK Aydınlatma Metnini onaylamanız gerekmektedir.'
          : 'Please accept the privacy policy to continue.'
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setErrorMessage(
        isTr ? 'Lütfen 4 haneli SMS kodunu giriniz.' : 'Please enter the 4-digit SMS code.'
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-10"
      >
        {/* Üst Başlık Şeridi */}
        <div className="bg-[#00357B] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 id="auth-modal-title" className="text-base font-extrabold tracking-tight">
                {isTr ? '13 Sigorta Müşteri Paneli' : '13 Insurance Customer Portal'}
              </h3>
              <p className="text-[11px] text-blue-100/90 mt-0.5">
                {isTr ? 'Poliçe ve tekliflerinizi anında takip edin' : 'Track your policies and quotes'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-white/80 hover:bg-white/15 hover:text-white transition-colors"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Butonları */}
        {step === 'form' && (
          <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-[#00357B] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isTr ? 'Giriş Yap' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-[#00357B] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isTr ? 'Üye Ol' : 'Sign Up'}
            </button>
          </div>
        )}

        {/* Modal Gövdesi */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTr ? 'Ad Soyad' : 'Full Name'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Örn: Ahmet Yılmaz"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-[#00357B] focus:outline-none"
                  />
                </div>
              )}

              {/* T.C. Kimlik / Vergi No */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isTr ? 'T.C. Kimlik / Vergi No' : 'National ID / Tax Number'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    ref={firstInputRef}
                    type="text"
                    required
                    maxLength={11}
                    value={identityNumber}
                    onChange={handleIdChange}
                    placeholder={isTr ? '11 Haneli T.C. Kimlik veya Vergi No' : '11-digit National ID'}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 py-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:border-[#00357B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Cep Telefonu */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isTr ? 'Cep Telefonu' : 'Mobile Phone'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="05xx xxx xx xx"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 py-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:border-[#00357B] focus:outline-none"
                  />
                </div>
              </div>

              {activeTab === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTr ? 'E-Posta Adresi' : 'Email Address'}{' '}
                    <span className="text-slate-400 font-normal">({isTr ? 'İsteğe bağlı' : 'Optional'})</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@alanadi.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-[#00357B] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'login' ? (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-[#00357B] focus:ring-[#00357B]"
                    />
                    <span>{isTr ? 'Beni Hatırla' : 'Remember me'}</span>
                  </label>
                  <span className="text-[11px] text-[#00357B] font-semibold">
                    {isTr ? 'SMS ile Güvenli Giriş' : 'Secure SMS Login'}
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="auth-kvkk"
                    required
                    checked={kvkkAccepted}
                    onChange={(e) => setKvkkAccepted(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#00357B] focus:ring-[#00357B]"
                  />
                  <label htmlFor="auth-kvkk" className="text-[11px] text-slate-600 leading-tight">
                    <a
                      href="/cerez-politikasi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00357B] underline font-bold"
                    >
                      {isTr ? 'KVKK Aydınlatma Metni' : 'Privacy Policy'}
                    </a>
                    {isTr
                      ? '\'ni okudum, müşteri hesabımın oluşturulmasını onaylıyorum.'
                      : ' I have read and agree to customer registration.'}{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#00357B] py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#00224f] active:scale-[0.99] disabled:opacity-60 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{isTr ? 'Doğrulanıyor...' : 'Verifying...'}</span>
                  </>
                ) : (
                  <>
                    <span>
                      {activeTab === 'login'
                        ? isTr
                          ? 'Poliçe ve Tekliflerimi Gör'
                          : 'View My Policies & Quotes'
                        : isTr
                        ? 'Müşteri Hesabı Oluştur'
                        : 'Create Customer Account'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf1fa] text-[#00357B] mb-2">
                  <Lock className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {isTr ? 'SMS Doğrulama Kodu' : 'SMS Verification Code'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {isTr
                    ? `${phone} numaralı telefonunuza gönderilen 4 haneli güvenlik kodunu giriniz.`
                    : `Enter the 4-digit code sent to ${phone}.`}
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={4}
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="1234"
                  className="w-full text-center tracking-[0.5em] text-xl font-bold font-mono rounded-xl border border-slate-300 bg-slate-50 py-3 text-slate-900 focus:bg-white focus:border-[#00357B] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00357B] py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#00224f] transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{isTr ? 'Giriş Yapılıyor...' : 'Signing In...'}</span>
                  </>
                ) : (
                  <span>{isTr ? 'Kodu Onayla ve Giriş Yap' : 'Verify & Continue'}</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-full text-center text-xs text-slate-500 hover:text-[#00357B] underline font-medium pt-1"
              >
                {isTr ? 'Numarayı Değiştir' : 'Change Phone Number'}
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-4 space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {isTr ? 'Müşteri Girişi Başarılı' : 'Login Successful'}
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                {isTr
                  ? 'Hoş geldiniz! Poliçeleriniz ve aktif teklif talepleriniz acente panelinize bağlandı.'
                  : 'Welcome! Your policies and active quotes have been synced with your agent portal.'}
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-xl bg-[#00357B] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#00224f]"
                >
                  {isTr ? 'Siteye Devam Et' : 'Continue to Site'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Alt Güvenlik Bandı */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium text-slate-600">
            <Shield className="h-3.5 w-3.5 text-emerald-600" />
            <span>256-Bit SSL Şifreleme</span>
          </span>
          <span className="text-[#00357B] font-bold">13 Sigorta Portalı</span>
        </div>
      </div>
    </div>
  );
};
