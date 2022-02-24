Vue.component('v-select-autor',VueSelect.VueSelect);
Vue.component('libro',{
    data:()=>{
        return {
            buscar:'',
            libros:[],
            autores:[],
            libro:{
                accion : 'nuevo',
                mostrar_msg : false,
                msg : '',
                autor: {
                    id: '',
                    label: '',
                },
                idlibro : '',
                lsbn: '',
                titulo : '',
                editorial : '',
                edicion : '0',
            }
        }
    },
    methods:{    
        buscandolibro(){
            this.obtenerlibros(this.buscar);
        },
        eliminarlibro(libro){
            if( confirm(`Esta seguro de eliminar el libro ${libro.nombre}?`) ){
                this.libro.accion = 'eliminar';
                this.libro.idlibro = libro.idlibro;
                this.guardarlibro();
            }
            this.nuevolibro();
        },
        modificarlibro(datos){
            this.libro = JSON.parse(JSON.stringify(datos));
            this.libro.accion = 'modificar';
        },
        guardarlibro(){
            this.obtenerlibros();
            let libros = JSON.parse(localStorage.getItem('libros')) || [];
            if(this.libro.accion=="nuevo"){
                this.libro.idlibro = generarIdUnicoFecha();
                libros.push(this.libro);
            } else if(this.libro.accion=="modificar"){
                let index = libros.findIndex(libro=>libro.idlibro==this.libro.idlibro);
                libros[index] = this.libro;
            } else if( this.libro.accion=="eliminar" ){
                let index = libros.findIndex(libro=>libro.idlibro==this.libro.idlibro);
                libros.splice(index,1);
            }
            localStorage.setItem('libros', JSON.stringify(libros));
            this.nuevolibro();
            this.obtenerlibros();
            this.libro.msg = 'libro procesado con exito';
        },
        obtenerlibros(valor=''){
            this.libros = [];
            let libros = JSON.parse(localStorage.getItem('libros')) || [];
            this.libros = libros.filter(libro=>libro.nombre.toLowerCase().indexOf(valor.toLowerCase())>-1);

            this.autores = [];
            let autores = JSON.parse(localStorage.getItem('autores')) || [];
            this.autores = autores.map(autor=>{
                return {
                    id: autor.idautor,
                    label: autor.nombre,
                }
            });
        },
        nuevolibro(){
            this.libro.accion = 'nuevo';
            this.libro.msg = '';
            this.libro.idlibro = '';
            this.libro.lsbn = '';
            this.libro.titulo = '';
            this.libro.editorial = '';
            this.libro.edicion = '';
        }
        
    },
    created(){
        this.obtenerlibros();
    },
    template:`
        <div id="appCiente">
            <div class="card text-white" id="carlibro">
                <div class="card-header bg-primary">
                    Registro de libros
                    <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carlibro" aria-label="Close"></button>
                </div>
                <div class="card-body text-dark">
                    <form method="post" @submit.prevent="guardarlibro" @reset="nuevolibro">
                        <div class="row p-1">
                            <div class="col col-md-2">
                                autor:
                            </div>
                            <div class="col col-md-3">
                                <v-select-autor v-model="libro.autor" 
                                    :options="autores" placeholder="Seleccione una autor"/>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">lsbn:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese la lsbn" v-model="libro.lsbn" pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Libros:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese los libro" v-model="libro.titulo" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Editorial:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese la editorial, final" v-model="libro.editorial" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Edicion:</div>
                            <div class="col col-md-3">
                                <input title="Edicion" v-model="libro.edicion" pattern="[0-9.]{1,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-5 text-center">
                                <div v-if="libro.mostrar_msg" class="alert alert-primary alert-dismissible fade show" role="alert">
                                    {{ libro.msg }}
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
            <div class="card text-white" id="carBuscarlibro">
                <div class="card-header bg-primary">
                    Busqueda de libros
                    <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarlibro" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th colspan="6">
                                    Buscar: <input @keyup="buscandolibro" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                                </th>
                            </tr>
                            <tr>
                                <th>autor</th>
                                <th>lsbn</th>
                                <th>TITULO</th>
                                <th>EDITORIAL</th>
                                <th>EDICION</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in libros" @click='modificarlibro( item )' :key="item.idlibro">
                                <td>{{item.autor}}</td>
                                <td>{{item.lsbn}}</td>
                                <td>{{item.titulo}}</td>
                                <td>{{item.editorial}}</td>
                                <td>{{item.edicion}}</td>
                                <td>
                                    <button class="btn btn-danger" @click="eliminarlibro(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
});