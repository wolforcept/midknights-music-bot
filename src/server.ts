// import Bot from "./Bot";
// import express = require('express');
// const port = 54321;

// export enum MessageType {
//     PLAY
// }

// export default class Server {

//     app;

//     async start(bot: Bot) {

//         const driver = await startDriver(bot);

//         const app = express();
//         app.use(express.json());

//         app.post('/message', async function (req: any, res: any) {
//             try {
//                 const { type, payload } = req.body;
//                 const response = await driver.handleMessage(type, payload)
//                 res.send(JSON.stringify(response))
//             } catch (e) { }
//         });

//         app.listen(port, () => console.log(`[SERVER] listening on port ${port}`));

//     }

//     send(type: MessageType, message: any) {
//         switch (type) {
//             case MessageType.PLAY: if (message as string) this.play(message as string)
//         }
//     }

//     play(message: string) {

//     }
// }
export { }