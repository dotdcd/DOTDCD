
/* const [horasDisponibles] = await pool.query(
        "SELECT SUM(hora_administrativa + (cableado_mts * (8/305)) + (tuberia_mts * (8/30)) + (instal_dispositivo * (8/4)) + (configuracion * (8/32)) + mtto_dispositivo + otros) as horas_consumidas from asistencia_inventario where proyectoID = ?", [cotizacionId]
    );
    
    const [horasConsumidas] = await pool.query(
        "SELECT ROUND((total * pf/100 / CASE cotizacion_moneda_id WHEN 1 THEN 2100 ELSE 100 END) * 8, 2) AS horas FROM cotizaciones WHERE cotizacion_id =  ?" , [cotizacionId]
    );

    const horasDisponiblesValue = horasDisponibles[0].horas_consumidas;
    const horasConsumidasValue = horasConsumidas[0].horas_consumidas;
    const avance = (horasConsumidasValue / horasDisponiblesValue) * 100;

    return {horasDisponiblesValue, horasConsumidasValue, avance};*/

//Sacar las horas consumidas

SELECT SUM(hora_administrativa + (cableado_mts * (8/305)) + (tuberia_mts * (8/30)) + 
				(instal_dispositivo * (8/4)) + (configuracion * (8/32)) + mtto_dispositivo + otros) as horas_consumidas
			from asistencia_inventario where proyectoID = 17489



// SACAR IMPORTE
SELECT insumo_cantidad, insumo_precio_mo FROM cotizaciones_insumos JOIN productos ON insumo_producto_id = producto_id JOIN marcas ON producto_marca_id = marca_id JOIN unidades ON producto_unidad_id = unidad_id LEFT JOIN familias ON familia_id = insumo_diciplina_id LEFT JOIN cotizaciones_niveles ON nivel_id = insumo_nivel_id LEFT JOIN cotizaciones_tipos ON tipo_id = insumo_tipo_id WHERE insumo_cotizacion_id = 17489 ORDER BY insumo_cotizacion_id, insumo_diciplina_id, insumo_nivel_id, insumo_tipo_id, cotizaciones_insumos.orden




// CALCULOS importe, jornada y horas requeridas
SELECT ROUND(importe, 2) AS importe, ROUND(importe / 2100, 2) AS jornada, ROUND((importe / 2100) * 8, 2) AS h_requeridas FROM (SELECT insumo_cantidad, insumo_precio_mo, ROUND(insumo_precio_mo * insumo_cantidad, 2) AS importe FROM cotizaciones_insumos JOIN productos ON insumo_producto_id = producto_id JOIN marcas ON producto_marca_id = marca_id JOIN unidades ON producto_unidad_id = unidad_id LEFT JOIN familias ON familia_id = insumo_diciplina_id LEFT JOIN cotizaciones_niveles ON nivel_id = insumo_nivel_id LEFT JOIN cotizaciones_tipos ON tipo_id = insumo_tipo_id WHERE insumo_cotizacion_id = 17489 ORDER BY insumo_cotizacion_id, insumo_diciplina_id, insumo_nivel_id, insumo_tipo_id, cotizaciones_insumos.orden ) AS subconsulta



// Calculo de no me acuero que era, era algo de horas disponibles y horas consumidas y horas disponibles para el proyecto
SELECT ROUND((total * (pf/100)), 2) AS Pf_Cantidad, ROUND((total * (pf/100)) / CASE cotizacion_moneda_id WHEN 1 THEN 2100 WHEN 2 THEN 100 ELSE NULL END, 2) AS dias_h_disponibles, ROUND(((total * (pf/100)) / CASE cotizacion_moneda_id WHEN 1 THEN 2100 WHEN 2 THEN 100 ELSE NULL END) * 8, 2) AS horas_disponibles FROM cotizaciones WHERE cotizacion_id = 17489














































































































<?php


date_default_timezone_set('America/Tegucigalpa');
setlocale(LC_TIME, 'spanish');


if (isset($_REQUEST['moneda_id'])) {
    $moneda_id = $_REQUEST['moneda_id'];
} else
    $moneda_id = '0';
if (isset($_REQUEST['tipo_id'])) {
    $tipo_id = $_REQUEST['tipo_id'];
} else
    $tipo_id = '0';
if (isset($_REQUEST['cliente_id'])) {
    $cliente_id = $_REQUEST['cliente_id'];
} else
    $cliente_id = '0';
if (isset($_REQUEST['cotizacion_id'])) {
    $cotizacion_id = $_REQUEST['cotizacion_id'];
} else
    $cotizacion_id = '0';
if (isset($_REQUEST['autorizada_estatus'])) {
    $autorizada_estatus = $_REQUEST['autorizada_estatus'];
} else
    $autorizada_estatus = '1';
if (isset($_REQUEST['facturadas'])) {
    $facturadas = $_REQUEST['facturadas'];
} else
    $facturadas = '0';
if (isset($_REQUEST['ordenadas'])) {
    $ordenadas = $_REQUEST['ordenadas'];
} else
    $ordenadas = '0';
if (isset($_REQUEST['eliminadas'])) {
    $eliminadas = $_REQUEST['eliminadas'];
} else
    $eliminadas = '0';

ini_set('mysql.connect_timeout', '0');

include("./connexion_BD.php");


if ($cotizacion_id != 0) {
    // Leer cotizaci�n individual
    $filtro = " AND cotizacion_id = " . $cotizacion_id;
    $sql = "SELECT cliente_id, cotizacion_id, cotizacion_proyecto, cliente_razon_social
					FROM cotizaciones 
					JOIN clientes ON cotizacion_cliente_id = cliente_id
					WHERE IFNULL(liquidada_sn, 0) = 0 and cotizacion_autorizada_estatus= 1 AND cotizacion_estatus_baja = 0" . $filtro;
    $resultado = mysql_query($sql);
    if ($registro = mysql_fetch_array($resultado)) {
        $cotizacion_id_c = $registro['cotizacion_id'];
        $cliente_id = $registro['cliente_id'];
    }
}


// Filtros
$filtro = "";
if ($cliente_id > 0)
    $filtro .= " AND cotizacion_cliente_id=" . $cliente_id;
if ($tipo_id != 0)
    $filtro .= " AND cotizacion_tipo_id = " . $tipo_id;
if ($autorizada_estatus != 3)
    $filtro .= " AND cotizacion_autorizada_estatus = " . $autorizada_estatus;
if ($eliminadas == 1)
    $filtro .= " AND cotizacion_estatus_baja = 1";
else
    $filtro .= " AND cotizacion_estatus_baja = 0";

// facturadas	
if ($facturadas == 1)
    $filtro .= " AND cotizacion_id IN (SELECT DISTINCT factura_proyecto_id from facturas WHERE factura_estatus_baja = 1)";
else if ($facturadas == 2)
    $filtro .= " AND cotizacion_id NOT IN (SELECT DISTINCT factura_proyecto_id from facturas WHERE factura_estatus_baja = 1)";

// Ordenadas
if ($ordenadas == 1)
    $filtro .= " AND cotizacion_id IN (SELECT DISTINCT CASE orden_cotizacion_id WHEN 0 THEN COALESCE(requisicion_cotizacion_id, 0) ELSE orden_cotizacion_id END
		FROM ordenes_compra
		LEFT JOIN requisiciones ON requisicion_id = orden_requisicion_id
		WHERE (orden_cotizacion_id = 0 AND COALESCE(requisicion_cotizacion_id, 0) <> 0) OR orden_cotizacion_id <> 0)";
else if ($ordenadas == 2)
    $filtro .= " AND cotizacion_id NOT IN (SELECT DISTINCT CASE orden_cotizacion_id WHEN 0 THEN COALESCE(requisicion_cotizacion_id, 0) ELSE orden_cotizacion_id END
		FROM ordenes_compra
		LEFT JOIN requisiciones ON requisicion_id = orden_requisicion_id
		WHERE (orden_cotizacion_id = 0 AND COALESCE(requisicion_cotizacion_id, 0) <> 0) OR orden_cotizacion_id <> 0)";

$sqlTruncate1 = "TRUNCATE TABLE tmp_cotizacion_reporte";
mysql_query($sqlTruncate1, $conn);

$sqlTruncate2 = "TRUNCATE TABLE tmp_factura_reporte";
mysql_query($sqlTruncate2, $conn);

