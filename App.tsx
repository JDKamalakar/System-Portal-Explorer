
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PortalCard from './components/PortalCard';
import AIPanel from './components/AIPanel';
import { PortalFeature, SystemStatus } from './types';

const features: PortalFeature[] = [
  { id: 'file', name: 'File Portal', description: 'Trigger the system file selection dialog.', icon: 'fa-solid fa-folder-open', color: 'bg-blue-500' },
  { id: 'fs_open', name: 'File Access API', description: 'Modern fs-access file picker.', icon: 'fa-regular fa-folder-open', color: 'bg-blue-400' },
  { id: 'folder', name: 'Folder Portal', description: 'Access local directory structure.', icon: 'fa-solid fa-folder-tree', color: 'bg-emerald-600' },
  { id: 'folder_legacy', name: 'Legacy Folder', description: 'Standard input directory picker.', icon: 'fa-regular fa-folder', color: 'bg-emerald-700' },
  { id: 'save', name: 'Save Portal', description: 'Trigger system save file dialog.', icon: 'fa-solid fa-floppy-disk', color: 'bg-teal-500' },
  { id: 'camera', name: 'Media Portal', description: 'Request access to camera/microphone systems.', icon: 'fa-solid fa-camera', color: 'bg-emerald-500' },
  { id: 'notification', name: 'Notification Portal', description: 'Trigger a system-level desktop notification.', icon: 'fa-solid fa-bell', color: 'bg-amber-500' },
  { id: 'location', name: 'Geo Portal', description: 'Bridge to the system GPS/location daemon.', icon: 'fa-solid fa-location-dot', color: 'bg-rose-500' },
  { id: 'share', name: 'Web Share', description: 'Trigger the OS-native sharing sheet.', icon: 'fa-solid fa-share-nodes', color: 'bg-indigo-500' },
  { id: 'wakelock', name: 'Wake Lock', description: 'Prevent system display sleep.', icon: 'fa-solid fa-lightbulb', color: 'bg-yellow-400' },
  { id: 'fullscreen', name: 'Fullscreen', description: 'Toggle system fullscreen mode.', icon: 'fa-solid fa-expand', color: 'bg-gray-600' },
  { id: 'badge', name: 'Badge Portal', description: 'Set application icon badge.', icon: 'fa-solid fa-certificate', color: 'bg-red-600' },
  { id: 'clipboard', name: 'Clipboard Portal', description: 'Intervene with the system clipboard.', icon: 'fa-solid fa-clipboard', color: 'bg-cyan-500' },
  { id: 'screen', name: 'Display Capture', description: 'Request permission to capture system windows.', icon: 'fa-solid fa-display', color: 'bg-purple-500' },
  { id: 'vibration', name: 'Haptic Portal', description: 'Trigger hardware vibration feedback.', icon: 'fa-solid fa-mobile-screen', color: 'bg-orange-500' },
  { id: 'contact', name: 'Contact Picker', description: 'Access the native system contact list.', icon: 'fa-solid fa-address-book', color: 'bg-yellow-600' },
  { id: 'bluetooth', name: 'Bluetooth Bridge', description: 'Trigger the system device pairing dialog.', icon: 'fa-brands fa-bluetooth-b', color: 'bg-blue-600' },
  { id: 'usb', name: 'USB Portal', description: 'Request access to system USB hardware.', icon: 'fa-solid fa-usb', color: 'bg-slate-500' },
  { id: 'eyedropper', name: 'Eye Dropper', description: 'Trigger system-level color magnifier/picker.', icon: 'fa-solid fa-eye-dropper', color: 'bg-pink-500' },
  { id: 'print', name: 'Print Dialog', description: 'Open the native OS print settings.', icon: 'fa-solid fa-print', color: 'bg-gray-400' },
  { id: 'fonts', name: 'Local Fonts', description: 'Request permission for local system fonts.', icon: 'fa-solid fa-font', color: 'bg-lime-500' },
];

