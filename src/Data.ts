import NodePersist = require('node-persist');

export default class Data {

    async init() {
        try {
            await NodePersist.init({
                dir: 'data/node_persist',
                stringify: JSON.stringify,
                parse: JSON.parse,
                encoding: 'utf8',
                logging: (e) => console.log("[DATA] " + e),
                expiredInterval: 2 * 60 * 1000,
                forgiveParseErrors: false,
            });
        } catch (e) {
            console.log("[DATA] " + e)
        }
    }

    setChannel(channelName: string) {
        try {
            NodePersist.setItem("channel", channelName);
        } catch (e) {
            console.log("[DATA] " + e)
        }
    }

    async getChannel(): Promise<string> {
        try {
            const channel = await NodePersist.getItem("channel") as string;
            if (channel) return channel;
        } catch (e) {
            console.log("[DATA] " + e)
        }
        return "MidKnights Keep";
    }

}