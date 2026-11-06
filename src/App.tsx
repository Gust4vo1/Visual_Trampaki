import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ViewMode, SyncMessage } from './types/presentation';
import { SCENES_CONFIG, TOTAL_DURATION_SECONDS } from './data/presentationData';
import { AudienceView } from './components/AudienceView';
import { PresenterView } from './components/PresenterView';
import { ModeToolbar } from './components/ModeToolbar';
import { HelpModal } from './components/HelpModal';
import { PilotModal } from './components/PilotModal';

export default function App() {
  // Mode detection from URL
  const initialMode = (() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('presenter')) return 'presenter';
    if (params.has('preview')) return 'preview';
    return 'audience';
  })();

  const [mode, setMode] = useState<ViewMode>(initialMode);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  // Presentation Timer states
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [elapsedTotalSeconds, setElapsedTotalSeconds] = useState(0);
  const [sceneElapsedSeconds, setSceneElapsedSeconds] = useState(0);

  // Sync state with audience window
  const [isAudienceConnected, setIsAudienceConnected] = useState(false);
  const lastAudiencePongRef = useRef(Date.now());
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Modals & Toasts
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPilotModalOpen, setIsPilotModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4500);
  }, []);

  // Broadcast navigation
  const broadcastSync = useCallback((message: SyncMessage) => {
    if (channelRef.current && mode !== 'preview') {
      try {
        channelRef.current.postMessage(message);
      } catch (e) {
        console.warn('Sync broadcast warning:', e);
      }
    }
  }, [mode]);

  const goToScene = useCallback((index: number, broadcast = true) => {
    if (index < 0 || index >= SCENES_CONFIG.length) return;
    setCurrentSceneIndex(index);
    setSceneElapsedSeconds(0);
    if (broadcast) {
      broadcastSync({
        type: 'NAVIGATE',
        scene: index,
        timestamp: Date.now()
      });
    }
  }, [broadcastSync]);

  const nextScene = useCallback(() => {
    goToScene(currentSceneIndex + 1, true);
  }, [currentSceneIndex, goToScene]);

  const prevScene = useCallback(() => {
    goToScene(currentSceneIndex - 1, true);
  }, [currentSceneIndex, goToScene]);

  const resetPresentation = useCallback(() => {
    setElapsedTotalSeconds(0);
    setSceneElapsedSeconds(0);
    setIsTimerRunning(true);
    goToScene(0, true);
  }, [goToScene]);

  const toggleTimer = useCallback(() => {
    setIsTimerRunning(prev => {
      const nextState = !prev;
      broadcastSync({
        type: 'TIMER_STATE',
        timerRunning: nextState,
        timestamp: Date.now()
      });
      return nextState;
    });
  }, [broadcastSync]);

  // Set up BroadcastChannel
  useEffect(() => {
    let ch: BroadcastChannel | null = null;
    try {
      ch = new BroadcastChannel('trampaki_pitch_sync');
      channelRef.current = ch;

      ch.onmessage = (event: MessageEvent<SyncMessage>) => {
        const data = event.data;
        if (!data) return;

        if (data.type === 'NAVIGATE' && typeof data.scene === 'number') {
          setCurrentSceneIndex(data.scene);
          setSceneElapsedSeconds(0);
        } else if (data.type === 'PING') {
          ch?.postMessage({ type: 'PONG', timestamp: Date.now() });
        } else if (data.type === 'PONG') {
          lastAudiencePongRef.current = Date.now();
          setIsAudienceConnected(true);
        } else if (data.type === 'TIMER_STATE' && typeof data.timerRunning === 'boolean') {
          setIsTimerRunning(data.timerRunning);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported in this context:', e);
    }

    return () => {
      ch?.close();
    };
  }, []);

  // Heartbeat ping interval for Presenter Mode
  useEffect(() => {
    if (mode !== 'presenter') return;

    const pingInterval = setInterval(() => {
      broadcastSync({ type: 'PING', timestamp: Date.now() });
      const diff = Date.now() - lastAudiencePongRef.current;
      setIsAudienceConnected(diff <= 3500);
    }, 2000);

    return () => clearInterval(pingInterval);
  }, [mode, broadcastSync]);

  // Timer tick
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setElapsedTotalSeconds(prev => prev + 1);
      setSceneElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input is focused inside a modal
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Escape') {
        setIsHelpOpen(false);
        setIsPilotModalOpen(false);
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault();
          nextScene();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevScene();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          setMode(prev => (prev === 'audience' ? 'presenter' : 'audience'));
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 't':
        case 'T':
          e.preventDefault();
          toggleTimer();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          resetPresentation();
          break;
        case '?':
          e.preventDefault();
          setIsHelpOpen(prev => !prev);
          break;
        default:
          // Keys 1 to 8 to jump directly
          if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(e.key)) {
            const idx = parseInt(e.key, 10) - 1;
            goToScene(idx, true);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextScene, prevScene, toggleTimer, resetPresentation, goToScene]);

  // Touch swipe support for mobile/tablets
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.changedTouches[0].screenX;
      startY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].screenX - startX;
      const dy = e.changedTouches[0].screenY - startY;

      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) nextScene();
        else prevScene();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextScene, prevScene]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const openPresenterWindow = () => {
    const url = new URL(window.location.href);
    url.search = '?presenter';
    window.open(url.toString(), 'TrampakiPresenterConsole', 'width=1280,height=850,menubar=no,toolbar=no,location=no');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a0c]">
      {/* Top Floating Toolbar (hidden in preview mode) */}
      {mode !== 'preview' && (
        <ModeToolbar
          currentMode={mode}
          onSetMode={setMode}
          onOpenPresenterWindow={openPresenterWindow}
          onToggleFullscreen={toggleFullscreen}
          onOpenHelp={() => setIsHelpOpen(true)}
        />
      )}

      {/* Main View Router */}
      {mode === 'presenter' ? (
        <PresenterView
          currentSceneIndex={currentSceneIndex}
          onGoToScene={idx => goToScene(idx, true)}
          onNextScene={nextScene}
          onPrevScene={prevScene}
          onResetPresentation={resetPresentation}
          elapsedTotalSeconds={elapsedTotalSeconds}
          sceneElapsedSeconds={sceneElapsedSeconds}
          isTimerRunning={isTimerRunning}
          onToggleTimer={toggleTimer}
          isAudienceConnected={isAudienceConnected}
          onOpenHelp={() => setIsHelpOpen(true)}
          onSwitchToAudience={() => setMode('audience')}
          onOpenPilotModal={() => setIsPilotModalOpen(true)}
        />
      ) : (
        <AudienceView
          currentSceneIndex={currentSceneIndex}
          onOpenPilotModal={() => setIsPilotModalOpen(true)}
          isPreview={mode === 'preview'}
        />
      )}

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Pilot Application Modal */}
      <PilotModal
        isOpen={isPilotModalOpen}
        onClose={() => setIsPilotModalOpen(false)}
        onSubmittedToast={() =>
          showToast('✓ Piloto solicitado com sucesso! Nossa equipe do Trampaki entrará em contato hoje.')
        }
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#11131a] text-white px-6 py-3.5 rounded-full border border-[#ff2d7a] shadow-[0_10px_40px_rgba(0,0,0,0.85)] font-mono text-xs sm:text-sm flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
