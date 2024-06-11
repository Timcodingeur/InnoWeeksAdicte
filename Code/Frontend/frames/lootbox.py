import tkinter as tk

class Lootbox(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        label = tk.Label(self, text="Page de Lootbox", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)
        desc = tk.Label(self, text="Bonjour", font=("Helvetica", 12), bg="#D5CFE1", fg="black", bd=0)
        desc.pack(pady=10, padx=10)
