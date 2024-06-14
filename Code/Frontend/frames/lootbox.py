import tkinter as tk
from PIL import Image, ImageTk
import os

class Lootbox(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        label = tk.Label(self, text="Page de boite a butin", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)

        card = tk.Frame(self, bg="#D5CFE1", bd=0, highlightthickness=0)
        card.pack(pady=10, padx=10, fill="both", expand=True)

        label = tk.Label(card, text="Lootbox disponible", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=8, padx=8)

        cardloot1 = tk.Frame(card, bg="#E42222", bd=0, highlightthickness=0)
        cardloot1.pack(pady=10, padx=10, fill="both", expand=True)

        # Afficher les informations de l'utilisateur connecté
        self.user_info_label = tk.Label(cardloot1, text="butin 1", font=("Helvetica", 12), bg="#D5CFE1", fg="black")
        self.user_info_label.pack(pady=10, padx=10)

                # Chemin de l'image
        base_path = os.path.dirname(__file__)
        images_path = os.path.join(base_path, '..', 'images')
        image_path = os.path.join(images_path, 'lootbox.png')  # Remplacez par le nom de votre image

        # Charger l'image
        image = Image.open(image_path)
        image = image.resize((150, 150), Image.LANCZOS)  # Redimensionner l'image si nécessaire
        photo = ImageTk.PhotoImage(image)

        # Ajouter l'image à un label
        image_label = tk.Label(cardloot1, image=photo, bg="#D5CFE1")
        image_label.image = photo  # Garder une référence de l'image
        image_label.pack(pady=10)

        label = tk.Label(cardloot1, text="500⌬", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=8, padx=8)
        
        cardloot2 = tk.Frame(card, bg="#0499F9", bd=0, highlightthickness=0)
        cardloot2.pack(pady=10, padx=10, fill="both", expand=True)

        # Afficher les informations de l'utilisateur connecté
        self.user_info_label = tk.Label(cardloot2, text="Lootbox 2", font=("Helvetica", 12), bg="#D5CFE1", fg="black")
        self.user_info_label.pack(pady=10, padx=10)

                # Chemin de l'image
        base_path = os.path.dirname(__file__)
        images_path = os.path.join(base_path, '..', 'images')
        image_path = os.path.join(images_path, 'lootbox2.jpg')  # Remplacez par le nom de votre image

        # Charger l'image
        image = Image.open(image_path)
        image = image.resize((150, 150), Image.LANCZOS)  # Redimensionner l'image si nécessaire
        photo = ImageTk.PhotoImage(image)

        # Ajouter l'image à un label
        image_label = tk.Label(cardloot2, image=photo, bg="#D5CFE1")
        image_label.image = photo  # Garder une référence de l'image
        image_label.pack(pady=10)

        label = tk.Label(cardloot2, text="5000⌬", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=8, padx=8)

        #desc = tk.Label(self, text="Bonjour", font=("Helvetica", 12), bg="#D5CFE1", fg="black", bd=0)
        #desc.pack(pady=10, padx=10)
