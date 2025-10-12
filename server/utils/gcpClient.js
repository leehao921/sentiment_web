const { Storage } = require('@google-cloud/storage');

// Initialize Google Cloud Storage client
// Uses Application Default Credentials from gcloud CLI
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT
});

// Get bucket reference
const getBucket = () => {
  const bucketName = process.env.GCS_BUCKET;
  if (!bucketName) {
    throw new Error('GCS_BUCKET environment variable is not set');
  }
  return storage.bucket(bucketName);
};

// List files in a specific prefix (folder)
const listFiles = async (prefix = 'rawdata/') => {
  try {
    const bucket = getBucket();
    const [files] = await bucket.getFiles({ prefix });

    return files.map(file => ({
      name: file.name,
      size: file.metadata.size,
      updated: file.metadata.updated,
      contentType: file.metadata.contentType
    }));
  } catch (error) {
    console.error('Error listing files from GCS:', error);
    throw error;
  }
};

// Download and read a file
const downloadFile = async (fileName) => {
  try {
    const bucket = getBucket();
    const file = bucket.file(fileName);

    const [contents] = await file.download();
    return contents;
  } catch (error) {
    console.error(`Error downloading file ${fileName}:`, error);
    throw error;
  }
};

// Check if bucket is accessible
const checkBucketAccess = async () => {
  try {
    const bucket = getBucket();
    const [exists] = await bucket.exists();
    return exists;
  } catch (error) {
    console.error('Error checking bucket access:', error);
    throw error;
  }
};

module.exports = {
  storage,
  getBucket,
  listFiles,
  downloadFile,
  checkBucketAccess
};
