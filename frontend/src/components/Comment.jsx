import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'

const Comment = ({ comment }) => {
    console.log('Comment:', comment);
    return (
        <div className='my-2'>
            <div className='flex gap-3 items-center'>
                <Avatar>
                    <Link to={`/profile/${comment.author?._id}`}>
                        <AvatarImage src={comment?.author?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Link>
                </Avatar>
                <h1 className='font-bold text-sm'>
                    <Link to={`/profile/${comment.author?._id}`}>{comment?.author?.username}</Link>
                    <span className='font-normal pl-1'>{comment?.text}</span>
                </h1>
            </div>
        </div>
    )
}

export default Comment;
