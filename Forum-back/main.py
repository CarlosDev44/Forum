from fastapi import Depends, FastAPI, HTTPException
from database import SessionLocal, engine, Base
from models import Post
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from schemas import PostCreate, PostUpdate, ResponsePost

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/posts", response_model=ResponsePost)
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    new_post = Post(title=post.title, content=post.content)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post

@app.get("/posts", response_model=list[ResponsePost])
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).all()
    return posts

@app.get("/posts/{post_id}", response_model=ResponsePost)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@app.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    db.delete(post)
    db.commit()
    return {"detail": "Post deleted successfully"}
    

@app.put("/posts/{post_id}", response_model=ResponsePost)
def update_post(post_id: int, post: PostUpdate, db: Session = Depends(get_db)):
    post_db = db.query(Post).filter(Post.id == post_id).first()

    if not post_db:
        raise HTTPException(status_code=404, detail="Post not found")

    post_db.title = post.title
    post_db.content = post.content
    db.commit()
    db.refresh(post_db)
    return post_db