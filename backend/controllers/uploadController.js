const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  const imageUrl = `/images/${req.file.filename}`;

  res.status(201).json({
    url: imageUrl,
    alt: req.file.originalname,
  });
};

module.exports = { uploadImage };
