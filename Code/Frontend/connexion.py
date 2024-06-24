import tkinter as tk
from tkinter import messagebox
from requests import post, exceptions
from utils import update_user_info, update_user_icon, show_frame, resize_image
import os


base_path = os.path.dirname(__file__)
images_path = os.path.join(base_path, '..', 'Images')

class Connexion(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        self.controller = controller
        
        self.hide_image = resize_image(os.path.join(images_path, "hide.png"), 16)
        self.show_image = resize_image(os.path.join(images_path, "show.png"), 16)

        card = tk.Frame(self, bg="#D5CFE1", bd=0, highlightthickness=0)
        card.pack(pady=10, padx=10, fill="both", expand=True)

        label = tk.Label(card, text="Connexion", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)

        tk.Label(card, text="Nom d'utilisateur", font=("Helvetica", 12), bg="#D5CFE1").pack(pady=5)
        self.username_entry = tk.Entry(card, font=("Helvetica", 12))
        self.username_entry.pack(pady=5)
        self.username_entry.bind("<Return>", self.focus_password_entry)
        self.username_entry.focus_set()
        self.username_entry.bind("<Down>", self.focus_password_entry)

        password_frame = tk.Frame(card, bg="#D5CFE1")
        password_frame.pack(pady=5, fill="x")

        tk.Label(password_frame, text="Mot de passe", font=("Helvetica", 12), bg="#D5CFE1").pack(pady=5)

        self.password_entry = tk.Entry(password_frame, font=("Helvetica", 12), show="*")
        self.password_entry.pack(side=tk.LEFT, fill="x", expand=True, padx=(222, 0))
        self.password_entry.bind("<Return>", self.on_enter)
        self.password_entry.bind("<Up>", self.focus_username_entry)

        self.toggle_btn = tk.Button(password_frame, image=self.show_image, font=("Helvetica", 8), bg="#E83030", fg="white", command=self.toggle_password)
        self.toggle_btn.pack(side=tk.LEFT, padx=(0, 205))

        button = tk.Button(card, text="Se connecter", font=("Helvetica", 12), bg="#E83030", fg="white", command=self.login)
        button.pack(pady=20, padx=10)
        button.config(bd=2, relief="solid", highlightbackground="#E83030", highlightthickness=2, pady=10, padx=10)

        self.message_label = tk.Label(card, text="", font=("Helvetica", 12), bg="#D5CFE1", fg="red")
        self.message_label.pack(pady=10)

    def toggle_password(self):
        if self.password_entry.cget('show') == '':
            self.password_entry.config(show='*')
            self.toggle_btn.config(image=self.show_image)
        else:
            self.password_entry.config(show='')
            self.toggle_btn.config(image=self.hide_image)

    def on_enter(self, event):
        self.login()

    def focus_password_entry(self, event):
        self.password_entry.focus_set()

    def focus_username_entry(self, event):
        self.username_entry.focus_set()

    def login(self):
        username = self.username_entry.get()
        password = self.password_entry.get()
        if not username or not password:
            self.message_label.config(text="Veuillez entrer un nom d'utilisateur et un mot de passe")
            return

        url = "http://localhost:3000/api/users/login"
        data = {'username': username, 'password': password}
        try:
            response = post(url, json=data)
            response.raise_for_status()
            result = response.json()
            self.message_label.config(text="Connexion réussie", fg="green")
            self.controller.token = result['token']
            self.controller.user_data = result['data']
            update_user_info(result['data'], self.controller.level_label, self.controller.points_label)
            self.controller.frames["Profile"].update_user_info(result['data'])
            show_frame(self.controller, self.controller.frames["Accueil"])  
            update_user_icon(result['data'].get('photo'), self.controller.user_icon_label, self.controller.images_path)
            self.destroy()  
        except exceptions.RequestException:
            self.message_label.config(text="Mot de passe ou nom d'utilisateur incorrect", fg="red")

class MainApplication(tk.Tk):
    def __init__(self, *args, **kwargs):
        tk.Tk.__init__(self, *args, **kwargs)

        self.geometry("400x300")
        self.controller = tk.Frame(self)
        self.controller.pack(fill="both", expand=True)

        self.frames = {}
        self.frames["Connexion"] = Connexion(parent=self.controller, controller=self)
        self.frames["Connexion"].pack(fill="both", expand=True)

if __name__ == "__main__":
    app = MainApplication()
    app.mainloop()
