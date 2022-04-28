import MessageService from '../services/messageService';

const getConversations = async (req, res) => {
    try {
        const conversations = await MessageService.getConversations(req.user.id);
        return res.status(200).json({
          conversations,
        });
    } catch (err) {
      return res.status(500).json({
        error: err?.message,
      });
    }
}
export default { getConversations };