import { events } from "./events";
import { customEvents } from "./customEvents";
import { syncEvents } from "./syncEvents";
import { periodSyncEvents } from "./periodSyncEvents";
import { useEffect, useState } from "react";

export default class PWA {
  public registration: ServiceWorkerRegistration;
  public customEvents: PWACustomEvents = customEvents;
  public syncEvents: PWASyncEvents = syncEvents;
  public periodSyncEvents: PWAPeriodSyncEvents = periodSyncEvents;

  public constructor(registration: ServiceWorkerRegistration) {
    this.registration = registration;
  }

  public emit<T>(event: string, data: T) {
    const customEvent = new CustomEvent<T>(event, { detail: data });
    console.info("Dispatch event", customEvent);
    window.dispatchEvent(customEvent);
  }

  public onSuccess(registration: ServiceWorkerRegistration) {
    events.onSuccess(registration);
  }

  public onUpdate(registration: ServiceWorkerRegistration) {
    events.onUpdate(registration);
  }
}

export const ServiceWorkerActiveEvent = "ServiceWorkerActiveEvent";

export const usePWA = () => {
  const [pwa, setPWA] = useState<PWA | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [events, setEvents] = useState<Array<{ eventName: string; data: any }>>([]);

  function dispatch<T>(eventName: string, data: T) {
    setEvents(state => [...state, { eventName, data }]);
  }

  useEffect(() => {
    const onSWActive = async () => {
      const reg = await navigator.serviceWorker.ready;
      setPWA(new PWA(reg));
      setRegistration(reg);
    };

    window.addEventListener(ServiceWorkerActiveEvent, onSWActive);
    return window.removeEventListener(ServiceWorkerActiveEvent, onSWActive);
  });

  useEffect(() => {
    if (registration && pwa) {
      let event = events.find((e, i) => i === 0);
      if (event) {
        pwa.emit(event.eventName, event.data);
        setEvents(state => state.filter(e => e.eventName !== event?.eventName));
      }
    }
  }, [registration, pwa, events, setEvents]);

  return { pwa, registration, dispatch };
};

export type PWACustomEvents = {
  [k: string]: (registration: ServiceWorkerRegistration, data: any) => Promise<void>;
};

export type PWASyncEvents = {
  [k: string]: {
    onSupported: (self: ServiceWorkerGlobalScope, syncEvent: any, data: any) => Promise<void>;
    onNotSupported: (registration: ServiceWorkerRegistration, data: any) => Promise<void>;
  };
};

export type PWAPeriodSyncEvents = {
  [k: string]: {
    minInterval: number;
    onSupported: (self: ServiceWorkerGlobalScope, syncEvent: any) => Promise<void>;
    onNotSupported: (registration: ServiceWorkerRegistration) => Promise<void>;
  };
};

export type PWAEvents = {
  onSuccess: (registration: ServiceWorkerRegistration) => void;
  onUpdate: (registration: ServiceWorkerRegistration) => void;
};
