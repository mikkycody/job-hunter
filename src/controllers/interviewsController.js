import interviewsServices from '../services/interviewsServices';

// eslint-disable-next-line consistent-return
const webhook = async (req, res) => {
  try {
    // Handle the event
    switch (req.body.event) {
      case 'invitee.created':
        await interviewsServices.createInterview(req.body.payload);
        break;
      case 'invitee.cancelled':
        await interviewsServices.cancelInterview(req.body.payload);
        break;
      // ... handle other event types
      default:
        // Logger.info(`Unhandled event type ${event.type}`);
        console.info(`Unhandled event type ${req.body.event}`);
    }
    // Return a 200 res to acknowledge receipt of the event
    res.send();
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const getInterviews = async (req, res) => {
  try {
    const interviews = await interviewsServices.getInterviews(req.user.id);
    return res.status(200).json({
      interviews,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

export default { webhook, getInterviews };
