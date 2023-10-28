import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import postService from "../../appwrite/post";
import fileService from "../../appwrite/file";
import { Input, Select, Button, RTE } from "../index";

const PostForm = ({ post }) => {
    const { register, handleSubmit, watch, getValues, setValue, control } = useForm({ 
        defaultValues: {
            title: post?.title || '',
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active'
        }
    });
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);

    // Method for submitting post form 
    const submit = async (data) => {
        if(post) { // Update Post
            // File Upload
            const file = data.image[0] ? await fileService.uploadFile(data.image[0]) : null;
            
            if(file) {
                // Deleting previous image
                await fileService.deleteFile(post.featuredImage);
            }

            // Updating post with post id
            const dbPost = await postService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined
            });
            
            if(dbPost) {
                // redirecting the post
                navigate(`/post/${dbPost.$id}`);
            }
        } else { // New Post
            const file = await fileService.uploadFile(data.image[0]);
            console.log({userData});
            //Checking Image is uploaded successfully
            if(file) {
                console.log("AddPost ",userData);
                console.log("AddPost Data",data);
                const dbPost = await postService.createPost({
                    ...data,
                    featuredImage: file.$id,
                    userId: userData.$id
                });

                if(dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    }

    const slugTransform = useCallback(value => {
        if(value && typeof value === "string") {
            // return value.toLowerCase().replace(/ /g, '-');
            
            return value
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-zA-Z\d\s]+/g, "-")
                    .replace(/\s/g, "-");
        }
        return '';
    }, []);

    useEffect(() => {
        console.log({userData});
        const subscription = watch((value, {name}) => {
            if(name === 'title') {
                setValue('slug', slugTransform(value.title), { shouldValidate: true })
            }
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input 
                    label = "Title: "
                    type = "text"
                    placeholder="Title"
                    className = "mb-4"
                    {...register("title", { required: true })}
                    
                />
                <Input 
                    label = "Slug: "
                    type = "text"
                    placeholder="Slug"
                    className = "mb-4"
                    {...register("slug", { required: true })}
                    onInput = {e => setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })}                    
                />
                <RTE 
                    label = "Content: "
                    name = "content"
                    control={control}
                    defaultValue={getValues('content')}
                />
            </div>
            <div className="w-1/3 px-2">
                <Input 
                    label = "Featured Image: "
                    type = "file"
                    className = "mb-4"
                    accept = "image/jpg, image/jpeg, image/png, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img 
                            src={fileService.getPreviewFile(post.featuredImage)} 
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select 
                    options = {['active', 'inactive']}
                    label = "Status: "
                    className = "mb-4"
                    {...register('status', { required: true })}
                />
                <Button
                    type = "submit"
                    bgColor = {post ? 'bg-green-500' : undefined}
                    className="w-full"
                > 
                    { post ? 'Update' : 'Submit'} 
                </Button>
            </div>
        </form>
    )
};

export default PostForm;