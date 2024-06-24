import tkinter as tk
from tkinter import ttk
import requests

class Chat(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#D5CFE1", bd=0, highlightthickness=0)
        self.controller = controller
        label = tk.Label(self, text="Espace discussions", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)
        self.create_widgets()
        self.update_data()  # Initial data load

    def create_widgets(self):
        self.message_list = tk.Text(self, state='disabled', wrap='word', bg="#D5CFE1")
        self.message_list.pack(pady=10, padx=10, fill='both', expand=True)

        self.message_entry = tk.Entry(self, font=("Helvetica", 12))
        self.message_entry.pack(pady=5, padx=10, fill='x')
        self.message_entry.bind("<Return>", self.send_message)

        self.send_button = tk.Button(self, text="Envoyer", font=("Helvetica", 12), bg="#E83030", fg="white", command=self.send_message)
        self.send_button.pack(pady=5, padx=10)

    def update_data(self):
        self.load_messages()
        self.after(5000, self.update_data)  # Refresh every 5 seconds

    def load_messages(self):
        url = "http://localhost:3000/api/chat"
        headers = {"Authorization": f"Bearer {self.controller.token}"}
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            messages = response.json()['data']
            self.display_messages(messages)
        except requests.exceptions.RequestException as e:
            print(f"Erreur lors de la récupération des messages de chat: {e}")

    def display_messages(self, messages):
        self.message_list.config(state='normal')
        self.message_list.delete(1.0, tk.END)
        for message in messages:
            user = message['user']['username']
            content = message.get('message', 'Message vide')  # Utiliser get pour éviter KeyError
            self.message_list.insert(tk.END, f"{user}: {content}\n")
        self.message_list.config(state='disabled')

    def send_message(self, event=None):
        content = self.message_entry.get()
        if content:
            url = "http://localhost:3000/api/chat"
            headers = {"Authorization": f"Bearer {self.controller.token}"}
            data = {'message': content}  # Utiliser la clé 'message' pour envoyer le message
            try:
                response = requests.post(url, json=data, headers=headers)
                response.raise_for_status()
                self.message_entry.delete(0, tk.END)
                self.load_messages()  # Refresh messages after sending
            except requests.exceptions.RequestException as e:
                print(f"Erreur lors de l'envoi du message: {e}")
