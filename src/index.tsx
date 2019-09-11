import * as React from 'react';

type ContentSetter = (view: React.ReactNode) => void;
type ContentSetterCallback = (setter: ContentSetter) => void;
type Dictionary<TValue> = {
  [idx: string]: TValue[];
};

interface ISlotContext {
  add(name: string, setContent: ContentSetter): () => void;
  setView(name: string, view: React.ReactNode): boolean;
  subscribe(name: string, callback: ContentSetterCallback): () => void;
}

const SlotContext = React.createContext<ISlotContext>(null);

class SlotContoller implements ISlotContext {
  slots: Dictionary<ContentSetter>;
  subscribers: Dictionary<ContentSetterCallback>;
  parentContext: ISlotContext;

  constructor(parentContext?: ISlotContext) {
    this.parentContext = parentContext;
    this.slots = {};
    this.subscribers = {};
  }

  add(name: string, setContent: ContentSetter) {
    this.slots[name] = this.slots[name] || [];
    this.slots[name] = [...this.slots[name], setContent];

    if (this.subscribers[name]) {
      for (const s of this.subscribers[name]) {
        s(setContent);
      }
    }

    return () => {
      this.slots[name] = this.slots[name].filter(s => s !== setContent);
    };
  }

  subscribe(name: string, callback: ContentSetterCallback) {
    this.subscribers[name] = this.subscribers[name] || [];
    this.subscribers[name] = [...this.subscribers[name], callback];

    return () => {
      this.subscribers[name] = this.subscribers[name].filter(e => e !== callback);
    };

  }

  setView(name: string, view: React.ReactNode) {

    if (this.slots[name]) {
      this.slots[name].forEach(slot => slot(view));
      return true;
    }
    if (this.parentContext) {
      return this.parentContext.setView(name, view);
    }
    return false;
  }
}

export function SlotsContainer({ children }) {
  const parentContext = React.useContext(SlotContext);
  const [ctrl] = React.useState(() => new SlotContoller(parentContext));

  return <SlotContext.Provider value={ctrl}>
    {children}
  </SlotContext.Provider>;
}

export function Slot({ name }) {
  const [view, setView] = React.useState(null);
  const context = React.useContext(SlotContext);

  React.useEffect(
    () => {
      return context.add(name, setView);
    },
    [context]);

  return (
    view
  );
}

export function SlotContent({ name, children }) {
  const context = React.useContext(SlotContext);

  React.useEffect(
    () => {
      context.setView(name, () => children);
      return context.subscribe(name, (setContent) => {
        setContent(children);
      });
    },
    [name, children]);

  return null;
}
