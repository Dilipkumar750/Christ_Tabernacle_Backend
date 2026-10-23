import Song from '../models/Song.js';
import { isDbConnected, readStore, writeStore } from '../utils/localStore.js';

// @desc Get public songs (active only)
// @route GET /api/songs
export const getPublicSongs = async (req, res) => {
  try {
    const { language, search } = req.query;

    if (isDbConnected()) {
      const filter = { isActive: true };

      if (language && language !== 'All') {
        filter.language = { $regex: new RegExp(`^${language}$`, 'i') };
      }

      if (search && search.trim()) {
        const s = search.trim();
        filter.$or = [
          { title: { $regex: s, $options: 'i' } },
          { author: { $regex: s, $options: 'i' } },
          { lyrics: { $regex: s, $options: 'i' } },
          { theme: { $regex: s, $options: 'i' } },
        ];
      }

      const songs = await Song.find(filter).sort({ order: 1, createdAt: -1 });
      return res.status(200).json({ success: true, count: songs.length, data: songs });
    } else {
      const store = readStore();
      let list = (store.songs || []).filter((s) => s.isActive !== false);

      if (language && language !== 'All') {
        list = list.filter((s) => s.language?.toLowerCase() === language.toLowerCase());
      }

      if (search && search.trim()) {
        const s = search.trim().toLowerCase();
        list = list.filter(
          (item) =>
            item.title?.toLowerCase().includes(s) ||
            item.lyrics?.toLowerCase().includes(s) ||
            item.author?.toLowerCase().includes(s) ||
            item.theme?.toLowerCase().includes(s)
        );
      }

      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      return res.status(200).json({ success: true, count: list.length, data: list });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch worship songs', error: error.message });
  }
};

// @desc Get single song by ID
// @route GET /api/songs/:id
export const getSongById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      let song = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        song = await Song.findById(id);
      } else {
        song = await Song.findOne({ _id: id });
      }

      if (!song) {
        return res.status(404).json({ success: false, message: 'Song not found' });
      }

      return res.status(200).json({ success: true, data: song });
    } else {
      const store = readStore();
      const song = (store.songs || []).find((s) => String(s._id) === String(id) || String(s.id) === String(id));

      if (!song) {
        return res.status(404).json({ success: false, message: 'Song not found in store' });
      }

      return res.status(200).json({ success: true, data: song });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch song details', error: error.message });
  }
};

