import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk
import os

class BattlePass(tk.Frame):
    """
    Classe représentant l'interface du Battle Pass.

    Parameters
    ----------
    parent : tk.Widget
        Le widget parent.
    controller : object
        Le contrôleur de l'application.
    """
    def __init__(self, parent, controller):
        """
        Initialiser la page Battle Pass.

        Parameters
        ----------
        parent : tk.Widget
            Le widget parent.
        controller : object
            Le contrôleur de l'application.
        """
        tk.Frame.__init__(self, parent, bg="#D5CFE1")
        self.controller = controller

        # Titre
        title_label = tk.Label(self, text="Battle pass", font=("Helvetica", 24), bg="#D5CFE1")
        title_label.pack(pady=20)

        # Cadre pour la barre de défilement
        navigation_frame = tk.Frame(self, bg="#D5CFE1")
        navigation_frame.pack(fill="both", expand=True)

        # Boutons de navigation
        self.left_button_Big = tk.Button(navigation_frame, text="<<", command=self.scroll_left_Big, bg="#D5CFE1", font=("Helvetica", 18))
        self.left_button_Big.pack(side="left", padx=10, pady=10)

        self.left_button = tk.Button(navigation_frame, text="<", command=self.scroll_left, bg="#D5CFE1", font=("Helvetica", 18))
        self.left_button.pack(side="left", padx=10, pady=10)

        self.right_button_Big = tk.Button(navigation_frame, text=">>", command=self.scroll_right_Big, bg="#D5CFE1", font=("Helvetica", 18))
        self.right_button_Big.pack(side="right", padx=10, pady=10)

        self.right_button = tk.Button(navigation_frame, text=">", command=self.scroll_right, bg="#D5CFE1", font=("Helvetica", 18))
        self.right_button.pack(side="right", padx=10, pady=10)

        # Canvas pour contenir le Battle Pass
        self.canvas = tk.Canvas(navigation_frame, bg="#F0E6FA", bd=0, highlightthickness=0)
        self.canvas.pack(side="left", fill="both", expand=True)

        # Créer un cadre interne pour contenir tous les widgets
        self.outer_frame = tk.Frame(self.canvas, bg="#F0E6FA")
        self.inner_frame = tk.Frame(self.outer_frame, bg="#F0E6FA")
        self.outer_window = self.canvas.create_window((0, 0), window=self.outer_frame, anchor="n")

        # Configurer le canvas pour s'adapter à la taille du contenu
        self.inner_frame.pack(anchor="center")
        self.outer_frame.bind("<Configure>", self.on_frame_configure)

        # Créer plusieurs cartes et les ajouter au cadre interne
        items = [
            ("10xp", "Accueil.webp"),
            ("75", "chat.png"),
            ("Avatar", "chat.png"),
            ("Surprise", "chat.png"),
            ("50xp", "chat.png"),
            ("130", "chat.png"),
            ("Mouse", "chat.png")
        ]

        self.cards = []
        for i, (text, img_file) in enumerate(items):
            card = self.create_card(self.inner_frame, text, img_file)
            card.grid(row=0, column=i*2, padx=10, pady=10)
            self.cards.append(card)
            if i < len(items) - 1:
                arrow = self.create_arrow(self.inner_frame)
                arrow.grid(row=0, column=i*2+1)

    def create_card(self, parent, text, img_file):
        """
        Crée une carte contenant une image et un texte.

        Parameters
        ----------
        parent : tk.Widget
            Le widget parent.
        text : str
            Le texte à afficher sur la carte.
        img_file : str
            Le fichier image à afficher sur la carte.

        Returns
        -------
        tk.Frame
            Le widget de la carte.
        """
        # Chemin de l'image
        base_path = os.path.dirname(__file__)
        images_path = os.path.join(base_path, '..', 'Images')
        image_path = os.path.join(images_path, img_file)

        # Créer une carte pour les informations et l'image
        card = tk.Frame(parent, bg="#D5CFE1", bd=2, relief="groove")

        # Charger l'image
        image = Image.open(image_path)
        image = image.resize((80, 80), Image.LANCZOS)  # Redimensionner l'image si nécessaire
        photo = ImageTk.PhotoImage(image)

        # Ajouter l'image à un label
        image_label = tk.Label(card, image=photo, bg="#D5CFE1")
        image_label.image = photo  # Garder une référence de l'image
        image_label.pack(pady=10)

        # Ajouter un label pour les informations
        info_label = tk.Label(card, text=text, font=("Helvetica", 12), bg="#D5CFE1", fg="black")
        info_label.pack(pady=10, padx=10)

        return card

    def create_arrow(self, parent):
        """
        Crée un widget représentant une flèche.

        Parameters
        ----------
        parent : tk.Widget
            Le widget parent.

        Returns
        -------
        tk.Label
            Le widget représentant la flèche.
        """
        # Créer un label pour représenter une flèche
        arrow = tk.Label(parent, text="➔", font=("Helvetica", 24), bg="#F0E6FA", fg="black")
        return arrow

    def on_frame_configure(self, event):
        """
        Met à jour la région de défilement du canvas pour s'adapter à la taille du contenu.

        Parameters
        ----------
        event : tk.Event
            L'événement de configuration.
        """
        self.canvas.configure(scrollregion=self.canvas.bbox("all"))
        self.center_frame()

    def center_frame(self):
        """
        Centre le cadre interne horizontalement dans le canvas.
        """
        canvas_width = self.canvas.winfo_width()
        frame_width = self.inner_frame.winfo_reqwidth()
        if frame_width < canvas_width:
            x_offset = (canvas_width - frame_width) // 2
            self.canvas.coords(self.outer_window, x_offset, 0)
        else:
            self.canvas.coords(self.outer_window, 0, 0)

    def scroll_left(self):
        """Défile vers la gauche."""
        self.canvas.xview_scroll(-5, "units")

    def scroll_left_Big(self):
        """Défile vers la gauche."""
        self.canvas.xview_scroll(-1000, "units")

    def scroll_right(self):
        """Défile vers la droite."""
        self.canvas.xview_scroll(5, "units")

    def scroll_right_Big(self):
        """Défile vers la droite."""
        self.canvas.xview_scroll(1000, "units")

# Pour tester la page BattlePass séparément
if __name__ == "__main__":
    root = tk.Tk()
    root.title("Test BattlePass")
    root.geometry("1024x768")
    battle_pass_frame = BattlePass(root, None)
    battle_pass_frame.pack(fill="both", expand=True)
    root.mainloop()
