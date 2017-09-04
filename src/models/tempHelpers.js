class Helper {

    getGuid(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    getRandomPropFromObj(obj) {
        var keys = Object.keys(obj)
        return obj[keys[keys.length * Math.random() << 0]];
    }
}

module.exports = new Helper()