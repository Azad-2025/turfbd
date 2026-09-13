import React, { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
  }>;
}

export default function InstallPWA() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handler
    );

    window.addEventListener(
      "appinstalled",
      () => {
        setInstalled(true);
      }
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler
      );
    };
  }, []);

  if (installed || !installPrompt) {
    return null;
  }

  const installApp = async () => {
    await installPrompt.prompt();

    const result = await installPrompt.userChoice;

    if (result.outcome === "accepted") {
      console.log("TurfBD installed");
    }

    setInstallPrompt(null);
  };

  return (
    <button
      onClick={installApp}
      className="
      fixed bottom-5 right-5
      bg-green-600
      text-white
      px-5 py-3
      rounded-full
      shadow-lg
      font-bold
      z-50
      "
    >
      📱 Install TurfBD App
    </button>
  );
}