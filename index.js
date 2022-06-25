const {EventEmitter} = require("events");
const {writer} = require("repl");
const readline = require("readline");
const colors = require("colors");

writer.options.colors = true;

class Logger extends EventEmitter {
    constructor(useInput) {
        if (typeof useInput == "undefined") useInput = false;
        if (typeof useInput !== "boolean") throw new TypeError(`The type of 'useInput' should be of type boolean. Received a type of ${typeof useInput}`);
        super();
        if (useInput) {
            this.interface = readline.createInterface(process.stdin, process.stdout);
            process.stdout.clearLine();
            process.stdout.write(this.interface.getPrompt() + this.interface.line);
            process.stdout.cursorTo(this.interface.getPrompt().length + this.interface.cursor);
            this.interface.on("line", input => {
                process.stdout.write(this.interface.getPrompt());
                this.emit("line", input);
            });
            this.interface.on("close", () => {
                this.interface = undefined;
                this.emit("close");
            });
        }
    }

    log(type, ...data) {
        var d = [];
        if (this.interface) {
            this.interface.pause();
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
        }
        let date = new Date();
        for (let i in data) {
            if (typeof data[i] == "string") d.push(data[i]);
            else d.push(writer(data[i]));
        }
        if (type == "info") process.stdout.write(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()} ${colors.brightBlue("info")}]: ${d.join(" ")}\n`);
        else if (type == "warn") process.stdout.write(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()} ${colors.brightYellow("warn")}]: ${d.join(" ")}\n`);
        else if (type == "error") process.stdout.write(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()} ${colors.brightRed("error")}]: ${d.join(" ")}\n`);
        else if (type == "debug") process.stdout.write(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()} ${colors.brightGreen("debug")}]: ${d.join(" ")}\n`);
        if (this.interface) process.stdout.write(this.interface.getPrompt() + this.interface.line);
        if (this.interface) {
            process.stdout.cursorTo(this.interface.getPrompt().length + this.interface.cursor);
            this.interface.resume();
        }
    }

    info(...message) {
        this.log("info", ...message);
    }

    warn(...message) {
        this.log("warn", ...message);
    }

    error(...message) {
        this.log("error", ...message);
    }

    debug(...message) {
        this.log("debug", ...message);
    }

    setPrompt(prompt) {
        if (!this.interface) throw new Error("Interface was not enabled");
        this.interface.setPrompt(prompt);
        process.stdout.clearLine();
        process.stdout.write(this.interface.getPrompt() + this.interface.line);
        process.stdout.cursorTo(this.interface.getPrompt().length + this.interface.cursor);
    }
}

module.exports = Logger;
