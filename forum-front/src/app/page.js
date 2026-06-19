"use client"

import {useState} from "react"
import {useEffect} from "react"

export default function Home()
{

   const [posts, setPosts] = useState([])
   const [title, setTitle] = useState("")
   const [content, setContent] = useState("")

  useEffect(() => 
  {
    fetch("http://localhost:8000/posts")
    .then(response => response.json())
    .then(data => setPosts(data))

  }, [])

  const createPost = async () => {

  const res = await fetch("http://localhost:8000/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title,
      content: content
    })
  })

  const newPost = await res.json()

  setPosts([newPost, ...posts])

  setTitle("")
  setContent("")
}
  return (

    <div>
      <h1> Forum </h1>
      <div>
        <input 
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      </div>

      <div>
        <input 
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      </div>

      <button onClick={() =>{createPost()}}>Create Post</button>

  
    {posts.map((post) => (
      <div 
        key= {post.id}
        style={{
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "10px",
        width: "400px"
        }}
      >
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </div>
    ))}

    </div>
  )
}