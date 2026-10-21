import Song from '../models/Song.js';
import { isDbConnected, readStore, writeStore } from '../utils/localStore.js';

// @desc Get public songs (filtered by language / search)
// @route GET /api/songs
export const getPublicSongs = async (req, res) => {
  try {
    const { language, search } = req.query;

    if (isDbConnected()) {
      const filter = { isActive: true };
      if (language && language !== 'All') filter.language = language;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { theme: { $regex: search, $options: 'i' } },
          { lyrics: { $regex: search, $options: 'i' } },
        ];
      }
      const songs = await Song.find(filter).sort({ order: 1, createdAt: -1 });
      return res.status(200).json({ success: true, count: songs.length, data: songs });
    } else {
      const store = readStore();
      let list = (store.songs || []).filter((s) => s.isActive);
      if (language && language !== 'All') {
        list = list.filter((s) => s.language?.toLowerCase() === language.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (s) =>
            s.title?.toLowerCase().includes(q) ||
            s.theme?.toLowerCase().includes(q) ||
            s.lyrics?.toLowerCase().includes(q)
        );
      }
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      return res.status(200).json({ success: true, count: list.length, data: list });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch worship lyrics', error: error.message });
  }
};

// @desc Get all songs (Admin)
// @route GET /api/songs/all
export const getAllSongsAdmin = async (req, res) => {
  try {
    const { language, search } = req.query;

    if (isDbConnected()) {
      const filter = {};
      if (language && language !== 'All') filter.language = language;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { theme: { $regex: search, $options: 'i' } },
          { lyrics: { $regex: search, $options: 'i' } },
        ];
      }
      const songs = await Song.find(filter).sort({ order: 1, createdAt: -1 });
      return res.status(200).json({ success: true, count: songs.length, data: songs });
    } else {
      const store = readStore();
      let list = [...(store.songs || [])];
      if (language && language !== 'All') {
        list = list.filter((s) => s.language?.toLowerCase() === language.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (s) =>
            s.title?.toLowerCase().includes(q) ||
            s.theme?.toLowerCase().includes(q) ||
            s.lyrics?.toLowerCase().includes(q)
        );
      }
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      return res.status(200).json({ success: true, count: list.length, data: list });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch worship songs', error: error.message });
  }
};

// @desc Create new song (Admin)
// @route POST /api/songs
export const createSong = async (req, res) => {
  try {
    const {
      title,
      language,
      theme,
      key,
      tempo,
      lyrics,
      audioUrl,
      youtubeUrl,
      author,
      uploadDate,
      views,
      duration,
      order,
      isActive,
    } = req.body;

    if (!title || !lyrics) {
      return res.status(400).json({ success: false, message: 'Title and lyrics are required' });
    }

    if (isDbConnected()) {
      const newSong = await Song.create({
        title,
        language: language || 'Tamil',
        theme: theme || 'Praise & Worship',
        key: key || 'C Major',
        tempo: tempo || 'Medium',
        lyrics,
        audioUrl: audioUrl || '',
        youtubeUrl: youtubeUrl || '',
        author: author || "Christ's Tabernacle Worship",
        uploadDate: uploadDate || 'Recently Uploaded',
        views: views || '14.2K views',
        duration: duration || '5:15',
        order: order !== undefined ? Number(order) : 0,
        isActive: isActive !== undefined ? isActive : true,
      });
      return res.status(201).json({ success: true, message: 'Worship song saved', data: newSong });
    } else {
      const store = readStore();
      const newSong = {
        _id: 'song_' + Date.now(),
        title,
        language: language || 'Tamil',
        theme: theme || 'Praise & Worship',
        key: key || 'C Major',
        tempo: tempo || 'Medium',
        lyrics,
        audioUrl: audioUrl || '',
        youtubeUrl: youtubeUrl || '',
        author: author || "Christ's Tabernacle Worship",
        uploadDate: uploadDate || 'Recently Uploaded',
        views: views || '14.2K views',
        duration: duration || '5:15',
        order: order !== undefined ? Number(order) : (store.songs?.length || 0) + 1,
        isActive: isActive !== undefined ? isActive : true,
        createdAt: new Date().toISOString(),
      };
      store.songs = store.songs || [];
      store.songs.push(newSong);
      writeStore(store);
      return res.status(201).json({ success: true, message: 'Worship song saved', data: newSong });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to save worship song', error: error.message });
  }
};

// @desc Update song (Admin)
// @route PUT /api/songs/:id
export const updateSong = async (req, res) => {
  try {
    if (isDbConnected()) {
      const updated = await Song.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated) return res.status(404).json({ success: false, message: 'Worship song not found' });
      return res.status(200).json({ success: true, message: 'Worship song updated successfully', data: updated });
    } else {
      const store = readStore();
      const index = (store.songs || []).findIndex((s) => s._id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Worship song not found' });

      store.songs[index] = {
        ...store.songs[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };
      writeStore(store);
      return res.status(200).json({ success: true, message: 'Worship song updated successfully', data: store.songs[index] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update worship song', error: error.message });
  }
};

// @desc Delete song (Admin)
// @route DELETE /api/songs/:id
export const deleteSong = async (req, res) => {
  try {
    if (isDbConnected()) {
      const deleted = await Song.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Worship song not found' });
      return res.status(200).json({ success: true, message: 'Worship song deleted successfully' });
    } else {
      const store = readStore();
      const initial = store.songs?.length || 0;
      store.songs = (store.songs || []).filter((s) => s._id !== req.params.id);
      if (store.songs.length === initial) {
        return res.status(404).json({ success: false, message: 'Worship song not found' });
      }
      writeStore(store);
      return res.status(200).json({ success: true, message: 'Worship song deleted successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete worship song', error: error.message });
  }
};
