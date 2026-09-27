import ttkbootstrap as ttk
from ttkbootstrap.constants import *

class MiInterfaz:
    def __init__(self, root):
        self.root = root
        self.root.title("Prueba Designer V2")
        self.root.geometry("600x450")

        self.frame_principal = ttk.Frame(self.root)
        self.frame_principal.pack(fill=BOTH, expand=YES, padx=20, pady=20)

        self.titulo = ttk.Label(
            self.frame_principal,
            text="Registro de estudiante",
            font=("Arial", 20, "bold"),
            bootstyle="primary"
        )
        self.titulo.pack(pady=10)

        self.frame_formulario = ttk.Labelframe(
            self.frame_principal,
            text="Datos del estudiante",
            padding=15
        )
        self.frame_formulario.pack(fill=X, pady=10)

        self.lbl_nombre = ttk.Label(
            self.frame_formulario,
            text="Nombre:"
        )
        self.lbl_nombre.grid(row=0, column=0, padx=5, pady=5)

        self.entry_nombre = ttk.Entry(
            self.frame_formulario,
            width=30
        )
        self.entry_nombre.grid(row=0, column=1, padx=5, pady=5)

        self.lbl_seccion = ttk.Label(
            self.frame_formulario,
            text="Sección:"
        )
        self.lbl_seccion.grid(row=1, column=0, padx=5, pady=5)

        self.combo_seccion = ttk.Combobox(
            self.frame_formulario,
            values=["A", "B", "C"],
            state="readonly",
            width=27
        )
        self.combo_seccion.grid(row=1, column=1, padx=5, pady=5)

        self.activo = ttk.Checkbutton(
            self.frame_formulario,
            text="Estudiante activo",
            bootstyle="success"
        )
        self.activo.grid(row=2, column=1, padx=5, pady=10)

        self.frame_botones = ttk.Frame(self.frame_principal)
        self.frame_botones.pack(pady=15)

        self.btn_guardar = ttk.Button(
            self.frame_botones,
            text="Guardar",
            bootstyle="success"
        )
        self.btn_guardar.pack(side=LEFT, padx=5)

        self.btn_eliminar = ttk.Button(
            self.frame_botones,
            text="Eliminar",
            bootstyle="danger"
        )
        self.btn_eliminar.pack(side=LEFT, padx=5)


root = ttk.Window(themename="darkly")
app = MiInterfaz(root)
root.mainloop()
