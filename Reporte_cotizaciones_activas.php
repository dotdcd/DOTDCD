<?php
error_reporting(E_ALL);
//ini_set('display_errors','On');
ini_set('error_log','php_error.log');

session_start();
if (!isset($_SESSION["alfa"])) $_SESSION["alfa"]="";
if (!isset($_SESSION["session_id"])) $_SESSION["session_id"]="";
if($_SESSION["session_id"] != $_COOKIE["PHPSESSID"]) header('Location: index.php');
if (!isset($_SESSION["directorio"])) $_SESSION["directorio"]="";
if($_SESSION["directorio"] != dirname(__FILE__)) header('Location: index.php');

if($_SESSION["alfa"]!="1") header('Location: index.php'); 

date_default_timezone_set('America/Tegucigalpa');
setlocale(LC_TIME, 'spanish'); 
$hoy = substr(strftime("%d/%m/%Y, %H:%M:%S"),0,10);

function fsql_dmy($fecha){
return substr($fecha,8,2).'/'.substr($fecha,5,2).'/'.substr($fecha,0,4);
}

function fdmy_sql($fecha){
return substr($fecha,6,4).'-'.substr($fecha,3,2).'-'.substr($fecha,0,2);
}

$mensaje = '';

	if (isset($_REQUEST['moneda_id'])) { $moneda_id = $_REQUEST['moneda_id']; } else 		$moneda_id = '0';

	if (isset($_REQUEST['tipo_id'])) { $tipo_id = $_REQUEST['tipo_id']; } else $tipo_id = '0';
	
	if (isset($_REQUEST['cliente_id'])) { $cliente_id = $_REQUEST['cliente_id']; } else 		$cliente_id = '0';
	
	if (isset($_REQUEST['cotizacion_id'])) { $cotizacion_id = $_REQUEST['cotizacion_id']; } else 		$cotizacion_id = '0';
	
	if (isset($_REQUEST['autorizada_estatus'])) { $autorizada_estatus = $_REQUEST['autorizada_estatus']; } else $autorizada_estatus = '1';

	if (isset($_REQUEST['facturadas'])) { $facturadas = $_REQUEST['facturadas']; } else $facturadas = '0';
	if (isset($_REQUEST['ordenadas'])) { $ordenadas = $_REQUEST['ordenadas']; } else $ordenadas = '0';
	if (isset($_REQUEST['eliminadas'])) { $eliminadas = $_REQUEST['eliminadas']; } else $eliminadas = '0';

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<title>Sistema DOTDCD - Ingresos - Nuevos</title>
<?php include ('menu_ligas.php'); ?>
<link rel="stylesheet" href="css/formulario.css" type="text/css" />
<link rel="stylesheet" href="./ui/jquery-ui-1.10.2/themes/base/jquery.ui.all.css">
<link rel="stylesheet" href="css/Egreso_cheque.css" type="text/css" />
<script src="./ui/jquery-ui-1.10.2/ui/jquery.ui.core.js"></script>
<script src="./ui/jquery-ui-1.10.2/ui/jquery.ui.datepicker.sp.js"></script>
<script type="text/javascript">

	function emitir_reporte(){
		var moneda_id = document.getElementById("moneda_id").value;
		var tipo_id = document.getElementById("tipo_id").value;
		var autorizada_estatus = document.getElementById("autorizada_estatus").value;
		var facturadas = document.getElementById("facturadas").value;
		var ordenadas = document.getElementById("ordenadas").value;
		var eliminadas = document.getElementById("eliminadas").value;
		var cliente_id = document.getElementById("cliente_id").value;
		var cotizacion_id = 0; 
		location.href= './Reporte_cotizaciones_activas_PDF3.php?moneda_id='+moneda_id+'&tipo_id='+tipo_id+'&cliente_id='+cliente_id+'&cotizacion_id='+cotizacion_id+'&autorizada_estatus='+autorizada_estatus+'&facturadas='+facturadas+'&ordenadas='+ordenadas+'&eliminadas='+eliminadas;
	} 

	function emitir_reporte_excel(){
		//alert('Pendiente');
		//return;
		
		var moneda_id = document.getElementById("moneda_id").value;
		var tipo_id = document.getElementById("tipo_id").value;
		var autorizada_estatus = document.getElementById("autorizada_estatus").value;
		var facturadas = document.getElementById("facturadas").value;
		var ordenadas = document.getElementById("ordenadas").value;
		var eliminadas = document.getElementById("eliminadas").value;
		var cliente_id = document.getElementById("cliente_id").value;
		var cotizacion_id = 0; 
		location.href= './Reporte_cotizaciones_activas_XLS.php?moneda_id='+moneda_id+'&tipo_id='+tipo_id+'&cliente_id='+cliente_id+'&cotizacion_id='+cotizacion_id+'&autorizada_estatus='+autorizada_estatus+'&facturadas='+facturadas+'&ordenadas='+ordenadas+'&eliminadas='+eliminadas;
	} 
	
	function prepareInfo(){
		
		var moneda_id = document.getElementById("moneda_id").value;
		var tipo_id = document.getElementById("tipo_id").value;
		var autorizada_estatus = document.getElementById("autorizada_estatus").value;
		var facturadas = document.getElementById("facturadas").value;
		var ordenadas = document.getElementById("ordenadas").value;
		var eliminadas = document.getElementById("eliminadas").value;
		var cliente_id = document.getElementById("cliente_id").value;
		var cotizacion_id = 0; 
		  
		iniciar_espera();
		
		$.ajax({ type : 'GET', url : './Reporte_cotizaciones_activas_prepare.php?moneda_id='+moneda_id+'&tipo_id='+tipo_id+'&cliente_id='+cliente_id+'&cotizacion_id='+cotizacion_id+'&autorizada_estatus='+autorizada_estatus+'&facturadas='+facturadas+'&ordenadas='+ordenadas+'&eliminadas='+eliminadas, success : function (resultado) {
			terminar_espera();
			if (resultado != "1"){
				alert("Informacion generada para iniciar reporte.");				
				//emitir_reporte2();	
			}			
			else
				alert("La informacion no pudo ser generada.");
			}});	
	}
	 
	
	function emitir_reporte2(){
		var moneda_id = document.getElementById("moneda_id").value;
		var tipo_id = document.getElementById("tipo_id").value;
		var autorizada_estatus = document.getElementById("autorizada_estatus").value;
		var facturadas = document.getElementById("facturadas").value;
		var ordenadas = document.getElementById("ordenadas").value;
		var eliminadas = document.getElementById("eliminadas").value;
		var cliente_id = document.getElementById("cliente_id").value;
		var cotizacion_id = 0; 
		location.href= './Reporte_cotizaciones_activas_PDF3.php?moneda_id='+moneda_id+'&tipo_id='+tipo_id+'&cliente_id='+cliente_id+'&cotizacion_id='+cotizacion_id+'&autorizada_estatus='+autorizada_estatus+'&facturadas='+facturadas+'&ordenadas='+ordenadas+'&eliminadas='+eliminadas;
		/*
		iniciar_espera();
		var moneda_id = document.getElementById("moneda_id").value;
		var tipo_id = document.getElementById("tipo_id").value;
		var autorizada_estatus = document.getElementById("autorizada_estatus").value;
		var facturadas = document.getElementById("facturadas").value;
		var ordenadas = document.getElementById("ordenadas").value;
		var eliminadas = document.getElementById("eliminadas").value;
		var cliente_id = document.getElementById("cliente_id").value;
		var cotizacion_id = 0; 
		
		document.alta_cheque.target = "ifReporte";		
		document.alta_cheque.action = 'Reporte_cotizaciones_activas_PDF3.php?moneda_id='+moneda_id+'&tipo_id='+tipo_id+'&cliente_id='+cliente_id+'&cotizacion_id='+cotizacion_id+'&autorizada_estatus='+autorizada_estatus+'&facturadas='+facturadas+'&ordenadas='+ordenadas+'&eliminadas='+eliminadas;		
		document.alta_cheque.submit();
		*/
	}
	
	function validar_forma(){
		var moneda_id = document.getElementById("moneda_id").value;
		if(moneda_id == 0)
			alert('Favor de seleccionar la moneda en que se emitirá el reporte');
		else
			emitir_reporte();
	}
	
	function validar_forma2(){
		var moneda_id = document.getElementById("moneda_id").value;
		if(moneda_id == 0)
			alert('Favor de seleccionar la moneda en que se emitirá el reporte');
		else
			emitir_reporte_excel();
	}
	
	function llenar_combo_cotizaciones() {
		var cliente_id = document.getElementById("cliente_id").value;
		var cotizacion_id = document.getElementById("cotizacion_id").value;
		var fecha_inicial = document.getElementById("fecha_inicial").value;
		var fecha_final = document.getElementById("fecha_final").value;
		$.ajax({ type : 'GET', url : './Proyectos_requisiciones_buscar_combo_cotizaciones.php?cliente_id='+cliente_id+'&cotizacion_id='+cotizacion_id+'&fecha_inicial='+fecha_inicial+'&fecha_final='+fecha_final, success : function (resultado) {
			if (resultado!="")
				{
				document.getElementById("combo_cotizaciones").innerHTML = resultado;
				}
				}});	
	}

	var moneda_id = 0;
	function obtener_moneda(){
		moneda_id  = parseInt(document.getElementById("moneda_id").value);
	}
	
	function iniciar_espera(){
		document.getElementById('espere').style.display = 'block';
	}

	function terminar_espera(){
		document.getElementById('espere').style.display = 'none';
	}

	function iniciar_espera2(){
		document.getElementById('espere2').style.display = 'block';
	}

	function terminar_espera2(){
		document.getElementById('espere2').style.display = 'none';
	}
	
	function terminaReporte(){
		terminar_espera();
	}
	
	
