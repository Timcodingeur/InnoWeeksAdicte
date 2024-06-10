import requests
import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageTk
import os

# Création de la fenêtre principale
root = tk.Tk()
root.title("Motivapp")
root.geometry("1024x768")
root.configure(bg='#313131')

# Stocker le jeton d'authentification
root.token = None
root.user_data = None

# Obtenir le chemin du script principal
base_path = os.path.dirname(__file__)
images_path = os.path.join(base_path, 'images')

# Fonction pour changer de page
def show_frame(frame):
    if root.token or frame == frames["Connexion"]:
        if frame == frames["Clan"]:
            frame.update_data()
        frame.tkraise()
    else:
        frames["Connexion"].tkraise()
        update_user_info(None)  # Cacher les informations de l'utilisateur

# Fonction pour ajuster la taille des images
def resize_image(path, height):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return None
    image = Image.open(path)
    image = image.resize((int(image.width * (height / image.height)), height), Image.LANCZOS)
    return ImageTk.PhotoImage(image)

# Fonction pour mettre à jour l'icône utilisateur
def update_user_icon(photo_data):
    if photo_data:
        photo_path = os.path.join(images_path, "user_photo.png")
        with open(photo_path, 'wb') as f:
            f.write(bytes(photo_data))
        user_icon_img = resize_image(photo_path, 50)
    else:
        user_icon_img = resize_image(os.path.join(images_path, "Connection.png"), 50)
    
    if user_icon_img:
        user_icon_label.config(image=user_icon_img)
        user_icon_label.image = user_icon_img

