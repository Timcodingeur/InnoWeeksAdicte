import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk
import os

# Création de la fenêtre principale
root = tk.Tk()
root.title("Motivapp")
root.geometry("1024x768")
root.configure(bg='#313131')

# Obtenir le chemin du script principal
base_path = os.path.dirname(__file__)
images_path = os.path.join(base_path, 'images')

# Fonction pour changer de page
def show_frame(frame):
    frame.tkraise()

# Fonction pour ajuster la taille des images
def resize_image(path, height):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return None
    image = Image.open(path)
    image = image.resize((int(image.width * (height / image.height)), height), Image.LANCZOS)
    return ImageTk.PhotoImage(image)

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

# Création du cadre pour le header
header_frame = tk.Frame(root, bg="#313131", height=80, bd=0, highlightthickness=0)
header_frame.pack(side="top", fill="x")

# Ajout du logo dans le header
logo_img = resize_image(os.path.join(images_path, "Logo.png"), 80)
if logo_img:
    logo_label = tk.Label(header_frame, image=logo_img, bg="#313131", bd=0)
    logo_label.pack(side="left", padx=0, pady=0)

# Ajout des icônes utilisateur à droite du header
user_icon_img = resize_image(os.path.join(images_path, "Panier.png"), 50)
if user_icon_img:
    user_icon_label = tk.Label(header_frame, image=user_icon_img, bg="#313131", bd=0)
    user_icon_label.pack(side="right", padx=10)

settings_icon_img = resize_image(os.path.join(images_path, "Image niveau.png"), 50)
if settings_icon_img:
    settings_icon_label = tk.Label(header_frame, image=settings_icon_img, bg="#313131", bd=0)
    settings_icon_label.pack(side="right", padx=10)

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
level_label = tk.Label(info_frame, text="Level 1", font=("Helvetica", 12), fg="white", bg="#101010", bd=0)
level_label.pack()
points_label = tk.Label(info_frame, text="500", font=("Helvetica", 12), fg="white", bg="#101010", bd=0)
points_label.pack()

# Ajout des boutons avec des icônes dans la barre latérale
icons = ["Accueil", "Panier", "Clan", "Liste tâches", "Croix", "Nouveau Bouton 1", "Nouveau Bouton 2"]
icon_files = ["Accueil.webp", "Panier.png", "Clan.webp", "Liste tâches.png", "Croix.png", "Panier.png", "Panier.png"]

buttons = []
for i, icon in enumerate(icons):
    img = resize_image(os.path.join(images_path, icon_files[i]), 50)
    if img:
        canvas = tk.Canvas(sidebar_frame, width=80, height=80, bg="#101010", highlightthickness=0, bd=0)
        canvas.pack(pady=10, padx=10)
        color = "#D5CFE1" if i < 5 else ("#E83030" if i == 6 else "#D5CFE1")
        create_rounded_rectangle(canvas, 5, 5, 75, 75, radius=10, fill=color, outline="")
        canvas.create_image(40, 40, image=img)
        canvas.image = img  # Pour éviter que l'image ne soit détruite par le garbage collector
        canvas.bind("<Button-1>", lambda event, i=i: show_frame(frames[icons[i]]))
        buttons.append(canvas)

# Définition des classes pour les pages
class AccueilPage(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        card = tk.Frame(self, bg="#D5CFE1", bd=0, highlightthickness=0)
        card.pack(pady=10, padx=10, fill="both", expand=True)

        label = tk.Label(card, text="Nom de la tâche courante", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)
        desc = tk.Label(card, text="Nombre de point de la mission\nAction à finir pour la tâche courante", font=("Helvetica", 12), bg="#D5CFE1", fg="black", bd=0)
        desc.pack(pady=10, padx=10)
        button = tk.Button(card, text="Button", font=("Helvetica", 12), bg="#E83030", fg="white", command=lambda: show_frame(frames["TachePage"]), relief="flat", bd=0)
        button.pack(pady=20, padx=10)
        button.config(bd=2, relief="solid", highlightbackground="#E83030", highlightthickness=2, pady=5, padx=5)

class TachePage(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        label = tk.Label(self, text="Page de tâche", font=("Helvetica", 14), bg="#D5CFE1", fg
="black", bd=0)
        label.pack(pady=10, padx=10)
        # Ajoutez ici les composants spécifiques à la page de tâche

class ConnexionPage(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        label = tk.Label(self, text="Connexion", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)
        # Ajoutez ici les composants spécifiques à la page de connexion

class LootboxPage(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        label = tk.Label(self, text="Page de Lootbox", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)
        # Ajoutez ici les composants spécifiques à la page de lootbox

class ClassementPage(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        label = tk.Label(self, text="Page de Classement", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)
        # Ajoutez ici les composants spécifiques à la page de classement

# Création des pages
frames = {}
for F in (AccueilPage, TachePage, ConnexionPage, LootboxPage, ClassementPage):
    page_name = F.__name__
    frame = F(parent=container, controller=root)
    frames[page_name] = frame
    frame.grid(row=0, column=0, sticky="nsew")

# Affichage initial de la page d'accueil
show_frame(frames["AccueilPage"])

# Lancement de la boucle principale de l'application
root.mainloop()
