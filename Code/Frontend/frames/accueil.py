import tkinter as tk
from utils import fetch_task_info, show_frame, update_user_info, fetch_user_tasks, resize_image
import os

images_path = 'Images'

class Accueil(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        self.controller = controller
        
        self.card = tk.Frame(self, bg="#D5CFE1", bd=0, highlightthickness=0)
        self.card.pack(pady=10, padx=10, fill="both", expand=True)

        self.hide_image = resize_image(os.path.join(os.path.dirname(__file__), '..', images_path, "Validation.png"), 16)
        self.show_image = resize_image(os.path.join(os.path.dirname(__file__), '..', images_path, "Croix.png"), 16)

        self.task_label = tk.Label(self.card, text="", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        self.task_label.pack(pady=10, padx=10)

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
                    
                    task_label = tk.Entry(task_frame, font=("Helvetica", 12))

                    self.toggle_btn = tk.Button(task_frame, image=self.hide_image, font=("Helvetica", 8), bg="#00FF0C", fg="white", command=self.toggle_image)
                    self.toggle_btn.pack(side=tk.LEFT, padx=(0, 0))

            else:
                tk.Label(self.card, text="Aucune tâche courante", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0).pack(pady=10, padx=10)
        else:
            tk.Label(self.card, text="Aucune tâche courante", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0).pack(pady=10, padx=10)
    
    def toggle_image(self):
        if self.toggle_btn.cget('bg') == "#E83030":
            self.toggle_btn.config(image=self.hide_image)
            self.toggle_btn.config(bg= "#00FF0C")
        else:
            self.toggle_btn.config(image=self.show_image)
            self.toggle_btn.config(bg= "#E83030")
            

        # Optionally, you can pass the task info to the next frame or handle the task validation here
