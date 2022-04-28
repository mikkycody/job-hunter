const { format } = require('util');
const { Storage } = require('@google-cloud/storage');
const processFile = require('../middlewares/upload');
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: 'google-cloud-key.json' });
const bucket = storage.bucket('job-hunter-resume');
const upload = async (req, res) => {
  try {
    await processFile(req, res);
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file!' });
    }
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream.on('error', (err) => {
      res.status(500).json({ error: err.message });
    });
    blobStream.on('finish', async () => {
      // Create URL for directly file access via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
      try {
        // Make the file public
        await bucket.file(req.file.originalname).makePublic();
      } catch {
        return res.status(200).json({
          message: `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
          url: publicUrl,
        });
      }
      return res.status(200).json({
        message: `Uploaded the file successfully: ${req.file.originalname}`,
        url: publicUrl,
      });
    });
    blobStream.end(req.file.buffer);
    // return true;
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(500).json({
        error: 'File size cannot be larger than 2MB!',
      });
    }
    return res.status(500).json({
      error: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};
export default { upload };
