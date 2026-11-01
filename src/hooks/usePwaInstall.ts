import { useState, useEffect, useCallback } from 'react';

// Global beforeinstallprompt yakalama (sayfa ilk açıldığı anda kaçırmamak için)
let globalDeferredPrompt: any = null;
const promptListeners = new Set<(prompt: any) => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    globalDeferredPrompt = e;
    promptListeners.forEach((fn) => fn(e));
  });

  window.addEventListener('appinstalled', () => {
    globalDeferredPrompt = null;
    promptListeners.forEach((fn) => fn(null));
  });
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(globalDeferredPrompt);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [showIosModal, setShowIosModal] = useState<boolean>(false);
  const [showGenericModal, setShowGenericModal] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Zaten standalone (PWA olarak açılmış) mı?
    const checkStandalone = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(Boolean(standalone));
    };

    checkStandalone();

    // Cihaz tespiti
    const ua = window.navigator.userAgent.toLowerCase();
    const iosDevice =
      /iphone|ipad|ipod/.test(ua) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    setIsIos(Boolean(iosDevice));

    const androidDevice = /android/.test(ua);
    setIsAndroid(Boolean(androidDevice));

    // Prompt dinleyici
    const onPromptChange = (prompt: any) => {
      setDeferredPrompt(prompt);
    };

    promptListeners.add(onPromptChange);

    return () => {
      promptListeners.delete(onPromptChange);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    // 1. Zaten uygulama içindeyse işlem gerekmez
    if (isStandalone) {
      return;
    }

    // 2. iOS Safari ise özel modal aç
    if (isIos) {
      setShowIosModal(true);
      return;
    }

    // 3. Android veya Chrome/Edge üzerinde deferredPrompt mevcutsa
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          globalDeferredPrompt = null;
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.error('PWA prompt error:', err);
      }
      return;
    }

    // 4. DeferredPrompt henüz hazır değilse veya masaüstü/diğer tarayıcı ise rehber modalı aç
    setShowGenericModal(true);
  }, [isStandalone, isIos, deferredPrompt]);

  return {
    isInstallable: !isStandalone, // Zaten yüklü değilse her platformda buton aktif ve erişilebilir
    isStandalone,
    isIos,
    isAndroid,
    hasNativePrompt: Boolean(deferredPrompt),
    showIosModal,
    setShowIosModal,
    showGenericModal,
    setShowGenericModal,
    triggerInstall,
  };
}
