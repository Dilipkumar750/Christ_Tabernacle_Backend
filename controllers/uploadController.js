// @desc Handle image upload
// @route POST /api/upload
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    const host = req.get('host');
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: fileUrl,
      fileUrl: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Image upload failed', error: error.message });
  }
};

// @desc Handle PowerPoint PPT / PPTX upload
// @route POST /api/upload/ppt
export const uploadPowerPoint = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a PowerPoint file (.ppt, .pptx) to upload' });
    }

    const host = req.get('host');
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: 'PowerPoint file uploaded successfully',
      url: fileUrl,
      fileUrl: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'PowerPoint upload failed', error: error.message });
  }
};