// @desc Get all songs (Admin)
// @route GET /api/songs/all
export const getAllSongsAdmin = async (req, res) => {
  try {
    const { language, search } = req.query;

    if (isDbConnected()) {
      const filter = {};

      if (language && language !== 'All') {
        filter.language = { $regex: new RegExp(`^${language}$`, 'i') };
      }

      if (search && search.trim()) {
        const s = search.trim();
        filter.$or = [
          { title: { $regex: s, $options: 'i' } },
          { author: { $regex: s, $options: 'i' } },
          { lyrics: { $regex: s, $options: 'i' } },
          { theme: { $regex: s, $options: 'i' } },
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

      if (search && search.trim()) {
        const s = search.trim().toLowerCase();
        list = list.filter(
          (item) =>
            item.title?.toLowerCase().includes(s) ||
            item.lyrics?.toLowerCase().includes(s) ||
            item.author?.toLowerCase().includes(s) ||
            item.theme?.toLowerCase().includes(s)
        );
      }

      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      return res.status(200).json({ success: true, count: list.length, data: list });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch songs', error: error.message });
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
      author,
      youtubeUrl,
      pptUrl,
      audioUrl,
      lyrics,
      englishLyrics,
      chords,
      tags,
      order,
      isActive,
      duration,
      uploadDate,
    } = req.body;

    if (!title || !lyrics) {
      return res.status(400).json({ success: false, message: 'Title and lyrics are required' });
    }

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    if (isDbConnected()) {
      const newSong = await Song.create({
        title,
        language: language || 'Tamil',
        theme: theme || 'Adoration & Grace',
        key: key || '',
        tempo: tempo || '',
        author: author || "Christ's Tabernacle Worship",
        youtubeUrl: youtubeUrl || '',
        pptUrl: pptUrl || '',
        audioUrl: audioUrl || '',
        lyrics,
        englishLyrics: englishLyrics || '',
        chords: chords || '',
        tags: parsedTags,
        order: order !== undefined ? Number(order) : 0,
        isActive: isActive !== undefined ? isActive : true,
        duration: duration || '',
        uploadDate: uploadDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      });

      return res.status(201).json({ success: true, message: 'Worship song saved successfully', data: newSong });
    } else {
      const store = readStore();
      const newSong = {
        _id: 'song_' + Date.now(),
        title,
        language: language || 'Tamil',
        theme: theme || 'Adoration & Grace',
        key: key || '',
        tempo: tempo || '',
        author: author || "Christ's Tabernacle Worship",
        youtubeUrl: youtubeUrl || '',
        pptUrl: pptUrl || '',
        audioUrl: audioUrl || '',
        lyrics,
        englishLyrics: englishLyrics || '',
        chords: chords || '',
        tags: parsedTags,
        order: order !== undefined ? Number(order) : (store.songs?.length || 0) + 1,
        isActive: isActive !== undefined ? isActive : true,
        duration: duration || '',
        uploadDate: uploadDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        views: '0 views',
        createdAt: new Date().toISOString(),
      };

      store.songs = store.songs || [];
      store.songs.push(newSong);
      writeStore(store);

      return res.status(201).json({ success: true, message: 'Worship song saved successfully', data: newSong });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create song', error: error.message });
  }
};

// @desc Update song (Admin)
// @route PUT /api/songs/:id
export const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };

    if (body.tags && typeof body.tags === 'string') {
      body.tags = body.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
    if (body.order !== undefined) {
      body.order = Number(body.order);
    }

    if (isDbConnected()) {
      let song = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        song = await Song.findByIdAndUpdate(id, body, { new: true, runValidators: true });
      } else {
        song = await Song.findOneAndUpdate({ _id: id }, body, { new: true, runValidators: true });
      }

      if (!song) {
        return res.status(404).json({ success: false, message: 'Song not found' });
      }

      return res.status(200).json({ success: true, message: 'Song updated successfully', data: song });
    } else {
      const store = readStore();
      const idx = (store.songs || []).findIndex((s) => String(s._id) === String(id) || String(s.id) === String(id));

      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Song not found in store' });
      }

      store.songs[idx] = {
        ...store.songs[idx],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      writeStore(store);

      return res.status(200).json({ success: true, message: 'Song updated successfully', data: store.songs[idx] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update song', error: error.message });
  }
};

// @desc Delete song (Admin)
// @route DELETE /api/songs/:id
export const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      let song = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        song = await Song.findByIdAndDelete(id);
      } else {
        song = await Song.findOneAndDelete({ _id: id });
      }

      if (!song) {
        return res.status(404).json({ success: false, message: 'Song not found' });
      }

      return res.status(200).json({ success: true, message: 'Song deleted successfully' });
    } else {
      const store = readStore();
      const initialLen = store.songs?.length || 0;
      store.songs = (store.songs || []).filter((s) => String(s._id) !== String(id) && String(s.id) !== String(id));

      if (store.songs.length === initialLen) {
        return res.status(404).json({ success: false, message: 'Song not found in store' });
      }

      writeStore(store);
      return res.status(200).json({ success: true, message: 'Song deleted successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete song', error: error.message });
  }
};

// @desc Toggle active status of song
// @route PATCH /api/songs/:id/toggle
export const toggleSong = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const song = await Song.findById(id);
      if (!song) {
        return res.status(404).json({ success: false, message: 'Song not found' });
      }

      song.isActive = !song.isActive;
      await song.save();

      return res.status(200).json({
        success: true,
        message: `Song status set to ${song.isActive ? 'Active' : 'Inactive'}`,
        data: song,
      });
    } else {
      const store = readStore();
      const song = (store.songs || []).find((s) => String(s._id) === String(id) || String(s.id) === String(id));
      if (!song) {
        return res.status(404).json({ success: false, message: 'Song not found in store' });
      }

      song.isActive = !song.isActive;
      writeStore(store);

      return res.status(200).json({
        success: true,
        message: `Song status set to ${song.isActive ? 'Active' : 'Inactive'}`,
        data: song,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to toggle status', error: error.message });
  }
};
