import Member from '../models/Member.js';
import { isDbConnected, readStore, writeStore } from '../utils/localStore.js';

// Helper to compute age from DOB (YYYY-MM-DD)
const calculateAge = (dobString) => {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
};

// @desc Get all members (Admin)
// @route GET /api/members or /api/members/all
export const getAllMembersAdmin = async (req, res) => {
  try {
    const { search, status, gender, baptized } = req.query;

    if (isDbConnected()) {
      const filter = {};
      if (status && status !== 'All') filter.status = status;
      if (gender && gender !== 'All') filter.gender = gender;
      if (baptized && baptized !== 'All') filter.baptized = baptized;

      if (search && search.trim()) {
        const q = search.trim();
        filter.$or = [
          { name: { $regex: q, $options: 'i' } },
          { mobile: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { address: { $regex: q, $options: 'i' } },
          { occupation: { $regex: q, $options: 'i' } },
        ];
      }

      const members = await Member.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: members.length, data: members });
    } else {
      const store = readStore();
      let list = [...(store.members || [])];

      if (status && status !== 'All') {
        list = list.filter((m) => m.status?.toLowerCase() === status.toLowerCase());
      }
      if (gender && gender !== 'All') {
        list = list.filter((m) => m.gender?.toLowerCase() === gender.toLowerCase());
      }
      if (baptized && baptized !== 'All') {
        list = list.filter((m) => m.baptized?.toLowerCase() === baptized.toLowerCase());
      }
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        list = list.filter(
          (m) =>
            m.name?.toLowerCase().includes(q) ||
            m.mobile?.toLowerCase().includes(q) ||
            m.email?.toLowerCase().includes(q) ||
            m.address?.toLowerCase().includes(q) ||
            m.occupation?.toLowerCase().includes(q)
        );
      }

      return res.status(200).json({ success: true, count: list.length, data: list });
    }
  } catch (error) {
    console.error('Error fetching members:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch members', error: error.message });
  }
};

// @desc Get single member by ID
// @route GET /api/members/:id
export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const member = await Member.findById(id);
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }
      return res.status(200).json({ success: true, data: member });
    } else {
      const store = readStore();
      const member = (store.members || []).find((m) => m._id === id);
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }
      return res.status(200).json({ success: true, data: member });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve member', error: error.message });
  }
};

// @desc Create new church member (Public Registration or Admin entry)
// @route POST /api/members
export const createMember = async (req, res) => {
  try {
    const {
      name,
      dob,
      age,
      gender,
      mobile,
      email,
      address,
      occupation,
      bloodGroup,
      maritalStatus,
      baptized,
      emergencyContact,
      membershipDate,
      status,
      notes,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Member name is required' });
    }
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }
    if (!address || !address.trim()) {
      return res.status(400).json({ success: false, message: 'Residential address is required' });
    }

    // Determine age (if not supplied, calculate from DOB)
    let finalAge = age !== undefined && age !== '' && age !== null ? Number(age) : null;
    if (finalAge === null && dob) {
      finalAge = calculateAge(dob);
    }

    const memberPayload = {
      name: name.trim(),
      dob: dob ? dob.trim() : '',
      age: finalAge,
      gender: gender || 'Male',
      mobile: mobile.trim(),
      email: email ? email.trim().toLowerCase() : '',
      address: address.trim(),
      occupation: occupation ? occupation.trim() : '',
      bloodGroup: bloodGroup ? bloodGroup.trim() : '',
      maritalStatus: maritalStatus || 'Single',
      baptized: baptized || 'Yes',
      emergencyContact: emergencyContact ? emergencyContact.trim() : '',
      membershipDate: membershipDate || new Date().toISOString().split('T')[0],
      status: status || 'Active',
      notes: notes ? notes.trim() : '',
    };

    if (isDbConnected()) {
      const newMember = await Member.create(memberPayload);
      return res.status(201).json({
        success: true,
        message: 'Church member enrolled successfully',
        data: newMember,
      });
    } else {
      const store = readStore();
      const newMember = {
        _id: 'mem_' + Date.now(),
        ...memberPayload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.members = store.members || [];
      store.members.unshift(newMember);
      writeStore(store);

      return res.status(201).json({
        success: true,
        message: 'Church member enrolled successfully',
        data: newMember,
      });
    }
  } catch (error) {
    console.error('Error creating member:', error);
    return res.status(500).json({ success: false, message: 'Failed to create member', error: error.message });
  }
};

// @desc Update member details (Admin)
// @route PUT /api/members/:id
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Recalculate age if DOB or age is updated
    if (updateData.dob && (updateData.age === undefined || updateData.age === '')) {
      updateData.age = calculateAge(updateData.dob);
    }

    if (isDbConnected()) {
      const updated = await Member.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'Member details updated successfully',
        data: updated,
      });
    } else {
      const store = readStore();
      const index = (store.members || []).findIndex((m) => m._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }

      store.members[index] = {
        ...store.members[index],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      writeStore(store);

      return res.status(200).json({
        success: true,
        message: 'Member details updated successfully',
        data: store.members[index],
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update member', error: error.message });
  }
};

// @desc Delete member (Admin)
// @route DELETE /api/members/:id
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await Member.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }
      return res.status(200).json({ success: true, message: 'Member record deleted successfully' });
    } else {
      const store = readStore();
      const initial = store.members?.length || 0;
      store.members = (store.members || []).filter((m) => m._id !== id);

      if (store.members.length === initial) {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }
      writeStore(store);

      return res.status(200).json({ success: true, message: 'Member record deleted successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete member', error: error.message });
  }
};

// @desc Toggle member active status (Admin)
// @route PATCH /api/members/:id/toggle-status
export const toggleMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const member = await Member.findById(id);
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }
      member.status = member.status === 'Active' ? 'Inactive' : 'Active';
      await member.save();

      return res.status(200).json({
        success: true,
        message: `Member status set to ${member.status}`,
        data: member,
      });
    } else {
      const store = readStore();
      const member = (store.members || []).find((m) => m._id === id);
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }
      member.status = member.status === 'Active' ? 'Inactive' : 'Active';
      writeStore(store);

      return res.status(200).json({
        success: true,
        message: `Member status set to ${member.status}`,
        data: member,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update member status', error: error.message });
  }
};
