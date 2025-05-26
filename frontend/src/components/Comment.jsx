import React, { useState, useEffect  } from 'react';
import api from "../api";
import { useParams } from 'react-router-dom';
import DigitalClock from "./DigitalClock";
import '../styles/Comment.css';

function Comment() {
      const { pk } = useParams(); 
        const [content, setContent] = useState("");
        const [created_at, setCreated_at] = useState("");
        const [written_by, setWritten_by] = useState("");
        const [the_product, setThe_product] = useState("");
            const [comments, setComments] = useState([]); 
            const [UserType, setUserType] = useState("");

    useEffect(() => {
        getUsername();
        getType();
        setThe_product(pk);
        GetComments(pk);
    }, []);

  
    const getType = () => {
        api
            .get("api/UserDetails/")
            .then((res) => res.data.profile_user.user_type)
            .then((user_type) => {
            setUserType(user_type);
       //     console.log(user_type, "___");
            })
            .catch((err) => alert(err));
    };
    const getUsername = async () => {
        api.get("api/UserDetails/")
            .then((res) => res.data.username)
            .then((username) => {
                setWritten_by(username);
                console.log(username);
            })
            .catch((err) => alert(err));
    };

    const GetComments = async (pk) => {
// console.log("GetComments is working");
        try{
            const response = await api.get(`api/products/${pk}/comments/`);
            if (response.data) {
                setComments(response.data); 
                setWritten_by(response.data.written_by);
             //   console.log("Comments from backend:", response.data); 
            } else {
                console.error("Comments not found or data is invalid");
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }
        const Add = async (e) => {
            e.preventDefault();    
        try {
            const response = await api.post(
                `api/products/${pk}/comments/create/`, {content, created_at, written_by, the_product});
            
            if (response.status === 201) {
                console.log("Comment successfully created!");
                    setContent('');

                const newComment = response.data;
                setComments([...comments, newComment]);
            } else {
           //     console.log("Failed to create product", response.status);
                alert("Failed to make product.");
            }
        } catch (err) {
            console.log("Error during product creation:", err);
        
            if (err.response) {
             //   console.log("Response error data:", err.response.data);
             //   console.log("Response status:", err.response.status);
             //   console.log("Response headers:", err.response.headers);
            }
        
            if (err.request) {
                console.log("Request error:", err.request);
            }
        
        }
    };

  

return (
    <div>
        {comments.length === 0 ? (
            <div style={{ textAlign: 'center', margin: '50px 0' }}>
                <h3>No comments yet</h3>
            </div>
        ) : (
            <div>
                {UserType === "Customer" &&
                    <div style={{ textAlign: 'left' }}>
                        <form onSubmit={Add} className="form-container" encType="multipart/form-data">
                            <input className="form-input" type="text" value={content} onChange={(e) => setContent(e.target.value)} placeholder="COMMENT" required />
                            <button className="form-button" type="submit">Add comment</button>
                        </form>
                    </div>
                }
                <div className="comments-container">
                    {comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ margin: "0px" }}>{comment.written_by}</h2>
                                <p style={{ margin: 0 }}> {new Date(comment.created_at).toLocaleDateString()}</p>
                            </div>
                            <hr style={{ border: '1px solid #ccc', width: '95%' }} />
                            <p>{comment.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);


}
export default Comment;






// content created_at written_by the_product
// path("products/<int:product_id>/comments/", views.GetComments.as_view(), name="get_comments"),
// path("products/<int:product_id>/comments/create/", views.CreateComment.as_view(), name="create_comment"),

/* setComments(response.data.content); // Update with the array from the API response
                console.log("Comments from backend:", response.data.content); // Log the data received from the backend
                console.log(comments); */