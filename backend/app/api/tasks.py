from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.db.session import get_session
from app.schemas.task_schema import TaskCreate, TaskUpdate
from app.services.task_service import create_task, update_task
from app.crud import task_crud

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("/")
def create(task: TaskCreate, session: Session = Depends(get_session)):

    user_id = 1   # replace with JWT user later

    return create_task(session, task, user_id)


@router.get("/")
def list_tasks(
    status: str | None = None,
    search: str | None = None,
    session: Session = Depends(get_session)
):

    user_id = 1

    return task_crud.get_tasks(session, user_id, status, search)


@router.put("/{task_id}")
def update(task_id: int, data: TaskUpdate, session: Session = Depends(get_session)):

    task = task_crud.get_task(session, task_id)

    return update_task(session, task, data)


@router.delete("/{task_id}")
def delete(task_id: int, session: Session = Depends(get_session)):

    task = task_crud.get_task(session, task_id)

    task_crud.delete_task(session, task)

    return {"message": "deleted"}