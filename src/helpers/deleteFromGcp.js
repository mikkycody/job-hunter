const { Storage } = require('@google-cloud/storage');
// Instantiate a storage client with credentials

const storage = new Storage({ keyFilename: 'google-cloud-key.json' });
const deleteFile = async (file) => {
    const bucket = storage.bucket('job-hunter-resume');

    await storage.bucket(bucket.name).file(file.split('/')[4]).delete();

    console.log(`gs://${bucket.name}/${file} deleted`);
};

export default { deleteFile };
