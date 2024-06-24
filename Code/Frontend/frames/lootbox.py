import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageTk
import requests
import os
import io
from utils import fetch_and_update_user_info

class Lootbox(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#D5CFE1", bd=0, highlightthickness=0)
        self.controller = controller
        self.lootboxes = []
        self.images_path = os.path.join(os.path.dirname(__file__), '..', 'images')
        self.create_widgets()

    def create_widgets(self):
        label = tk.Label(self, text="Page de Lootbox", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)

        container_frame = tk.Frame(self, bg="#D5CFE1")
        container_frame.pack(side="top", fill="both", expand=True)

        self.canvas = tk.Canvas(container_frame, bg="#D5CFE1", bd=0, highlightthickness=0)
        self.scrollable_frame = ttk.Frame(self.canvas, style="TFrame")
        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(
                scrollregion=self.canvas.bbox("all")
            )
        )

        self.canvas.create_window((0, 0), window=self.scrollable_frame, anchor="n")
        self.canvas.pack(side="top", fill="both", expand=True, padx=100, pady=20)

        self.canvas.bind_all("<MouseWheel>", self._on_mouse_wheel)

    def _on_mouse_wheel(self, event):
        self.canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")

    def update_data(self):
        self.load_lootboxes()

    def load_lootboxes(self):
        url = "http://localhost:3000/api/lootbox"
        headers = {"Authorization": f"Bearer {self.controller.token}"}
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            self.lootboxes = response.json()['data']
            self.display_lootboxes()
        except requests.exceptions.RequestException as e:
            self.display_default_message(f"Erreur lors de la récupération des lootboxes: {e}")

    def display_lootboxes(self):
        for widget in self.scrollable_frame.winfo_children():
            widget.destroy()

        for lootbox in self.lootboxes:
            self.create_lootbox_card(lootbox)
    
        if not self.lootboxes:
            self.display_default_message("Aucune lootbox disponible pour le moment.")

    def create_lootbox_card(self, lootbox):
        card = tk.Frame(self.scrollable_frame, bg="#D5CFE1", bd=2, relief="solid", width=350, height=300)
        card.pack_propagate(0)
        card.pack(pady=10, padx=10, fill="both", expand=True)
        
        label_nom = tk.Label(card, text=f"{lootbox['nom']} - {lootbox['prix']} ⌬", font=("Helvetica", 14), bg="#D5CFE1", fg="black")
        label_nom.pack(pady=8, padx=8)

        cardloot = tk.Frame(card, bg="#B7B6C1", bd=2, relief="solid")
        cardloot.pack(pady=10, padx=10, fill="both", expand=True)
        
        image_path = os.path.join(self.images_path, lootbox.get('image', 'lootbox.png'))
        if not os.path.exists(image_path):
            image_path = os.path.join(self.images_path, 'lootbox.png')
        
        image = Image.open(image_path)
        image = image.resize((150, 150), Image.LANCZOS)
        photo = ImageTk.PhotoImage(image)
        
        image_label = tk.Label(cardloot, image=photo, bg="#B7B6C1")
        image_label.image = photo
        image_label.pack(pady=10)

        # Binding the click event to the card
        card.bind("<Button-1>", lambda event, id=lootbox['id']: self.open_lootbox(id))
        cardloot.bind("<Button-1>", lambda event, id=lootbox['id']: self.open_lootbox(id))
        label_nom.bind("<Button-1>", lambda event, id=lootbox['id']: self.open_lootbox(id))
        image_label.bind("<Button-1>", lambda event, id=lootbox['id']: self.open_lootbox(id))

    def open_lootbox(self, lootbox_id):
        url = f"http://localhost:3000/api/lootbox/{lootbox_id}/ouvrir"
        headers = {"Authorization": f"Bearer {self.controller.token}"}
        try:
            response = requests.post(url, headers=headers)
            response.raise_for_status()
            recompense = response.json()['data']['recompense']
            self.display_reward(recompense)
            fetch_and_update_user_info(self.controller)  # Mise à jour des informations de l'utilisateur
            self.update_data()  # Met à jour les lootboxes pour refléter les changements
        except requests.exceptions.RequestException as e:
            messagebox.showerror("Erreur", f"Erreur lors de l'ouverture de la lootbox: {e}")

    def display_reward(self, recompense):
        reward_window = tk.Toplevel(self)
        reward_window.title("Récompense")
        reward_window.geometry("400x400")
        reward_window.configure(bg="#D5CFE1")

        reward_label = tk.Label(reward_window, text=recompense['nom'], font=("Helvetica", 12), bg="#D5CFE1", fg="black")
        reward_label.pack(pady=10, padx=10)

        image_data = recompense['image']['data']
        image = Image.open(io.BytesIO(bytearray(image_data)))
        image = image.resize((150, 150), Image.LANCZOS)
        photo = ImageTk.PhotoImage(image)

        image_label = tk.Label(reward_window, image=photo, bg="#D5CFE1")
        image_label.image = photo
        image_label.pack(pady=10)

        close_button = tk.Button(reward_window, text="Fermer", command=reward_window.destroy)
        close_button.pack(pady=10)

    def display_default_message(self, message):
        label = tk.Label(self.scrollable_frame, text=message, font=("Helvetica", 14), bg="#D5CFE1", fg="black")
        label.pack(pady=20, padx=20)