# Fonction pour créer un rectangle avec coins arrondis
def create_rounded_rectangle(canvas, x1, y1, x2, y2, radius=25, **kwargs):
    points = [x1+radius, y1,
              x1+radius, y1,
              x2-radius, y1,
              x2-radius, y1,
              x2, y1,
              x2, y1+radius,
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

# Fonction pour mettre à jour les informations utilisateur
def update_user_info(user_data):
    if user_data:
        level_label.config(text=f"Level {user_data['level']}")
        points_label.config(text=str(user_data['point']))
        level_label.pack()
        points_label.pack()
    else:
        level_label.pack_forget()
        points_label.pack_forget()

# Création du cadre pour le header
header_frame = tk.Frame(root, bg="#313131", height=80, bd=0, highlightthickness=0)
header_frame.pack(side="top", fill="x")

# Ajout du logo dans le header
logo_img = resize_image(os.path.join(images_path, "Logo.png"), 80)
if logo_img:
    logo_label = tk.Label(header_frame, image=logo_img, bg="#313131", bd=0)
    logo_label.pack(side="left", padx=0, pady=0)

# Ajout des icônes utilisateur à droite du header
user_icon_img = resize_image(os.path.join(images_path, "Connection.png"), 50)
if user_icon_img:
    user_icon_label = tk.Label(header_frame, image=user_icon_img, bg="#313131", bd=0)
    user_icon_label.pack(side="right", padx=10)
    user_icon_label.bind("<Button-1>", lambda event: show_frame(frames["Profile"]))  # Redirection vers la page de profil après connexion

# Création du cadre pour le footer
footer_frame = tk.Frame(root, bg="#313131", height=30, bd=0, highlightthickness=0)
footer_frame.pack(side="bottom", fill="x")

# Ajout d'un label dans le footer
footer_label = tk.Label(footer_frame, text="Footer", font=("Helvetica", 12), fg="white", bg="#313131", bd=0)
footer_label.pack()

# Création du conteneur pour les pages
container = tk.Frame(root, bg="#B7B6C1", bd=0, highlightthickness=0)
container.pack(side="right", expand=True, fill="both")

# Création de la barre latérale
sidebar_frame = tk.Frame(root, width=100, bg="#101010", bd=0, highlightthickness=0)
sidebar_frame.pack(side="left", fill="y")

# Ajout des labels d'information dans la barre latérale
info_frame = tk.Frame(sidebar_frame, bg="#101010", height=100, bd=0, highlightthickness=0)
info_frame.pack(pady=0, padx=0)  # Ajustement du padding

level_label = tk.Label(info_frame, text="", font=("Helvetica", 12), fg="white", bg="#101010", bd=0)
level_label.pack()
points_label = tk.Label(info_frame, text="", font=("Helvetica", 12), fg="white", bg="#101010", bd=0)
points_label.pack()

# Ajout des boutons avec des icônes dans la barre latérale
icons = [("Accueil", "Accueil.webp"), ("Panier", "Panier.png"), ("Clan", "Clan.webp"), ("Tache", "Liste_taches.png"), ("Classement", "Classement.png"), ("Croix", "Sortir.png")]
buttons = []
for icon, icon_file in icons:
    img = resize_image(os.path.join(images_path, icon_file), 50)
    if img:
        canvas = tk.Canvas(sidebar_frame, width=80, height=80, bg="#101010", highlightthickness=0, bd=0)
        canvas.pack(pady=10, padx=10)
        color = "#D5CFE1" if icon != "Croix" else "#E83030"
        create_rounded_rectangle(canvas, 5, 5, 75, 75, radius=10, fill=color, outline="")
        canvas.create_image(40, 40, image=img)
        canvas.image = img  # Pour éviter que l'image ne soit détruite par le garbage collector
        if icon == "Croix":
            canvas.bind("<Button-1>", lambda event: root.destroy())
        else:
            canvas.bind("<Button-1>", lambda event, icon=icon: show_frame(frames[icon]))
        buttons.append(canvas)

# Définition des classes pour les pages
class Accueil(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        self.controller = controller
        
        self.card = tk.Frame(self, bg="#D5CFE1", bd=0, highlightthickness=0)
        self.card.pack(pady=10, padx=10, fill="both", expand=True)

        self.task_label = tk.Label(self.card, text="", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        self.task_label.pack(pady=10, padx=10)
        
        self.button = tk.Button(self.card, text="Demander à valider la tâche", font=("Helvetica", 12), bg="#E83030", fg="white", command=lambda: show_frame(frames["Tache"]), relief="flat", bd=0)
        self.button.pack(pady=20, padx=10)
        self.button.config(bd=2, relief="solid", highlightbackground="#E83030", highlightthickness=2, pady=5, padx=5)
        
        self.update_task()
    
    def update_task(self):
        if root.user_data and root.user_data.get('current_task'):
            task_id = root.user_data['current_task']
            task_info = fetch_task_info(task_id)
            if task_info:
                self.task_label.config(text=f"Tâche courante: {task_info['nom']} - {task_info['description']}")
            else:
                self.task_label.config(text="Aucune tâche courante")
        else:
            self.task_label.config(text="Aucune tâche courante")

def fetch_task_info(task_id):
    url = f"http://localhost:3000/api/tasks/{task_id}"
    headers = {"Authorization": f"Bearer {root.token}"}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data['data']
    except requests.exceptions.RequestException as e:
        return None


class Tache(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        self.controller = controller
        
        label = tk.Label(self, text="Page de tâche", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)
        
        self.task_list = tk.Listbox(self, font=("Helvetica", 12), bg="#D5CFE1", fg="black", bd=0)
        self.task_list.pack(pady=10, padx=10, fill=tk.BOTH, expand=True)
        
        self.select_button = tk.Button(self, text="Sélectionner la tâche", command=self.select_task)
        self.select_button.pack(pady=10)
        
        self.load_tasks()
    
    def load_tasks(self):
        if root.token:
            tasks = fetch_tasks()
            self.task_list.delete(0, tk.END)
            if isinstance(tasks, str):
                self.task_list.insert(tk.END, tasks)
            else:
                for task in tasks:
                    self.task_list.insert(tk.END, f"{task['id']} - {task['nom']} - {task['description']}")
        else:
            self.task_list.insert(tk.END, "Erreur: Non autorisé. Veuillez vous connecter.")
    
    def select_task(self):
        selected_index = self.task_list.curselection()
        if selected_index:
            task_info = self.task_list.get(selected_index)
            task_id = task_info.split(' - ')[0]  # Assuming the task id is part of the task_info string
            self.assign_task(task_id)
    
    def assign_task(self, task_id):
        url = f"http://localhost:3000/api/tasks/{task_id}"
        headers = {"Authorization": f"Bearer {root.token}"}
        data = {"assignedUserId": root.user_data['id']}
        try:
            response = requests.put(url, headers=headers, json=data)
            response.raise_for_status()
            root.user_data['current_task'] = task_id  # Mettre à jour la tâche courante de l'utilisateur
            messagebox.showinfo("Succès", "Tâche assignée avec succès")
            show_frame(frames["Accueil"])
        except requests.exceptions.RequestException as e:
            messagebox.showerror("Erreur", f"Erreur lors de l'assignation de la tâche: {e}")

def fetch_tasks():
    url = "http://localhost:3000/api/tasks"
    headers = {"Authorization": f"Bearer {root.token}"}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data['data']
    except requests.exceptions.RequestException as e:
        return f"Erreur lors de la récupération des tâches: {e}"


class Connexion(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        self.controller = controller
        
        card = tk.Frame(self, bg="#D5CFE1", bd=0, highlightthickness=0)
        card.pack(pady=10, padx=10, fill="both", expand=True)

        label = tk.Label(card, text="Connexion", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)

        tk.Label(card, text="Nom d'utilisateur", font=("Helvetica", 12), bg="#D5CFE1").pack(pady=5)
        self.username_entry = tk.Entry(card, font=("Helvetica", 12))
        self.username_entry.pack(pady=5)

        tk.Label(card, text="Mot de passe", font=("Helvetica", 12), bg="#D5CFE1").pack(pady=5)
        self.password_entry = tk.Entry(card, font=("Helvetica", 12), show="*")
        self.password_entry.pack(pady=5)

        self.message_label = tk.Label(card, text="", font=("Helvetica", 12), bg="#D5CFE1", fg="red")
        self.message_label.pack(pady=10)

        button = tk.Button(card, text="Se connecter", font=("Helvetica", 12), bg="#E83030", fg="white", command=self.login)
        button.pack(pady=20, padx=10)
        button.config(bd=2, relief="solid", highlightbackground="#E83030", highlightthickness=2, pady=10, padx=10)
    
    def login(self):
        username = self.username_entry.get()
        password = self.password_entry.get()
        if not username or not password:
            self.message_label.config(text="Veuillez entrer un nom d'utilisateur et un mot de passe")
            return

        # Requête de connexion
        url = "http://localhost:3000/api/users/login"
        data = {'username': username, 'password': password}
        try:
            response = requests.post(url, json=data)
            response.raise_for_status()
            result = response.json()
            self.message_label.config(text="Connexion réussie", fg="green")
            self.controller.token = result['token']  
            root.token = result['token'] 
            root.user_data = result['data']  
            frames["Profile"].update_user_info(result['data'])
            update_user_info(result['data'])  # Mise à jour des informations utilisateur
            root.after(500, lambda: show_frame(frames["Accueil"]))  # Redirection après un délai de 500 ms
            update_user_icon(result['data'].get('photo'))
            
        except requests.exceptions.RequestException as e:
            self.message_label.config(text=f"Erreur de connexion: {e}", fg="red")


class Profile(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        self.controller = controller
        
        card = tk.Frame(self, bg="#D5CFE1", bd=0, highlightthickness=0)
        card.pack(pady=10, padx=10, fill="both", expand=True)

        label = tk.Label(card, text="Profil de l'utilisateur", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)

        # Afficher les informations de l'utilisateur connecté
        self.user_info_label = tk.Label(card, text="", font=("Helvetica", 12), bg="#D5CFE1", fg="black")
        self.user_info_label.pack(pady=10, padx=10)

    def update_user_info(self, user_data):
        user_info_text = f"Nom: {user_data['name']}\n"
        user_info_text += f"Prénom: {user_data['familyname']}\n"
        user_info_text += f"Email: {user_data['email']}\n"
        user_info_text += f"Niveau: {user_data['level']}\n"
        user_info_text += f"Points: {user_data['point']}"
        self.user_info_label.config(text=user_info_text)

class Lootbox(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        label = tk.Label(self, text="Page de Lootbox", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)
        desc = tk.Label(self, text="Bonjour", font=("Helvetica", 12), bg="#D5CFE1", fg="black", bd=0)
        desc.pack(pady=10, padx=10)

class Classement(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        label = tk.Label(self, text="Page de Classement", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)
        desc = tk.Label(self, text="Bonjour", font=("Helvetica", 12), bg="#D5CFE1", fg="black", bd=0)
        desc.pack(pady=10, padx=10)

class Clan(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        self.controller = controller
        
        label = tk.Label(self, text="Page de Clan", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)
        
        self.clan_desc = tk.Label(self, text="", font=("Helvetica", 12), bg="#D5CFE1", fg="black", bd=0)
        self.clan_desc.pack(pady=10, padx=10)
        
        self.user_list = tk.Listbox(self, font=("Helvetica", 12), bg="#D5CFE1", fg="black", bd=0)
        self.user_list.pack(pady=10, padx=10, fill=tk.BOTH, expand=True)
        
        self.clan_buttons = []

    def update_data(self):
        clans = self.fetch_clans()
        desc_text = ""
        self.clear_clan_buttons()  # Clear previous buttons
        if isinstance(clans, str):
            desc_text = clans
        else:
            for clan in clans:
                button = tk.Button(self, text=f"{clan['nom']} - Niveau {clan['level']}", font=("Helvetica", 12), command=lambda c=clan: self.show_clan_users(c))
                button.pack(pady=5)
                self.clan_buttons.append(button)

        self.clan_desc.config(text=desc_text)

    def clear_clan_buttons(self):
        for button in self.clan_buttons:
            button.destroy()
        self.clan_buttons = []

    def fetch_clans(self):
        url = "http://localhost:3000/api/clans"
        headers = {"Authorization": f"Bearer {root.token}"}
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            return data['data']
        except requests.exceptions.RequestException as e:
            return f"Erreur lors de la récupération des données: {e}"

    def show_clan_users(self, clan):
        url = f"http://localhost:3000/api/clans/{clan['id']}/users"
        headers = {"Authorization": f"Bearer {root.token}"}
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            users = response.json()['data']
            self.user_list.delete(0, tk.END)
            for user in users:
                self.user_list.insert(tk.END, f"{user['name']} {user['familyname']} - Niveau {user['level']}")
        except requests.exceptions.RequestException as e:
            self.user_list.delete(0, tk.END)
            self.user_list.insert(tk.END, f"Erreur lors de la récupération des utilisateurs: {e}")


class Panier(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        label = tk.Label(self, text="Page de Panier", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)
        desc = tk.Label(self, text="Bonjour", font=("Helvetica", 12), bg="#D5CFE1", fg="black", bd=0)
        desc.pack(pady=10, padx=10)

# Création des pages
frames = {}
for F in (Accueil, Tache, Connexion, Lootbox, Classement, Clan, Panier, Profile):
    page_name = F.__name__
    frames[page_name] = F(parent=container, controller=root)
    frames[page_name].grid(row=0, column=0, sticky="nsew")

# Affichage initial de la page de connexion
show_frame(frames["Connexion"])

# Lancement de la boucle principale de l'application
root.mainloop()
