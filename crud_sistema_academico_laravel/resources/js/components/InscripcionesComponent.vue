<template>
        <div class="container-fluid">
            <div class="card text-white" id="carCliente">
                <div class="card-header bg-dark">
                    Registro de Inscripciones

                    <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carCliente" aria-label="Close"></button>
                </div>
                <div class="card-body text-white bg-secondary">
                    <form method="post" @submit.prevent="guardarInscripcion" @reset="nuevaInscripcion">
                        <div class="row p-1">
                            <div class="col col-md-2">Inscripción:</div>
                            <div class="col col-md-6">
                                <select class="form-control" v-model="inscripcion.alumno" v-bind:disabled="inscripcion.accion != 'nuevo'">
                                    <option v-for="alumno in alumnos" :value="alumno.idAlumno" :key="alumno.idAlumno">{{ alumno.codigo }} - {{alumno.nombre}}</option>
                                </select>
                            </div>
                            <div class="col col-md-4">
                                <span v-if="inscripcion.accion == 'modificar'">
                                    Modificando a: {{ inscripcion.alumnos }}
                                </span>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Inscripcion:</div>
                            <div class="col col-md-6">
                                <select class="form-control" v-model="inscripcion.materias" multiple>
                                    <option v-for="materia in materias" :value="materia.idMateria" :key="materia.idMateria">{{ materia.codigo }} - {{materia.nombre}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-5 text-center">
                                <div v-if="inscripcion.mostrar_msg" class="alert alert-primary alert-dismissible fade show" role="alert">
                                    {{ inscripcion.msg }}
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
            <div class="card text-white" id="carBuscarInscripcion">
                <div class="card-header bg-primary">
                    Busqueda de Inscripciones

                    <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarInscripcion" aria-label="Close"></button>
                </div>
                <div class="card-body bg-secondary">
                    <table class="table table-dark table-striped">
                        <thead>
                            <tr>
                                <th colspan="8">
                                    Buscar: <input @keyup="buscarInscripcion" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                                </th>
                            </tr>
                            <tr>
                                <th>Inscripcion</th>
                                <th>Inscripcion</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in inscripciones" @click='modificarInscripcion( item )' :key="item.idAlumno">
                                <td>{{item.alumnos}}</td>
                                <td>{{item.materias}}</td>
                                <!-- <td>
                                    <li v-for="inscripciones in item.inscripciones" :key="inscripciones.idInscripcion">
                                        {{ inscripciones }}
                                    </li>
                                </td> -->
                                <td>
                                    <button class="btn btn-danger" @click="eliminarInscripcion(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
</template>

<script>
    export default ({
        props:['form'],
        data:()=>{
            return {
                buscar:'',
                materias:[],
                alumnos:[],
                inscripciones:[],
                inscripcion:{
                    accion : 'nuevo',
                    mostrar_msg : false,
                    msg : '',
                    alumno : '',
                    materias : []
                }
            }
        },
        methods: {
            buscarInscripcion(){
                this.obtenerDatos(this.buscar);
            },
            async sincronizarDatosServidor(inscripcion='', metodo='POST', url='inscripciones'){
                await axios({
                    method: metodo,
                    url: url,
                    data: inscripcion,
                })
                .then(res=>{
                    if( inscripcion.accion=='nuevo' ){
                        inscripcion.id = res.data.id;
                        this.actualizarLocal(inscripcion);
                    }
                    this.inscripcion.msg = 'Inscripcion sincronizado con exito en el servidor';
                })
                .catch(err=>{
                    this.inscripcion.msg = `Error al sincronizar el inscripcion en el servidor: ${err}`
                });
            },
            actualizarLocal(inscripcion){
                let store = this.abrirStore('inscripcion','readwrite'),
                    query = store.put(inscripcion);
                query.onsuccess=e=>{
                    this.inscripcion.msg = 'Inscripcion procesado con exito';
                    this.nuevaInscripcion();
                    this.obtenerDatos();
                };
                query.onerror=e=>{
                    this.inscripcion.msg = 'Error al procesar el inscripcion';
                };
            },
            guardarInscripcion(){
                let metodo = 'PUT',
                    url = `inscripciones/${this.inscripcion.alumno}`;
                if( this.inscripcion.accion == 'nuevo' ){
                    metodo = 'POST';
                    url = 'inscripciones';
                }
                let inscripciones = {};
                let inscripcion = JSON.parse( JSON.stringify(this.inscripcion) );
                inscripcion.materias.forEach(materia=>{
                    console.log(this.inscripcion.alumno);
                    this.sincronizarDatosServidor({
                        idAlumno: this.inscripcion.alumno,
                        idMateria: materia
                    }, metodo, url);
                    this.actualizarLocal({
                        idAlumno: inscripcion.idAlumno,
                        idMateria: materia
                    });
                });
            },
            modificarInscripcion(data){
                this.inscripcion = JSON.parse(JSON.stringify(data));
                this.inscripcion.accion = 'modificar';
            },
            eliminarInscripcion(data){
                if( confirm(`¿Esta seguro de eliminar la inscripcion ${data.nombre}?`) ){
                    let store = this.abrirStore('inscripcion','readwrite'),
                        query = store.delete(data.idAlumno);
                        metodo = 'DELETE',
                        url = `inscripciones/${data.idAlumno}`;
                    data.materias.forEach(inscripcion=>{
                        this.sincronizarDatosServidor(inscripcion, metodo, url);
                    }); 
                    query.onsuccess=e=>{
                        data.accion = 'eliminar';
                        this.inscripcion.msg = 'Inscripcion eliminada con exito';
                        this.nuevaInscripcion();
                        this.obtenerDatos();
                    };
                    query.onerror=e=>{
                        this.inscripcion.msg = `Error al procesar la inscripcion ${e.target.error}`;
                    };
                }
            },
            obtenerDatos(busqueda=''){
                let store = this.abrirStore('inscripcion', 'readonly'),
                    data = store.getAll();
                data.onsuccess = resp=>{
                    if( data.result.length<=0 ){
                        fetch(`inscripciones`,
                            {credentials:'same-origin'})
                            .then(res=>res.json())
                            .then(data=>{
                                this.inscripciones = data;
                                this.inscripcion.msg = 'Inscripciones obtenidas con exito';

                                data.map(inscripcion=>{
                                    let store = this.abrirStore('inscripcion','readwrite'),
                                        query = store.put(inscripcion);
                                    query.onsuccess=e=>{
                                        this.inscripcion.msg = 'Inscripciones guardadas en local';
                                    };
                                    query.onerror=e=>{
                                        this.inscripcion.msg = `Error al obtener inscripciones ${e.target.error}`;
                                    };
                                });
                            })
                            .catch(err=>{
                                this.inscripcion.msg = `Error al sincronizar la inscripcion en el servidor: ${err}`
                            });
                    }
                    this.inscripciones = data.result.filter(inscripcion=>inscripcion.nombre.toLowerCase().indexOf(busqueda.toLowerCase())>-1);
                };
                data.onerror = e=>{
                    this.inscripcion.msg = `Error al obtener los datos ${e.target.error}`;
                };
                this.obtenerAlumnos();
                this.obtenerMaterias();
            },
            obtenerAlumnos(){
                let store = this.abrirStore('alumno', 'readonly'),
                    data = store.getAll();
                data.onsuccess = resp=>{
                    if( data.result.length<=0 ){
                        fetch(`alumnos`,
                            {credentials:'same-origin'})
                            .then(res=>res.json())
                            .then(data=>{
                                this.alumnos = data;
                                this.inscripcion.msg = 'Alumnos obtenidos con exito';

                                data.map(alumno=>{
                                    let store = this.abrirStore('alumno','readwrite'),
                                        query = store.put(alumno);
                                    query.onsuccess=e=>{
                                        this.inscripcion.msg = 'Alumnos guardados en local';
                                    };
                                    query.onerror=e=>{
                                        this.inscripcion.msg = `Error al obtener alumnos ${e.target.error}`;
                                    };
                                });
                            })
                            .catch(err=>{
                                this.inscripcion.msg = `Error al sincronizar los alumnos en el servidor: ${err}`
                            });
                        this.alumnos = data.result;
                    };
                    this.alumnos = data.result;
                };
            },
            obtenerMaterias(){
                let store = this.abrirStore('materia', 'readonly'),
                    data = store.getAll();
                data.onsuccess = resp=>{
                    if( data.result.length<=0 ){
                        fetch(`materias`,
                            {credentials:'same-origin'})
                            .then(res=>res.json())
                            .then(data=>{
                                this.materias = data;
                                this.inscripcion.msg = 'Materias obtenidas con exito';

                                data.map(materia=>{
                                    let store = this.abrirStore('materia','readwrite'),
                                        query = store.put(materia);
                                    query.onsuccess=e=>{
                                        this.inscripcion.msg = 'Materias guardadas en local';
                                    };
                                    query.onerror=e=>{
                                        this.inscripcion.msg = `Error al obtener materias ${e.target.error}`;
                                    };
                                });
                            })
                            .catch(err=>{
                                this.inscripcion.msg = `Error al sincronizar las materias en el servidor: ${err}`
                            });
                        this.materias = data.result;
                    };
                    this.materias = data.result;
                };
            },
            nuevaInscripcion(){
                this.inscripcion.accion = 'nuevo';
                this.inscripcion.alumno = '';
                this.inscripcion.inscripciones = [];
                this.inscripcion.msg = '';
            },
            abrirStore(store, modo){
                let tx = db.transaction(store, modo);
                return tx.objectStore(store);
            }
        }, 
        created(){
            //this.obtenerDatos();
        },
    })
</script>
