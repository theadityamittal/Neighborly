import React from 'react';
import PostCard from "../../../components/VerticalCard/PostCard";

const BulletinCards = ({posts}) => {
    return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {posts.length === 0 ? (
          <div>No posts available.</div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.post_id}
              userName={post.user_name}
              dateTime={new Date(post.date_posted).toLocaleString()}
              postContent={post.content}
              tags={post.tags}
              image={post.image}
            />
          ))
        )}
    </div>
    );
};

export default BulletinCards;