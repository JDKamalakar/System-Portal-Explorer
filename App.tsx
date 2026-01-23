import React, { useState, useEffect, useCallback, useRef } from 'react';
import PortalCard from './components/PortalCard';
import { PortalFeature, SystemStatus } from './types';

const features: PortalFeature[] = [
  { id: 'folder', name: 'Folder Picker', description: 'Select an entire directory.', icon: 'fa-solid fa-folder-tree', color: 'bg-teal-600' },
  { id: 'archive', name: 'Archive Only', description: 'Select compressed archive files.', icon: 'fa-solid fa-file-zipper', color: 'bg-amber-600' },
  { id: 'image', name: 'Image Picker', description: 'Select image files only.', icon: 'fa-solid fa-image', color: 'bg-rose-600' },
  { id: 'video', name: 'Video Picker', description: 'Select video files only.', icon: 'fa-solid fa-film', color: 'bg-red-600' },
  { id: 'audio', name: 'Audio Picker', description: 'Select audio files only.', icon: 'fa-solid fa-music', color: 'bg-violet-600' },
  { id: 'app-selector', name: 'App Selector', description: 'Select an executable application.', icon: 'fa-solid fa-window-maximize', color: 'bg-blue-700' },
  { id: 'app-list', name: 'App List', description: 'Request list of installed applications.', icon: 'fa-solid fa-list-check', color: 'bg-indigo-700' },
  { id: 'camera', name: 'Media Portal', description: 'Request access to camera/microphone systems.', icon: 'fa-solid fa-camera', color: 'bg-emerald-500' },
  { id: 'screen-share', name: 'Screen Share', description: 'Start screen sharing session.', icon: 'fa-solid fa-display', color: 'bg-purple-600' },
  { id: 'screen-record', name: 'Screen Record', description: 'Record screen activity.', icon: 'fa-solid fa-video', color: 'bg-red-700' },
  { id: 'download', name: 'Download File', description: 'Trigger a file download.', icon: 'fa-solid fa-download', color: 'bg-green-600' },
  { id: 'device', name: 'Select Device', description: 'Connect to a USB/HID device.', icon: 'fa-solid fa-keyboard', color: 'bg-slate-600' },
  { id: 'notification', name: 'Notification Portal', description: 'Trigger a system-level desktop notification.', icon: 'fa-solid fa-bell', color: 'bg-amber-500' },
  { id: 'location', name: 'Geo Portal', description: 'Bridge to the system GPS/location daemon.', icon: 'fa-solid fa-location-dot', color: 'bg-rose-500' },
  { id: 'share', name: 'Web Share', description: 'Trigger the OS-native sharing sheet.', icon: 'fa-solid fa-share-nodes', color: 'bg-indigo-500' },
  { id: 'clipboard', name: 'Clipboard Portal', description: 'Intervene with the system clipboard.', icon: 'fa-solid fa-clipboard', color: 'bg-cyan-500' },
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
  const [status, setStatus] = useState<SystemStatus>({ online: navigator.onLine, battery: null, memory: null });
  const [log, setLog] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Replaced generic fileInputRef with dynamic handling

  const addLog = (msg: string) => {
    setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  useEffect(() => {
    const handleOnline = () => setStatus(prev => ({ ...prev, online: true }));
    const handleOffline = () => setStatus(prev => ({ ...prev, online: false }));
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

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

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerFilePortal = (options: { accept?: string; directory?: boolean } = {}) => {
    const input = document.createElement('input');
    input.type = 'file';
    if (options.accept) input.accept = options.accept;
    if (options.directory) {
      input.setAttribute('webkitdirectory', '');
      input.setAttribute('directory', '');
    }

    input.onchange = (e: any) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        if (options.directory) {
          addLog(`Folder Selected: ${files.length} files in directory.`);
        } else {
          addLog(`File Selected: ${files[0].name} (${(files[0].size / 1024).toFixed(1)} KB)`);
        }
      }
    };
    input.click();
  };

  const triggerAppList = async () => {
    addLog("Requesting installed application list...");
    await new Promise(r => setTimeout(r, 800));
    addLog("Reading /usr/local/bin...");
    await new Promise(r => setTimeout(r, 600));
    const apps = ['Firefox', 'Terminal', 'Files', 'Code', 'Spotify', 'Discord'];
    addLog(`Found ${apps.length} applications: ${apps.join(', ')}`);
  };

  const triggerScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      addLog("Screen recording started...");
      // Simulate recording
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        addLog("Screen recording stopped (Simulated).");
      }, 3000);
    } catch (err: any) {
      addLog(`Recording denied: ${err.message}`);
    }
  };

  const triggerDownload = () => {
    const blob = new Blob(["System Portal Test File"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portal_test_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addLog("Download triggered.");
  };

  const triggerDeviceSelect = async () => {
    if ('hid' in navigator) {
      try {
        const devices = await (navigator as any).hid.requestDevice({ filters: [] });
        if (devices.length > 0) addLog(`Device selected: ${devices[0].productName}`);
        else addLog("No device selected.");
      } catch (err: any) {
        addLog(`Device selection failed: ${err.message}`);
      }
    } else {
      addLog("HID API not supported, simulating device picker...");
      await new Promise(r => setTimeout(r, 1000));
      addLog("Device 'Generic USB Controller' selected.");
    }
  };

  const triggerPortal = useCallback(async (id: string) => {
    setActivePortal(id);
    addLog(`Initiating ${id} portal...`);

    try {
      switch (id) {
        case 'file':
          triggerFilePortal();
          break;
        case 'folder':
          triggerFilePortal({ directory: true });
          break;
        case 'archive':
          triggerFilePortal({ accept: '.zip,.rar,.7z,.tar,.gz,.bz2' });
          break;
        case 'image':
          triggerFilePortal({ accept: 'image/*' });
          break;
        case 'video':
          triggerFilePortal({ accept: 'video/*' });
          break;
        case 'audio':
          triggerFilePortal({ accept: 'audio/*' });
          break;
        case 'app-selector':
          triggerFilePortal({ accept: '.exe,.app,.sh,.deb,.rpm,.apk' });
          break;
        case 'app-list':
          triggerAppList();
          break;
        case 'screen-share':
        case 'screen':
          try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play();
            }
            addLog("Screen sharing active.");
          } catch (err: any) { addLog(`Share denied: ${err.message}`); }
          break;
        case 'screen-record':
          triggerScreenRecording();
          break;
        case 'download':
          triggerDownload();
          break;
        case 'device':
          triggerDeviceSelect();
          break;
        case 'camera':
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          addLog("System media stream active.");
          break;
        case 'notification':
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            new Notification("Bridge Active", { body: "Portal trigger successful!" });
            addLog("Notification sent to OS.");
          }
          break;
        case 'location':
          navigator.geolocation.getCurrentPosition(
            (pos) => addLog(`Geo Bridge: ${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`),
            (err) => addLog(`Geo Error: ${err.message}`)
          );
          break;
        case 'share':
          if (navigator.share) {
            await navigator.share({ title: 'Portal Nexus', text: 'Testing OS Bridges', url: window.location.href });
            addLog("Share sheet closed.");
          }
          break;
        case 'clipboard':
          await navigator.clipboard.writeText("Nexus Bridge Data: " + Date.now());
          addLog("Clipboard updated.");
          break;
        case 'vibration':
          if (navigator.vibrate) navigator.vibrate([100, 30, 100]);
          addLog("Haptic pulse sent.");
          break;
        case 'eyedropper':
          if ('EyeDropper' in window) {
            const result = await new (window as any).EyeDropper().open();
            addLog(`Picked: ${result.sRGBHex}`);
          }
          break;
        case 'print':
          window.print();
          break;
        default:
          addLog(`Portal ${id} triggered (Action placeholder)`);
          break;
      }
    } catch (err: any) {
      addLog(`Portal error: ${err.name}`);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">

      <main className="p-6 lg:p-12 max-w-[1600px] mx-auto w-full">
        {/* Cinematic Header with Elevation */}
        <header className="mb-12 flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-white/[0.03] p-10 rounded-[3rem] border border-white/10 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.4)] transition-all hover:shadow-blue-500/[0.05] hover:border-white/20">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 rounded-full text-[11px] font-black tracking-[0.25em] text-white uppercase shadow-2xl shadow-blue-500/30 animate-pulse">
                Nexus v1.2
              </span>
              <div className="flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-slate-500">
                <div className={`w-3 h-3 rounded-full ${status.online ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                {status.online ? 'SYSTEM_LOCKED' : 'LINK_OFFLINE'}
              </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white mb-6 drop-shadow-2xl">
              Bridge <span className="text-slate-600">Portals</span>
            </h1>
            <p className="text-slate-400 max-w-xl text-xl font-light leading-relaxed">
              Real-time hardware telemetry and native OS bridge diagnostics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-6 bg-black/40 backdrop-blur-3xl px-10 py-5 rounded-3xl border border-white/5 shadow-inner transition-all hover:bg-black/60 hover:-translate-y-1">
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Battery</div>
                <div className="text-2xl font-black text-white">{status.battery?.level.toFixed(0) || '--'}%</div>
              </div>
              <div className="h-12 w-px bg-white/10"></div>
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">RAM</div>
                <div className="text-2xl font-black text-white">{status.memory || '--'}GB</div>
              </div>
            </div>
          </div>
        </header>

        {/* Video Bridge section */}
        <section className="mb-12 group relative">
          <div className="rounded-[3.5rem] overflow-hidden bg-slate-900/50 border border-white/5 aspect-video xl:h-[400px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] transition-all duration-700 hover:shadow-blue-500/10 hover:border-white/10">
            {!videoRef.current?.srcObject ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700">
                <div className="w-24 h-24 rounded-full bg-black/40 flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:bg-black/60 transition-all duration-700">
                  <i className="fa-solid fa-video-slash text-4xl"></i>
                </div>
                <p className="mt-6 text-xs font-black tracking-[0.4em] uppercase opacity-40">Portal_Standby</p>
              </div>
            ) : (
              <video ref={videoRef} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" autoPlay muted playsInline />
            )}
          </div>
        </section>

        {/* Grid with Depth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {features.map(f => (
            <PortalCard
              key={f.id}
              feature={f}
              onClick={() => triggerPortal(f.id)}
              status={activePortal === f.id ? 'ACTIVE' : undefined}
            />
          ))}
        </div>

        {/* Recessed Terminal Console */}
        <div className="bg-slate-900/40 rounded-[3rem] border border-white/5 overflow-hidden shadow-inner backdrop-blur-xl transition-all hover:border-white/10 group">
          <div className="px-10 py-8 bg-white/[0.02] flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/30 group-hover:bg-red-500/80 transition-all"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/30 group-hover:bg-amber-500/80 transition-all"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/30 group-hover:bg-emerald-500/80 transition-all"></div>
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">System_Bridge_Kernel::0.1</h3>
            </div>
            <button
              onClick={() => setLog([])}
              className="text-[10px] font-black text-slate-500 hover:text-white bg-white/5 px-6 py-3 rounded-2xl transition-all active:scale-95 border border-white/5 hover:bg-red-500/20 hover:border-red-500/20"
            >
              PURGE_BUFFER
            </button>
          </div>
          <div className="p-10 h-80 overflow-y-auto font-mono text-xs space-y-4 custom-scrollbar bg-black/20 shadow-inner">
            {log.length === 0 ? (
              <div className="text-slate-700 italic animate-pulse tracking-widest">Awaiting kernel telemetry...</div>
            ) : (
              log.map((entry, i) => (
                <div key={i} className="flex gap-6 border-b border-white/[0.03] pb-4 transition-all hover:bg-white/5 rounded-xl px-4 py-2">
                  <span className={`leading-relaxed ${entry.includes('Error') ? 'text-rose-500' : 'text-emerald-400'}`}>
                    {entry}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;