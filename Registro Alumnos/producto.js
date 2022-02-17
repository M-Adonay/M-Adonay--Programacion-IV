Vue.component('producto', {
    data:()=>{
        return {
            productos: [],
            buscar: '',
            producto: {
                accion: 'nuevo',
                mostrar_msg : false,
                msg : '',
                idproducto: '',
                codigo: '',
                nombre: '',
                marca: '',
                precio: ''
            }
        }
    },
    methods: {
        buscarproducto(){
            this.obtenerDatos(this.buscar);
        },
        guardarproducto(){
            this.obtenerDatos();
            let productos = this.productos || [];
            if(this.producto.accion == 'nuevo'){
                this.producto.idproducto = idUnicoFecha();
                productos.push(this.producto);
            }else if(this.producto.accion == 'modificar'){
                let index = productos.findIndex(producto=>producto.idproducto==this.producto.idproducto);
                productos[index] = this.producto;
            }else if(this.producto.accion == 'eliminar'){
                let index = productos.findIndex(producto=>producto.idproducto==this.producto.idproducto);
                productos.splice(index,1);
            }
            localStorage.setItem('productos', JSON.stringify(this.producto));
            this.producto.msg = 'producto procesado con exito';
            this.nuevoproducto();
            this.obtenerDatos();
        },
        modificarproducto(data){
            this.producto = JSON.parse(JSON.stringify(data));
            this.producto.accion = 'modificar';
        },
        eliminarproducto(data){
            if( confirm(`¿Esta seguro de eliminar el producto ${data.nombre}?`) ){
                this.producto.idproducto = data.idproducto;
                this.producto.accion = 'eliminar';
                this.guardarproducto();
            }
        },
        obtenerDatos(busqueda=''){
            this.productos = [];
            if( localStorage.getItem('productos')!=null ){
                for(let i=0; i<JSON.parse(localStorage.getItem('productos')).length; i++){
                    let data = JSON.parse(localStorage.getItem('productos'))[i];
                    if( this.buscar.length>0 ){
                        if( data.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ){
                            this.productos.push(data);
                        }
                    }else{
                        this.productos.push(data);
                    }
                }
            }
        },
        nuevoproducto(){
            this.producto.accion = 'nuevo';
            this.producto.idproducto = '';
            this.producto.codigo = '';
            this.producto.nombre = '';
            this.producto.msg = '';
            this.producto.marca = '';
            this.producto.precio = '';
            console.log(this.producto);
        }
    }, 
    created(){
        this.obtenerDatos();
    },
    template: `
        <div id='appproducto'>
            <form @submit.prevent="guardarproducto" @reset.prevent="nuevoproducto" method="post" id="frmproducto">
                <div class="card mb-3">
                    <div class="card-header text-white bg-dark">
                        Administracion de productos

                        <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#frmproducto" aria-label="Close"></button>
                    </div>
                    <div class="card-body">
                        <div class="row p-1">
                            <div class="col col-md-1">Codigo</div>
                            <div class="col col-md-2">
                                <input v-model="producto.codigo" placeholder="codigo" pattern="[A-Z0-9]{3,10}" required title="Codigo de producto" class="form-control" type="text">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-1">Nombre</div>
                            <div class="col col-md-2">
                                <input v-model="producto.nombre" placeholder="escribe tu nombre" pattern="[A-Za-zÑñáéíóú ]{3,75}" required title="Nombre de producto" class="form-control" type="text">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-md-3 text-center">
                                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                                    {{ producto.msg }}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-md-3 text-center">
                                <button type="submit" class="btn btn-primary">Guardar</button>
                                <button type="reset" class="btn btn-warning">Nuevo</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div class="card mb-3" id="cardBuscarproducto">
                <div class="card-header text-white bg-dark">
                    Busqueda de productos

                    <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#cardBuscarproducto" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <td colspan="6">
                                    Buscar: <input title="Introduzca el texto a buscar" @keyup="buscarproducto" v-model="buscar" class="form-control" type="text">
                                </td>
                            </tr>
                            <tr>
                                <th>Codigo</th>
                                <th>Nombre</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in productos" :key="item.idproducto" @click="modificarproducto(item)">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>
                                    <button type="button" class="btn btn-danger" @click="eliminarproducto(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div> 
    `
});