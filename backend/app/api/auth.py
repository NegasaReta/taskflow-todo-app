from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.db.session import get_session
from app.schemas.user_schema import UserCreate, UserLogin
from app.services.auth_service import register_user
from app.crud.user_crud import get_user_by_email
from app.core.security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register(user: UserCreate, session: Session = Depends(get_session)):

    return register_user(session, user)


@router.post("/login")
def login(data: UserLogin, session: Session = Depends(get_session)):

    user = get_user_by_email(session, data.email)

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})

    return {"access_token": token, "token_type": "bearer"}