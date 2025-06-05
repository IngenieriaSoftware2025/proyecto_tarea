import { Dropdown } from 'bootstrap';
import Swal from 'sweetalert2';
import DataTable from 'datatables.net-bs5';
import { validarFormulario } from "../funciones";
import { lenguaje } from "../lenguaje";



const FormClientes = document.getElementById('FormClientes');
const BtnGuardar = document.getElementById('BtnGuardar');
// const BtnModificar = document.getElementById('BtnModificar');
// const BtnLimpiar = document.getElementById('BtnLimpiar');
const validarTelefono = document.getElementById('cliente_telefono');
const validarNit = document.getElementById('cliente_nit');

const validacionTelefono = () => {
    const cantidadDigitos = validarTelefono.value;
    if (cantidadDigitos.length < 8 ){
        validarTelefono.classList.remove('is_valid', 'is-invalid');

    }else {
        if(cantidadDigitos.length != 8){
            Swal.fire({
                position:"center",
                icon:"warning",
                title:"datos incorrectos",
                text:"El número de teléfono debe tener 8 dígitos.",
                timer: 2000,
             });

validarTelefono.classList.remove('is-invalid');
            validarTelefono.classList.remove('is_valid');
             

            }
             else{
                validarTelefono.classList.remove('is_valid');
            validarTelefono.classList.remove('is-invalid');
            
        } 
    }
}



function validandoNIT() {
    const nit = cliente_nit.value.trim();

    let nd, add = 0;

    if (nd = /^(\d+)-?([\dkK])$/.exec(nit)) {
        nd[2] = (nd[2].toLowerCase() === 'k') ? 10 : parseInt(nd[2], 10);

        for (let i = 0; i < nd[1].length; i++) {
            add += ((((i - nd[1].length) * -1) + 1) * parseInt(nd[1][i], 10));
        }
        return ((11 - (add % 11)) % 11) === nd[2];
    } else {
        return false;
    }
}


const validacionNIT = () => {

    validandoNIT();

    if (validandoNIT()) {
        cliente_nit.classList.add('is-valid');
        cliente_nit.classList.remove('is-invalid');
    } else {
        cliente_nit.classList.remove('is-valid');
        cliente_nit.classList.add('is-invalid');

        Swal.fire({
            position: "center",
            icon: "error",
            title: "NIT INVALIDO",
            text: "El numero de nit ingresado es invalido",
            showConfirmButton: true,
        });

    }
}




const Datosdelatabla = new  DataTable('#TableClientes',{
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
                title: 'No.',
                data: 'cliente_id',
                width: '%',
                render: (data, type, row, meta) => meta.row + 1

            },

            {title:'Nombre', data: 'cliente_nombres'},
            {title:'apellido', data: 'cliente_apellidos'},
            {title:'NIT', data: 'cliente_nit'},
            {title:'telefono', data: 'cliente_telefono'},
            {title:'correo', data: 'cliente_correo'},
            {
                title: 'Acciones',
                data: 'cliente_id',
                searchable: false,
                orderable: false,
                render: (data, type, row, meta) => {
                    return`
                <div class='d-flex justify-content-center'>
                    <button class='btn btn-warning modificar mx-1' 
                        data-id="${data}" 
                        data-nombre="${row.cliente_nombres}"  
                        data-apellidos="${row.cliente_apellidos}"
                        data-telefono="${row.cliente_telefono}"  
                        data-sar="${row.cliente_nit}"   
                        data-correo="${row.cliente_correo}"  
                        <i class='bi bi-pencil-square me-1'></i> Modificar
                    </button>
                    <button class='btn btn-danger eliminar mx-1' 
                        data-id="${data}">
                        <i class="bi bi-trash3 me-1"></i>Eliminar
                    </button>
                
                </div>
                `;
                }

            }
        ],

});


const guardarAPI = async (e) => {
    e.preventDefault(); // Evita el envío del formulario
    BtnGuardar.disabled = true; // Deshabilita el botón para evitar múltiples envíos

    if(!validarFormulario(FormClientes, ['cliente_id'])) {
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
    const url = '/proyecto_tarea/clientes/guardarAPI'
    const config = {
        method: 'POST',
        body: body
    }

    //guardar cliente
    try{
        const respuesta = await fetch(url, config)
        const datos = await respuesta.json();
        console.log(datos);
        const {codigo, mensaje} = datos;

        if(codigo === 1 ){
            Swal.fire({
            position: "top-end",
            icon: "success",
            title: "exito",
            text: " datos guardados",
            timer: 2000 
           // showConfirmButton: true,
        });


        // limpiarFormulario();
        // buscarCliete();


        }
    }catch(error){
        console.log(error);

    }
    BtnGuardar.disabled = false;
}




// Datosdelatabla.on('click', 'Eliminar', eliminarClientes);
// Datosdelatabla.on('click', 'Modificar', llenarFormulario);
validarTelefono.addEventListener('change', validacionTelefono);
validarNit.addEventListener('change', validacionNIT);
FormClientes.addEventListener('submit', guardarAPI)
