import Photo from '../models/Photo.js';
import { isDbConnected, readStore, writeStore } from '../utils/localStore.js';

// Helper to extract or fallback year
const resolveYear = (year, date, createdAt) => {
  if (year && String(year).trim()) return String(year).trim();
  if (date) {
    const match = String(date).match(/\b(19\d{2}|20\d{2})\b/);
    if (match) return match[1];
  }
  if (createdAt) {
    const d = new Date(createdAt);
    if (!isNaN(d.getTime())) return String(d.getFullYear());
  }
  return String(new Date().getFullYear());
};

// @desc Get public photos
// @route GET /api/photos
export const getPublicPhotos = async (req, res) => {
  try {
    const { category, year } = req.query;

    if (isDbConnected()) {
      const filter = {};
      if (category && category !== 'All') filter.category = category;
      if (year && year !== 'All') {
        filter.$or = [
          { year: String(year) },
          { date: { $regex: String(year), $options: 'i' } }
        ];
      }
      const photos = await Photo.find(filter).sort({ order: 1, createdAt: -1 });
      return res.status(200).json({ success: true, count: photos.length, data: photos });
    } else {
      const store = readStore();
      let list = [...(store.photos || [])];
      if (category && category !== 'All') {
        list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
      }
      if (year && year !== 'All') {
        list = list.filter((p) => {
          const itemYear = resolveYear(p.year, p.date, p.createdAt);
          return itemYear === String(year);
        });
      }
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      return res.status(200).json({ success: true, count: list.length, data: list });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch photos', error: error.message });
  }
};

// @desc Get all photos (Admin)
// @route GET /api/photos/all
export const getAllPhotosAdmin = async (req, res) => {
  try {
    const { category, year } = req.query;

    if (isDbConnected()) {
      const filter = {};
      if (category && category !== 'All') filter.category = category;
      if (year && year !== 'All') {
        filter.$or = [
          { year: String(year) },
          { date: { $regex: String(year), $options: 'i' } }
        ];
      }
      const photos = await Photo.find(filter).sort({ order: 1, createdAt: -1 });
      return res.status(200).json({ success: true, count: photos.length, data: photos });
    } else {
      const store = readStore();
      let list = [...(store.photos || [])];
      if (category && category !== 'All') {
        list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
      }
      if (year && year !== 'All') {
        list = list.filter((p) => {
          const itemYear = resolveYear(p.year, p.date, p.createdAt);
          return itemYear === String(year);
        });
      }
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      return res.status(200).json({ success: true, count: list.length, data: list });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch photos', error: error.message });
  }
};

// @desc Create new photo (Admin)
// @route POST /api/photos
export const createPhoto = async (req, res) => {
  try {
    const { title, category, image, caption, date, year, isFeatured, order } = req.body;

    if (!title || !image) {
      return res.status(400).json({ success: false, message: 'Title and image are required' });
    }

    const calculatedYear = resolveYear(year, date, null);

    if (isDbConnected()) {
      const newPhoto = await Photo.create({
        title,
        category: category || 'Sanctuary',
        image,
        caption: caption || '',
        date: date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        year: calculatedYear,
        isFeatured: isFeatured || false,
        order: order !== undefined ? Number(order) : 0,
      });
      return res.status(201).json({ success: true, message: 'Photo added to gallery', data: newPhoto });
    } else {
      const store = readStore();
      const newPhoto = {
        _id: 'photo_' + Date.now(),
        title,
        category: category || 'Sanctuary',
        image,
        caption: caption || '',
        date: date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        year: calculatedYear,
        isFeatured: isFeatured || false,
        order: order !== undefined ? Number(order) : (store.photos?.length || 0) + 1,
        createdAt: new Date().toISOString(),
      };
      store.photos = store.photos || [];
      store.photos.push(newPhoto);
      writeStore(store);
      return res.status(201).json({ success: true, message: 'Photo added to gallery', data: newPhoto });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add photo', error: error.message });
  }
};

// @desc Update photo (Admin)
// @route PUT /api/photos/:id
export const updatePhoto = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (!updateData.year && updateData.date) {
      updateData.year = resolveYear(null, updateData.date, null);
    }

    if (isDbConnected()) {
      const updated = await Photo.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updated) return res.status(404).json({ success: false, message: 'Photo not found' });
      return res.status(200).json({ success: true, message: 'Photo updated successfully', data: updated });
    } else {
      const store = readStore();
      const index = (store.photos || []).findIndex((p) => p._id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Photo not found' });

      store.photos[index] = {
        ...store.photos[index],
        ...updateData,
        year: updateData.year || resolveYear(store.photos[index].year, updateData.date || store.photos[index].date, store.photos[index].createdAt),
        updatedAt: new Date().toISOString(),
      };
      writeStore(store);
      return res.status(200).json({ success: true, message: 'Photo updated successfully', data: store.photos[index] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update photo', error: error.message });
  }
};

// @desc Delete photo (Admin)
// @route DELETE /api/photos/:id
export const deletePhoto = async (req, res) => {
  try {
    if (isDbConnected()) {
      const deleted = await Photo.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Photo not found' });
      return res.status(200).json({ success: true, message: 'Photo removed from gallery' });
    } else {
      const store = readStore();
      const initial = store.photos?.length || 0;
      store.photos = (store.photos || []).filter((p) => p._id !== req.params.id);
      if (store.photos.length === initial) {
        return res.status(404).json({ success: false, message: 'Photo not found' });
      }
      writeStore(store);
      return res.status(200).json({ success: true, message: 'Photo removed from gallery' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete photo', error: error.message });
  }
};
