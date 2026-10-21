// @desc Upload image file
// @route POST /api/upload
export const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    // Build the accessible URL
    const protocol = req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
};
