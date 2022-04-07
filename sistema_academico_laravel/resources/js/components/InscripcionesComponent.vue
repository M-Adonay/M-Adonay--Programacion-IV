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
                                <select class="form-control" v-model="inscripcion.alumno">
                                    <option v-for="alumno in alumnos" :value="alumno.idAlumno" :key="alumno.idAlumno">{{ alumno.codigo }} - {{alumno.nombre}}</option>
                                </select>
                            </div>
                            <div class="col col-md-4">
                                <span v-if="inscripcion.accion == 'modificar'">
                                    Modificando a: {{ inscripcion.alumno }}
                                </span>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Inscripcion:</div>
                            <div class="col col-md-6">
                                <v-select v-model="inscripcion.materias" :options="materias" multiple :label="'nombre'" :placeholder="'Seleccione las materias'" :selectable="() => inscripcion.materias.length < 5"></v-select>
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
                                <td>
                                    <li v-for="inscripcion in item.inscripciones" :key="inscripcion">
                                        {{ inscripcion }}
                                    </li>
                                </td>
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
import 'vue-select/dist/vue-select.css';
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
                console.log(inscripcion, metodo, url);
                await axios({
                    method: metodo,
                    url: url,
                    data: inscripcion,
                })
                .then(res=>{
                    if( inscripcion.accion=='nuevo' || inscripcion.accion=='modificar' ){
                        inscripcion.id = res.data.id;
                        this.actualizarLocal(inscripcion);
                    }
                    this.inscripcion.msg = 'Inscripcion sincronizado con exito en el servidor';
                })
                .catch(err=>{
                    console.log(err);
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
                    console.log(e);
                    this.inscripcion.msg = 'Error al procesar el inscripcion';
                };
            },
            guardarInscripcion(){
                let metodo = 'POST',
                    url = `inscripciones/${this.inscripcion.alumno}`;
                if( this.inscripcion.accion == 'nuevo' ){
                    url = 'inscripciones';
                } else if ( this.inscripcion.accion == 'modificar' ){
                    this.sincronizarDatosServidor(this.inscripcion.idInscripcion, 'DELETE', `inscripciones/${this.inscripcion.idInscripcion}`);
                    this.inscripcion.alumno = this.inscripcion.idInscripcion;
                }
                let inscripcion = JSON.parse( JSON.stringify(this.inscripcion) );
                inscripcion.materias.forEach(materia=>{
                    console.log(this.inscripcion);
                    this.sincronizarDatosServidor({
                        idAlumno: this.inscripcion.alumno,
                        idMateria: materia
                    }, metodo, url);
                });
            },
            modificarInscripcion(data){
                this.inscripcion = JSON.parse(JSON.stringify(data));
                this.inscripcion.accion = 'modificar';
            },
            eliminarInscripcion(data){
                console.log(data);
                if( confirm(`¿Esta seguro de eliminar la inscripcion ${data.alumno}?`) ){
                    let store = this.abrirStore('inscripcion','readwrite'),
                        query = store.delete(data.idInscripcion),
                        metodo = 'DELETE',
                        url = `inscripciones/${data.idInscripcion}`;
                    this.sincronizarDatosServidor(data, metodo, url);
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
            async obtenerDatos(busqueda=''){
                let store = this.abrirStore('inscripcion', 'readonly'),
                    data = store.getAll();
                data.onsuccess = resp=>{
                    if( data.result.length<=0 ){
                        fetch(`inscripciones`,
                            {credentials:'same-origin'})
                            .then(res=>res.json())
                            .then(data=>{
                                this.inscripcion = data;
                                this.inscripcion.msg = 'Alumnos obtenidos con exito';

                                data.forEach(inscripcion=>{
                                    console.log(inscripcion);
                                    let inscripciones = {
                                        idInscripcion: inscripcion.idAlumno,
                                        alumno: inscripcion.alumnos,
                                        materias: inscripcion.idMateria.split(','),
                                        inscripciones: inscripcion.materias.split(',')
                                    };
                                    console.log(inscripciones);
                                    this.inscripciones.push(inscripciones);
                                    let store = this.abrirStore('inscripcion','readwrite'),
                                        query = store.put(inscripciones);
                                    query.onsuccess=e=>{
                                        this.inscripcion.msg = 'Inscripciones guardadas en local';
                                    };
                                    query.onerror=e=>{
                                        console.log(e);
                                        this.inscripcion.msg = `Error al obtener inscripciones ${e.target.error}`;
                                    };
                                });

                                
                            })
                            .catch(err=>{
                                console.log(err);
                                this.inscripcion.msg = `Error al sincronizar la inscripcion en el servidor: ${err}`
                            });
                    }
                    this.inscripciones = this.inscripciones.filter(inscripcion=>inscripcion.alumnos.toLowerCase().indexOf(busqueda.toLowerCase())>-1);
                };
                data.onerror = e=>{
                    this.inscripcion.msg = `Error al obtener los datos ${e.target.error}`;
                };
                await this.obtenerAlumnos();
                await this.obtenerMaterias();
            },
            obtenerAlumnos(){
                let store = this.abrirStore('alumno', 'readonly'),
                    data = store.getAll();
                data.onsuccess = async resp=>{
                    if( data.result.length<=0 ){
                        await fetch(`alumnos`,
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
                this.alumnos = this.alumnos.filter(alumno=>{
                    let inscripciones = this.inscripciones.filter(inscripcion=>{
                        return inscripcion.alumno !== alumno.idAlumno;
                    });
                    return inscripciones.length<=0;
                });
            },
            obtenerMaterias(){
                let store = this.abrirStore('materia', 'readonly'),
                    data = store.getAll();
                data.onsuccess = resp=>{
                    console.log(data.result.length);
                    if( data.result.length<=0 ){
                        console.log('entro');
                        fetch(`materias`,
                            {credentials:'same-origin'})
                            .then(res=>res.json())
                            .then(data=>{
                                console.log(data);
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
                                console.log(err);
                                this.inscripcion.msg = `Error al sincronizar las materias en el servidor: ${err}`
                            });
                            console.log(this.materias);
                    } else {
                        console.log('no entro');
                        this.materias = data.result;
                        console.log(this.materias, data, data.result);
                    };
                };
                data.onerror = e=>{
                    console.log(e);
                    this.inscripcion.msg = `Error al obtener las materias ${e.target.error}`;
                };
                console.log(this.materias);
            },
            nuevaInscripcion(){
                this.inscripcion.accion = 'nuevo';
                this.inscripcion.alumno = '';
                this.inscripcion.materias = [];
                this.inscripcion.msg = '';
            },
            abrirStore(store, modo){
                let tx = db.transaction(store, modo);
                return tx.objectStore(store);
            }
        }, 
        created(){
        },
    })
</script>
