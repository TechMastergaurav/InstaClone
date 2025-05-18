import {Conversation} from "../models/conversation.model.js"
import{Message} from "../models/message.model.js"
import { getRecieverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {textMessage:message} = req.body;
      
        let conversation = await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        });
        // establish the conversation if not started yet.
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
      const newMessage = await Message.create({
        senderId,
        receiverId,
        message,
      });
  
      if(newMessage) conversation.messages.push(newMessage._id);

      await Promise.all([conversation.save(),newMessage.save()])
      const receiverSocketId = getRecieverSocketId(receiverId);
      if(receiverSocketId){
        io.to(receiverSocketId).emit('newMessage',newMessage)
      }
      return res.status(201).json({
        success:true,
        newMessage
      })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error sending message"
        });
    }
};

  export const getMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants:{$all: [senderId, receiverId]}
        }).populate('messages');
        if(!conversation) return res.status(200).json({success:true, messages:[]});

        return res.status(200).json({success:true, messages:conversation?.messages});
        
    } catch (error) {
        console.log(error);
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const userId = req.id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        // Only allow sender to delete the message
        if (message.senderId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this message"
            });
        }

        // Find and update the conversation
        const conversation = await Conversation.findOne({
            messages: messageId
        });

        if (conversation) {
            conversation.messages = conversation.messages.filter(
                msgId => msgId.toString() !== messageId
            );
            await conversation.save();
        }

        // Delete the message
        await Message.findByIdAndDelete(messageId);

        // Notify the receiver if they are online
        const receiverSocketId = getRecieverSocketId(message.receiverId.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('messageDeleted', messageId);
        }

        return res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error deleting message"
        });
    }
};