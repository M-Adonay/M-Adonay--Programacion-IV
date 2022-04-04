<template>
    <div class="container-fluid">
        <div class="card text-white bg-secondary" id="carCliente">
            <div class="card-header text-white bg-dark">
                Registro de Alumnos

                <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carCliente" aria-label="Close"></button>
            </div>
            <div class="card-body text-white">
                <form method="post" @submit.prevent="guardarAlumno" @reset="nuevoAlumno">
                    <div class="row p-1">
                        <div class="col col-md-2">Codigo:</div>
                        <div class="col col-md-2">
                            <input title="Ingrese el codigo" v-model="alumno.codigo" pattern="[0-9]{3,10}" required type="text" class="form-control">
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col col-md-2">Nombre:</div>
                        <div class="col col-md-3">
                            <input title="Ingrese el nombre" v-model="alumno.nombre" pattern="[A-Za-zñÑáéíóúü ]{3,75}" required type="text" class="form-control">
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col col-md-2">Fecha de Nacimiento:</div>
                        <div class="col col-md-2">
                            <input title="Ingrese la fecha de nacimiento" v-model="alumno.fechaNacimiento" required type="date" class="form-control">
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col col-md-2">Direccion:</div>
                        <div class="col col-md-3">
                            <input title="Ingrese la direccion" v-model="alumno.direccion" pattern="[0-9#.A-Za-zñÑáéíóúü ]{3,100}" required type="text" class="form-control">
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col col-md-2">Telefono:</div>
                        <div class="col col-md-2">
                            <input title="Ingrese el tel" v-model="alumno.telefono" pattern="[0-9]{4}-[0-9]{4}" required type="text" class="form-control">
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col col-md-2">DUI:</div>
                        <div class="col col-md-2">
                            <input title="Ingrese el DUI" v-model="alumno.dui" pattern="[0-9]{8}-[0-9]{1}" required type="text" class="form-control">
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col col-md-5 text-center">
                            <div v-if="alumno.mostrar_msg" class="alert alert-primary alert-dismissible fade show" role="alert">
                                {{ alumno.msg }}
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                    <div class="row m-2">
                        <div class="col col-md-5 text-center">
                            <input class="btn btn-success" type="submit" value="Guardar">
                            <input class="btn btn-warning" type="reset" value="Nuevo">
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="card text-white" id="carBuscarCliente">
            <div class="card-header bg-dark">
                Busqueda de Alumnos

                <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarCliente" aria-label="Close"></button>
            </div>
            <div class="card-body bg-secondary">
                <table class="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th colspan="7">
                                Buscar: <input @keyup="buscarAlumno" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                            </th>
                        </tr>
                        <tr>
                            <th>CODIGO</th>
                            <th>NOMBRE</th>
                            <th>FECHA DE NACIMIENTO</th>
                            <th>DIRECCION</th>
                            <th>TEL</th>
                            <th>DUI</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in alumnos" @click='modificarAlumno( item )' :key="item.idAlumno">
                            <td>{{item.codigo}}</td>
                            <td>{{item.nombre}}</td>
                            <td>{{item.fechaNacimiento}}</td>
                            <td>{{item.direccion}}</td>
                            <td>{{item.telefono}}</td>
                            <td>{{item.dui}}</td>
                            <td>
                                <button class="btn btn-danger" @click="eliminarAlumno(item)">Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props:['form'],
        data:()=>{
            return {
                buscar:'',
                alumnos:[],
                alumno:{
                    accion : 'nuevo',
                    mostrar_msg : false,
                    msg : '',
                    codigo: '',
                    nombre: '',
                    fechaNacimiento: '',
                    direccion: '',
                    telefono: '',
                    dui: ''
                }
            }
        },
        methods: {
            buscarAlumno(){
                this.obtenerDatos(this.buscar);
            },
            async sincronizarDatosServidor(alumno='', metodo='POST', url='alumnos'){
                await axios({
                    method: metodo,
                    url: url,
                    data: alumno,
                })
                .then(res=>{
                    if( alumno.accion=='nuevo' ){
                        alumno.id = res.data.id;
                        this.actualizarLocal(alumno);
                    }
                    this.alumno.msg = 'Alumno sincronizado con exito en el servidor';
                })
                .catch(err=>{
                    this.alumno.msg = `Error al sincronizar el alumno en el servidor: ${err}`
                });
            },
            actualizarLocal(alumno){
                let store = this.abrirStore('alumno','readwrite'),
                    query = store.put(alumno);
                query.onsuccess=e=>{
                    this.alumno.msg = 'Alumno procesado con exito';
                    this.nuevoAlumno();
                    this.obtenerDatos();
                };
                query.onerror=e=>{
                    this.alumno.msg = 'Error al procesar el alumno';
                };
            },
            guardarAlumno(){
                let metodo = 'PUT',
                    url = `alumnos/${this.alumno.id}`;
                if( this.alumno.accion == 'nuevo' ){
                    this.alumno.idAlumno = generarIdUnicoFecha();
                    metodo = 'POST';
                    url = 'alumnos';
                }
                let alumno = JSON.parse( JSON.stringify(this.alumno) );
                console.log(alumno, metodo, url);
                this.sincronizarDatosServidor(alumno, metodo, url);
                this.actualizarLocal(alumno);
            },
            modificarAlumno(data){
                this.alumno = JSON.parse(JSON.stringify(data));
                this.alumno.accion = 'modificar';
            },
            eliminarAlumno(data){
                if( confirm(`¿Esta seguro de eliminar el alumno ${data.nombre}?`) ){
                    let store = this.abrirStore('alumno','readwrite'),
                        query = store.delete(data.idAlumno),
                        metodo = 'DELETE',
                        url = `alumnos/${data.id}`;
                    this.sincronizarDatosServidor(data, metodo, url);    
                    query.onsuccess=e=>{
                        data.accion = 'eliminar';
                        this.alumno.msg = 'Alumno eliminado con exito';
                        this.nuevoAlumno();
                        this.obtenerDatos();
                    };
                    query.onerror=e=>{
                        this.alumno.msg = `Error al procesar el alumno ${e.target.error}`;
                    };
                }
            },
            obtenerDatos(busqueda=''){
                let store = this.abrirStore('alumno', 'readonly'),
                    data = store.getAll();
                data.onsuccess = resp=>{
                    if( data.result.length<=0 ){
                        fetch(`alumnos`,
                            {credentials:'same-origin'})
                            .then(res=>res.json())
                            .then(data=>{
                                this.alumnos = data;
                                this.alumno.msg = 'Alumnos obtenidos con exito';

                                data.map(alumno=>{
                                    let store = this.abrirStore('alumno','readwrite'),
                                        query = store.put(alumno);
                                    query.onsuccess=e=>{
                                        this.alumno.msg = 'Alumnos guardados en local';
                                    };
                                    query.onerror=e=>{
                                        this.alumno.msg = `Error al obtener alumnos ${e.target.error}`;
                                    };
                                });
                            })
                            .catch(err=>{
                                this.alumno.msg = `Error al sincronizar el alumno en el servidor: ${err}`
                            });
                    }
                    this.alumnos = data.result.filter(alumno=>alumno.nombre.toLowerCase().indexOf(busqueda.toLowerCase())>-1);
                };
                data.onerror = e=>{
                    this.alumno.msg = `Error al obtener los datos ${e.target.error}`;
                };
            },
            nuevoAlumno(){
                this.alumno.accion = 'nuevo';
                this.alumno.idAlumno = '';
                this.alumno.codigo = '';
                this.alumno.nombre = '';
                this.alumno.fechaNacimiento = '';
                this.alumno.direccion = '';
                this.alumno.telefono = '';
                this.alumno.dui = '';
                this.alumno.msg = '';
            },
            abrirStore(store, modo){
                let tx = db.transaction(store, modo);
                return tx.objectStore(store);
            }
        }, 
        created(){
            //this.obtenerDatos();
        }
    }
</script>
