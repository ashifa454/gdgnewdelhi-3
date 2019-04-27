const trainingCode = () => {
    this.self.importScripts('https://cdn.rawgit.com/BrainJS/brain.js/master/browser.js');
    this.self.onmessage = function (e) {
        const net = new this.self.brain.recurrent.LSTM();
        const { data } = JSON.parse(e.data);
        net.train(data, {
            log: true,
            iterations: 10000,
            callback: () => {
            }
        });
        this.self.postMessage(JSON.stringify(net.toJSON()))
    }
}
let code = trainingCode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;