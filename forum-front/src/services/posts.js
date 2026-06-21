const API = process.env.NEXT_PUBLIC_API_URL

// GET POSTS
export const getPosts = async () => {
  const res = await fetch(`${API}/posts`)
  return res.json()
}

// CREATE POST
export const createPost = async (data) => {
  const res = await fetch(`${API}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  return res.json()
}

// DELETE POST
export const deletePost = async (id) => {
  await fetch(`${API}/posts/${id}`, {
    method: "DELETE"
  })
}

// UPDATE POST
export const updatePost = async (id, data) => {
  const res = await fetch(`${API}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  return res.json()
}