$sqlTruncate22 = "TRUNCATE TABLE tmp_facturas_pagos_reporte";
mysql_query($sqlTruncate22, $conn);

$sqlTruncate3 = "TRUNCATE TABLE tmp_ordenes_reporte";
mysql_query($sqlTruncate3, $conn);

$sqlTruncate4 = "TRUNCATE TABLE tmp_cliente_reporte";
mysql_query($sqlTruncate4, $conn);

$sqlTruncate5 = "TRUNCATE TABLE tmp_cheque_reporte";
mysql_query($sqlTruncate5, $conn);

$sqlTruncate6 = "TRUNCATE TABLE tmp_cheques_reporte";
mysql_query($sqlTruncate6, $conn);

$sqlTruncate7 = "TRUNCATE TABLE tmp_oc_pagos_reporte";
mysql_query($sqlTruncate7, $conn);

$sqlInsert = "INSERT INTO tmp_cotizacion_reporte 
	SELECT * FROM cotizaciones WHERE cotizacion_estatus_baja <> 9" . $filtro;
mysql_query($sqlInsert, $conn);

$sqlInsert2 = "INSERT INTO tmp_factura_reporte (factura_id, factura_empresa_id, factura_cliente_id, factura_descripcion, factura_empleado_id, 
factura_centrodecostos_id, factura_proyecto_id, factura_folio_id, factura_remisionfactura_id, factura_moneda_id, 
factura_subtotal, factura_iva, factura_total, factura_fecha_alta, factura_observaciones, factura_estatus_baja, 
factura_fecha_baja, factura_ultima_modificacion, factura_estimacion_id, factura_anticipo_id, factura_numero, 
factura_factura, factura_pdf, factura_xml, factura_inversion_id, correo, uso_cfdi, forma_pago, retencion, 
fecha_cancelacion, cadena_sat, tipo_venta, retencion_isr, tipo_cambio, uuid, sucursal_id, dias_credito)
	SELECT factura_id, factura_empresa_id, factura_cliente_id, factura_descripcion, factura_empleado_id, 
factura_centrodecostos_id, factura_proyecto_id, factura_folio_id, factura_remisionfactura_id, factura_moneda_id, 
factura_subtotal, factura_iva, factura_total, factura_fecha_alta, factura_observaciones, factura_estatus_baja, 
factura_fecha_baja, factura_ultima_modificacion, factura_estimacion_id, factura_anticipo_id, factura_numero, 
factura_factura, factura_pdf, factura_xml, factura_inversion_id, correo, uso_cfdi, forma_pago, retencion, 
fecha_cancelacion, cadena_sat, tipo_venta, retencion_isr, tipo_cambio, uuid, sucursal_id, dias_credito FROM facturas WHERE factura_proyecto_id in (select cotizacion_id from tmp_cotizacion_reporte)";
mysql_query($sqlInsert2, $conn);


$sqlInsert22 = "INSERT INTO tmp_facturas_pagos_reporte 
	SELECT * FROM facturas_pagos WHERE pago_factura_id in (select factura_id from tmp_factura_reporte)";
mysql_query($sqlInsert22, $conn);


$sqlInsert33 = "INSERT INTO tmp_cheques_reporte 
				select cheque_id
				FROM cheques 
				LEFT JOIN ordenes_compra_pagos AS O ON O.pago_cheque_id = cheque_id 
				LEFT JOIN ordenes_compra ON orden_id = pago_orden_id 
				LEFT JOIN requisiciones ON requisicion_id = orden_requisicion_id 
				LEFT JOIN facturas_pagos AS F ON F.pago_cheque_id = cheque_id 
				LEFT JOIN facturas ON factura_id = pago_factura_id 
				LEFT JOIN proveedores AS PR ON PR.proveedor_id = cheque_proveedor_id 
				LEFT JOIN cotizaciones AS CO ON CO.cotizacion_id = cheque_cotizacion_id 
				LEFT JOIN clientes AS CL ON CL.cliente_id = CO.cotizacion_cliente_id 
				LEFT JOIN proveedores AS PR2 ON PR2.proveedor_id = orden_proveedor_id 
				LEFT JOIN cotizaciones AS CO2 ON CO2.cotizacion_id = orden_cotizacion_id 
				LEFT JOIN cotizaciones AS CO3 ON CO3.cotizacion_id = requisicion_cotizacion_id 
				LEFT JOIN cotizaciones AS CO4 ON CO4.cotizacion_id = factura_proyecto_id 
				LEFT JOIN clientes AS CL2 ON CL2.cliente_id = CO4.cotizacion_cliente_id 
				JOIN bancos_cuentas ON banco_cuenta_id = cheque_cuenta_id 
				JOIN multiempresa ON empresa_id = banco_empresa_id 
				WHERE cheque_ingreso <> '1' 
				AND cheque_estatus_baja = 0 
				AND (
					(COALESCE(CO.cotizacion_id, 0) in (select cotizacion_id from tmp_cotizacion_reporte) 
					OR COALESCE(CO2.cotizacion_id, 0) in (select cotizacion_id from tmp_cotizacion_reporte)) 
					OR (COALESCE(CO3.cotizacion_id, 0) in (select cotizacion_id from tmp_cotizacion_reporte) 
					OR COALESCE(CO4.cotizacion_id, 0) in (select cotizacion_id from tmp_cotizacion_reporte))
				)	
				ORDER BY cheque_fecha_alta, cheque_id";
mysql_query($sqlInsert33, $conn);

$sqlInsert3 = "INSERT INTO tmp_cheque_reporte 
	SELECT * FROM cheques WHERE cheque_id in (select cheque_id FROM tmp_cheques_reporte)";
mysql_query($sqlInsert3, $conn);

$sqlInsert4 = "INSERT INTO tmp_ordenes_reporte 
	SELECT * FROM ordenes_compra WHERE orden_cotizacion_id in (select cotizacion_id from tmp_cotizacion_reporte)";
mysql_query($sqlInsert4, $conn);

$sqlInsert5 = "INSERT INTO tmp_cliente_reporte 
	SELECT * FROM clientes WHERE cliente_id in (select cliente_cotizacion_id from tmp_cotizacion_reporte)";
mysql_query($sqlInsert5, $conn);

$sqlInsert6 = "INSERT INTO tmp_oc_pagos_reporte  
			SELECT ocp.*
			FROM ordenes_compra_pagos ocp
			inner join tmp_cheque_reporte ON pago_cheque_id = cheque_id";
mysql_query($sqlInsert6, $conn);


// Cerrar base de datos
mysql_close($conn);


echo '1';

?>




















































<?php 

/*
	ini_set('max_execution_time' ,0);       
	set_time_limit(0);
	ini_set("memory_limit", "1024M");
*/ 

	function fsql_dmy($fecha){
	return substr($fecha,8,2).'/'.substr($fecha,5,2).'/'.substr($fecha,0,4);
	}
	
	function fdmy_sql($fecha){
	return substr($fecha,6,4).'-'.substr($fecha,3,2).'-'.substr($fecha,0,2);
	}
	
	date_default_timezone_set('America/Tegucigalpa');
	setlocale(LC_TIME, 'spanish'); 
	$fecha = substr(strftime("%d/%m/%Y, %H:%M:%S"),0,10);
	$corte = substr(strftime("%d-%m-%Y, %H:%M:%S"),0,10);

	if (isset($_REQUEST['moneda_id'])) { $moneda_id = $_REQUEST['moneda_id']; } else 		$moneda_id = '0';

	if (isset($_REQUEST['tipo_id'])) { $tipo_id = $_REQUEST['tipo_id']; } else $tipo_id = '0';
	
	if (isset($_REQUEST['cliente_id'])) { $cliente_id = $_REQUEST['cliente_id']; } else 		$cliente_id = '0';
	
	if (isset($_REQUEST['cotizacion_id'])) { $cotizacion_id = $_REQUEST['cotizacion_id']; } else 		$cotizacion_id = '0';

	if (isset($_REQUEST['autorizada_estatus'])) { $autorizada_estatus = $_REQUEST['autorizada_estatus']; } else $autorizada_estatus = '1';

	if (isset($_REQUEST['facturadas'])) { $facturadas = $_REQUEST['facturadas']; } else $facturadas = '0';
	if (isset($_REQUEST['ordenadas'])) { $ordenadas = $_REQUEST['ordenadas']; } else $ordenadas = '0';
	if (isset($_REQUEST['eliminadas'])) { $eliminadas = $_REQUEST['eliminadas']; } else $eliminadas = '0';

