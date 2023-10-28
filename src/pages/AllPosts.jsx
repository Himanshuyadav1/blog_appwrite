import { useState, useEffect } from "react";
import postService from "../appwrite/post";
import { Container, PostCard } from "../components";

const AllPost = () => {
    const [ posts, setPosts] = useState([]);
    useEffect(() => {
        postService.getPosts([])
                        .then(posts => {                            
                            if(posts) {
                                setPosts(posts.documents);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
    }, []);
    return (
        <div className="w-full py-8">
            <Container>
                <div className="flex flex-wrap">
                    {posts.map(post => (
                        <div key={post.$id} className="p-2 w-1/4">
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPost;