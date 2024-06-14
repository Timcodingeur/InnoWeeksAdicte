import tkinter as tk

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
        user_info_text += f"Points: {user_data['point']}⌬"
        self.user_info_label.config(text=user_info_text)
