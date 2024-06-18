import tkinter as tk
from utils import fetch_task_info, show_frame, update_user_info, fetch_user_tasks

class Accueil(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        self.controller = controller
        
        self.card = tk.Frame(self, bg="#D5CFE1", bd=0, highlightthickness=0)
        self.card.pack(pady=10, padx=10, fill="both", expand=True)
        
        self.update_task()
    
    def update_task(self):
        for widget in self.card.winfo_children():
            widget.destroy()
        
        if self.controller.user_data:
            tasks = fetch_user_tasks(self.controller.user_data['id'], self.controller.token)
            if tasks:
                for task in tasks:
                    task_frame = tk.Frame(self.card, bg="#D5CFE1", bd=0, highlightthickness=0)
                    task_frame.pack(pady=10, padx=10, fill="x")
                    
                    task_label = tk.Label(task_frame, text=f"Tâche courante: {task['nom']} - {task['description']} - {task['nbpoints']}⌬", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
                    task_label.pack(side="left", pady=10, padx=10)
                    
                    button = tk.Button(task_frame, text="Demander à valider la tâche", font=("Helvetica", 12), bg="#E83030", fg="white", command=lambda task=task: self.validate_task(task), relief="flat", bd=0)
                    button.pack(side="right", pady=5, padx=5)
                    button.config(bd=2, relief="solid", highlightbackground="#E83030", highlightthickness=2)
            else:
                tk.Label(self.card, text="Aucune tâche courante", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0).pack(pady=10, padx=10)
        else:
            tk.Label(self.card, text="Aucune tâche courante", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0).pack(pady=10, padx=10)
    
    def validate_task(self, task):
        show_frame(self.controller, self.controller.frames["Tache"])
        # Optionally, you can pass the task info to the next frame or handle the task validation here

