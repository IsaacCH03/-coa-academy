import ttkbootstrap as ttk
from ttkbootstrap.constants import *

root = ttk.Window(themename="superhero")
root.title("COA Registro")
root.geometry("1000x700")

titulo = ttk.Label(root, text="COA REGISTRO", font=("Arial", 24, "bold"), bootstyle="primary")
titulo.place(x=50, y=45, width=300, height=45)
datos = ttk.Labelframe(root, text="Datos de estudiante", padding=12)
datos.place(x=50, y=120, width=900, height=170)
lbl_nombre = ttk.Label(datos, text="Nombre Completo")
lbl_nombre.place(x=20, y=25, width=150, height=32)
entry_nombre = ttk.Entry(datos)
entry_nombre.place(x=180, y=25, width=280, height=34)
lbl_curso = ttk.Label(datos, text="Curso")
lbl_curso.place(x=490, y=25, width=80, height=32)
combo_curso = ttk.Combobox(datos, values=["Python", "Web", "SQL"], state="readonly")
combo_curso.place(x=580, y=25, width=250, height=34)
tabla = ttk.Treeview(root, columns=("nombre", "curso"), show="headings", height=10)
tabla.heading("nombre", text="Nombre")
tabla.heading("curso", text="Curso")
tabla.column("nombre", width=430, anchor="w", stretch=True)
tabla.column("curso", width=250, anchor="w", stretch=True)
tabla.place(x=50, y=330, width=700, height=280)
registrar = ttk.Button(root, text="Registrar", bootstyle="success")
registrar.place(x=780, y=530, width=170, height=44)

root.mainloop()
