import sharp from "sharp"
import cloudinary from "../utils/cloudinary.js"
import{Post} from "../models/post.model.js"
import{User} from "../models/user.model.js"
import { Comment } from "../models/comment.model.js";




export const addNewPost = async(req,res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
       
        const authorId = req.id;
        if(!image){
            return res.status(400).json({
                message:'Image Required',
               
            })
        }
        const optimizedImageBuffer = await sharp(image.buffer)
        .resize({width:800,height:800,fit:'inside'})
        .toFormat('jpeg',{quality:80})
        .toBuffer()
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image:cloudResponse.secure_url,
            author:authorId
        })
        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save();
        }
        await post.populate({path:'author' , select:'-password'})
        return res.status(200).json({
            message:'New Post Added',
            post,
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}
export const getAllPost = async(req,res) => {
    try{
        const posts = await Post.find().sort({createdAt:-1})
        .populate({path:'author',select:'username  profilePicture'})
        .populate({
            path:'comments',
            options: { sort: { 'createdAt': -1 } },
            populate:{
                path:'author',
                select:'username profilePicture'
            }
        })
        
        return res.status(200).json({
            posts,
            success:true
        })

    }catch(error){
        console.log(error);
    }
}
export const getUserPost = async(req,res) => {
    try{
        const authorId = req.id;
        const posts = await Post.find({author:authorId}).sort({createdAt:-1}).populate({
            path:'author',
            select:'username  profilePicture'
        })
        .populate({
            path:'comments',
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'username,profilePicture'
            }
        })
        return res.status(200).json({
            posts,
            success:true
        })
    }catch(error){
        console.log('error')
    }
}
export const likePost = async (req, res) => {
    try {
        const userId = req.id; // ID of the user liking the post
        const postId = req.params.id; // ID of the post being liked

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false,
            });
        }

        // Like logic: Add user to the "likes" array if not already present
        const result = await Post.updateOne(
            { _id: postId },
            { $addToSet: { likes: userId } } // `$addToSet` ensures no duplicates
        );

        if (result.nModified === 0) {
            return res.status(400).json({
                message: 'Failed to like the post',
                success: false,
            });
        }

        return res.status(200).json({
            message: 'Post liked',
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

export const dislikePost = async (req, res) => {
    try {
        const userId = req.id; // ID of the user disliking the post
        const postId = req.params.id; // ID of the post being disliked

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false,
            });
        }

        // Dislike logic: Remove user from the "likes" array
        const result = await Post.updateOne(
            { _id: postId },
            { $pull: { likes: userId } } // `$pull` removes the user from the array
        );

        if (result.nModified === 0) {
            return res.status(400).json({
                message: 'Failed to dislike the post',
                success: false,
            });
        }

        return res.status(200).json({
            message: 'Post disliked',
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

export const addComment = async(req,res) => {
    try{
       const postId = req.params.id;
       const commentKrneWaleUserKiId = req.id;
       const{text} = req.body;

       const post = await Post.findById(postId)
       if(!text){
        res.status(400).json({
            message:'text is required',
            success:'false'
        })
       }
       const comment = await Comment.create({
        text,
        author:commentKrneWaleUserKiId,
        post:postId
       })
       await comment.populate({
        path:'author',
        select:"username , profilePicture"
       })
       post.comments.push(comment._id)
       await post.save();

       return res.status(201).json({
        message:'Comment Added',
        comment,
        success:true
       })
    }catch(error){
        console.log(error)
    }
}
export const getCommentOfPosts = async(req,res) => {
    try{
    const postId = req.params.id;
    const comments = await Comment.find({post:postId}).populate('author','usename,profilePicture');
    if(!comments) return res.status(404).json({message:'No Comments found dor this post',success:false});
    return res.status(200).json({success:true,comments});
    }catch(error){
     console.log(error);
    }
}

export const deletePost = async(req,res) => {
    try{
     const postId = req.params.id;
     const authorId = req.id;
     const post = await Post.findById(postId)
     if(!post){
        return res.status(404).json({message:'Post not found',success:false});
     }
     if(post.author.toString()!==authorId) return res.status(403).json({message:'Unauthorized'})
        await Post.findByIdAndDelete(postId)
    let user = await User.findById(authorId)
    user.posts = user.posts.filter(id => id.toString()!=postId)
    await Comment.deleteMany({post:postId})
    return res.status(200).json({
        success:'true',
        message:'Post Deleted'
    })
    }catch(error){
        console.log(error)
    }
}
export const bookMarkPost = async(req,res) => {
    try{
    const userId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId)
    if(!post) return res.status(404).json({message:'Post not Found',success:false})
        const user = await User.findById(authorId)
    if(user.bookmarks.includes(post._id)){
        await user.updateOne({$pull:{bookmarks:post._id}})
        await user.save();
        return res.status(200).json({type:'unsaved',message:'Post removed from bookmark',success:true});
    }else{
        await user.updateOne({$addToSet:{bookmarks:post._id}})
        await user.save();
        return res.status(200).json({type:'saved',message:'Post bookmarked',success:true});
    }
    }catch(error){
        console.log(error);
    }
}

export const getUserPostsById = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'username profilePicture' })
      .populate({
        path: 'comments',
        options: { sort: { 'createdAt': -1 } },
        populate: { path: 'author', select: 'username profilePicture' }
      });
    return res.status(200).json({ posts, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error', success: false });
  }
};