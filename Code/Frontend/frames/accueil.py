import tkinter as tk
from utils import fetch_task_info, show_frame, update_user_info

class Accueil(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        self.controller = controller
        
        self.card = tk.Frame(self, bg="#D5CFE1", bd=0, highlightthickness=0)
        self.card.pack(pady=10, padx=10, fill="both", expand=True)

        self.task_label = tk.Label(self.card, text="", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        self.task_label.pack(pady=10, padx=10)
        
        self.button = tk.Button(self.card, text="Demander à valider la tâche", font=("Helvetica", 12), bg="#E83030", fg="white", command=lambda: show_frame(self.controller, self.controller.frames["Tache"]), relief="flat", bd=0)
        self.button.pack(pady=20, padx=10)
        self.button.config(bd=2, relief="solid", highlightbackground="#E83030", highlightthickness=2, pady=5, padx=5)
        
        self.update_task()
    
    def update_task(self):
        if self.controller.user_data and self.controller.user_data.get('current_task'):
            task_id = self.controller.user_data['current_task']
            task_info = fetch_task_info(task_id, self.controller.token)
            if task_info:
                self.task_label.config(text=f"Tâche courante: {task_info['nom']} - {task_info['description']}")
            else:
                self.task_label.config(text="Aucune tâche courante")
        else:
            self.task_label.config(text="Aucune tâche courante")
