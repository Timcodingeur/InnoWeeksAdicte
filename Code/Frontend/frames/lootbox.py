import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk
import requests
import os
import io

class Lootbox(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#D5CFE1", bd=0, highlightthickness=0)
        self.controller = controller
        self.lootboxes = []
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
        
        label = tk.Label(card, text=lootbox['nom'], font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=8, padx=8)
        
        cardloot = tk.Frame(card, bg="#B7B6C1", bd=2, relief="solid")
        cardloot.pack(pady=10, padx=10, fill="both", expand=True)
        
        label = tk.Label(cardloot, text=lootbox['nom'], font=("Helvetica", 12), bg="#B7B6C1", fg="black")
        label.pack(pady=10, padx=10)
        
        image_path = os.path.join('images', lootbox.get('image', 'lootbox.png')) 
        if not os.path.exists(image_path):
            image_path = os.path.join('images', 'lootbox.png')
        image = Image.open(image_path)
        image = image.resize((150, 150), Image.LANCZOS)  
        photo = ImageTk.PhotoImage(image)
        
        image_label = tk.Label(cardloot, image=photo, bg="#B7B6C1")
        image_label.image = photo  
        image_label.pack(pady=10)
        
        label = tk.Label(cardloot, text=str(lootbox['prix']), font=("Helvetica", 14), bg="#B7B6C1", fg="black", bd=0)
        label.pack(pady=8, padx=8)
        
        open_button = tk.Button(cardloot, text="Ouvrir", command=lambda: self.open_lootbox(lootbox['id']))
        open_button.pack(pady=10, padx=10)  # Add padx here for more space if needed

    def open_lootbox(self, lootbox_id):
        url = f"http://localhost:3000/api/lootbox/{lootbox_id}/ouvrir"
        headers = {"Authorization": f"Bearer {self.controller.token}"}
        try:
            response = requests.post(url, headers=headers)
            response.raise_for_status()
            recompense = response.json()['data']['recompense']
            self.display_reward(recompense)
        except requests.exceptions.RequestException as e:
            tk.messagebox.showerror("Erreur", f"Erreur lors de l'ouverture de la lootbox: {e}")

    def display_reward(self, recompense):
        reward_window = tk.Toplevel(self)
        reward_window.title("Récompense")
        reward_window.geometry("400x400")
        reward_window.configure(bg="#D5CFE1")
        
        reward_window.update_idletasks()
        x = (reward_window.winfo_screenwidth() - reward_window.winfo_reqwidth()) // 2
        y = (reward_window.winfo_screenheight() - reward_window.winfo_reqheight()) // 2
        reward_window.geometry(f"+{x}+{y}")

        reward_label = tk.Label(reward_window, text=recompense['nom'], font=("Helvetica", 12), bg="#D5CFE1", fg="black")
        reward_label.pack(pady=10, padx=10)

   
        image_data = recompense['image']['data']
        image = Image.open(io.BytesIO(bytearray(image_data)))
        image = image.resize((150, 150), Image.LANCZOS)  
        photo = ImageTk.PhotoImage(image)

        image_label = tk.Label(reward_window, image=photo, bg="#D5CFE1")
        image_label.image = photo 
        image_label.pack(pady=10)

        self.animate_text(reward_label, recompense['nom'])

        close_button = tk.Button(reward_window, text="Fermer", command=reward_window.destroy)
        close_button.pack(pady=10)

    def animate_text(self, label, text):
        def rotate_text():
            current_text = label.cget("text")
            new_text = current_text[-1] + current_text[:-1]
            label.config(text=new_text)
            label.after(200, rotate_text)
        
        label.config(text=text)
        rotate_text()

    def display_default_message(self, message):
       
        for widget in self.scrollable_frame.winfo_children():
            widget.destroy()

        card = tk.Frame(self.scrollable_frame, bg="#D5CFE1", bd=2, relief="solid", width=350, height=200)
        card.pack_propagate(0)
        card.pack(pady=10, padx=10, fill="both", expand=True)
        
        label = tk.Label(card, text=message, font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=8, padx=8)
        
        cardloot = tk.Frame(card, bg="#B7B6C1", bd=2, relief="solid")
        cardloot.pack(pady=10, padx=10, fill="both", expand=True)
        
        label = tk.Label(cardloot, text="Lootbox par défaut", font=("Helvetica", 12), bg="#B7B6C1", fg="black")
        label.pack(pady=10, padx=10)
        
        image_path = os.path.join('images', 'lootbox.png')  
        image = Image.open(image_path)
        image = image.resize((150, 150), Image.LANCZOS) 
        photo = ImageTk.PhotoImage(image)
        
        image_label = tk.Label(cardloot, image=photo, bg="#B7B6C1")
        image_label.image = photo  
        image_label.pack(pady=10)

        label = tk.Label(cardloot, text="N/A", font=("Helvetica", 14), bg="#B7B6C1", fg="black", bd=0)
        label.pack(pady=8, padx=8)
