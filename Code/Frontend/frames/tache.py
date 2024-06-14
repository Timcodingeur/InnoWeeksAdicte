import tkinter as tk
from tkinter import messagebox
from utils import fetch_tasks, show_frame
import requests  # Ajouter l'importation de requests

class Tache(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        self.controller = controller
        
        label = tk.Label(self, text="Page de tâche", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)
        
        self.task_list = tk.Listbox(self, font=("Helvetica", 12), bg="#D5CFE1", fg="black", bd=0)
        self.task_list.pack(pady=10, padx=10, fill=tk.BOTH, expand=True)
        
        self.select_button = tk.Button(self, text="Sélectionner la tâche", command=self.select_task)
        self.select_button.pack(pady=10)

    def load_tasks(self):
        print(f"Token: {self.controller.token}")  
        if self.controller.token:
            print("Token found, fetching tasks...")
            tasks = fetch_tasks(self.controller.token)
            print(f"Fetched tasks: {tasks}")  
            self.task_list.delete(0, tk.END)
            if isinstance(tasks, str):
                self.task_list.insert(tk.END, tasks)
            else:
                for task in tasks:
                    self.task_list.insert(tk.END, f"{task['id']} - {task['nom']} - {task['description']}")
        else:
            print("No token found, showing error message.")
            self.task_list.insert(tk.END, "Erreur: Non autorisé. Veuillez vous connecter.")
    
    def select_task(self):
        selected_index = self.task_list.curselection()
        if selected_index:
            task_info = self.task_list.get(selected_index)
            task_id = task_info.split(' - ')[0]  
            self.assign_task(task_id)
    
    def assign_task(self, task_id):
        url = f"http://localhost:3000/api/tasks/{task_id}"
        headers = {"Authorization": f"Bearer {self.controller.token}"}
        data = {"assignedUserId": self.controller.user_data['id']}
        try:
            response = requests.put(url, headers=headers, json=data)
            response.raise_for_status()
            self.controller.user_data['current_task'] = task_id 
            messagebox.showinfo("Succès", "Tâche assignée avec succès")
            show_frame(self.controller, self.controller.frames["Accueil"])
        except requests.exceptions.RequestException as e:
            messagebox.showerror("Erreur", f"Erreur lors de l'assignation de la tâche: {e}")
    
    def update_data(self):
        self.load_tasks()
