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
        {editingId === post.id ? (
          <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            <input 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <input 
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <button onClick={() => updatePost()} style={{marginLeft: "auto", border: "1px solid #ccc", padding: "2px", width: "fit-content"}}> Save </button>
          </div>
        ) : (
          <div>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        )}

        <button onClick={() => deletePost(post.id)} style={{marginRight: "10px", border: "1px solid #ccc", padding: "2px"}}> Delete </button>
        <button onClick={() => startEditing(post)} style={{border: "1px solid #ccc", padding: "2px"}}> edit </button>


      </div>
    ))}

    </div>
  )
}