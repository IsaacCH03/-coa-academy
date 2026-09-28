import tkinter as tk
import ttkbootstrap as ttk

class InterfazApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Mi interfaz")
        self.root.geometry("1100x700")
        self.root.configure(background="#333333")
        self.label1 = ttk.Label(self.root, text="COA REGISTRO", anchor="w")
        _coa_style_label1 = "COA.label1.TLabel"
        ttk.Style().configure(_coa_style_label1, font=("Arial", 25), foreground="#55cddd")
        self.label1.configure(style=_coa_style_label1)
        self.label1.place(x=32, y=48, width=380, height=49)
        self.frame1 = ttk.Frame(self.root)
        self.frame1.place(x=35, y=137, width=1017, height=175)
        self.label2 = ttk.Label(self.frame1, text="Datos de estudiante", anchor="w")
        _coa_style_label2 = "COA.label2.TLabel"
        ttk.Style().configure(_coa_style_label2, font=("Arial", 13))
        self.label2.configure(style=_coa_style_label2)
        self.label2.place(x=4, y=3, width=150, height=30)
        self.entry1 = ttk.Entry(self.frame1)
        self.entry1.place(x=5, y=102, width=180, height=32)
        self.label3 = ttk.Label(self.frame1, text="Nombre Completo", anchor="w")
        _coa_style_label3 = "COA.label3.TLabel"
        ttk.Style().configure(_coa_style_label3, font=("Times New Roman", 13, "bold"), foreground="#160e0e", background="#f3ef8c")
        self.label3.configure(style=_coa_style_label3)
        self.label3.place(x=7, y=72, width=176, height=28)
        self.combo1 = ttk.Combobox(self.frame1, values=["Python Basico", "Python Intermedio"], state="readonly")
        self.combo1.place(x=220, y=103, width=180, height=32)
        self.label4 = ttk.Label(self.frame1, text="Curso", anchor="w")
        _coa_style_label4 = "COA.label4.TLabel"
        ttk.Style().configure(_coa_style_label4, font=("Times New Roman", 13, "bold"), foreground="#000000", background="#f1f386")
        self.label4.configure(style=_coa_style_label4)
        self.label4.place(x=221, y=73, width=178, height=28)
        self.tree1 = ttk.Treeview(self.root, columns=["Nom", "cantidad"], show="headings")
        self.tree1.heading("Nom", text="Nombre")
        self.tree1.column("Nom", width=140, anchor="w", stretch=True)
        self.tree1.heading("cantidad", text="Curso")
        self.tree1.column("cantidad", width=70, anchor="center", stretch=True)
        self.tree1.place(x=39, y=320, width=208, height=334)
        self.button1 = ttk.Button(self.root, text="Registrar", bootstyle="primary")
        _coa_style_button1 = "COA.button1.TButton"
        ttk.Style().configure(_coa_style_button1, font=("Arial", 13))
        self.button1.configure(style=_coa_style_button1)
        self.button1.place(x=272, y=328, width=120, height=36)

root = ttk.Window(themename="superhero")
app = InterfazApp(root)
root.mainloop()
