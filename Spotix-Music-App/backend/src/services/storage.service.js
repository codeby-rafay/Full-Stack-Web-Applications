const { ImageKit } = require("@imagekit/nodejs");

const imagekitclient = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const uploadFile = async (file) => {
  const result = await imagekitclient.files.upload({
    file: file,
    fileName: "music_" + Date.now(),
    folder: "backend_project/music",
  });
  return result;
};

module.exports = { uploadFile };
