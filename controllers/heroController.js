import HeroSlide from '../models/HeroSlide.js';
import { isDbConnected, readStore, writeStore } from '../utils/localStore.js';

// @desc Get active hero slides (Public)
// @route GET /api/hero
export const getPublicHeroSlides = async (req, res) => {
  try {
    if (isDbConnected()) {
      const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
      return res.status(200).json({ success: true, count: slides.length, data: slides });
    } else {
      const store = readStore();
      const active = (store.heroSlides || []).filter((h) => h.isActive);
      active.sort((a, b) => (a.order || 0) - (b.order || 0));
      return res.status(200).json({ success: true, count: active.length, data: active });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch hero slides', error: error.message });
  }
};

// @desc Get all hero slides (Admin)
// @route GET /api/hero/all
export const getAllHeroSlidesAdmin = async (req, res) => {
  try {
    if (isDbConnected()) {
      const slides = await HeroSlide.find().sort({ order: 1, createdAt: -1 });
      return res.status(200).json({ success: true, count: slides.length, data: slides });
    } else {
      const store = readStore();
      const list = store.heroSlides || [];
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      return res.status(200).json({ success: true, count: list.length, data: list });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch hero slides', error: error.message });
  }
};

// @desc Create new hero slide (Admin)
// @route POST /api/hero
export const createHeroSlide = async (req, res) => {
  try {
    const { title, subtitle, tag, verse, actionText, actionLink, image, alt, order, isActive } = req.body;

    if (!title || !subtitle || !image) {
      return res.status(400).json({ success: false, message: 'Title, subtitle, and image are required' });
    }

    if (isDbConnected()) {
      const newSlide = await HeroSlide.create({
        title,
        subtitle,
        tag: tag || '',
        verse: verse || '',
        actionText: actionText || 'Plan a Visit',
        actionLink: actionLink || '/contact',
        image,
        alt: alt || title,
        order: order !== undefined ? Number(order) : 0,
        isActive: isActive !== undefined ? isActive : true,
      });
      return res.status(201).json({ success: true, message: 'Hero slide created successfully', data: newSlide });
    } else {
      const store = readStore();
      const newSlide = {
        _id: 'hero_' + Date.now(),
        title,
        subtitle,
        tag: tag || '',
        verse: verse || '',
        actionText: actionText || 'Plan a Visit',
        actionLink: actionLink || '/contact',
        image,
        alt: alt || title,
        order: order !== undefined ? Number(order) : (store.heroSlides?.length || 0) + 1,
        isActive: isActive !== undefined ? isActive : true,
        createdAt: new Date().toISOString(),
      };
      store.heroSlides = store.heroSlides || [];
      store.heroSlides.push(newSlide);
      writeStore(store);
      return res.status(201).json({ success: true, message: 'Hero slide created successfully', data: newSlide });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create hero slide', error: error.message });
  }
};

// @desc Update hero slide (Admin)
// @route PUT /api/hero/:id
export const updateHeroSlide = async (req, res) => {
  try {
    if (isDbConnected()) {
      const updatedSlide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedSlide) return res.status(404).json({ success: false, message: 'Hero slide not found' });
      return res.status(200).json({ success: true, message: 'Hero slide updated successfully', data: updatedSlide });
    } else {
      const store = readStore();
      const index = (store.heroSlides || []).findIndex((h) => h._id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Hero slide not found' });

      store.heroSlides[index] = {
        ...store.heroSlides[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };
      writeStore(store);
      return res.status(200).json({ success: true, message: 'Hero slide updated successfully', data: store.heroSlides[index] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update hero slide', error: error.message });
  }
};

// @desc Delete hero slide (Admin)
// @route DELETE /api/hero/:id
export const deleteHeroSlide = async (req, res) => {
  try {
    if (isDbConnected()) {
      const slide = await HeroSlide.findByIdAndDelete(req.params.id);
      if (!slide) return res.status(404).json({ success: false, message: 'Hero slide not found' });
      return res.status(200).json({ success: true, message: 'Hero slide deleted successfully' });
    } else {
      const store = readStore();
      const beforeLen = store.heroSlides?.length || 0;
      store.heroSlides = (store.heroSlides || []).filter((h) => h._id !== req.params.id);
      if (store.heroSlides.length === beforeLen) {
        return res.status(404).json({ success: false, message: 'Hero slide not found' });
      }
      writeStore(store);
      return res.status(200).json({ success: true, message: 'Hero slide deleted successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete hero slide', error: error.message });
  }
};

// @desc Toggle hero slide active status (Admin)
// @route PATCH /api/hero/:id/toggle
export const toggleHeroSlideStatus = async (req, res) => {
  try {
    if (isDbConnected()) {
      const slide = await HeroSlide.findById(req.params.id);
      if (!slide) return res.status(404).json({ success: false, message: 'Hero slide not found' });
      slide.isActive = !slide.isActive;
      await slide.save();
      return res.status(200).json({
        success: true,
        message: `Hero slide is now ${slide.isActive ? 'active' : 'hidden'}`,
        data: slide,
      });
    } else {
      const store = readStore();
      const slide = (store.heroSlides || []).find((h) => h._id === req.params.id);
      if (!slide) return res.status(404).json({ success: false, message: 'Hero slide not found' });
      slide.isActive = !slide.isActive;
      writeStore(store);
      return res.status(200).json({
        success: true,
        message: `Hero slide is now ${slide.isActive ? 'active' : 'hidden'}`,
        data: slide,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to toggle slide status', error: error.message });
  }
};
