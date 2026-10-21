import Testimonial from '../models/Testimonial.js';
import { isDbConnected, readStore, writeStore } from '../utils/localStore.js';

// @desc Get public approved testimonials
// @route GET /api/testimonials
export const getPublicTestimonials = async (req, res) => {
  try {
    const { category, search } = req.query;

    if (isDbConnected()) {
      const filter = { isApproved: true };
      if (category && category !== 'All') filter.category = category;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { story: { $regex: search, $options: 'i' } },
        ];
      }
      const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
    } else {
      const store = readStore();
      let list = (store.testimonials || []).filter((t) => t.isApproved);
      if (category && category !== 'All') {
        list = list.filter((t) => t.category?.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (t) =>
            t.name?.toLowerCase().includes(q) ||
            t.title?.toLowerCase().includes(q) ||
            t.story?.toLowerCase().includes(q)
        );
      }
      return res.status(200).json({ success: true, count: list.length, data: list });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch testimonials', error: error.message });
  }
};

// @desc Get all testimonials (Admin)
// @route GET /api/testimonials/all
export const getAllTestimonialsAdmin = async (req, res) => {
  try {
    const { category, status } = req.query;

    if (isDbConnected()) {
      const filter = {};
      if (category && category !== 'All') filter.category = category;
      if (status === 'approved') filter.isApproved = true;
      if (status === 'pending') filter.isApproved = false;

      const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
    } else {
      const store = readStore();
      let list = [...(store.testimonials || [])];
      if (category && category !== 'All') {
        list = list.filter((t) => t.category?.toLowerCase() === category.toLowerCase());
      }
      if (status === 'approved') list = list.filter((t) => t.isApproved);
      if (status === 'pending') list = list.filter((t) => !t.isApproved);
      return res.status(200).json({ success: true, count: list.length, data: list });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch testimonials', error: error.message });
  }
};

// @desc Create new testimonial (Admin or Public)
// @route POST /api/testimonials
export const createTestimonial = async (req, res) => {
  try {
    const { name, location, category, title, story, verse, date, isApproved, isFeatured } = req.body;

    if (!name || !title || !story) {
      return res.status(400).json({ success: false, message: 'Name, title, and story are required' });
    }

    const approved = req.admin ? (isApproved !== undefined ? isApproved : true) : false;

    if (isDbConnected()) {
      const newTestimonial = await Testimonial.create({
        name,
        location: location || 'Chennai, India',
        category: category || 'Healing',
        title,
        story,
        verse: verse || '',
        date: date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        isApproved: approved,
        isFeatured: isFeatured || false,
      });

      return res.status(201).json({
        success: true,
        message: approved ? 'Testimony created and published' : 'Testimony submitted for review',
        data: newTestimonial,
      });
    } else {
      const store = readStore();
      const newTestimonial = {
        _id: 'test_' + Date.now(),
        name,
        location: location || 'Chennai, India',
        category: category || 'Healing',
        title,
        story,
        verse: verse || '',
        date: date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        isApproved: approved,
        isFeatured: isFeatured || false,
        createdAt: new Date().toISOString(),
      };
      store.testimonials = store.testimonials || [];
      store.testimonials.unshift(newTestimonial);
      writeStore(store);

      return res.status(201).json({
        success: true,
        message: approved ? 'Testimony created and published' : 'Testimony submitted for review',
        data: newTestimonial,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create testimonial', error: error.message });
  }
};

// @desc Update testimonial (Admin)
// @route PUT /api/testimonials/:id
export const updateTestimonial = async (req, res) => {
  try {
    if (isDbConnected()) {
      const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated) return res.status(404).json({ success: false, message: 'Testimonial not found' });
      return res.status(200).json({ success: true, message: 'Testimonial updated successfully', data: updated });
    } else {
      const store = readStore();
      const index = (store.testimonials || []).findIndex((t) => t._id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Testimonial not found' });

      store.testimonials[index] = {
        ...store.testimonials[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };
      writeStore(store);
      return res.status(200).json({ success: true, message: 'Testimonial updated successfully', data: store.testimonials[index] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update testimonial', error: error.message });
  }
};

// @desc Delete testimonial (Admin)
// @route DELETE /api/testimonials/:id
export const deleteTestimonial = async (req, res) => {
  try {
    if (isDbConnected()) {
      const deleted = await Testimonial.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Testimonial not found' });
      return res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
    } else {
      const store = readStore();
      const initial = store.testimonials?.length || 0;
      store.testimonials = (store.testimonials || []).filter((t) => t._id !== req.params.id);
      if (store.testimonials.length === initial) {
        return res.status(404).json({ success: false, message: 'Testimonial not found' });
      }
      writeStore(store);
      return res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete testimonial', error: error.message });
  }
};

// @desc Toggle approval status (Admin)
// @route PATCH /api/testimonials/:id/toggle-approve
export const toggleApproveTestimonial = async (req, res) => {
  try {
    if (isDbConnected()) {
      const testimonial = await Testimonial.findById(req.params.id);
      if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
      testimonial.isApproved = !testimonial.isApproved;
      await testimonial.save();
      return res.status(200).json({
        success: true,
        message: `Testimonial is now ${testimonial.isApproved ? 'approved' : 'hidden'}`,
        data: testimonial,
      });
    } else {
      const store = readStore();
      const testimonial = (store.testimonials || []).find((t) => t._id === req.params.id);
      if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
      testimonial.isApproved = !testimonial.isApproved;
      writeStore(store);
      return res.status(200).json({
        success: true,
        message: `Testimonial is now ${testimonial.isApproved ? 'approved' : 'hidden'}`,
        data: testimonial,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to toggle status', error: error.message });
  }
};
