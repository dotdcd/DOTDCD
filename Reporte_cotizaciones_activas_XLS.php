
<?php 
	ini_set("session.auto_start", 0);
	 
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

	// Encabezados para EXCEL
	header("Cache-Control: public");
	header("Content-Description: File Transfer");
	header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
	header('Content-type: application/vnd.ms-excel');
 	header('Content-Disposition:  filename="cotizaciones_activas_al_'.$fecha.'.xls";');
	
try{
	
	//Abrir base de datos
	ini_set('mysql.connect_timeout','0');   
	
	include("./connexion_BD.php");
	
	require_once('cotizacion_fun_get_total.php');
	
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
				$moneda_solicitada = "DÓLARES";
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
		// Leer cotización individual
		$filtro	= " AND cotizacion_id = ".$cotizacion_id;
		$sql = "SELECT cliente_id, cotizacion_id, cotizacion_proyecto, cliente_razon_social, 
					CONCAT(empleado_nombre, ' ', empleado_paterno, ' ', empleado_materno) AS empleado					
					FROM cotizaciones 
					JOIN clientes ON cotizacion_cliente_id = cliente_id					
					LEFT JOIN empleados ON empleado_id = cotizacion_arq_responsable
					WHERE IFNULL(liquidada_sn, 0) = 0 and cotizacion_autorizada_estatus= 1 
					AND cotizacion_estatus_baja = 0".$filtro;
		$resultado=mysql_query($sql);
		if ($registro = mysql_fetch_array($resultado))
			{
			$cotizacion_id_c		= $registro['cotizacion_id'];
			$cotizacion_proyecto 	= utf8_decode($registro['cotizacion_proyecto']);
			$cliente_razon_social	= utf8_decode($registro['cliente_razon_social']);
			$proyecto_nombre 		= 'Proyecto: '.$cotizacion_proyecto.' ('.$cotizacion_id_c.')';
			$cliente 				= 'Cliente: '.$cliente_razon_social;
			$cliente_id				= $registro['cliente_id'];
			$arq_responsable		= $registro['empleado'];			
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
	$tipo= 'Tipo: Cotización';
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
$facturadas_SN= ', Facturadas: Sí';
else
if($facturadas == 2)
	$facturadas_SN= ', Facturadas: No';
	else
	$facturadas_SN= ', Facturadas: Todas';

if($ordenadas == 1)
$ordenadas_SN= ', Ordenadas: Sí';
else
if($ordenadas == 2)
	$ordenadas_SN= ', Ordenadas: No';
	else
	$ordenadas_SN= ', Ordenadas: Todas';

if($eliminadas == 1)
$eliminadas_SN= ', Eliminadas: Sí';
else
$eliminadas_SN= ', Eliminadas: No';

$filtro_enca = utf8_decode($tipo . $estatus . $facturadas_SN . $ordenadas_SN . $eliminadas_SN);

//ob_start();


  function Encabezado()
    {
	  global $fecha, $cliente_enca, $proyecto_nombre, $tipo_de_cambio_DOLLAR, $tipo_de_cambio_EURO, $moneda_id, $moneda_solicitada, $filtro_enca;	
		
	  echo '
		<tr>
			<td align="center" colspan="10"><font style="font-size:14px;"><b>DOTDCD, S.A. DE C.V.</b></font></td>
		</tr>';
		
	  echo '
		<tr>
			<td align="center" colspan="10">REPORTADO EN '.$moneda_solicitada.'</td>
		</tr>';
		
	if($moneda_id==2)
	  echo '
		<tr>
			<td align="center" colspan="10">T.C. '.$tipo_de_cambio_DOLLAR.'</td>
		</tr>';
	else if($moneda_id==3)
		echo '
		<tr>
			<td align="center" colspan="10">T.C. '.$tipo_de_cambio_EURO.'</td>
		</tr>';
	else 
		echo '
		<tr>
			<td align="center" colspan="10">T.C. MX$ 1.0000</td>
		</tr>';
		
	echo '
		<tr>
			<td align="center" colspan="10"><b>'.utf8_decode('SITUACIÓN ACTUAL DE COTIZACIONES').'</b></td>
		</tr>';
		
	$strcte = $cliente_enca;
	echo '
		<tr>
			<td align="center" colspan="10">'.$strcte.'</td>
		</tr>';


	  $strcte = $filtro_enca;
	  echo '
		<tr>
			<td align="center" colspan="10">'.$strcte.'</td>
		</tr>';
	  
	  echo '
		<tr>
			<td align="center" colspan="10">'.date ( "d/m/Y h:i A" ).'</td>
		</tr>';
	  
	  echo '	
		<tr>
			<td align="center" width="90" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;"># Cliente</span></td>
			<td align="center" width="290" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">Nombre Cliente</span></td>
			<td align="center" width="90" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;"># Proyecto</span></td>
			<td align="center" width="400" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">Cliente / Proyectos</span></td>
			<td align="center" width="250" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">Arquitecto responsable</span></td>
			<td align="center" width="250" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">Vendedor</span></td>
			<td align="center" width="250" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">Ing. responsable</span></td>
			<td align="center" width="130" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">Sucursal</span></td>
			<td align="center" width="130" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">Cotizado</span></td>
			<td align="center" width="130" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">Costo-total</span></td>
			<td align="center" width="130" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">Comprado</span></td>
			<td align="center" width="130" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">Por comprar</span></td>
			<td align="center" width="130" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">Facturado</span></td>
			<td align="center" width="130" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">Por facturar</span></td>
			<td align="center" width="130" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">Cobrado</span></td>
			<td align="center" width="130" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">Por cobrar</span></td>
			<td align="center" width="130" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">'.utf8_decode('Posición').'</span></td>
			<td align="center" width="130" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">PF</span></td>
			<td align="center" width="130" bgcolor="#16525F"><span style="font-family: Verdana, Geneva, sans-serif;	font-size: 10px; color: #FFF;">'.utf8_decode('Fecha autorización').'</span></td>			
		</tr>';
		
     }
	  
	function Detalle($linea_detalle, $fecha_aut, $proyecto, $v1, $v2, $v3, $v4, $v5, $v6, $v7, $v8, $v9, $v10, $moneda, 
				$cotizacion_tipo_id, $arq_responsable, $num_cliente, $num_proy, $sucursal_nombre, $vendedor, $ing_responsable, 
				$pf, $nombre_cliente)
	{
		 if (strlen($arq_responsable) <= 1)
			$arq_responsable = '';			 		
		
		$nombre_cliente = str_replace('('.$num_cliente.')', '', $nombre_cliente);
		
		if($moneda == 2)
			$simbolo = 'US$';
		else
			if($moneda == 3)
				$simbolo = '€';
			else
				$simbolo = 'MX$';

		switch ($linea_detalle){
		case 0:
			 
			if($cotizacion_tipo_id == 1) $tipo_cot = 'S'; else $tipo_cot = 'P';
			
			$nombre = trim($proyecto.' '.$tipo_cot);
			$nombre = str_replace(chr(13).chr(10), ' ', $nombre);
			$indice = 0;
			for ($i = 0; $i <= 10; $i++) $desc_prod[$i]='';
			
			$nombre = substr($nombre, 0, 45);  //****
			
			$ancho = 51;
			$i = 0;
			do	{
				$atras = 0;
				if (strlen(substr($nombre,$i)) < ($ancho + 1))
					// desplegar sección final
					{
					$desc_prod[$indice]=trim(substr($nombre,$i));
					$indice=$indice+1;
					}
					else
					{
					while (substr(substr($nombre,$i,$ancho - $atras),(($ancho -1 ) - $atras),1) != ' ' && $atras < $ancho) 
						$atras = $atras + 1;
					// desplegar sección
					$desc_prod[$indice]=trim(substr($nombre,$i,($ancho - $atras)));
					$indice=$indice+1;
					}
				$i = ($i + $ancho) - $atras;
				} while ($i < strlen($nombre));
			
			echo '	
			<tr>
			<td>'.$num_cliente.'</td>
			<td>'.$nombre_cliente.'</td>
			<td>'.$num_proy.'</td>
			<td>'.$proyecto.'</td>			
			<td>'.$arq_responsable.'</td>
			<td>'.$vendedor.'</td>
			<td>'.$ing_responsable.'</td>
			<td>'.$sucursal_nombre.'</td>			
			<td align="right">'.$simbolo.number_format(round(trim($v1), 2), 2, '.', ',').'</td>
			<td align="right">'.$simbolo.number_format(round(trim($v2), 2), 2, '.', ',').'</td>
			<td align="right">'.$simbolo.number_format(round(trim($v3), 2), 2, '.', ',').'</td>
			<td align="right">'.$simbolo.number_format(round(trim($v4), 2), 2, '.', ',').'</td>
			<td align="right">'.$simbolo.number_format(round(trim($v5), 2), 2, '.', ',').'</td>
			<td align="right">'.$simbolo.number_format(round(trim($v6), 2), 2, '.', ',').'</td>
			<td align="right">'.$simbolo.number_format(round(trim($v7), 2), 2, '.', ',').'</td>
			<td align="right">'.$simbolo.number_format(round(trim($v8), 2), 2, '.', ',').'</td>
			<td align="right">'.$simbolo.number_format(round(trim(($v1+$v3) -($v2+$v7)), 2), 2, '.', ',').'</td>
			<td align="center">'.$pf.'</td>
			<td align="center">'.$fecha_aut.'</td>	
			</tr>';
			//v1 = cotizado
			//v2 = costo total
			//v3 = comprado
			//v4 = por comprar
			//v5 = facturado
			//v6 = por facturar
			//v7 = cobrado
			//v8 = por cobrar
			
			/*
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
			*/
		break;
		
		case 1:
			echo '	
			<tr>			
			<td>'.$num_cliente.'</td>
			<td>'.$nombre_cliente.'</td>
			<td>&nbsp;</td>
			<td><b>'.$proyecto.'</b></td>
			<td>--</td>
			<td>--</td>
			<td>--</td>
			<td>'.$sucursal_nombre.'</td>
			<td align="right">'.$simbolo.number_format(round(trim($v1), 2), 2, '.', ',').'</td>
			<td align="right">'.$simbolo.number_format(round(trim($v2), 2), 2, '.', ',').'</td>
			<td align="right">'.$simbolo.number_format(round(trim($v3), 2), 2, '.', ',').'</td>
			<td align="right">'.$simbolo.number_format(round(trim($v4), 2), 2, '.', ',').'</td>
			<td align="right">'.$simbolo.number_format(round(trim($v5), 2), 2, '.', ',').'</td>
			<td align="right">'.$simbolo.number_format(round(trim($v6), 2), 2, '.', ',').'</td>
			<td align="right">'.$simbolo.number_format(round(trim($v7), 2), 2, '.', ',').'</td>
			<td align="right">'.$simbolo.number_format(round(trim($v8), 2), 2, '.', ',').'</td>
			<td align="right">'.$simbolo.number_format(round(trim(($v1+$v3) -($v2+$v7)), 2), 2, '.', ',').'</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			</tr>';
			echo '<tr>					
					<td>--</td>
					<td>--</td>
					<td>--</td>
					<td>--</td>
					<td>--</td>
					<td>--</td>
					<td>--</td>
					<td>--</td>
					<td>--</td>
					<td>--</td>
					<td>--</td>
					<td>--</td>
					<td>--</td>
					<td>--</td>
					<td>--</td>
					<td>--</td>
					<td>--</td>
					<td>--</td>
				</tr>';
		break;

		case 2:
			echo '<tr>					
					<td>'.$num_cliente.'</td>
					<td>'.$nombre_cliente.'</td>
					<td>&nbsp;</td>
					<td><b>'.$proyecto.'</b></td>
					<td>--</td>
					<td>--</td>
					<td>--</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
				</tr>';
		break;
		}
	}
	
	// Abrir base de datos
	include("./connexion_BD.php");

	// inicio de tabla
	echo '<table border="0" cellspacing="0">';
	
	Encabezado();
	
	
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
		$sqlTruncate1 = "TRUNCATE TABLE tmp_cotizacion_reporte; 
			TRUNCATE TABLE tmp_factura_reporte; 			
			TRUNCATE TABLE tmp_ordenes_reporte;  
			TRUNCATE TABLE tmp_cheque_reporte; 
			TRUNCATE TABLE tmp_cliente_reporte;";
			
		mysql_query($sqlTruncate1, $conn);
		*/
		
	
	// Proceso
	$sql = "SELECT cotizacion_id, cotizacion_proyecto, 
					cliente_razon_social, cotizacion_moneda_id, cotizacion_cliente_id, 
					estimacion_iva, cotizacion_compras_totalizadas, cotizacion_extras, cotizacion_tipo_id, 
					cotizacion_descuento_porcentaje,
					CONCAT(e.empleado_nombre, ' ', e.empleado_paterno, ' ', e.empleado_materno) AS empleado,
					CONCAT(e1.empleado_nombre, ' ', e1.empleado_paterno, ' ', e1.empleado_materno) as cotizado_por,
					CONCAT(e2.empleado_nombre, ' ', e2.empleado_paterno, ' ', e2.empleado_materno) as ing_responsable,
					total as total_grabado, sucursal_nombre, cotizacion_fecha_autorizada, IFNULL(pf, 0) as pf
				FROM cotizaciones  
				JOIN clientes ON cliente_id = cotizacion_cliente_id
				LEFT JOIN sucursal s on s.sucursal_id = cotizaciones.sucursal_id 
				LEFT JOIN empleados e ON e.empleado_id = cotizacion_arq_responsable
				LEFT JOIN empleados e1 ON e1.empleado_id = cotizacion_empleado_id
				LEFT JOIN empleados e2 ON e2.empleado_id = cotizacion_encargado
				WHERE IFNULL(liquidada_sn, 0) = 0 
				and cotizacion_estatus_baja <> 9".$filtro."
		ORDER BY cliente_razon_social, cotizacion_proyecto";
				 	
					
	//echo '***'.$sql.'***';
	
	/*
	$sqlInsert = "INSERT INTO tmp_cotizacion_reporte 
	SELECT * FROM cotizaciones WHERE cotizacion_estatus_baja <> 9".$filtro;					
	mysql_query($sqlInsert, $conn);
	
	$sqlInsert2 = "INSERT INTO tmp_factura_reporte 
	SELECT * FROM facturas WHERE factura_proyecto_id in (select cotizacion_id from tmp_cotizacion_reporte)";				
	mysql_query($sqlInsert2, $conn);
	 
	//$sqlInsert3 = "INSERT INTO tmp_cheque_reporte 
	//SELECT * FROM cheques WHERE cheque_cotizacion_id in (select cotizacion_id from tmp_cotizacion_reporte)";				
	//mysql_query($sqlInsert3, $conn);
	
	//$sqlInsert3 = "INSERT INTO tmp_cheque_reporte 
	//SELECT * FROM cheques WHERE cheque_id in (select cheque_id FROM tmp_cheques_reporte)";
	//mysql_query($sqlInsert3, $conn);
	
	$sqlInsert4 = "INSERT INTO tmp_ordenes_reporte 
	SELECT * FROM ordenes_compra WHERE orden_cotizacion_id in (select cotizacion_id from tmp_cotizacion_reporte)";				
	mysql_query($sqlInsert4, $conn);
	
	$sqlInsert5 = "INSERT INTO tmp_cliente_reporte 
	SELECT * FROM clientes WHERE cliente_id in (select cliente_cotizacion_id from tmp_cotizacion_reporte)";				
	mysql_query($sqlInsert5, $conn);
	*/
	
	$resultado=mysql_query($sql);
	$cliente_ant = 0;
	$cliente_razon_social_ant = 0;
	while ($registro = mysql_fetch_array($resultado))
	{
		$f_pcje 	=  1 - (($registro['cotizacion_descuento_porcentaje']+0) / 100);
			$cotizacion_tipo_id     = $registro['cotizacion_tipo_id'];
			$cotizacion_id_c		= $registro['cotizacion_id'];
			$cliente_id_c			= $registro['cotizacion_cliente_id'];
			$cotizacion_proyecto 	= utf8_decode($registro['cotizacion_proyecto']);
			$cliente_razon_social	= utf8_decode($registro['cliente_razon_social']).'('.$cliente_id_c.')';
			$arq_responsable		= utf8_decode($registro['empleado']);
			$ing_responsable		= utf8_decode($registro['ing_responsable']);
			$vendedor				= utf8_decode($registro['cotizado_por']);
			$total_grabado			= $registro['total_grabado'];
			$sucursal_nombre		= $registro['sucursal_nombre'];			
			$fechaAut 				= fsql_dmy(substr($registro['cotizacion_fecha_autorizada'],0,10));
			$pf = $registro['pf']; 
						
			if ($row['pf'] == 0){
				$result = getTotal($cotizacion_id_c);
				$datos = explode("|", $result);
				$pf = $datos[0].'%';
			}			
			else {
				$pf = '';
			}
			
			if($cliente_ant == 0)     
			{
				$linea_detalle = 2;
				Detalle($linea_detalle,'',$cliente_razon_social,0,0,0,0,0,0,0,0,0,0,0,0,0,$cliente_id_c,0, '', '', '', '', $cliente_razon_social);
				$cliente_ant = $cliente_id_c;
				$cliente_razon_social_ant = $cliente_razon_social;
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

				// COTIZADO - Conversión a pesos
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
						
				// COSTO - Conversión a pesos
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
						
				// Conversión a moneda solicitada
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
				
				// COTIZADO - Conversión a pesos
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
						
				// COSTO - Conversión a pesos
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
						
				// Conversión a moneda solicitada
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
				
				// COTIZADO - Conversión a pesos
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
						
				// COSTO - Conversión a pesos
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
						
				// Conversión a moneda solicitada
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
					
			// Conversión a moneda solicitada
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
			

			 
			// Obtener lo comprado ($v3)
			$v3	= 0;
			
			// Leer movimientos
			$sql = "select cheque_id, cheque_fecha_alta, banco_cuenta_moneda_id, cheque_monto,  COALESCE(pago_monto_moneda_cheque, 0) AS pago_orden, COALESCE(cheque_comentario, '') as cheque_comentario, COALESCE(P.proveedor_razon_social, '') as proveedor_razon_social_orden, COALESCE(C.proveedor_razon_social, '') as proveedor_razon_social_cheque
						   FROM tmp_cheque_reporte
						   LEFT JOIN proveedores as C ON C.proveedor_id = cheque_proveedor_id
						   LEFT JOIN ordenes_compra_pagos ON pago_cheque_id = cheque_id
						   LEFT JOIN ordenes_compra ON orden_id = pago_orden_id
						   LEFT JOIN proveedores as P ON P.proveedor_id = orden_proveedor_id
						   LEFT JOIN requisiciones ON requisicion_id = orden_requisicion_id
						   JOIN bancos_cuentas ON banco_cuenta_id = cheque_cuenta_id
						   WHERE cheque_ingreso <> '1' AND cheque_estatus_baja = 0 
								 AND (COALESCE(orden_cotizacion_id, 0) = ".$cotizacion_id_c." OR COALESCE(cheque_cotizacion_id, 0) = ".$cotizacion_id_c." OR COALESCE(requisicion_cotizacion_id, 0) = ".$cotizacion_id_c.")	 	
						   ORDER BY cheque_id";
						   
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
					
					// Conversión a pesos
					$moneda_id_p = $reg['banco_cuenta_moneda_id'];
					if($moneda_id_p == 2)
						$monto_pesos = $monto * $Cotizacion_DOLLAR;
						else
						if($moneda_id_p == 3)
							$monto_pesos = $monto * $Cotizacion_EURO;
							else
							$monto_pesos = $monto;
							
					// Conversión a moneda solicitada
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

			//echo $v3;			
			//die();
			
			$gtot_ingresos 		= 0;
			$gtot_egresos  		= 0;
			
			// Leer movimientos
			$filtro	= " AND ((COALESCE(CO.cotizacion_id, 0) = ".$cotizacion_id_c." OR COALESCE(CO2.cotizacion_id, 0) = ".$cotizacion_id_c.") OR (COALESCE(CO3.cotizacion_id, 0) = ".$cotizacion_id_c." OR COALESCE(CO4.cotizacion_id, 0) = ".$cotizacion_id_c."))";
			
			$sql = "select cheque_ingreso, cheque_monto, cheque_fecha_alta, banco_cuenta_moneda_id,
						   cheque_comentario, 
						   /*CONCAT(empresa_razon_social, ' - ', banco_cuenta_comentario) as empresa_cuenta,*/ 
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
						    
						   FROM tmp_cheque_reporte						   
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
					
					/*JOIN bancos_cuentas ON banco_cuenta_id = cheque_cuenta_id
						   JOIN multiempresa ON empresa_id = banco_empresa_id*/
						   
					//echo $sql;
					//die();
			 
			
			
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
					
					// Conversión a pesos
					if($moneda_id_p == 2)
						$monto_pesos = $monto * $Cotizacion_DOLLAR;
						else
						if($moneda_id_p == 3)
							$monto_pesos = $monto * $Cotizacion_EURO;
							else
							$monto_pesos = $monto;
							
					// Conversión a moneda solicitada
					if($moneda_id == 2)
						$monto_moneda = $monto_pesos / $Cotizacion_DOLLAR;
						else
						if($moneda_id == 3)
							$monto_moneda = $monto_pesos / $Cotizacion_EURO;
							else
							$monto_moneda = $monto_pesos;
					
					//***$empresa_cuenta			= $reg['empresa_cuenta'];
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
					}
				}
		
			// Total
			$linea_detalle = 1;
			
			 
			//******* porque esta esto? --> $v3 = $gtot_egresos;

			// Tomando lo comprado como pagado
			$v9 = $v3;
			
			// Calcular por comprar
			$v4 = $v2 - $v3;

			// Calcular por pagar
			$v10 = $v2 - $v9;
	
			// Obtener lo facturado ($v5)
			$sql = "SELECT factura_id, factura_total as facturado, factura_moneda_id FROM tmp_factura_reporte
					WHERE factura_proyecto_id = ".$cotizacion_id_c." AND factura_estatus_baja = 1";
			$datasetc = mysql_query($sql,$conn) or die("Error selecting Coords :".mysql_error());
				
			while ($rowc = mysql_fetch_array($datasetc))
			{ 
				$facturado 		= trim($rowc['facturado'])+0;
				$moneda_id_f    = $rowc['factura_moneda_id'];
	
				// Conversión a pesos
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
						
				// Conversión a moneda solicitada
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
				
			}
			
				
			// Calcular por facturar
			$v6 = $v1 - $v5;
	
			$v7 = 0;
			
			// Obtener lo cobrado ($v7)
			$sql = "SELECT pago_monto AS cobrado, factura_moneda_id
						FROM facturas_pagos
						JOIN tmp_factura_reporte ON factura_id = pago_factura_id
						WHERE factura_proyecto_id = ".$cotizacion_id_c;
			
			$datasetc = mysql_query($sql,$conn) or die("Error selecting Coords :".mysql_error());
			while ($rowc = mysql_fetch_array($datasetc))
				{ 
				$cobrado 		= $rowc['cobrado'];
				$moneda_id_f    = $rowc['factura_moneda_id'];
	
				// Conversión a pesos
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
						
				// Conversión a moneda solicitada
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
			
			
			// Calcular por cobrar
			$v8 = $v1 - $v7;
	
			// Recalcular los proyectos con compras realizadas al 100%
			if($cotizacion_compras_totalizadas)
				{
				$v3 = $v2;
				$v4 = 0;
				$v10 = $v1 - $v7;
				}
			
			if($cliente_ant != $cliente_id_c)     
			{				
					$linea_detalle = 1;
					Detalle($linea_detalle,'','TOTAL DEL CLIENTE',$tv1,$tv2,$tv3,$tv4,$tv5,$tv6,$tv7,$tv8, $tv9,$tv10, $moneda_id, 0, 0, $cliente_ant, 0, '', '', '', '', $cliente_razon_social_ant);
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
				$linea_detalle = 2;
				Detalle($linea_detalle,'',$cliente_razon_social,0,0,0,0,0,0,0,0,0,0,0,0,0,$cliente_id_c, 0, '', '', '', '', $cliente_razon_social);
				$cliente_ant = $cliente_id_c;
				$cliente_razon_social_ant = $cliente_razon_social;
			}
	

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
									
			
			if ($total_grabado == 0 || $total_grabado == "0"){
				$sqlUpdTotal = "UPDATE cotizaciones SET total = ".$v1." WHERE cotizacion_id = ".$cotizacion_id_c;									
				$modificado = mysql_query($sqlUpdTotal, $conn);
			}
			
			// Detalle proyecto
			$linea_detalle = 0;
			Detalle($linea_detalle,$fechaAut,$proyecto_cliente,$v1,$v2,$v3,$v4,$v5,$v6,$v7,$v8,$v9,$v10, $moneda_id, $cotizacion_tipo_id, $arq_responsable, 
				$cliente_id_c, $cotizacion_id_c, $sucursal_nombre, $vendedor, $ing_responsable, $pf, $cliente_razon_social);
			flush();
		}

	// Total cliente
	$linea_detalle = 1;
	Detalle($linea_detalle, '','TOTAL DEL CLIENTE',$tv1,$tv2,$tv3,$tv4,$tv5,$tv6,$tv7,$tv8,$tv9,$tv10, $moneda_id, 0, 0, $cliente_id_c, 0, '', '', '', '', $cliente_razon_social);

	// Gran Total
	$linea_detalle = 1;
	Detalle($linea_detalle, '','GRAN TOTAL',$gtv1,$gtv2,$gtv3,$gtv4,$gtv5,$gtv6,$gtv7,$gtv8,$gtv9,$gtv10, $moneda_id, 0, 0, $cliente_id_c, 0, '', '', '', '', $cliente_razon_social);
		

	// Fin de tabla
	echo '</table>';
	
	// Cerrar base de datos
	mysql_close($conn);
	
} 

catch(Error $e) {
    $trace = $e->getTrace();
    echo $e->getMessage().' in '.$e->getFile().' on line '.$e->getLine().' called from '.$trace[0]['file'].' on line '.$trace[0]['line'];
}
		
?>
	
