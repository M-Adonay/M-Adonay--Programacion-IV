<?php
include('../../db/DB.php');

class cliente{
    private $datos=[],$db;
    public $respuesta = ['msg'=>'correcto'];

    public function cliente($db=''){
        $this->db = $db;
    }
    public function recibir_datos($cliente=''){
        $this->datos = json_decode($cliente, true);
        $this->validar_datos();
    }
    public function validar_datos(){
        if(empty(trim($this->datos['codigo']))){
            $this->respuestas['msg'] = 'Por favor ingrese el codigo';
        }
        if(empty(trim($this->datos['nombre']))){
            $this->respuestas['msg'] = 'Por favor ingrese el nombre';
        }
        if(empty(trim($this->datos['direccion']))){
            $this->respuestas['msg'] = 'Por favor ingrese el direccion';
        }
        if(empty(trim($this->datos['telefono']))){
            $this->respuestas['msg'] = 'Por favor ingrese el telefono';
        }
        if(empty(trim($this->datos['dui']))){
            $this->respuestas['msg'] = 'Por favor ingrese el dui';
        }
    }
}
?>