var fs = require("fs");

const asyncHandler = require("express-async-handler");

const uploadFile = asyncHandler(async (req, res) => {
  res.json(req.file.filename);
});

const deleteUploadedFile = asyncHandler(async (req, res) => {
  const fileName = req.params.fileName;
  fs.unlink(`public/uploads/${fileName}`, function (err) {
    if (err) return res.status(500).json(err);
    res.json("file deleted successfully");
  });
});

module.exports = { uploadFile, deleteUploadedFile };