//echo '<br>*Tipo='.$tipo_id.'*autorizada_estatus='.$autorizada_estatus.'*facturadas='.$facturadas.'*ordenadas='.$ordenadas.'*eliminadas='.$eliminadas.'<br>';

try{
	
	//Abrir base de datos
	
	ini_set('mysql.connect_timeout','0');   
	
	include("./connexion_BD.php");
	
	
	// Cotizacion de monedas
	$cotizacion_solicitada = 1.0000;
	$moneda_solicitada = "PESOS";
	$sql = "SELECT moneda_id, moneda_cotizacion, moneda_ultima_modificacion FROM monedas
			WHERE moneda_id IN (2, 3)";
	$dataset = mysql_query($sql,$conn) or die("Error selecting Coords :".mysql_error());
		

	while($row = mysql_fetch_array($dataset)) 
		{
		if($row['moneda_id'] == 2)
			{
			$tipo_de_cambio_DOLLAR 	= 'MX$'.number_format(round($row['moneda_cotizacion'],4), 4, '.', ',');
			$Cotizacion_DOLLAR 	= round($row['moneda_cotizacion'],4);
			$dolar_fechayhora	= fsql_dmy(substr($row['moneda_ultima_modificacion'],0,10)).substr($row['moneda_ultima_modificacion'],10,9);
			if($moneda_id == 2)
				{ 
				$cotizacion_solicitada = $Cotizacion_DOLLAR;
				$moneda_solicitada = "D�LARES";
				}
			}
			else
			{
			$tipo_de_cambio_EURO 	= 'MX$'.number_format(round($row['moneda_cotizacion'],4), 4, '.', ',');
			$Cotizacion_EURO 	= round($row['moneda_cotizacion'],4);
			$euro_fechayhora	= fsql_dmy(substr($row['moneda_ultima_modificacion'],0,10)).substr($row['moneda_ultima_modificacion'],10,9);
			if($moneda_id == 3) 
				{
				$cotizacion_solicitada = $Cotizacion_EURO;
				$moneda_solicitada = "EUROS";
				}
			}
		}

	if($cliente_id != 0)
		{
		// Leer cliente individual
		$sql = "select cliente_razon_social FROM clientes
			   WHERE cliente_id=".$cliente_id;
		$resultado=mysql_query($sql);
		if($registro = mysql_fetch_array($resultado))
			$cliente_enca = 'Cliente: '.utf8_decode($registro['cliente_razon_social']);
			else
			$cliente_enca = 'Cliente: ('.$cliente_id.') NO ENCONTRADO';
		}
		else
		$cliente_enca = 'Cliente: TODOS LOS CLIENTES';

	if($cotizacion_id != 0)
		{
		// Leer cotizaci�n individual
		$filtro	= " AND cotizacion_id = ".$cotizacion_id;
		$sql = "SELECT cliente_id, cotizacion_id, cotizacion_proyecto, cliente_razon_social
					FROM cotizaciones 
					JOIN clientes ON cotizacion_cliente_id = cliente_id
					WHERE cotizacion_autorizada_estatus= 1 AND cotizacion_estatus_baja = 0".$filtro;
		$resultado=mysql_query($sql);
		if ($registro = mysql_fetch_array($resultado))
			{
			$cotizacion_id_c		= $registro['cotizacion_id'];
			$cotizacion_proyecto 	= utf8_decode($registro['cotizacion_proyecto']);
			$cliente_razon_social	= utf8_decode($registro['cliente_razon_social']);
			$proyecto_nombre 		= 'Proyecto: '.$cotizacion_proyecto.' ('.$cotizacion_id_c.')';
			$cliente 				= 'Cliente: '.$cliente_razon_social;
			$cliente_id				= $registro['cliente_id'];
			}
			else
			$proyecto_nombre = 'Proyecto: ('.$cotizacion_id.') NO ENCONTRADO';
		}
		else
		$proyecto_nombre = 'Proyecto: TODOS LOS PROYECTOS';
	
	mysql_close($conn);	

// Filtro

if($tipo_id == 2)
$tipo= 'Tipo: Proyecto';
else
if($tipo_id == 1)
	$tipo= 'Tipo: Cotizaci�n';
	else
	$tipo= 'Tipo: Todos';

if($autorizada_estatus == 1)
$estatus= ', Estatus: Autorizada';
else
if($autorizada_estatus == 0)
	$estatus= ', Estatus: Cotizada';
	else
	$estatus= ', Estatus: Todas';

if($facturadas == 1)
$facturadas_SN= ', Facturadas: S�';
else
if($facturadas == 2)
	$facturadas_SN= ', Facturadas: No';
	else
	$facturadas_SN= ', Facturadas: Todas';

if($ordenadas == 1)
$ordenadas_SN= ', Ordenadas: S�';
else
if($ordenadas == 2)
	$ordenadas_SN= ', Ordenadas: No';
	else
	$ordenadas_SN= ', Ordenadas: Todas';

if($eliminadas == 1)
$eliminadas_SN= ', Eliminadas: S�';
else
$eliminadas_SN= ', Eliminadas: No';

$filtro_enca = utf8_decode($tipo . $estatus . $facturadas_SN . $ordenadas_SN . $eliminadas_SN);

// Objeto FPDF 
require('./fpdf/fpdf.php');

class PDF extends FPDF
{
  function Header()
    {
	  global $fecha, $cliente_enca, $proyecto_nombre, $tipo_de_cambio_DOLLAR, $tipo_de_cambio_EURO, $moneda_id, $moneda_solicitada, $filtro_enca;	
		
      $this->Image('./img/logo.JPG',10,9,33);
	  $this->SetTextColor(100);
	  $this->SetFont('Helvetica','',10);
	  
	  $PosX = (274 - $this->GetStringWidth('DOTDCD, S.A. DE C.V.')) / 2;
	  $this->SetXY($PosX, 9);
	  $this->Write (5, 'DOTDCD, S.A. DE C.V.');
	  
	  $this->SetTextColor(0);
	  $this->SetFont('Helvetica','',8);
	  $PosX = 228 + (20 - $this->GetStringWidth('REPORTADO EN '.$moneda_solicitada) / 2);
	  $this->SetXY($PosX, 11);
	  $this->Write (5, 'REPORTADO EN '.$moneda_solicitada);
	  
	  $this->SetTextColor(0);
	  $this->SetFont('Helvetica','',8);
	  
	  if($moneda_id==2)
	  	{
		$PosX = 228 + (20 - $this->GetStringWidth('T.C. '.$tipo_de_cambio_DOLLAR) / 2);
		$this->SetXY($PosX, 15);
		$this->Write (5, 'T.C. '.$tipo_de_cambio_DOLLAR);
		}
		else
		if($moneda_id==3)
			{
			$PosX = 228 + (20 - $this->GetStringWidth('T.C. '.$tipo_de_cambio_EURO) / 2);
			$this->SetXY($PosX, 15);
			$this->Write (5, 'T.C. '.$tipo_de_cambio_EURO);
			}
			else
			{
			$PosX = 228 + (20 - $this->GetStringWidth('T.C. MX$ 1.0000') / 2);
			$this->SetXY($PosX, 15);
			$this->Write (5, 'T.C. MX$ 1.0000');
			}

	  $strcte = 'SITUACI�N ACTUAL DE COTIZACIONES';
	  $PosX = (274 - $this->GetStringWidth($strcte)) / 2;
	  $this->SetXY($PosX, 13);
	  $this->Write (5, $strcte);
	  
	  $strcte = $cliente_enca;
	  $PosX = (274 - $this->GetStringWidth($strcte)) / 2;
	  $this->SetXY($PosX, 17);
	  $this->Write (5, $strcte);

	  $strcte = $filtro_enca;
	  $PosX = (274 - $this->GetStringWidth($strcte)) / 2;
	  $this->SetXY($PosX, 21);
	  $this->Write (5, $strcte);
	  
	  $this->SetFont('Arial','',6);
	  $this->SetTextColor(150);
	  $this->SetXY(15, 20);
	  $this->Write (5, date ( "d/m/Y h:i A" ));
	  $this->SetXY(21, 23);
	  $this->Write (5, 'P�gina '.$this->PageNo());
	  $this->SetTextColor(0);
	  
	  $this->SetLineWidth(.2);
	  
	  $this->Line(5,28,275,28);
	  $this->SetFont('Arial','B',7);
	  
	  $this-> SetLeftMargin(5);	
	  $this-> ln(5);
		
	  //$this-> SetLeftMargin(15);
	  
	  $this->SetFont('Arial','B',8);
		
	  $this->Write (5, 'Cliente / Proyectos'); 
	  
	  //$this->Setx(71);
	  //$this->Write (5, 'Autorizado');

	  $this->Setx(84);
	  $this->Write (5, 'Cotizado');
		
	  $this->Setx(104);
	  $this->Write (5, 'costo-total');
		
	  $this->Setx(126);
	  $this->Write (5, 'comprado');

	  $this->Setx(146);
	  $this->Write (5, 'por-comprar');

/*
	  $this->Setx(152);
	  $this->Write (5, 'Pagado');

	  $this->Setx(171);
	  $this->Write (5, 'por-pagar');
*/

	  $this->Setx(171);
	  $this->Write (5, 'facturado');

	  $this->Setx(190);
	  $this->Write (5, 'por facturar');

	  $this->Setx(217);
	  $this->Write (5, 'cobrado');

      $this->Setx(236);
	  $this->Cell(20,4,'por-cobrar',0,'R');



      $this->Setx(260);
	  $this->Cell(20,4,'Posici�n',0,'R');

	  $this->Line(5,33,275,33);
	  
	  $this-> ln(5);
	  $this->SetFont('Arial','',8);
	  
     }
	  
	function Detalle($linea_detalle, $proyecto,$v1,$v2,$v3,$v4,$v5,$v6,$v7,$v8,$v9,$v10,$moneda, $cotizacion_tipo_id)
	 {
	 $this->SetTextColor(50);
	 if($moneda == 2)
		$simbolo = 'US$';
		else
		if($moneda == 3)
			$simbolo = '�';
			else
			$simbolo = 'MX$';

		switch ($linea_detalle){
		case 0:
			$this->SetFont('Arial','B',7);
			
			if($cotizacion_tipo_id == 1) $tipo_cot = 'S'; else $tipo_cot = 'P';
			
			$nombre = trim($proyecto.' '.$tipo_cot);
			$nombre = str_replace(chr(13).chr(10), ' ', $nombre);
			$indice = 0;
			for ($i = 0; $i <= 10; $i++) $desc_prod[$i]='';
			$ancho = 51;
			$i = 0;
			do	{
				$atras = 0;
				if (strlen(substr($nombre,$i)) < ($ancho + 1))
					// desplegar secci�n final
					{
					$desc_prod[$indice]=trim(substr($nombre,$i));
					$indice=$indice+1;
					}
					else
					{
					while (substr(substr($nombre,$i,$ancho - $atras),(($ancho -1 ) - $atras),1) != ' ' && $atras < $ancho) 
						$atras = $atras + 1;
					// desplegar secci�n
					$desc_prod[$indice]=trim(substr($nombre,$i,($ancho - $atras)));
					$indice=$indice+1;
					}
				$i = ($i + $ancho) - $atras;
				} while ($i < strlen($nombre));
			
			$this->Write (5, $desc_prod[0]);

			$this->SetFont('Arial','',6);
			
			$this->Setx(78);
			$this->Cell(20,4,$simbolo.number_format(round(trim($v1), 2), 2, '.', ','),'',0,'R');
	
			$this->Setx(100);
			$this->Cell(20,4,$simbolo.number_format(round(trim($v2), 2), 2, '.', ','),'',0,'R');
	
			$this->Setx(122);
			$this->Cell(20,4,$simbolo.number_format(round(trim($v3), 2), 2, '.', ','),'',0,'R');
	
			$this->Setx(144);
			$this->Cell(20,4,$simbolo.number_format(round(trim($v4), 2), 2, '.', ','),'',0,'R');

			$this->Setx(166);
			$this->Cell(20,4,$simbolo.number_format(round(trim($v5), 2), 2, '.', ','),'',0,'R');
	
			$this->Setx(188);
			$this->Cell(20,4,$simbolo.number_format(round(trim($v6), 2), 2, '.', ','),'',0,'R');
	
			$this->Setx(210);
			$this->Cell(20,4,$simbolo.number_format(round(trim($v7), 2), 2, '.', ','),'',0,'R');
			
			$this->Setx(232);
			$this->Cell(20,4,$simbolo.number_format(round(trim($v8), 2), 2, '.', ','),'',0,'R');
			
			$this->Setx(254);
			$this->Cell(20,4,$simbolo.number_format(round(trim(($v1+$v3) -($v2+$v7)), 2), 2, '.', ','),'',0,'R');
			
			$i = 1;
			while ($i <= $indice)
				{
				$this-> ln(3);
				if($i <= $indice)
					{
					$this->SetFont('Arial','B',7);
					$this->Write (5, $desc_prod[$i]);
					}
				$i++;
				$this-> ln(0);
				}
			
			$this-> ln(1);
		break;
		
		case 1:
		$this->SetTextColor(0);
		$this->SetFont('Arial','B',7);
		$this-> ln(1);
		$this->Write (5, $proyecto);

		$this->Setx(78);
		$this->Cell(20,4,$simbolo.number_format(round(trim($v1), 2), 2, '.', ','),'T',0,'R');

		$this->Setx(100);
		$this->Cell(20,4,$simbolo.number_format(round(trim($v2), 2), 2, '.', ','),'T',0,'R');

		$this->Setx(122);
		$this->Cell(20,4,$simbolo.number_format(round(trim($v3), 2), 2, '.', ','),'T',0,'R');

		$this->Setx(144);
		$this->Cell(20,4,$simbolo.number_format(round(trim($v4), 2), 2, '.', ','),'T',0,'R');

		$this->Setx(166);
		$this->Cell(20,4,$simbolo.number_format(round(trim($v5), 2), 2, '.', ','),'T',0,'R');

		$this->Setx(188);
		$this->Cell(20,4,$simbolo.number_format(round(trim($v6), 2), 2, '.', ','),'T',0,'R');

		$this->Setx(210);
		$this->Cell(20,4,$simbolo.number_format(round(trim($v7), 2), 2, '.', ','),'T',0,'R');

		$this->Setx(232);
		$this->Cell(20,4,$simbolo.number_format(round(trim($v8), 2), 2, '.', ','),'T',0,'R');
			
		$this->Setx(254);
		$this->Cell(20,4,$simbolo.number_format(round(trim(($v1+$v3) -($v2+$v7)), 2), 2, '.', ','),'T',0,'R');
			
		$this-> ln(6);
		break;

		case 2:
		$this->SetFont('Arial','B',8);
		$this->SetTextColor(0);
		$this-> ln(2);
		$this->Write (5, $proyecto);
		$this-> ln(4);
		break;
		}
	}

  function Footer()
    {
      $this->SetXY(100,-15);
      $this->SetFont('Helvetica','I',8);
      $this->Write (5, ''); // Letrero de pie de p�gina
    }
}

	$pdf=new PDF();
	//$pdf->AddPage('Portrait','Letter');
	$pdf->AddPage('Landscape','Letter');
	
	// Abrir base de datos
	include("./connexion_BD.php");

	// Inicializar acumuladores
	$gtv1 = 0;
	$gtv2 = 0;
	$gtv3 = 0;
	$gtv4 = 0;
	$gtv5 = 0;
	$gtv6 = 0;
	$gtv7 = 0;
	$gtv8 = 0;
	$gtv9  = 0;
	$gtv10 = 0;
	$tv1 = 0;
	$tv2 = 0;
	$tv3 = 0;
	$tv4 = 0;
	$tv5 = 0;
	$tv6 = 0;
	$tv7 = 0;
	$tv8 = 0;
	$tv9  = 0;
	$tv10 = 0;

    // Filtros
	$filtro	= "";
	if ($cliente_id > 0)
		$filtro .= " AND cotizacion_cliente_id=".$cliente_id;
	if($tipo_id != 0) $filtro .= " AND cotizacion_tipo_id = ".$tipo_id;
	if ($autorizada_estatus != 3)
		$filtro .= " AND cotizacion_autorizada_estatus = ".$autorizada_estatus;
	if ($eliminadas == 1)
		$filtro .= " AND cotizacion_estatus_baja = 1";
		else
		$filtro .= " AND cotizacion_estatus_baja = 0";

	// facturadas
	
	if($facturadas == 1)
		$filtro .= " AND cotizacion_id IN (SELECT DISTINCT factura_proyecto_id from facturas WHERE factura_estatus_baja = 1)";
	else if($facturadas == 2)
		$filtro .= " AND cotizacion_id NOT IN (SELECT DISTINCT factura_proyecto_id from facturas WHERE factura_estatus_baja = 1)";
	
	// Ordenadas
	if($ordenadas == 1)
		$filtro .= " AND cotizacion_id IN (SELECT DISTINCT CASE orden_cotizacion_id WHEN 0 THEN COALESCE(requisicion_cotizacion_id, 0) ELSE orden_cotizacion_id END
		FROM ordenes_compra
		LEFT JOIN requisiciones ON requisicion_id = orden_requisicion_id
		WHERE (orden_cotizacion_id = 0 AND COALESCE(requisicion_cotizacion_id, 0) <> 0) OR orden_cotizacion_id <> 0)";
		else
		if($ordenadas == 2)
		$filtro .= " AND cotizacion_id NOT IN (SELECT DISTINCT CASE orden_cotizacion_id WHEN 0 THEN COALESCE(requisicion_cotizacion_id, 0) ELSE orden_cotizacion_id END
		FROM ordenes_compra
		LEFT JOIN requisiciones ON requisicion_id = orden_requisicion_id
		WHERE (orden_cotizacion_id = 0 AND COALESCE(requisicion_cotizacion_id, 0) <> 0) OR orden_cotizacion_id <> 0)";

		/*
		$fecha_inicial = "06/07/2017";
		$fecha_final = "06/12/2018"; 
		$filtro .= " AND (cotizacion_fecha_alta >= '".fdmy_sql($fecha_inicial). "')";		
		$filtro .= " AND (cotizacion_fecha_alta <= '".fdmy_sql($fecha_final). "')";		
		 */
		 
	// Proceso
	$sql = "SELECT cotizacion_id, cotizacion_proyecto, cliente_razon_social, cotizacion_moneda_id, cotizacion_cliente_id, estimacion_iva, cotizacion_compras_totalizadas, cotizacion_extras, cotizacion_tipo_id, cotizacion_descuento_porcentaje
				FROM cotizaciones 
				JOIN clientes ON cliente_id = cotizacion_cliente_id
				WHERE cotizacion_estatus_baja <> 9".$filtro."
		ORDER BY cliente_razon_social, cotizacion_proyecto";

	//echo '***'.$sql.'***';
	 
	$resultado=mysql_query($sql);
	$cliente_ant = 0;
	while ($registro = mysql_fetch_array($resultado))
		{
		$f_pcje 	=  1 - (($registro['cotizacion_descuento_porcentaje']+0) / 100);
			$cotizacion_tipo_id     = $registro['cotizacion_tipo_id'];
			$cotizacion_id_c		= $registro['cotizacion_id'];
			$cliente_id_c			= $registro['cotizacion_cliente_id'];
			$cotizacion_proyecto 	= utf8_decode($registro['cotizacion_proyecto']);
			$cliente_razon_social	= utf8_decode($registro['cliente_razon_social']).'('.$cliente_id_c.')';
			
			if($cliente_ant == 0)     
				{
				$linea_detalle = 2;
				$pdf-> Detalle($linea_detalle,$cliente_razon_social,0,0,0,0,0,0,0,0,0,0,0,0);
				$cliente_ant = $cliente_id_c;
				}

			$proyecto_cliente 		= $cotizacion_proyecto.' ('.$cotizacion_id_c.')';
			
			$moneda_id_c			= $registro['cotizacion_moneda_id'];
			$iva 					= $registro['estimacion_iva'];
			$cotizacion_compras_totalizadas	= $registro['cotizacion_compras_totalizadas'];
			$extras					= $registro['cotizacion_extras']+0;
			
			// inicializar variables a llenar
			$v1 = 0; $v2 = 0; $v3 = 0; $v4 = 0;	$v5 = 0; $v6 = 0; $v7 = 0; $v8 = 0; $v9 = 0; $v10 = 0;		
			// Obtener lo cotizado y su costo ($v1, $v2 - 1)
			$sql = "SELECT (((insumo_cantidad * (insumo_precio_ma + insumo_precio_mo)) * (1 + ".$iva." *(.16)))*".$f_pcje.") AS cotizado, 
			CASE insumo_precio_ma WHEN 0 THEN 0
			ELSE
			((insumo_cantidad * producto_costo) * (1 + ".$iva." *(.16)))
			END as costo_cotizado, 
			producto_moneda_id
			FROM cotizaciones_insumos
			JOIN productos ON producto_id = insumo_producto_id
			WHERE insumo_cotizacion_id = ".$cotizacion_id_c;
			$datasetc = mysql_query($sql,$conn) or die("Error selecting Coords :".mysql_error());
			while($rowc = mysql_fetch_array($datasetc))
				{ 
				$cotizado 		= $rowc['cotizado'];
				$costo_cotizado = $rowc['costo_cotizado'];
				$producto_moneda_id = $rowc['producto_moneda_id'];

				// COTIZADO - Conversi�n a pesos
				if($moneda_id_c == 2)
					{
					$v1_pesos = $cotizado * $Cotizacion_DOLLAR;
					}
					else
					if($moneda_id_c == 3)
						{
						$v1_pesos = $cotizado * $Cotizacion_EURO;
						}
						else
						{
						$v1_pesos = $cotizado;
						}
						
				// COSTO - Conversi�n a pesos
				if($producto_moneda_id == 2)
					{
					$v2_pesos = $costo_cotizado * $Cotizacion_DOLLAR;
					}
					else
					if($producto_moneda_id == 3)
						{
						$v2_pesos = $costo_cotizado * $Cotizacion_EURO;
						}
						else
						{
						$v2_pesos = $costo_cotizado;
						}
						
				// Conversi�n a moneda solicitada
				if($moneda_id == 2)
					{
					$v1 += $v1_pesos / $Cotizacion_DOLLAR;
					$v2 += $v2_pesos / $Cotizacion_DOLLAR;
					}
					else
					if($moneda_id == 3)
						{
						$v1 += $v1_pesos / $Cotizacion_EURO;
						$v2 += $v2_pesos / $Cotizacion_EURO;
						}
						else
						{
						$v1 += $v1_pesos;
						$v2 += $v2_pesos;
						}
				}
			 
			//if ($cotizacion_id_c == 1100) echo $v1.'<br>';
			 
			// Obtener aditivas y su costo ($v1, $v2 - 2)
			$sql = "SELECT ((insumo_cantidad * (insumo_precio_ma + insumo_precio_mo)) * (1 + ".$iva." *(.16))) AS aditivas,
			CASE insumo_precio_ma WHEN 0 THEN 0
			ELSE
			((insumo_cantidad * producto_costo) * (1 + ".$iva." *(.16)))
			END as costo_aditivas, 
			producto_moneda_id
			FROM aditivas_y_deductivas_insumos
			JOIN productos ON producto_id = insumo_producto_id
			JOIN aditivas_y_deductivas ON cotizacion_id = insumo_cotizacion_id AND
										  cotizacion_adicional_id = insumo_adicional_id
			WHERE insumo_cotizacion_id = ".$cotizacion_id_c." AND cotizacion_esdeductiva = 0";

			$datasetc = mysql_query($sql,$conn) or die("Error selecting Coords :".mysql_error());
			while($rowc = mysql_fetch_array($datasetc))
				{ 
				$aditivas 		= $rowc['aditivas'];
				$costo_aditivas = $rowc['costo_aditivas'];
				$producto_moneda_id = $rowc['producto_moneda_id'];
				
				// COTIZADO - Conversi�n a pesos
				if($moneda_id_c == 2)
					{
					$v1_pesos = $aditivas * $Cotizacion_DOLLAR;
					}
					else
					if($moneda_id_c == 3)
						{
						$v1_pesos = $aditivas * $Cotizacion_EURO;
						}
						else
						{
						$v1_pesos = $aditivas;
						}
						
				// COSTO - Conversi�n a pesos
				if($producto_moneda_id == 2)
					{
					$v2_pesos = $costo_aditivas * $Cotizacion_DOLLAR;
					}
					else
					if($producto_moneda_id == 3)
						{
						$v2_pesos = $costo_aditivas * $Cotizacion_EURO;
						}
						else
						{
						$v2_pesos = $costo_aditivas;
						}
						
				// Conversi�n a moneda solicitada
				if($moneda_id == 2)
					{
					$v1 += $v1_pesos / $Cotizacion_DOLLAR;
					$v2 += $v2_pesos / $Cotizacion_DOLLAR;
					}
					else
					if($moneda_id == 3)
						{
						$v1 += $v1_pesos / $Cotizacion_EURO;
						$v2 += $v2_pesos / $Cotizacion_EURO;
						}
						else
						{
						$v1 += $v1_pesos;
						$v2 += $v2_pesos;
						}

				}
			
			//if ($cotizacion_id_c == 1100) echo $v1.'<br>';
				
			// Obtener deductivas y su costo ($v1, $v2 - 3)
			$sql = "SELECT ((insumo_cantidad * (insumo_precio_ma + insumo_precio_mo)) * (1 + ".$iva." *(.16))) AS deductivas,
			CASE insumo_precio_ma WHEN 0 THEN 0
			ELSE
			((insumo_cantidad * producto_costo) * (1 + ".$iva." *(.16)))
			END as costo_deductivas, 
			producto_moneda_id
			FROM aditivas_y_deductivas_insumos
			JOIN productos ON producto_id = insumo_producto_id
			JOIN aditivas_y_deductivas ON cotizacion_id = insumo_cotizacion_id AND
										  cotizacion_adicional_id = insumo_adicional_id
			WHERE insumo_cotizacion_id = ".$cotizacion_id_c." AND cotizacion_esdeductiva = 1";
			// insumo_ma_costo
			$datasetc = mysql_query($sql,$conn) or die("Error selecting Coords :".mysql_error());
			while($rowc = mysql_fetch_array($datasetc))
				{ 
				$deductivas 		= $rowc['deductivas'];
				$costo_deductivas 	= $rowc['costo_deductivas'];
				$producto_moneda_id = $rowc['producto_moneda_id'];
				
				// COTIZADO - Conversi�n a pesos
				if($moneda_id_c == 2)
					{
					$v1_pesos = $deductivas * $Cotizacion_DOLLAR;
					}
					else
					if($moneda_id_c == 3)
						{
						$v1_pesos = $deductivas * $Cotizacion_EURO;
						}
						else
						{
						$v1_pesos = $deductivas;
						}
						
				// COSTO - Conversi�n a pesos
				if($producto_moneda_id == 2)
					{
					$v2_pesos = $costo_deductivas * $Cotizacion_DOLLAR;
					}
					else
					if($producto_moneda_id == 3)
						{
						$v2_pesos = $deductivas * $Cotizacion_EURO;
						}
						else
						{
						$v2_pesos = $deductivas;
						}
						
				// Conversi�n a moneda solicitada
				if($moneda_id == 2)
					{
					$v1 -= $v1_pesos / $Cotizacion_DOLLAR;
					$v2 -= $v2_pesos / $Cotizacion_DOLLAR;
					}
					else
					if($moneda_id == 3)
						{
						$v1 -= $v1_pesos / $Cotizacion_EURO;
						$v2 -= $v2_pesos / $Cotizacion_EURO;
						}
						else
						{
						$v1 -= $v1_pesos;
						$v2 -= $v2_pesos;
						}
				}
			
			//if ($cotizacion_id_c == 1100) echo $v1.'<br>';
			
			// Calcular extras
			if($moneda_id_c == 2)
				{
				$v1_pesos = $extras * $Cotizacion_DOLLAR;
				}
				else
				if($moneda_id_c == 3)
					{
					$v1_pesos = $extras * $Cotizacion_EURO;
					}
					else
					{
					$v1_pesos = $extras;
					}
					
			// Conversi�n a moneda solicitada
			if($moneda_id == 2)
				{
				$v1 += $v1_pesos / $Cotizacion_DOLLAR;
				}
				else
				if($moneda_id == 3)
					{
					$v1 += $v1_pesos / $Cotizacion_EURO;
					}
					else
					{
					$v1 += $v1_pesos;
					}
			
			//if ($cotizacion_id_c == 1100) echo $v1.'<br>';


	
		/*
			// Obtener lo comprado ($v3)
			$v3	= 0;
			
			// Leer movimientos
			$sql = "select cheque_id, cheque_fecha_alta, banco_cuenta_moneda_id, cheque_monto,  COALESCE(pago_monto_moneda_cheque, 0) AS pago_orden, COALESCE(cheque_comentario, '') as cheque_comentario, COALESCE(P.proveedor_razon_social, '') as proveedor_razon_social_orden, COALESCE(C.proveedor_razon_social, '') as proveedor_razon_social_cheque
						   FROM cheques
						   LEFT JOIN proveedores as C ON C.proveedor_id = cheque_proveedor_id
						   LEFT JOIN ordenes_compra_pagos ON pago_cheque_id = cheque_id
						   LEFT JOIN ordenes_compra ON orden_id = pago_orden_id
						   LEFT JOIN proveedores as P ON P.proveedor_id = orden_proveedor_id
						   LEFT JOIN requisiciones ON requisicion_id = orden_requisicion_id
						   JOIN bancos_cuentas ON banco_cuenta_id = cheque_cuenta_id
						   WHERE cheque_ingreso <> '1' AND cheque_estatus_baja = 0 
								 AND (COALESCE(orden_cotizacion_id, 0) = ".$cotizacion_id_c." OR COALESCE(cheque_cotizacion_id, 0) = ".$cotizacion_id_c." OR COALESCE(requisicion_cotizacion_id, 0) = ".$cotizacion_id_c.")	 	
						   ORDER BY cheque_id";
			//if($cotizacion_id_c==1105) echo '***'.$sql.'***';
			//echo '***'.$sql.'***';
			$res=mysql_query($sql);
		
			if(mysql_num_rows($res)>0)
				{
				while ($reg = mysql_fetch_array($res))
					{
					// Determinar de donde se toma el monto, proyecto, proveedor, cliente
						if($reg['pago_orden'] != 0)
							$monto 		= $reg['pago_orden'];
							else
							$monto  	= $reg['cheque_monto'];
					
					// Conversi�n a pesos
					$moneda_id_p = $reg['banco_cuenta_moneda_id'];
					if($moneda_id_p == 2)
						$monto_pesos = $monto * $Cotizacion_DOLLAR;
						else
						if($moneda_id_p == 3)
							$monto_pesos = $monto * $Cotizacion_EURO;
							else
							$monto_pesos = $monto;
							
					// Conversi�n a moneda solicitada
					if($moneda_id == 2)
						$monto_moneda = $monto_pesos / $Cotizacion_DOLLAR;
						else
						if($moneda_id == 3)
							$monto_moneda = $monto_pesos / $Cotizacion_EURO;
							else
							$monto_moneda = $monto_pesos;
					
					$v3 = $v3 + $monto_moneda;
					}
				}

			//if($cotizacion_id_c==1105) echo $v3.'<br>';
 
			*/
 
			// Obtener lo comprado ($v3)
			//***$v3 = 0;
					
			$gtot_ingresos 		= 0;
			$gtot_egresos  		= 0;
			
			// Leer movimientos
			$filtro	= " AND ((COALESCE(CO.cotizacion_id, 0) = ".$cotizacion_id_c." OR COALESCE(CO2.cotizacion_id, 0) = ".$cotizacion_id_c.") OR (COALESCE(CO3.cotizacion_id, 0) = ".$cotizacion_id_c." OR COALESCE(CO4.cotizacion_id, 0) = ".$cotizacion_id_c."))";						
						   
			$sql = "select cheque_ingreso, cheque_monto, cheque_fecha_alta, banco_cuenta_moneda_id,
						   cheque_comentario, 
						   /*CONCAT(empresa_razon_social, ' - ', banco_cuenta_comentario) as empresa_cuenta, */
						   cheque_documento, cheque_cuenta_id,
						   
						   COALESCE(PR.proveedor_razon_social, '') AS proveedor,
						   COALESCE(CO.cotizacion_proyecto, '') AS proyecto,
						   COALESCE(CL.cliente_razon_social, '') AS cliente,
						   
						   COALESCE(PR2.proveedor_razon_social, '') AS proveedor2,
						   COALESCE(CO2.cotizacion_proyecto, '') AS proyecto2,
						   COALESCE(CO3.cotizacion_proyecto, '') AS proyecto3,
						   
						   COALESCE(CO4.cotizacion_proyecto, '') AS proyecto4,
						   COALESCE(CL2.cliente_razon_social, '') AS cliente2,
						   
						   COALESCE(O.pago_orden_id, 0) AS orden,
						   COALESCE(O.pago_monto_moneda_cheque, 0) AS pago_orden,
						   COALESCE(orden_cotizacion_id, 0) AS o_cotizacion_id,
						   COALESCE(requisicion_cotizacion_id, 0) AS r_cotizacion_id,
						   COALESCE(F.pago_monto_moneda_cheque, 0) AS pago_factura, 
						   COALESCE(factura_proyecto_id, 0) AS f_cotizacion_id,
						   COALESCE(factura_factura, '') AS factura
						   
						   FROM cheques
						   
						   LEFT JOIN ordenes_compra_pagos AS O ON O.pago_cheque_id = cheque_id
						   LEFT JOIN ordenes_compra ON orden_id = pago_orden_id
						   LEFT JOIN requisiciones ON requisicion_id = orden_requisicion_id
						   LEFT JOIN facturas_pagos AS F ON F.pago_cheque_id = cheque_id
						   LEFT JOIN facturas ON factura_id = pago_factura_id
						   
						   LEFT JOIN proveedores AS PR ON PR.proveedor_id = cheque_proveedor_id
						   LEFT JOIN cotizaciones AS CO ON CO.cotizacion_id = cheque_cotizacion_id
						   LEFT JOIN clientes AS CL ON CL.cliente_id = CO.cotizacion_cliente_id
						   
						   LEFT JOIN proveedores AS PR2 ON PR2.proveedor_id = orden_proveedor_id
						   LEFT JOIN cotizaciones AS CO2 
								ON CO2.cotizacion_id = orden_cotizacion_id
						   LEFT JOIN cotizaciones AS CO3 
								ON CO3.cotizacion_id = requisicion_cotizacion_id
							
						   LEFT JOIN cotizaciones AS CO4 
								ON CO4.cotizacion_id = factura_proyecto_id
						   LEFT JOIN clientes AS CL2 ON CL2.cliente_id = CO4.cotizacion_cliente_id
						   
						   WHERE cheque_ingreso <> '1'
								 AND cheque_estatus_baja = 0 
								 ".$filtro."	 	
						   ORDER BY cheque_fecha_alta, cheque_id";						   				
				
				/*
				JOIN bancos_cuentas ON banco_cuenta_id = cheque_cuenta_id
						   JOIN multiempresa ON empresa_id = banco_empresa_id
				*/
						   // AND COALESCE(CO.cotizacion_tipo_id, 0) = 2
			//if($cotizacion_id_c==1913) echo '***'.$sql.'***';
			$res=mysql_query($sql);
		
			if(mysql_num_rows($res)>0)
				{
				$empresa_cuenta		= '';	
				$tot_ingresos 		= 0;
				$tot_egresos  		= 0;
				$fecha_ant 			= '1900-01-01';
				$dia_ant 			= substr($fecha_ant,8,2) - 1;
				$fecha_ant 			= substr($fecha_ant,0,8) . substr(100+$dia_ant,1,2);
		
				while ($reg = mysql_fetch_array($res))
					{
					$moneda_id_p			= $reg['banco_cuenta_moneda_id'];
					$cheque_fecha 	 		= fsql_dmy(substr($reg['cheque_fecha_alta'],0,10));
					$cheque_ingreso 		= $reg['cheque_ingreso']+0;
					
					// Determinar de donde se toma el monto, proyecto, proveedor, cliente
					if($cheque_ingreso)
						{
						if($reg['f_cotizacion_id'] != 0)
							{
							$monto 		= $reg['pago_factura'];
							$proyecto	= $reg['proyecto4'];
							$cliente	= $reg['cliente2'];
							$factura    = $reg['factura'];
							$proveedor	= '';
							$orden		= '';
							$concepto  	= 'Pago de factura '.$factura;
							}
							else
							{
							$monto  	= $reg['cheque_monto'];
							$proyecto	= $reg['proyecto'];
							$cliente	= $reg['cliente'];
							$factura    = '';
							$orden		= '';
							$proveedor	= '';

							$concepto  	= $reg['cheque_comentario'];
							}
						}
						else
						{
						if($reg['o_cotizacion_id'] != 0)
							{
							$monto 		= $reg['pago_orden'];
							$proveedor	= $reg['proveedor2'];
							$proyecto	= $reg['proyecto2'];
							$orden		= $reg['orden'];
							$cliente	= '';
							$factura    = '';
							$concepto  	= 'Pago de orden '.$orden;
							}
							else
							if($reg['r_cotizacion_id'] != 0)
								{
								$monto 		= $reg['pago_orden'];
								$proveedor	= $reg['proveedor2'];
								$proyecto	= $reg['proyecto3'];
								$orden		= $reg['orden'];
								$cliente	= '';
								$factura    = '';
								$concepto  	= 'Pago de orden '.$orden;
								}
								else
								{
								$monto  	= $reg['cheque_monto'];
								$proveedor	= $reg['proveedor'];
								$proyecto	= $reg['proyecto'];
								$cliente	= '';
								$orden		= '';
								$factura    = '';
								$concepto  	= $reg['cheque_comentario'];
								}
						}
					
					// Conversi�n a pesos
					if($moneda_id_p == 2)
						$monto_pesos = $monto * $Cotizacion_DOLLAR;
						else
						if($moneda_id_p == 3)
							$monto_pesos = $monto * $Cotizacion_EURO;
							else
							$monto_pesos = $monto;
							
					// Conversi�n a moneda solicitada
					if($moneda_id == 2)
						$monto_moneda = $monto_pesos / $Cotizacion_DOLLAR;
						else
						if($moneda_id == 3)
							$monto_moneda = $monto_pesos / $Cotizacion_EURO;
							else
							$monto_moneda = $monto_pesos;
					
					//$empresa_cuenta			= $reg['empresa_cuenta'];
					$cheque_documento		= $reg['cheque_documento'];
					$cuenta_id				= $reg['cheque_cuenta_id'];
					$proveedor_cliente		= '';
		
					//Detalle
					if($cheque_ingreso)
						{
						$tot_ingresos 	= $tot_ingresos  + $monto_moneda;
						$gtot_ingresos 	= $gtot_ingresos + $monto_moneda;
						$proveedor_cliente = $cliente;
						}
						else
						{
						$tot_egresos 	= $tot_egresos 	+ $monto_moneda;
						$gtot_egresos 	= $gtot_egresos + $monto_moneda;
						$proveedor_cliente = $proveedor;
						}
					$linea_detalle = 0;
					//$pdf-> Detalle($linea_detalle, $cheque_documento, $cheque_fecha ,$cheque_ingreso,$monto,$moneda_id,$concepto,$empresa_cuenta,$proveedor_cliente,$monto_moneda,0,$moneda_id);
					}
				}
		
			// Total
			$linea_detalle = 1;
			//$pdf->Detalle($linea_detalle,'',$fecha_ant,0,0,0,'','','',$tot_ingresos,$tot_egresos,$moneda_id);
			$v3 = $gtot_egresos;

			echo $gtot_egresos;
			//die();
			 
			// Tomando lo comprado como pagado
			$v9 = $v3;
			
			// Calcular por comprar
			$v4 = $v2 - $v3;

			// Calcular por pagar
			$v10 = $v2 - $v9;
	
			// Obtener lo facturado ($v5)
			$sql = "SELECT factura_id, factura_total as facturado, factura_moneda_id FROM facturas
					WHERE factura_proyecto_id = ".$cotizacion_id_c." AND factura_estatus_baja = 1";
			$datasetc = mysql_query($sql,$conn) or die("Error selecting Coords :".mysql_error());
			
			// para sacar total por proyecto
			//$facturacion = 0;
			//$facturas = 0;
	
			while ($rowc = mysql_fetch_array($datasetc))
				{ 
				$facturado 		= trim($rowc['facturado'])+0;
				$moneda_id_f    = $rowc['factura_moneda_id'];
	
				// Conversi�n a pesos
				if($moneda_id_f == 2)
					{
					$v5_pesos = $facturado * $Cotizacion_DOLLAR;
					//$factor_conversion = 1;
					}
					else
					if($moneda_id_f == 3)
						{
						$v5_pesos = $facturado * $Cotizacion_EURO;
						}
						else
						{
						$v5_pesos = $facturado;
						//$factor_conversion = 13.20;
						}
						
				// Conversi�n a moneda solicitada
				if($moneda_id == 2)
					{
					$v5 += $v5_pesos / $Cotizacion_DOLLAR;
					}
					else
					if($moneda_id == 3)
						{
						$v5 += $v5_pesos / $Cotizacion_EURO;
						}
						else
						{
						$v5 += $v5_pesos;
						}
				//$facturacion += trim($facturado)/$factor_conversion;
				//$facturas++;
				//echo '<br>Factura_id = '.$rowc['factura_id'];
				}
			
			//echo '<br>Proyecto: '.$cotizacion_id_c.' Facturas: '.$facturas.' Facturado: '.$facturacion;
				
			// Calcular por facturar
			$v6 = $v1 - $v5;
	
			//if ($cotizacion_id_c == 619) echo '<br>Facturado';
			
			$v7 = 0;
			
			// Obtener lo cobrado ($v7)
			$sql = "SELECT ROUND( SUM(fp.pago_monto_moneda_cheque), 2 ) AS cobrado, factura_moneda_id
						FROM facturas_pagos
						JOIN facturas ON factura_id = pago_factura_id
						WHERE factura_proyecto_id = ".$cotizacion_id_c;
			//echo '***'.$sql.'***';
			$datasetc = mysql_query($sql,$conn) or die("Error selecting Coords :".mysql_error());
			while ($rowc = mysql_fetch_array($datasetc))
				{ 
				$cobrado 		= $rowc['cobrado'];
				$moneda_id_f    = $rowc['factura_moneda_id'];
	
				// Conversi�n a pesos
				if($moneda_id_f == 2)
					{
					$v7_pesos = $cobrado * $Cotizacion_DOLLAR;
					}
					else
					if($moneda_id_f == 3)
						{
						$v7_pesos = $cobrado * $Cotizacion_EURO;
						}
						else
						{
						$v7_pesos = $cobrado;
						}
						
				// Conversi�n a moneda solicitada
				if($moneda_id == 2)
					{
					$v7 += $v7_pesos / $Cotizacion_DOLLAR;
					}
					else
					{
					if($moneda_id == 3)
						{
						$v7 += $v7_pesos / $Cotizacion_EURO;
						}
						else
						{
						$v7 += $v7_pesos;
						}
					}
				}
			
			
			//if ($cotizacion_id_c == 619) echo '<br>Cobrado';
				
			// Calcular por cobrar
			$v8 = $v1 - $v7;
	
			// Recalcular los proyectos con compras realizadas al 100%
			if($cotizacion_compras_totalizadas)
				{
				$v3 = $v2;
				$v4 = 0;
				$v10 = $v1 - $v7;
				}
			
			//if ($cotizacion_id_c == 619) echo '<br>Recalculado';
			
			if($cliente_ant != $cliente_id_c)     
				{
				// Total
				//if ($tv2 > 15)
				//	{
					$linea_detalle = 1;
					$pdf-> Detalle($linea_detalle,'TOTAL DEL CLIENTE',$tv1,$tv2,$tv3,$tv4,$tv5,$tv6,$tv7,$tv8, $tv9,$tv10, $moneda_id, 0);
					$tv1 = 0;
					$tv2 = 0;
					$tv3 = 0;
					$tv4 = 0;
					$tv5 = 0;
					$tv6 = 0;
					$tv7 = 0;
					$tv8 = 0;
					$tv9 = 0;
					$tv10 = 0;
				//  }
				$linea_detalle = 2;
				$pdf-> Detalle($linea_detalle,$cliente_razon_social,0,0,0,0,0,0,0,0,0,0,0,0);
				$cliente_ant = $cliente_id_c;
				}
	
	//		if ($v2 > 15)
	//			{
				// Acumular
				$gtv1 += $v1;
				$gtv2 += $v2;
				$gtv3 += $v3;
				$gtv4 += $v4;
				$gtv5 += $v5;
				$gtv6 += $v6;
				$gtv7 += $v7;
				$gtv8 += $v8;
				$gtv9  += $v9;
				$gtv10  += $v10;
				$tv1  += $v1;
				$tv2  += $v2;
				$tv3  += $v3;
				$tv4  += $v4;
				$tv5  += $v5;
				$tv6  += $v6;
				$tv7  += $v7;
				$tv8  += $v8;
				$tv9  += $v9;
				$tv10  += $v10;
				
				//if ($cotizacion_id_c == 619) echo '<br>Detalle';
				
				// Detalle proyecto
				$linea_detalle = 0;
				$pdf-> Detalle($linea_detalle,$proyecto_cliente,$v1,$v2,$v3,$v4,$v5,$v6,$v7,$v8,$v9,$v10, $moneda_id, $cotizacion_tipo_id);
	//			}
		//	}
		flush();
		}

	// Total cliente
	$linea_detalle = 1;
	$pdf-> Detalle($linea_detalle, 'TOTAL DEL CLIENTE',$tv1,$tv2,$tv3,$tv4,$tv5,$tv6,$tv7,$tv8,$tv9,$tv10, $moneda_id, 0);

	// Gran Total
	$linea_detalle = 1;
	$pdf-> Detalle($linea_detalle, 'GRAN TOTAL',$gtv1,$gtv2,$gtv3,$gtv4,$gtv5,$gtv6,$gtv7,$gtv8,$gtv9,$gtv10, $moneda_id, 0);
		
	// Generar archivo PDF
	 $pdf-> Output('Situacion_proyectos_C'.$cliente_id.'_P'.$cotizacion_id.'.pdf','D');

	// Cerrar base de datos
	mysql_close($conn);
	
} 
catch(Error $e) {
    $trace = $e->getTrace();
    echo $e->getMessage().' in '.$e->getFile().' on line '.$e->getLine().' called from '.$trace[0]['file'].' on line '.$trace[0]['line'];
}

