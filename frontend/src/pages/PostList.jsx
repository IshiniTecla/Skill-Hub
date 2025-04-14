import React from "react";
import PostItem from "./PostItem";

const PostList = ({ posts, onDeletePost, onEditPost, onLikePost, onCommentPost, onRepostPost, onSharePost }) => {
    return (
        <div style={{ marginTop: "2rem" }}>
            {posts.length === 0 ? (
                <p style={{ textAlign: "center", color: "#888", marginTop: "2rem" }}>
                    No posts yet.
                </p>
            ) : (
                posts.map((post) => (
                    <PostItem
                        key={post.id}
                        post={post}
                        onDelete={() => onDeletePost(post.id)}
                        onEdit={() => onEditPost(post.id)}
                        onLike={() => onLikePost(post.id)}
                        onComment={() => onCommentPost(post.id)}
                        onRepost={() => onRepostPost(post.id)}
                        onShare={() => onSharePost(post.id)}
                    />
                ))
            )}
        </div>
    );
};

export default PostList;
