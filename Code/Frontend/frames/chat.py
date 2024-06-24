import tkinter as tk

class Chat(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg="#B7B6C1", bd=0, highlightthickness=0)
        self.controller = controller

        label = tk.Label(self, text="Page de Chat", font=("Helvetica", 14), bg="#D5CFE1", fg="black", bd=0)
        label.pack(pady=10, padx=10)

        chat_frame = tk.Frame(self, bg="#D5CFE1", bd=0, highlightthickness=0)
        chat_frame.pack(pady=10, padx=10, fill="both", expand=True)

        chat_display = tk.Text(chat_frame, font=("Helvetica", 12), bg="#E0E0E0", fg="black", state=tk.DISABLED)
        chat_display.pack(pady=10, padx=10, fill="both", expand=True)

        entry_frame = tk.Frame(self, bg="#D5CFE1", bd=0, highlightthickness=0)
        entry_frame.pack(fill="x", pady=10, padx=10)

        self.chat_entry = tk.Entry(entry_frame, font=("Helvetica", 12), bg="#FFFFFF", fg="black", bd=0)
        self.chat_entry.pack(side=tk.LEFT, fill="x", expand=True, padx=(0, 10))
        self.chat_entry.bind("<Return>", self.send_message)

        send_button = tk.Button(entry_frame, text="Envoyer", font=("Helvetica", 12), bg="#E83030", fg="white", command=self.send_message)
        send_button.pack(side=tk.LEFT)

    def send_message(self, event=None):
        message = self.chat_entry.get()
        if message:
            self.chat_entry.delete(0, tk.END)
            # Logique d'envoi de message à ajouter ici
            print(f"Message envoyé : {message}")

