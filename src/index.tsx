import * as React from 'react';

interface ISlotContext {
  add(name: string, setContent: (v: React.ReactNode) => void);
  remove(name: string);
  setView(name: string, view: React.ReactNode): boolean;
}
const SlotContext = React.createContext<ISlotContext>(null);

class SlotContoller implements ISlotContext {
  slots = {};
  pendingViews = {};
  parentContext: ISlotContext;

  constructor(parentContext?: ISlotContext) {
    this.parentContext = parentContext;
  }

  add(name: string, setContent: (v: React.ReactNode) => void) {
    this.slots[name] = setContent;
    if (this.pendingViews[name]) {
      const view = this.pendingViews[name];
      delete this.pendingViews[name];
      this.setView(name, view);
    }
  }

  remove(name: string) {
    delete this.slots[name];
  }

  setView(name: string, view: React.ReactNode) {
    if (this.slots[name]) {
      this.slots[name](view);
      return true;
    }
    if (this.parentContext) {
      return this.parentContext.setView(name, view);
    }
    this.pendingViews[name] = view;
    return false;
  }
}

export function SlotsContainer({ children }) {
  const parentContext = React.useContext(SlotContext);
  const [ctrl] = React.useState(() => new SlotContoller(parentContext));

  return <SlotContext.Provider value={ctrl}>
    {children}
  </SlotContext.Provider>
}

export function Slot({ name }) {
  const [view, setView] = React.useState(null);
  const context = React.useContext(SlotContext);

  React.useMemo(
    () => {
      context.add(name, setView);
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
      context.setView(name, children);
    },
    [name, children]);

  return null;
}
