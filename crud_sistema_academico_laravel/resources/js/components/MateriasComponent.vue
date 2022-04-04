<template>
    <div class="container-fluid">

        <div class="card text-white" id="carCliente">

            <div class="card-header bg-dark">

                Registro de Materias



                <button type="button" class="btn-close text-end" data-bs-dismiss="alert"
                    data-bs-target="#carCliente" aria-label="Close"></button>

            </div>

            <div class="card-body text-white bg-secondary">

                <form method="post" @submit.prevent="guardarMateria" @reset="nuevaMateria">

                    <div class="row p-1">

                        <div class="col col-md-2">Codigo:</div>

                        <div class="col col-md-2">

                            <input title="Ingrese el codigo" v-model="materia.codigo" pattern="[0-9]{3,10}" required
                                type="text" class="form-control">

                        </div>

                    </div>

                    <div class="row p-1">

                        <div class="col col-md-2">Nombre:</div>

                        <div class="col col-md-3">

                            <input title="Ingrese el nombre" v-model="materia.nombre"
                                pattern="[A-Za-zñÑáéíóúü .#0-9_]{3,75}" required type="text" class="form-control">

                        </div>

                    </div>

                    <div class="row p-1">

                        <div class="col col-md-2">Docente:</div>

                        <div class="col col-md-3">

                            <input title="Ingrese el docente" v-model="materia.docente"
                                pattern="[A-Za-zñÑáéíóúü .]{3,75}" required type="text" class="form-control">

                        </div>

                    </div>

                    <div class="row p-1">

                        <div class="col col-md-2">De:</div>

                        <div class="col col-md-2">

                            <input title="Ingrese la hora de inicio" v-model="materia.de" required type="time"
                                class="form-control">

                        </div>

                    </div>

                    <div class="row p-1">

                        <div class="col col-md-2">A:</div>

                        <div class="col col-md-2">

                            <input title="Ingrese la hora de finalizacion" v-model="materia.a" required type="time"
                                class="form-control">

                        </div>

                    </div>

                    <div class="row p-1">

                        <div class="col col-md-2">Dia:</div>

                        <div class="col col-md-2">

                            <select title="Seleccione el dia" v-model="materia.dia" required class="form-control">

                                <option value="">Seleccione una opcion</option>

                                <option v-for="dia in dias" :value="dia" v-bind:key="dia">{{dia}}</option>

                            </select>

                        </div>

                    </div>

                    <div class="row p-1">

                        <div class="col col-md-2">Aula:</div>

                        <div class="col col-md-3">

                            <input title="Ingrese el aula" v-model="materia.aula"
                                pattern="[A-Za-zñÑáéíóúü .#0-9_]{3,75}" required type="text" class="form-control">

                        </div>

                    </div>

                    <div class="row p-1">

                        <div class="col col-md-5 text-center">

                            <div v-if="materia.mostrar_msg" class="alert alert-primary alert-dismissible fade show"
                                role="alert">

                                {{ materia.msg }}

                                <button type="button" class="btn-close" data-bs-dismiss="alert"
                                    aria-label="Close"></button>

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

        <div class="card text-white" id="carBuscarMateria">

            <div class="card-header bg-dark">

                Busqueda de Materias



                <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarMateria"
                    aria-label="Close"></button>

            </div>

            <div class="card-body bg-secondary">

                <table class="table table-dark table-striped">

                    <thead>

                        <tr>

                            <th colspan="8">

                                Buscar: <input @keyup="buscarMateria" v-model="buscar" placeholder="buscar aqui"
                                    class="form-control" type="text">

                            </th>

                        </tr>

                        <tr>

                            <th>Codigo</th>

                            <th>Nombre</th>

                            <th>Docente</th>

                            <th>De</th>

                            <th>A</th>

                            <th>Dia</th>

                            <th>Aula</th>

                            <th></th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr v-for="item in materias" @click='modificarMateria( item )' :key="item.idMateria">

                            <td>{{item.codigo}}</td>

                            <td>{{item.nombre}}</td>

                            <td>{{item.docente}}</td>

                            <td>{{item.de}}</td>

                            <td>{{item.a}}</td>

                            <td>{{item.dia}}</td>

                            <td>{{item.aula}}</td>

                            <td>

                                <button class="btn btn-danger" @click="eliminarMateria(item)">Eliminar</button>

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
                dias: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
                materias:[],
                materia:{
                    accion : 'nuevo',
                    mostrar_msg : false,
                    msg : '',
                    codigo : '',
                    nombre : '',
                    docente : '',
                    de : '',
                    a : '',
                    dia : '',
                    aula : ''
                }
            }
        },
        methods: {
            buscarMateria(){
                this.obtenerDatos(this.buscar);
            },
            async sincronizarDatosServidor(materia='', metodo='POST', url='materias'){
                await axios({
                    method: metodo,
                    url: url,
                    data: materia,
                })
                .then(res=>{
                    if( materia.accion=='nuevo' ){
                        materia.id = res.data.id;
                        this.actualizarLocal(materia);
                    }
                    this.materia.msg = 'Materia sincronizado con exito en el servidor';
                })
                .catch(err=>{
                    this.materia.msg = `Error al sincronizar el materia en el servidor: ${err}`
                });
            },
            actualizarLocal(materia){
                let store = this.abrirStore('materia','readwrite'),
                    query = store.put(materia);
                query.onsuccess=e=>{
                    this.materia.msg = 'Materia procesado con exito';
                    this.nuevaMateria();
                    this.obtenerDatos();
                };
                query.onerror=e=>{
                    this.materia.msg = 'Error al procesar el materia';
                };
            },
            guardarMateria(){
                let metodo = 'PUT',
                    url = `materias/${this.materia.id}`;
                if( this.materia.accion == 'nuevo' ){
                    this.materia.idMateria = generarIdUnicoFecha();
                    metodo = 'POST';
                    url = 'materias';
                }
                let materia = JSON.parse( JSON.stringify(this.materia) );
                console.log(materia, metodo, url);
                this.sincronizarDatosServidor(materia, metodo, url);
                this.actualizarLocal(materia);
            },
            modificarMateria(data){
                this.materia = JSON.parse(JSON.stringify(data));
                this.materia.accion = 'modificar';
            },
            eliminarMateria(data){
                if( confirm(`¿Esta seguro de eliminar la materia ${data.nombre}?`) ){
                    let store = this.abrirStore('materia','readwrite'),
                        query = store.delete(data.idMateria),
                        metodo = 'DELETE',
                        url = `materias/${data.id}`;
                    this.sincronizarDatosServidor(data, metodo, url);    
                    query.onsuccess=e=>{
                        data.accion = 'eliminar';
                        this.materia.msg = 'Materia eliminada con exito';
                        this.nuevaMateria();
                        this.obtenerDatos();
                    };
                    query.onerror=e=>{
                        this.materia.msg = `Error al procesar la materia ${e.target.error}`;
                    };
                }
            },
            obtenerDatos(busqueda=''){
                let store = this.abrirStore('materia', 'readonly'),
                    data = store.getAll();
                data.onsuccess = resp=>{
                    if( data.result.length<=0 ){
                        fetch(`materias`,
                            {credentials:'same-origin'})
                            .then(res=>res.json())
                            .then(data=>{
                                this.materias = data;
                                this.materia.msg = 'Materias obtenidas con exito';

                                data.map(materia=>{
                                    let store = this.abrirStore('materia','readwrite'),
                                        query = store.put(materia);
                                    query.onsuccess=e=>{
                                        this.materia.msg = 'Materias guardadas en local';
                                    };
                                    query.onerror=e=>{
                                        this.materia.msg = `Error al obtener materias ${e.target.error}`;
                                    };
                                });
                            })
                            .catch(err=>{
                                this.materia.msg = `Error al sincronizar la materia en el servidor: ${err}`
                            });
                    }
                    this.materias = data.result.filter(materia=>materia.nombre.toLowerCase().indexOf(busqueda.toLowerCase())>-1);
                };
                data.onerror = e=>{
                    this.materia.msg = `Error al obtener los datos ${e.target.error}`;
                };
            },
            nuevaMateria(){
                this.materia.accion = 'nuevo';
                this.materia.idMateria = '';
                this.materia.codigo = '';
                this.materia.nombre = '';
                this.materia.fechaNacimiento = '';
                this.materia.direccion = '';
                this.materia.telefono = '';
                this.materia.dui = '';
                this.materia.msg = '';
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
