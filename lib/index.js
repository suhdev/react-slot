"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const SlotContext = React.createContext(null);
class SlotContoller {
    constructor(parentContext) {
        this.parentContext = parentContext;
        this.slots = {};
        this.subscribers = {};
    }
    add(name, setContent) {
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
    subscribe(name, callback) {
        this.subscribers[name] = this.subscribers[name] || [];
        this.subscribers[name] = [...this.subscribers[name], callback];
        return () => {
            this.subscribers[name] = this.subscribers[name].filter(e => e !== callback);
        };
    }
    setView(name, view) {
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
function SlotsContainer({ children }) {
    const parentContext = React.useContext(SlotContext);
    const [ctrl] = React.useState(() => new SlotContoller(parentContext));
    return React.createElement(SlotContext.Provider, { value: ctrl }, children);
}
exports.SlotsContainer = SlotsContainer;
function Slot({ name }) {
    const [view, setView] = React.useState(null);
    const context = React.useContext(SlotContext);
    React.useEffect(() => {
        return context.add(name, setView);
    }, [context]);
    return (view);
}
exports.Slot = Slot;
function SlotContent({ name, children }) {
    const context = React.useContext(SlotContext);
    React.useEffect(() => {
        context.setView(name, () => children);
        return context.subscribe(name, (setContent) => {
            setContent(children);
        });
    }, [name, children]);
    return null;
}
exports.SlotContent = SlotContent;
