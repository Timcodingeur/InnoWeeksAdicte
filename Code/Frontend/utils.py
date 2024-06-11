import os
from PIL import Image, ImageTk
import requests

def show_frame(controller, frame):
    if controller.token or frame == controller.frames["Connexion"]:
        if frame == controller.frames["Clan"]:
            frame.update_data()
        elif frame == controller.frames["Tache"]:
            frame.update_data()
        elif frame == controller.frames["Accueil"]:
            frame.update_task()
        elif frame == controller.frames["Classement"]:
            frame.update_data()
        frame.tkraise()
    else:
        controller.frames["Connexion"].tkraise()
        update_user_info(None, controller.level_label, controller.points_label)

def resize_image(path, height):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return None
    image = Image.open(path)
    image = image.resize((int(image.width * (height / image.height)), height), Image.LANCZOS)
    return ImageTk.PhotoImage(image)

def update_user_icon(photo_data, label, images_path):
    if photo_data:
        photo_path = os.path.join(images_path, "user_photo.png")
        with open(photo_path, 'wb') as f:
            f.write(bytes(photo_data))
        user_icon_img = resize_image(photo_path, 50)
    else:
        user_icon_img = resize_image(os.path.join(images_path, "Connection.png"), 50)
    
    if user_icon_img:
        label.config(image=user_icon_img)
        label.image = user_icon_img

def update_user_info(user_data, level_label, points_label):
    if user_data:
        level_label.config(text=f"Level {user_data['level']}")
        points_label.config(text=str(user_data['point']))
        level_label.pack()
        points_label.pack()
    else:
        level_label.pack_forget()
        points_label.pack_forget()

def create_rounded_rectangle(canvas, x1, y1, x2, y2, radius=25, **kwargs):
    points = [x1+radius, y1,
              x1+radius, y1,
              x2-radius, y1,
              x2-radius, y1,
              x2, y1,
              x2, y1+radius,
              x2, y2-radius,
              x2, y2-radius,
              x2, y2,
              x2-radius, y2,
              x2-radius, y2,
              x1+radius, y2,
              x1+radius, y2,
              x1, y2,
              x1, y2-radius,
              x1, y2-radius,
              x1, y1+radius,
              x1, y1+radius,
              x1, y1]
    return canvas.create_polygon(points, **kwargs, smooth=True)

def fetch_task_info(task_id, token):
    url = f"http://localhost:3000/api/tasks/{task_id}"
    headers = {"Authorization": f"Bearer {token}"}
    print(f"Fetching task info with token: {token}")
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data['data']
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch task info: {e}")
        return None

def fetch_tasks(token):
    url = "http://localhost:3000/api/tasks"
    headers = {"Authorization": f"Bearer {token}"}
    print(f"Fetching tasks with token: {token}")
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data['data']
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch tasks: {e}")
        return f"Erreur lors de la récupération des tâches: {e}"

def fetch_clans(token):
    url = "http://localhost:3000/api/clans"
    headers = {"Authorization": f"Bearer {token}"}
    print(f"Fetching clans with token: {token}")
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data['data']
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch clans: {e}")
        return f"Erreur lors de la récupération des clans: {e}"

def fetch_user_tasks(user_id, token):
    url = f"http://localhost:3000/api/tasks/assigned/{user_id}"
    headers = {"Authorization": f"Bearer {token}"}
    print(f"Fetching tasks for user {user_id} with token: {token}")
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data['data']
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch tasks for user: {e}")
        return f"Erreur lors de la récupération des tâches assignées: {e}"

def fetch_classement(token):
    url = "http://localhost:3000/api/users/classement"
    headers = {"Authorization": f"Bearer {token}"}
    print(f"Fetching classement with token: {token}")
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data['data']
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch classement: {e}")
        return []