?> 












$comprado = 0;
			
		// Leer movimientos
			$sql = "select cheque_id, cheque_fecha_alta, banco_cuenta_moneda_id, cheque_monto,  
					COALESCE(pago_monto_moneda_cheque, 0) AS pago_orden, COALESCE(cheque_comentario, '') as cheque_comentario, 
					COALESCE(P.proveedor_razon_social, '') as proveedor_razon_social_orden, 
					COALESCE(C.proveedor_razon_social, '') as proveedor_razon_social_cheque
					FROM cheques
					LEFT JOIN proveedores as C ON C.proveedor_id = cheque_proveedor_id
					LEFT JOIN ordenes_compra_pagos ON pago_cheque_id = cheque_id
					LEFT JOIN ordenes_compra ON orden_id = pago_orden_id
					LEFT JOIN proveedores as P ON P.proveedor_id = orden_proveedor_id
					LEFT JOIN requisiciones ON requisicion_id = orden_requisicion_id
					JOIN bancos_cuentas ON banco_cuenta_id = cheque_cuenta_id
					WHERE cheque_ingreso <> '1' AND cheque_estatus_baja = 0 
					AND (COALESCE(orden_cotizacion_id, 0) = ".$cotizacion_id." 
					OR COALESCE(cheque_cotizacion_id, 0) = ".$cotizacion_id." 
					OR COALESCE(requisicion_cotizacion_id, 0) = ".$cotizacion_id.")	 	
					ORDER BY cheque_id";
					   
		$res=mysql_query($sql);
		
		if(mysql_num_rows($res)>0)
		{
			while ($reg = mysql_fetch_array($res))
			{
				// Determinar de donde se toma el monto, proyecto, proveedor, cliente
				if($reg['pago_orden'] != 0)
					$monto = $reg['pago_orden'];
				else
					$monto = $reg['cheque_monto'];
				
				// Conversión a pesos
				$moneda_id_p = $reg['banco_cuenta_moneda_id'];
				if($moneda_id_p == 2)
					$monto_pesos = $monto * $Cotizacion_DOLLAR;
				else{
					if($moneda_id_p == 3)
						$monto_pesos = $monto * $Cotizacion_EURO;
					else
						$monto_pesos = $monto; 
				}		
				// Conversión a moneda solicitada
				if($moneda_id == 2)
					$monto_moneda = $monto_pesos / $Cotizacion_DOLLAR;
				else{
					if($moneda_id == 3)
						$monto_moneda = $monto_pesos / $Cotizacion_EURO;
					else
						$monto_moneda = $monto_pesos;
				}
				$comprado = $comprado + $monto_moneda;
			}
		}
		$comprado_f = '$'.number_format(round($comprado, 2), 2, '.', ',');
		