import { Bot } from "./bot";

const express = require('express');
const { startDriver } = require('./driver')
const port = 54321;

export async function startServer(bot: Bot) {

    const driver = await startDriver(bot);

    const app = express();
    app.use(express.json());

    app.post('/message', async function (req: any, res: any) {
        try {
            const { type, payload } = req.body;
            const response = await driver.handleMessage(type, payload)
            res.send(JSON.stringify(response))
        } catch (e) { }
    });

    app.listen(port, () => console.log(`[SERVER] listening on port ${port}`));

}
