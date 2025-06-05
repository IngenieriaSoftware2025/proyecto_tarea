import { Dropdown } from "bootstrap";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { validarFormulario } from "../funciones";
import { lenguaje } from "../lenguaje";

const FormClientes = document.getElementById("FormClientes");
const BtnGuardar = document.getElementById("BtnGuardar");
const BtnModificar = document.getElementById("BtnModificar");
const BtnLimpiar = document.getElementById("BtnLimpiar");
const validarTelefono = document.getElementById("cliente_telefono");
const validarNit = document.getElementById("cliente_nit");

const validacionTelefono = () => {
  const cantidadDigitos = validarTelefono.value;
  if (cantidadDigitos.length < 8) {
    validarTelefono.classList.remove("is_valid", "is-invalid");
  } else {
    if (cantidadDigitos.length != 8) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "datos incorrectos",
        text: "El número de teléfono debe tener 8 dígitos.",
        timer: 2000,
      });

      validarTelefono.classList.remove("is-invalid");
      validarTelefono.classList.remove("is_valid");
    } else {
      validarTelefono.classList.remove("is_valid");
      validarTelefono.classList.remove("is-invalid");
    }
  }
};

function validandoNIT() {
  const nit = cliente_nit.value.trim();

  let nd,
    add = 0;

  if ((nd = /^(\d+)-?([\dkK])$/.exec(nit))) {
    nd[2] = nd[2].toLowerCase() === "k" ? 10 : parseInt(nd[2], 10);

    for (let i = 0; i < nd[1].length; i++) {
      add += ((i - nd[1].length) * -1 + 1) * parseInt(nd[1][i], 10);
    }
    return (11 - (add % 11)) % 11 === nd[2];
  } else {
    return false;
  }
}

const validacionNIT = () => {
  validandoNIT();

  if (validandoNIT()) {
    cliente_nit.classList.add("is-valid");
    cliente_nit.classList.remove("is-invalid");
  } else {
    cliente_nit.classList.remove("is-valid");
    cliente_nit.classList.add("is-invalid");

    Swal.fire({
      position: "center",
      icon: "error",
      title: "NIT INVALIDO",
      text: "El numero de nit ingresado es invalido",
      showConfirmButton: true,
    });
  }
};

const Datosdelatabla = new DataTable("#TableClientes", {
  dom: `<"row mt-3 justify-content-between" 
            <"col" l> 
            <"col" B> 
            <"col-3" f>
        >
        t
        <"row mt-3 justify-content-between" 
            <"col-md-3 d-flex align-items-center" i> 
            <"col-md-8 d-flex justify-content-end" p>
        >`,
  language: lenguaje,
  data: [],
  columns: [
    {
      title: "No.",
      data: "cliente_id",
      width: "%",
      render: (data, type, row, meta) => meta.row + 1,
    },

    { title: "Nombre", data: "cliente_nombres" },
    { title: "apellido", data: "cliente_apellidos" },
    { title: "NIT", data: "cliente_nit" },
    { title: "telefono", data: "cliente_telefono" },
    { title: "correo", data: "cliente_correo" },
    {
      title: "Acciones",
      data: "cliente_id",
      searchable: false,
      orderable: false,
      render: (data, type, row, meta) => {
        return `
                <div class='d-flex justify-content-center'>
                    <button class='btn btn-warning modificar mx-1' 
                        data-cliente_id="${data}" 
                        data-cliente_nombres="${row.cliente_nombres}"  
                        data-cliente_apellidos="${row.cliente_apellidos}"
                        data-cliente_telefono="${row.cliente_telefono}"  
                        data-cliente_nit="${row.cliente_nit}"   
                        data-cliente_correo="${row.cliente_correo}"  
                        <i class='bi bi-pencil-square me-1'></i> Modificar
                    </button>
                    <button class='btn btn-danger eliminar mx-1' 
                        data-id="${data}">
                        <i class="bi bi-trash3 me-1"></i>Eliminar
                    </button>
                
                </div>
                `;
      },
    },
  ],
});