const App: React.FC = () => {
  const [activePortal, setActivePortal] = useState<string | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [status, setStatus] = useState<SystemStatus>({ online: navigator.onLine, battery: null, memory: null });
  const [log, setLog] = useState<string[]>([]);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => {
    setLog(prev => [msg, ...prev].slice(0, 50));
  };

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setStatus(prev => ({ ...prev, battery: { level: battery.level * 100, charging: battery.charging } }));
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      });
    }
    if ('deviceMemory' in navigator) {
      setStatus(prev => ({ ...prev, memory: (navigator as any).deviceMemory }));
    }
  }, []);

  const triggerPortal = useCallback(async (id: string) => {
    setActivePortal(id);
    addLog(`Initiating ${id} portal trigger...`);

    try {
      switch (id) {
        case 'file':
          fileInputRef.current?.click();
          break;
        case 'fs_open':
          if ('showOpenFilePicker' in window) {
            const [fileHandle] = await (window as any).showOpenFilePicker();
            addLog(`File Access Granted: ${fileHandle.name}`);
          } else {
            addLog("File System Access API (Open) unsupported.");
          }
          break;
        case 'folder_legacy':
          folderInputRef.current?.click();
          break;
        case 'folder':
          if ('showDirectoryPicker' in window) {
            const dirHandle = await (window as any).showDirectoryPicker();
            addLog(`Directory Access Granted: ${dirHandle.name}`);
          } else {
            addLog("File System Access API (Directory) unsupported.");
          }
          break;
        case 'save':
          if ('showSaveFilePicker' in window) {
            const fileHandle = await (window as any).showSaveFilePicker();
            addLog(`Save Target Selected: ${fileHandle.name}`);
          } else {
            addLog("File System Access API (Save) unsupported.");
          }
          break;
        case 'wakelock':
          if ('wakeLock' in navigator) {
            await (navigator as any).wakeLock.request('screen');
            addLog("Screen Wake Lock active.");
          } else {
            addLog("Wake Lock API unsupported.");
          }
          break;
        case 'fullscreen':
          if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
            addLog("Entered Fullscreen Mode.");
          } else {
            await document.exitFullscreen();
            addLog("Exited Fullscreen Mode.");
          }
          break;
        case 'badge':
          if ('setAppBadge' in navigator) {
            const count = Math.floor(Math.random() * 10) + 1;
            await (navigator as any).setAppBadge(count);
            addLog(`App Badge set to ${count}.`);
          } else {
            addLog("App Badging API unsupported.");
          }
          break;
        case 'camera':
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          addLog("System media stream established.");
          break;
        case 'notification':
          if (!("Notification" in window)) {
            addLog("Browser does not support desktop notification.");
          } else {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
              new Notification("System Portal Explorer", { body: "Portal trigger successful!" });
              addLog("System notification triggered.");
            } else {
              addLog("Notification permission denied.");
            }
          }
          break;
        case 'location':
          navigator.geolocation.getCurrentPosition(
            (pos) => addLog(`Location bridged: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
            (err) => addLog(`Location error: ${err.message}`),
            { enableHighAccuracy: true }
          );
          break;
        case 'share':
          if (navigator.share) {
            await navigator.share({ title: 'Portal Explorer', text: 'Testing Web-to-System Portals', url: window.location.href });
            addLog("System share sheet closed.");
          } else {
            addLog("Web Share API not supported.");
          }
          break;
        case 'clipboard':
          await navigator.clipboard.writeText("Portal data copied: " + new Date().toLocaleTimeString());
          addLog("Clipboard updated system-wide.");
          break;
        case 'screen':
          await navigator.mediaDevices.getDisplayMedia({ video: true });
          addLog("Screen capture session requested.");
          break;
        case 'vibration':
          if (navigator.vibrate) {
            navigator.vibrate([100, 30, 100]);
            addLog("Haptic pulse triggered.");
          } else {
            addLog("Vibration not supported.");
          }
          break;
        case 'contact':
          if ('contacts' in navigator && 'ContactsManager' in window) {
            const props = await (navigator as any).contacts.getProperties();
            const contacts = await (navigator as any).contacts.select(props, { multiple: false });
            addLog(`Contacts selected: ${contacts.length}`);
          } else {
            addLog("Contact Picker API unsupported.");
          }
          break;
        case 'bluetooth':
          if ((navigator as any).bluetooth) {
            addLog("Awaiting Bluetooth system dialog...");
            await (navigator as any).bluetooth.requestDevice({ acceptAllDevices: true });
          } else {
            addLog("Web Bluetooth API unsupported.");
          }
          break;
        case 'usb':
          if ((navigator as any).usb) {
            addLog("Awaiting USB device selector...");
            await (navigator as any).usb.requestDevice({ filters: [] });
          } else {
            addLog("Web USB API unsupported.");
          }
          break;
        case 'eyedropper':
          if ('EyeDropper' in window) {
            const eyeDropper = new (window as any).EyeDropper();
            const result = await eyeDropper.open();
            addLog(`Color picked from system: ${result.sRGBHex}`);
          } else {
            addLog("EyeDropper API unsupported.");
          }
          break;
        case 'print':
          addLog("Triggering system print dialog...");
          window.print();
          break;
        case 'fonts':
          if ('queryLocalFonts' in window) {
            const fonts = await (window as any).queryLocalFonts();
            addLog(`Found ${fonts.length} local system fonts.`);
          } else {
            addLog("Local Fonts API unsupported.");
          }
          break;
      }
    } catch (err: any) {
      addLog(`Portal error (${id}): ${err.name || 'Error'}`);
    }
  }, []);

  const testAll = async () => {
    if (isTestingAll) return;
    setIsTestingAll(true);
    addLog("--- STARTING FULL SYSTEM DIAGNOSTIC ---");

    for (const feature of features) {
      addLog(`Sequencing: ${feature.name}...`);
      await triggerPortal(feature.id);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    addLog("--- DIAGNOSTIC COMPLETE ---");
    setIsTestingAll(false);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => addLog(`File selected: ${e.target.files?.[0]?.name}`)}
      />
      <input
        type="file"
        ref={folderInputRef}
        className="hidden"
        {...{ webkitdirectory: "" }}
        onChange={(e) => addLog(`Folder selected (Legacy): ${e.target.files?.length} files`)}
      />

      <main className="p-6 lg:p-12 max-w-[1600px] mx-auto w-full">
        {/* Modern Glass Header */}
        <header className="mb-12 flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-2xl transition-all hover:shadow-blue-500/5">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] text-white uppercase shadow-lg shadow-blue-500/20">
                Nexus v1.2
              </span>
              <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 transition-colors hover:text-slate-300">
                <div className={`w-2.5 h-2.5 rounded-full ${status.online ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-red-500'}`}></div>
                {status.online ? 'SYSTEM_LOCKED' : 'LINK_SEVERED'}
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white mb-4 bg-clip-text">
              Bridge <span className="text-slate-500">Portals</span>
            </h1>
            <p className="text-slate-400 max-w-xl text-lg font-light leading-relaxed">
              Real-time monitoring and triggering of native OS interface bridges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsInspectorOpen(true)}
              className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              <i className="fa-solid fa-microchip text-blue-400 group-hover:rotate-12 transition-transform"></i>
              Inspector
            </button>

            <button
              onClick={testAll}
              disabled={isTestingAll}
              className={`group flex items-center justify-center gap-3 px-10 py-4 rounded-full font-black text-sm tracking-widest uppercase transition-all border ${isTestingAll
                ? 'bg-slate-800 border-slate-700 text-slate-500'
                : 'bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-500 text-white hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-95'
                }`}
            >
              <i className={`fa-solid ${isTestingAll ? 'fa-circle-notch fa-spin' : 'fa-bolt'}`}></i>
              {isTestingAll ? 'Running...' : 'Force Diagnostic'}
            </button>

            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-8 py-4 rounded-full border border-white/5 shadow-inner transition-transform hover:scale-105">
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Battery</div>
                <div className="text-xl font-black text-white">{status.battery?.level.toFixed(0) || '--'}%</div>
              </div>
              <div className="h-10 w-px bg-white/5"></div>
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">RAM</div>
                <div className="text-xl font-black text-white">{status.memory || '--'}GB</div>
              </div>
            </div>
          </div>
        </header>

        {/* Cinematic Video Bridge */}
        <section className="mb-12 group relative">
          <div className="rounded-[3rem] overflow-hidden bg-slate-900 border border-white/5 aspect-video xl:aspect-auto xl:h-[350px] shadow-2xl transition-all duration-700 hover:shadow-blue-500/10">
            {!videoRef.current?.srcObject ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 space-y-4">
                <div className="w-24 h-24 rounded-full bg-black/50 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-700">
                  <i className="fa-solid fa-video-slash text-4xl"></i>
                </div>
                <p className="text-sm font-black tracking-widest uppercase">Portal Standby</p>
              </div>
            ) : (
              <video ref={videoRef} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2000ms]" autoPlay muted playsInline />
            )}

            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              <div className="flex justify-between items-center bg-white/10 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,1)]"></div>
                  <span className="text-xs font-black tracking-widest text-white uppercase font-mono">system.video_bridge_01::ready</span>
                </div>
                {videoRef.current?.srcObject && (
                  <button
                    onClick={() => {
                      (videoRef.current!.srcObject as MediaStream).getTracks().forEach(t => t.stop());
                      videoRef.current!.srcObject = null;
                      addLog("Camera Portal terminated.");
                    }}
                    className="px-6 py-2 bg-red-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-red-400 transition-colors shadow-lg active:scale-90"
                  >
                    Kill Link
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid with Elevations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {features.map(f => (
            <PortalCard
              key={f.id}
              feature={f}
              onClick={() => triggerPortal(f.id)}
              status={activePortal === f.id ? 'ACTIVE' : undefined}
            />
          ))}
        </div>

        {/* Glass Console Terminal */}
        <div className="bg-slate-900/60 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm transition-all hover:border-white/10">
          <div className="px-10 py-6 bg-white/5 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 ml-4">System_Kernel_Log</h3>
            </div>
            <button
              onClick={() => setLog([])}
              className="text-[10px] font-bold text-slate-500 hover:text-white bg-white/5 px-4 py-2 rounded-full transition-all active:scale-90"
            >
              PURGE_BUFF
            </button>
          </div>
          <div className="p-10 h-72 overflow-y-auto font-mono text-sm space-y-3 custom-scrollbar">
            {log.length === 0 ? (
              <div className="text-slate-600 italic animate-pulse">Awaiting kernel interface telemetry...</div>
            ) : (
              log.map((entry, i) => (
                <div key={i} className="group flex gap-6 border-b border-white/5 pb-3 transition-colors hover:bg-white/5 rounded-lg px-2">
                  <span className="text-slate-600 shrink-0 select-none">[{new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}]</span>
                  <span className={`transition-all ${entry.includes('Error') || entry.includes('unsupported')
                    ? 'text-rose-500 font-bold'
                    : entry.includes('---')
                      ? 'text-blue-400 font-black tracking-wider'
                      : 'text-emerald-400'
                    }`}>
                    {entry}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Slide-out AI Panel */}
      <AIPanel
        activePortal={activePortal}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />

      {/* Backdrop for mobile */}
      {isInspectorOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-500"
          onClick={() => setIsInspectorOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
