import ttkbootstrap as ttk
from ttkbootstrap.constants import *

class PanelEstudiantes:
    def __init__(self, root):
        self.root = root
        self.root.title("COA - Gestión de Estudiantes")
        self.root.geometry("900x650")

        self.main = ttk.Frame(self.root)
        self.main.pack(fill=BOTH, expand=YES, padx=20, pady=20)

        self.header = ttk.Frame(self.main)
        self.header.pack(fill=X, pady=10)

        self.titulo = ttk.Label(
            self.header,
            text="Gestión de Estudiantes",
            font=("Arial", 22, "bold"),
            bootstyle="primary"
        )
        self.titulo.pack(side=LEFT)

        self.btn_nuevo = ttk.Button(
            self.header,
            text="Nuevo estudiante",
            bootstyle="success"
        )
        self.btn_nuevo.pack(side=RIGHT)

        self.formulario = ttk.Labelframe(
            self.main,
            text="Datos del estudiante",
            padding=15
        )
        self.formulario.pack(fill=X, pady=10)

        self.lbl_nombre = ttk.Label(
            self.formulario,
            text="Nombre completo"
        )
        self.lbl_nombre.grid(row=0, column=0, padx=8, pady=8)

        self.entry_nombre = ttk.Entry(
            self.formulario,
            width=30
        )
        self.entry_nombre.grid(row=0, column=1, padx=8, pady=8)

        self.lbl_seccion = ttk.Label(
            self.formulario,
            text="Sección"
        )
        self.lbl_seccion.grid(row=0, column=2, padx=8, pady=8)

        self.combo_seccion = ttk.Combobox(
            self.formulario,
            values=["A", "B", "C", "D"],
            state="readonly",
            width=18
        )
        self.combo_seccion.grid(row=0, column=3, padx=8, pady=8)

        self.lbl_correo = ttk.Label(
            self.formulario,
            text="Correo"
        )
        self.lbl_correo.grid(row=1, column=0, padx=8, pady=8)

        self.entry_correo = ttk.Entry(
            self.formulario,
            width=30
        )
        self.entry_correo.grid(row=1, column=1, padx=8, pady=8)

        self.activo = ttk.Checkbutton(
            self.formulario,
            text="Estudiante activo",
            bootstyle="success"
        )
        self.activo.grid(row=1, column=2, padx=8, pady=8)

        self.filtros = ttk.Frame(self.main)
        self.filtros.pack(fill=X, pady=10)

        self.lbl_buscar = ttk.Label(
            self.filtros,
            text="Buscar:"
        )
        self.lbl_buscar.pack(side=LEFT, padx=5)

        self.entry_buscar = ttk.Entry(
            self.filtros,
            width=30
        )
        self.entry_buscar.pack(side=LEFT, padx=5)

        self.btn_buscar = ttk.Button(
            self.filtros,
            text="Buscar",
            bootstyle="primary"
        )
        self.btn_buscar.pack(side=LEFT, padx=5)

        self.btn_limpiar = ttk.Button(
            self.filtros,
            text="Limpiar",
            bootstyle="secondary-outline"
        )
        self.btn_limpiar.pack(side=LEFT, padx=5)

        self.panel_tabla = ttk.Labelframe(
            self.main,
            text="Estudiantes registrados",
            padding=10
        )
        self.panel_tabla.pack(fill=BOTH, expand=YES, pady=10)

        self.tabla = ttk.Treeview(
            self.panel_tabla,
            columns=("nombre", "seccion", "correo", "estado"),
            show="headings",
            height=8
        )

        self.tabla.heading("nombre", text="Nombre")
        self.tabla.heading("seccion", text="Sección")
        self.tabla.heading("correo", text="Correo")
        self.tabla.heading("estado", text="Estado")

        self.tabla.column("nombre", width=180)
        self.tabla.column("seccion", width=80)
        self.tabla.column("correo", width=220)
        self.tabla.column("estado", width=100)

        self.tabla.pack(fill=BOTH, expand=YES)

        self.panel_estado = ttk.Frame(self.main)
        self.panel_estado.pack(fill=X, pady=10)

        self.lbl_estado = ttk.Label(
            self.panel_estado,
            text="Progreso del grupo"
        )
        self.lbl_estado.pack(side=LEFT, padx=5)

        self.progreso = ttk.Progressbar(
            self.panel_estado,
            value=70,
            maximum=100,
            bootstyle="success",
            length=250
        )
        self.progreso.pack(side=LEFT, padx=10)

        self.lbl_porcentaje = ttk.Label(
            self.panel_estado,
            text="70%",
            bootstyle="success"
        )
        self.lbl_porcentaje.pack(side=LEFT)

        self.acciones = ttk.Frame(self.main)
        self.acciones.pack(fill=X, pady=10)

        self.btn_guardar = ttk.Button(
            self.acciones,
            text="Guardar",
            bootstyle="success"
        )
        self.btn_guardar.pack(side=LEFT, padx=5)

        self.btn_editar = ttk.Button(
            self.acciones,
            text="Editar",
            bootstyle="warning"
        )
        self.btn_editar.pack(side=LEFT, padx=5)

        self.btn_eliminar = ttk.Button(
            self.acciones,
            text="Eliminar",
            bootstyle="danger"
        )
        self.btn_eliminar.pack(side=LEFT, padx=5)

        self.btn_salir = ttk.Button(
            self.acciones,
            text="Salir",
            bootstyle="secondary-outline"
        )
        self.btn_salir.pack(side=RIGHT, padx=5)


root = ttk.Window(themename="superhero")
app = PanelEstudiantes(root)
root.mainloop()