const guardarAPI = async (e) => {
  e.preventDefault(); // Evita el envío del formulario
  BtnGuardar.disabled = true; // Deshabilita el botón para evitar múltiples envíos

  if (!validarFormulario(FormClientes, ["cliente_id"])) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Campos obligatorios",
      text: " Por favor, complete todos los campos obligatorios.",
      showConfirmButton: true,
    });
    BtnGuardar.disabled = false; // Habilita el botón nuevamente
    return;
  }

  const body = new FormData(FormClientes);
  const url = "/proyecto_tarea/clientes/guardarAPI";
  const config = {
    method: "POST",
    body: body,
  };

  //guardar cliente
  try {
    const respuesta = await fetch(url, config);
    const datos = await respuesta.json();
    console.log(datos);
    const { codigo, mensaje } = datos;

    if (codigo === 1) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "exito",
        text: " datos guardados",
        timer: 2000,
        // showConfirmButton: true,
      });

      limpiarFormulario();
      buscarAPI();
    }
  } catch (error) {
    console.log(error);
  }
  BtnGuardar.disabled = false;
};

const buscarAPI = async () => {
  const url = "/proyecto_tarea/clientes/buscarAPI";
  const config = {
    method: "GET",
  };
  try {
    const respuesta = await fetch(url, config);
    const datos = await respuesta.json();
    const { codigo, mensaje, data } = datos;

    if (codigo === 1) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "exito",
        text: mensaje,
        timer: 2000,
      });

      Datosdelatabla.clear().draw();
      Datosdelatabla.rows.add(data).draw();
    } else {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "error",
        text: mensaje,
        timer: 2000,
      });
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

const llenarFormulario = (e) => {
  const datos = e.currentTarget.dataset;
  document.getElementById("cliente_id").value = datos.cliente_id;
  document.getElementById("cliente_nombres").value = datos.cliente_nombres;
  document.getElementById("cliente_apellidos").value = datos.cliente_apellidos;
   document.getElementById("cliente_nit").value = datos.cliente_nit;
  document.getElementById("cliente_telefono").value = datos.cliente_telefono;
 
  document.getElementById("cliente_correo").value = datos.cliente_correo;

  BtnGuardar.classList.add("d-none");
  BtnModificar.classList.remove("d-none");

  window.scrollTo({
    top: 0,
  });
};

const limpiarFormulario = () => {
  FormClientes.reset();
  BtnGuardar.classList.remove("d-none");
  BtnModificar.classList.add("d-none");
};






const modificarAPI = async (e) => {
  e.preventDefault();
  BtnModificar.disabled = true;

  if (!validarFormulario(FormClientes, [''])) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "exito",
      text: mensaje,
      showConfirmButton: false,
      timer: 2000,
    });
    BtnModificar.disabled = false;
    return;
  }

  const body = new FormData(FormClientes);
  const url = '/proyecto_tarea/clientes/modificarAPI';
  const config = {
    method: "POST",
    body
  };
  try {
    const respuesta = await fetch(url, config);
    const datos = await respuesta.json();

    const { codigo, mensaje, detalle } = datos;

    if (codigo === 1) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "exito",
        text: mensaje,
        timer: 800,
        showConfirmButton: false,
      });

      limpiarFormulario();
      buscarAPI();
    } else {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "error",
        text: detalle,
        showConfirmButton: false,
        timer: 20000,
      });
      
    }
  } catch (error) {
    console.log(error);
  }
  BtnModificar.disabled = false;
};

buscarAPI();

Datosdelatabla.on("click", ".modificar", llenarFormulario);
validarTelefono.addEventListener("change", validacionTelefono);
validarNit.addEventListener("change", validacionNIT);
FormClientes.addEventListener("submit", guardarAPI);
BtnLimpiar.addEventListener("click", limpiarFormulario);
BtnModificar.addEventListener("click", modificarAPI);
