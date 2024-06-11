import tkinter as tk
from tkinter import messagebox
import requests
from utils import update_user_info, update_user_icon, show_frame

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
            self.controller.user_data = result['data']  
            update_user_info(result['data'], self.controller.level_label, self.controller.points_label)
            self.controller.frames["Profile"].update_user_info(result['data'])
            show_frame(self.controller, self.controller.frames["Accueil"])  # Redirection directe après connexion réussie
            update_user_icon(result['data'].get('photo'), self.controller.user_icon_label, self.controller.images_path)
        except requests.exceptions.RequestException as e:
            self.message_label.config(text=f"Erreur de connexion: {e}", fg="red")
