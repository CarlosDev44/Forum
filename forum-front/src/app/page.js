"use client"

import {useState} from "react"
import {useEffect} from "react"

export default function Home()
{

   const [editingId, setEditingId] = useState(null)
   const [editTitle, setEditTitle] = useState("")
   const [editContent, setEditContent] = useState("")
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

  const deletePost = async (id) => 
  {
    await fetch(`http://localhost:8000/posts/${id}`, 
      {
        method: "DELETE"
      }
    )

    setPosts(
      posts.filter(post => post.id !== id)
    )
  }

  const startEditing = (post) => 
  {
    setEditingId(post.id)
    setEditTitle(post.title)
    setEditContent(post.content)
  }

  const updatePost = async () =>

    {
      const res = await fetch(`http://localhost:8000/posts/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent
        })
      })

      const updatedPost = await res.json()
      
      setPosts(
        posts.map(post => post.id === editingId ? updatedPost : post)
      )

      setEditingId(null)
      setEditTitle("")
      setEditContent("")
    }

  return (

    <div>
      <h1 className = "text-3xl font-bold mb-4"> Forum </h1>
      <div>
        <input 
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className = "border p-2 w-[300px] mb-2 rounded text-black"
      />
      </div>

      <div>
        <input 
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className = "border p-2 w-[300px] mb-2 rounded text-black"
      />
      </div>

      <button onClick={() =>{createPost()}} className= "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create Post</button>

  
    {posts.map((post) => (
      <div 
        key= {post.id}
        className = "border p-4 mb-3 w-[400px] rounded-lg shadow"
      >
        {editingId === post.id ? (
          <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            <input 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-black border p-2 rounded"
            />
            <input 
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="text-black border p-2 rounded"
            />
            <button onClick={() => updatePost()} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" style={{marginLeft: "auto"}}> Save </button>
          </div>
        ) : (
          <div>
            <h3  className="text-xl font-bold" >{post.title}</h3>
            <p className="text-gray-600" >{post.content}</p>
          </div>
        )}

        <button onClick={() => deletePost(post.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"> Delete </button>
        <button onClick={() => startEditing(post)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"> edit </button>


      </div>
    ))}

    </div>
  )
}