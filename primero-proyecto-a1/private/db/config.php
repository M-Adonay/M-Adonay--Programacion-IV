<?php 
class DB {
    private $conexion,$result;

    public function DB($server, $user, $pass){
        $this->conexion = new PDO($server, $user, $pass, array(PDO::ATTR_EMULATE_PREPARES => faLse,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)) or die('Error al conectar con la base de datos');
    }
    public function consultas($sql=''){
        try{
        $parametros = func_get_arg(); //Obtiene los parametros de la consulta SQL
        array_shift($parametros); //Elimine el primer parametro que es la consulta SQL
        $this->preparado = $this->conexion->prepare($sql);
        $this->result = $this->preparado->execute($parametros); //Ejecuta la consulta SQL
        }catch(PDOException $e){
            echo 'Error: '.$e->getMessage();
        }
    }
    public function obtener_datos(){
        return $this->preparado->fetchAll(PDO::FETCH_ASSOC);
    }
    public function obtener_respuestas(){
        return $this->result; // Devuelve true si es exitoso o flase si no
    }
    public function obtenerUltimoId(){
        return $this->conexion->lastInsertId(); //Devuelve el ultimo id insertado
    }
}
?>