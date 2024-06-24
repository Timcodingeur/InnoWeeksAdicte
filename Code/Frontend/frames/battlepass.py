import tkinter as tk

class BattlePass(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#D5CFE1", bd=0, highlightthickness=0)
        self.controller = controller
        label = tk.Label(self, text="Récompenses de progression mensuelle", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)
