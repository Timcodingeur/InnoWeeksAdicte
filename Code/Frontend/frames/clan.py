import tkinter as tk
import requests
from utils import show_frame

class Clan(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        self.controller = controller
        
        label = tk.Label(self, text="Page de Clan", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)
        
        self.user_list = tk.Listbox(self, font=("Helvetica", 12), bg="#D5CFE1", fg="black", bd=0)
        self.user_list.pack(pady=10, padx=10, fill=tk.BOTH, expand=True)
        
        self.clan_buttons = []

    def update_data(self):
        clans = self.fetch_clans()
        desc_text = ""
        self.clear_clan_buttons()  
        if isinstance(clans, str):
            desc_text = clans
        else:
            for clan in clans:
                button = tk.Button(self, text=f"{clan['nom']} - Niveau {clan['level']}", font=("Helvetica", 12), command=lambda c=clan: self.show_clan_users(c))
                button.pack(pady=5)
                self.clan_buttons.append(button)

    def clear_clan_buttons(self):
        for button in self.clan_buttons:
            button.destroy()
        self.clan_buttons = []

    def fetch_clans(self):
        url = "http://localhost:3000/api/clans"
        headers = {"Authorization": f"Bearer {self.controller.token}"}
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            return data['data']
        except requests.exceptions.RequestException as e:
            return f"Erreur lors de la récupération des données: {e}"

    def show_clan_users(self, clan):
        url = f"http://localhost:3000/api/clans/{clan['id']}/users"
        headers = {"Authorization": f"Bearer {self.controller.token}"}
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
