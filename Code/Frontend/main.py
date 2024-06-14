import requests
import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk
import os
from utils import show_frame, resize_image, update_user_icon, update_user_info, create_rounded_rectangle

# Import frames
from frames.accueil import Accueil
from frames.tache import Tache
from frames.connexion import Connexion
from frames.profile import Profile
from frames.lootbox import Lootbox
from frames.classement import Classement
from frames.clan import Clan

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

root.iconbitmap(os.path.join(images_path, "icon.ico"))

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
    user_icon_label.bind("<Button-1>", lambda event: show_frame(root, root.frames["Profile"]))  # Redirection vers la page de profil après connexion

# Création du cadre pour le footer
footer_frame = tk.Frame(root, bg="#313131", height=30, bd=0, highlightthickness=0)
footer_frame.pack(side="bottom", fill="x")

# Ajout d'un label dans le footer
footer_label = tk.Label(footer_frame, text="© 2024 Motivapp", font=("Helvetica", 12), fg="white", bg="#313131", bd=0)
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

root.level_label = tk.Label(info_frame, text="", font=("Helvetica", 12), fg="white", bg="#101010", bd=0)
root.level_label.pack()
root.points_label = tk.Label(info_frame, text="", font=("Helvetica", 12), fg="white", bg="#101010", bd=0)
root.points_label.pack()

# Ajout des boutons avec des icônes dans la barre latérale
icons = [("Accueil", "Accueil.webp"), ("Lootbox", "lootbox.png"), ("Clan", "Clan.webp"), ("Tache", "Liste_taches.png"), ("Classement", "Classement.png"), ("Croix", "Sortir.png")]
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
            canvas.bind("<Button-1>", lambda event, icon=icon: show_frame(root, root.frames[icon]))
        buttons.append(canvas)

# Création des pages
frames = {}
for F in (Accueil, Tache, Connexion, Lootbox, Classement, Clan, Profile):
    page_name = F.__name__
    frames[page_name] = F(parent=container, controller=root)
    frames[page_name].grid(row=0, column=0, sticky="nsew")

root.frames = frames

# Affichage initial de la page de connexion
show_frame(root, root.frames["Connexion"])

# Lancement de la boucle principale de l'application
root.mainloop()
