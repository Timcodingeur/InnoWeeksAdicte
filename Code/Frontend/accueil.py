import tkinter as tk
from tkinter import ttk

# Création de la fenêtre principale
root = tk.Tk()
root.title("Application de base Tkinter")
root.geometry("800x600")

# Création du cadre pour le header
header_frame = ttk.Frame(root, padding="10", relief="solid")
header_frame.pack(side="top", fill="x")

# Ajout d'un label dans le header
header_label = ttk.Label(header_frame, text="Header", font=("Helvetica", 16))
header_label.pack()

# Création du cadre pour le main
main_frame = ttk.Frame(root, padding="10")
main_frame.pack(expand=True, fill="both")

# Ajout d'un label dans le main
main_label = ttk.Label(main_frame, text="Main Content Area", font=("Helvetica", 14))
main_label.pack()

# Création du cadre pour le footer
footer_frame = ttk.Frame(root, padding="10", relief="solid")
footer_frame.pack(side="bottom", fill="x")

# Ajout d'un label dans le footer
footer_label = ttk.Label(footer_frame, text="Footer", font=("Helvetica", 12))
footer_label.pack()

# Lancement de la boucle principale de l'application
root.mainloop()
