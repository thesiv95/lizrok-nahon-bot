import path from 'path';
import fs from 'fs';

const getImagePath = (name: string) => {
    const isProdEnv = process.env.NODE_ENV !== 'dev';

    let imgPath;

    if (isProdEnv) {
        imgPath = path.resolve(__dirname, '..', '..', 'images', `${name}.jpg`);
    } else {
        imgPath = path.resolve(__dirname, '..', 'images', `${name}.jpg`);
    }

    return fs.createReadStream(imgPath);
};

export default getImagePath;