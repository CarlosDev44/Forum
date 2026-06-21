"use client"

import { useState, useEffect } from "react"
import {
  getPosts,
  createPost,
  deletePost,
  updatePost
} from "@/services/posts"

export default function Home() {

  const [posts, setPosts] = useState([])

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")

  // GET POSTS
  useEffect(() => {
    getPosts().then(setPosts)
  }, [])

  // CREATE
  const handleCreate = async () => {
    const newPost = await createPost({ title, content })

    setPosts(prev => [newPost, ...prev])

    setTitle("")
    setContent("")
  }

  // DELETE
  const handleDelete = async (id) => {
    await deletePost(id)
    setPosts(prev => prev.filter(post => post.id !== id))
  }

  // START EDIT
  const startEditing = (post) => {
    setEditingId(post.id)
    setEditTitle(post.title)
    setEditContent(post.content)
  }

  // UPDATE
  const handleUpdate = async () => {
    const updatedPost = await updatePost(editingId, {
      title: editTitle,
      content: editContent
    })

    setPosts(prev =>
      prev.map(post =>
        post.id === editingId ? updatedPost : post
      )
    )

    setEditingId(null)
    setEditTitle("")
    setEditContent("")
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-4">Forum</h1>
      <div>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-[300px] mb-2 rounded text-black"
        />

        <input
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 w-[300px] mb-2 rounded text-black"
        />

        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Post
        </button>
      </div>

      {posts.map((post) => (
        <div
          key={post.id}
          className="border p-4 mb-3 w-[400px] rounded-lg shadow"
        >

          {editingId === post.id ? (
            <div className="flex flex-col gap-2">

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

              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-fit ml-auto"
              >
                Save
              </button>

            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold">{post.title}</h3>
              <p className="text-gray-600">{post.content}</p>
            </div>
          )}

          <div className="flex gap-2 mt-2">

            <button
              onClick={() => handleDelete(post.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>

            <button
              onClick={() => startEditing(post)}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              Edit
            </button>

          </div>

        </div>
      ))}

    </div>
  )
}