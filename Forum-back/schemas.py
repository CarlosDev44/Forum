from pydantic import BaseModel

class PostCreate(BaseModel):
    title: str
    content: str

class PostUpdate(BaseModel):
    title: str
    content : str

class ResponsePost(BaseModel):
    id: int
    title: str
    content: str

    class Config:
        from_attributes = True