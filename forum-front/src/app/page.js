"use client"

import { useEffect, useState } from "react"

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  // EDIT STATE
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")

  // GET POSTS
  useEffect(() => {
    fetch("http://localhost:8000/posts")
      .then((res) => {
        if (!res.ok) throw new Error("Error cargando posts")
        return res.json()
      })
      .then((data) => setPosts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // CREATE POST
  const createPost = async (e) => {
    e.preventDefault()
    if (!title || !content) return

    const res = await fetch("http://localhost:8000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })

    const newPost = await res.json()
    setPosts([newPost, ...posts])

    setTitle("")
    setContent("")
  }

  // DELETE POST
  const deletePost = async (id) => {
    await fetch(`http://localhost:8000/posts/${id}`, {
      method: "DELETE",
    })

    setPosts(posts.filter((p) => p.id !== id))
  }

  // START EDIT
  const startEdit = (post) => {
    setEditingId(post.id)
    setEditTitle(post.title)
    setEditContent(post.content)
  }

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
    setEditContent("")
  }

  // SAVE EDIT
  const saveEdit = async (id) => {
    const res = await fetch(`http://localhost:8000/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        content: editContent,
      }),
    })

    const updated = await res.json()

    setPosts(posts.map((p) => (p.id === id ? updated : p)))

    cancelEdit()
  }

  if (loading) return <p>Cargando posts...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1>🧠 Forum App</h1>

      {/* CREATE FORM */}
      <form onSubmit={createPost} style={{ marginBottom: 30 }}>
        <h2>Crear post</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
          style={{ width: "100%", marginBottom: 10 }}
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Contenido"
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button type="submit">Publicar</button>
      </form>

      {/* POSTS */}
      <h2>Posts</h2>

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ddd",
            padding: 15,
            marginBottom: 10,
          }}
        >
          {/* EDIT MODE */}
          {editingId === post.id ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{ width: "100%", marginBottom: 10 }}
              />

              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={{ width: "100%", marginBottom: 10 }}
              />

              <button onClick={() => saveEdit(post.id)}>Guardar</button>
              <button onClick={cancelEdit} style={{ marginLeft: 10 }}>
                Cancelar
              </button>
            </>
          ) : (
            <>
              <h3>{post.title}</h3>
              <p>{post.content}</p>

              <button onClick={() => startEdit(post)}>Editar</button>

              <button
                onClick={() => deletePost(post.id)}
                style={{ marginLeft: 10 }}
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}