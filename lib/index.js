"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const SlotContext = React.createContext(null);
class SlotContoller {
    constructor(parentContext) {
        this.slots = {};
        this.pendingViews = {};
        this.parentContext = parentContext;
    }
    add(name, setContent) {
        this.slots[name] = setContent;
        if (this.pendingViews[name]) {
            const view = this.pendingViews[name];
            delete this.pendingViews[name];
            this.setView(name, view);
        }
    }
    remove(name) {
        delete this.slots[name];
    }
    setView(name, view) {
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
function SlotsContainer({ children }) {
    const parentContext = React.useContext(SlotContext);
    const [ctrl] = React.useState(() => new SlotContoller(parentContext));
    return React.createElement(SlotContext.Provider, { value: ctrl }, children);
}
exports.SlotsContainer = SlotsContainer;
function Slot({ name }) {
    const [view, setView] = React.useState(null);
    const context = React.useContext(SlotContext);
    React.useMemo(() => {
        context.add(name, setView);
    }, [context]);
    return (view);
}
exports.Slot = Slot;
function SlotContent({ name, children }) {
    const context = React.useContext(SlotContext);
    React.useEffect(() => {
        context.setView(name, children);
    }, [name, children]);
    return null;
}
exports.SlotContent = SlotContent;
