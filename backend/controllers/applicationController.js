import Application from '../models/Application.js';

export const getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find().populate('resumeVersionId').sort({ appliedAt: -1 });
    res.json(apps);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to retrieve application tracker records.' });
  }
};

export const createApplication = async (req, res) => {
  try {
    const { companyName, roleTitle, status, resumeVersionId } = req.body;

    if (!companyName || !roleTitle) {
      return res.status(400).json({ error: 'companyName and roleTitle are required.' });
    }

    const app = await Application.create({
      companyName,
      roleTitle,
      status: status || 'applied',
      resumeVersionId: resumeVersionId || null,
    });

    const populated = await Application.findById(app._id).populate('resumeVersionId');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to create application tracker item.' });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['applied', 'interview', 'rejected', 'offer'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const app = await Application.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ error: 'Application item not found.' });
    }

    app.status = status;
    await app.save();

    res.json({ success: true, application: app });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update application status.' });
  }
};
