import tkinter as tk
from tkinter import ttk
from utils import fetch_classement, show_frame

class Classement(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        self.controller = controller

        label = tk.Label(self, text="Classement", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)

        self.tree = ttk.Treeview(self, columns=("Name", "Level", "Clan", "Trophies"), show="headings")
        self.tree.heading("Name", text="Nom")
        self.tree.heading("Level", text="Niveau")
        self.tree.heading("Clan", text="Clan")
        self.tree.heading("Trophies", text="Trophées")
        self.tree.column("Name", anchor=tk.W, width=150)
        self.tree.column("Level", anchor=tk.CENTER, width=100)
        self.tree.column("Clan", anchor=tk.CENTER, width=150)
        self.tree.column("Trophies", anchor=tk.E, width=100)
        self.tree.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        self.update_data()

    def update_data(self):
        for i in self.tree.get_children():
            self.tree.delete(i)

        users = fetch_classement(self.controller.token)
        for user in users:
            clan_name = user['clandetail']['nom'] if user['clandetail'] else "Aucun"
            self.tree.insert("", tk.END, values=(user['name'], user['level'], clan_name, user['trophee']))

    def tkraise(self, aboveThis=None):
        self.update_data()
        super().tkraise(aboveThis)
