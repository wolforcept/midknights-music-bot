import { startBot } from './bot';
import { startServer } from './server';

// {
//     "command": "runCommands",
//     "key": "alt+shift+c", // whatever keybinding you want
//     "args": {
//         "commands": [
//             // "workbench.action.terminal.clear",
//             {
//                 "command": "workbench.action.terminal.sendSequence",
//                 "args": {
//                     "text": "asdasdasd"
//                 }
//             }
//         ]
//     },
//     "when": "editorTextFocus" // can use context keys
// }

async function start() {

    // console.log('[MDK] deploying commands...')
    // await deployCommands();
    // console.log('[MDK] commands deployed!')

    console.log('[MDK] starting bot...')
    const bot = await startBot();
    console.log('[MDK] bot started!')

    console.log('[MDK] starting server...')
    await startServer(bot);
    console.log('[MDK] server started!')

}

start();

// TODO:
// SEE QUEUE COMMAND
// DEPLOY AND TEST
// CHECK/REMAKE BROWSER WINDOW IF CLOSED