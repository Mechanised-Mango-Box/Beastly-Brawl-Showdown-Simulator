"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const EventTextBox = ({ onEventsSubmit }) => {
    const [input, setInput] = (0, react_1.useState)("");
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const parsedEvents = JSON.parse(input);
            onEventsSubmit(parsedEvents);
        }
        catch (error) {
            alert("Invalid JSON! Please check your input.");
        }
    };
    return (<form onSubmit={handleSubmit}>
      <h3>Enter Battle Events</h3>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} cols={50} placeholder="Type your events here..."/>
      <br />
      <button type="submit">Load Events</button>
    </form>);
};
exports.default = EventTextBox;
