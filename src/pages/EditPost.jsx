import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import postService from "../appwrite/post";
import { Container, PostForm } from "../components";

const EditPost = () => {
    const [ post, setPost ] = useState(null);
    const navigate = useNavigate();
    const { slug } = useParams();

    useEffect(() => {
        if(slug) {
            postService.getPost(slug).then(post => {
                if(post) setPost(post);    
            }).catch(err => console.log(err)) 
        } else {
            navigate('/');
        }       
    }, [slug, navigate]);

    return post ? (
        <div className="py-8">
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null
}

export default EditPost;