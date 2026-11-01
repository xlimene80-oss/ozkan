import { useState, useEffect, useCallback } from 'react';

// Tarayıcının yerel beforeinstallprompt olayını anında yakala
let globalDeferredPrompt: any = null;
const promptListeners = new Set<(prompt: any) => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Tarayıcının varsayılan bildirimini durdur ve referansı sakla
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
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Zaten ana ekrandan uygulama olarak mı açılmış?
    const checkStandalone = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(Boolean(standalone));
    };

    checkStandalone();

    // 2. Apple iOS / iPadOS cihaz tespiti
    const ua = window.navigator.userAgent.toLowerCase();
    const isApple =
      /iphone|ipad|ipod/.test(ua) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    setIsIos(Boolean(isApple));

    // 3. Prompt olay dinleyicisi
    const onPromptChange = (prompt: any) => {
      setDeferredPrompt(prompt);
    };

    promptListeners.add(onPromptChange);

    return () => {
      promptListeners.delete(onPromptChange);
    };
  }, []);

  // Butona tıklandığında çalışan güvenli PWA tetikleyici (Sıfır dosya indirme, %100 yerel)
  const triggerInstall = useCallback(async () => {
    // Zaten yüklü ise bir şey yapma
    if (isStandalone) {
      return;
    }

    // iOS cihazlarda Safari yerel rehber popup'ını aç
    if (isIos) {
      setShowModal(true);
      return;
    }

    // Android veya Chromium tarayıcılarda resmi PWA istemcisini aç
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          globalDeferredPrompt = null;
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('[PWA] Prompt tetikleme hatası:', err);
      }
      return;
    }

    // Tarayıcı otomatik prompt vermediyse rehber modalını aç
    setShowModal(true);
  }, [isStandalone, isIos, deferredPrompt]);

  return {
    isInstallable: !isStandalone,
    isStandalone,
    isIos,
    hasNativePrompt: Boolean(deferredPrompt),
    showModal,
    setShowModal,
    triggerInstall,
  };
}
