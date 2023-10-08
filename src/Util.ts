class Util {

    async sleep(ms: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}

const UTIL = new Util();
export default UTIL;