</script>
</head>

<body>
<?php include ('menu_general.php'); ?>
<div id="entrada">
	<h2>Reporte de situación actual de cotizaciones</h2>
	<form id="alta_cheque" name="alta_cheque" method="post" action="" onsubmit="return validar_forma();">
		<table width="1001" border="0" cellpadding="0" cellspacing="0">
			<tr>
				<td width="77"><p>Cliente</p></td>
				<td  colspan="12"><?php 
        include("./connexion_BD.php");
		$sql = "select cliente_id, cliente_razon_social 
						FROM clientes ORDER BY cliente_razon_social";
		$resultado=mysql_query($sql);
		$select1='<select id="cliente_id" name="cliente_id" class="box">';
		$select1.='<option value="0">--- Todos los clientes ---</option>';
		if(mysql_num_rows($resultado)>0)
			{
			while ($registro = mysql_fetch_array($resultado))
				{
				$cliente_id_c	= $registro['cliente_id'];
				$razon_social	= $registro['cliente_razon_social'];
				if($cliente_id_c == $cliente_id) $selected = ' selected'; else $selected = '';
				$select1 .= '<option value="'.$cliente_id_c.'"'.$selected.'>'.$razon_social.'</option>';
				}
            }
        $select1.= '</select>';
        mysql_close($conn); 
        echo $select1;
		?></td>
				<td>&nbsp;</td>
			</tr>
			<tr>
				<td width="77"><p>Moneda</p></td>
				<td width="18"><?php 
				include("./connexion_BD.php");
				$sql = "select moneda_id, moneda_descripcion, moneda_cotizacion FROM monedas";
				$resultado=mysql_query($sql);
				$select1='<select id="moneda_id" name="moneda_id" class="box" onChange="obtener_moneda();">';
				//$select1 .= '<option value="0">-- Seleccionar --</option>';
				if(mysql_num_rows($resultado)>0)
					{
					while ($registro = mysql_fetch_array($resultado))
						{
						$moneda_id_c		 = $registro['moneda_id'];
						$moneda_descripcion  = $registro['moneda_descripcion'];
						$moneda_cotizacion   = $registro['moneda_cotizacion'];
						if($moneda_id_c == substr($moneda_id,0,1)) $selected = ' selected'; else $selected = '';
						$select1 .= '<option value="'.$moneda_id_c.'"'.$selected.'>'.$moneda_descripcion.'</option>';
						}
					}
				$select1.= '</select>';
				mysql_close($conn); 
				echo $select1;
				?></td>
				<td width="48"><p>Tipo</p></td>
				<td width="136"><select id="tipo_id" name="tipo_id" class="box">
					<option value="0"<?php if($tipo_id=='0') echo ' selected'; ?>>TODAS</option>
					<option value="1"<?php if($tipo_id=='1') echo ' selected'; ?>>SIMPLE</option>
					<option value="2"<?php if($tipo_id=='2') echo ' selected'; ?>>PROYECTO</option>
				</select></td>
				<td width="70"><p>Estatus</p></td>
				<td width="131"><select id="autorizada_estatus" name="autorizada_estatus" class="box">
					<option value="3"<?php if($autorizada_estatus=='3') echo ' selected'; ?>>TODAS</option>
					<option value="0"<?php if($autorizada_estatus=='0') echo ' selected'; ?>>COTIZADA</option>
					<option value="1"<?php if($autorizada_estatus=='1') echo ' selected'; ?>>AUTORIZADA</option>
					<option value="2"<?php if($autorizada_estatus=='2') echo ' selected'; ?>>CONCLUIDA</option>
				</select></td>
				
				<td width="94"><p>Facturadas</p></td>
				<td width="81"><select id="facturadas" name= "facturadas" class="box">
					<option value="0"<?php if ($facturadas==0) echo ' selected'; ?>>Todas</option>
					<option value="1"<?php if ($facturadas==1) echo ' selected'; ?>>Sí</option>
					<option value="2"<?php if ($facturadas==2) echo ' selected'; ?>>No</option>
				</select></td>
				<td width="93"><p>Ordenadas</p></td>
				<td width="81"><select id="ordenadas" name= "ordenadas" class="box">
					<option value="0"<?php if ($ordenadas==0) echo ' selected'; ?>>Todas</option>
					<option value="1"<?php if ($ordenadas==1) echo ' selected'; ?>>Sí</option>
					<option value="2"<?php if ($ordenadas==2) echo ' selected'; ?>>No</option>
				</select></td>
				<td width="57"><p>Baja</p></td>
			<td width="112">
				<select id="eliminadas" name= "eliminadas" class="box">
					<option value="0"<?php if ($eliminadas==0) echo ' selected'; ?>>No</option>
					<option value="1"<?php if ($eliminadas==1) echo ' selected'; ?>>Sí</option>
				</select></td>
			</tr>
			<tr>
				<td colspan="13">&nbsp;</td>
			</tr>
		</table>
		
		<table width="100%">
			<tr>
				<td width="50%" align="right">
					<p><input class="boton" onclick="javascript:prepareInfo();"  style="width:100px;" name="btnInfo" id="btnInfo" value="Preparar info" /></p>
				</td>
				<td width="50%" align="left">
					<a href="javascript:validar_forma();"/><img src="img/pdf16x16.gif" width="16" height="16" title="Generar PDF"/></a>
					<a href="javascript:validar_forma2();"/><img src="img/Excel16x16.png" width="16" height="16" title="Exportar Excel"/></a>
				</td>
			</tr>
		</table>
	
		<br />
		
		<iframe name="ifReporte" height="0" width="600" scrolling="yes" FRAMEBORDER="0" MARGINHEIGHT="0" MARGINWIDTH="0"></iframe>	
		
	</form>
	
	<?php echo $mensaje; ?> </div>
	
	<div id="espere" style="display:none;"><table border="0" cellspacing="0" cellpadding="0">
		<table>
		  <tr>
			<td><img src="img/OtrosGIFs/LoadingProgressBar.gif" alt="espere ..."></td>
			<td>&nbsp;</td>
			<td valign="middle" style="font-size:20px;">Generando reporte...</td>
		  </tr>
		</table>
	</div>	
	

</body>

</html>